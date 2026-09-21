import { markSyncDirty } from './cloudSync.js';

const SRS_KEY = 'lingospace_srs';
const ACTIVITY_KEY = 'lingospace_activity';
const MISTAKE_KEY = 'lingospace_mistakes';
const DAILY_GOAL_KEY = 'lingospace_daily_goal';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const DAY_MS = 24 * 60 * 60 * 1000;

export const SRS_GRADES = {
  again: { label: 'Lupa', hint: '10 menit', tone: 'again' },
  hard: { label: 'Sulit', hint: '1 hari', tone: 'hard' },
  good: { label: 'Bagus', hint: 'bertahap', tone: 'good' },
  easy: { label: 'Mudah', hint: 'lebih lama', tone: 'easy' },
};

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const normalizeSrsRecord = (record = {}, now = Date.now()) => {
  const legacyLevel = Number(record.level) || 0;
  const correct = Number(record.correct) || 0;
  const wrong = Number(record.wrong) || 0;
  const hasHistory = legacyLevel > 0 || correct > 0 || wrong > 0 || Number(record.repetitions) > 0;
  const repetitions = Number.isFinite(Number(record.repetitions))
    ? Math.max(0, Number(record.repetitions))
    : legacyLevel;
  const legacyIntervals = [0, 1, 3, 7, 14, 30];
  const intervalDays = Number(record.intervalDays) > 0
    ? Number(record.intervalDays)
    : legacyIntervals[clamp(legacyLevel, 0, 5)] || 0;

  return {
    ...record,
    level: clamp(legacyLevel, 0, 5),
    correct,
    wrong,
    repetitions,
    ease: clamp(Number(record.ease) || 2.5, 1.3, 3),
    intervalDays,
    lastReviewed: record.lastReviewed || null,
    nextReview: record.nextReview || (hasHistory ? new Date(now).toISOString() : null),
  };
};

export const readSrsState = (vocabulary = []) => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = JSON.parse(localStorage.getItem(SRS_KEY) || '{}');
    const idSet = new Set(vocabulary.map((item) => Number(item.id)));
    const wordToId = new Map(vocabulary.map((item) => [String(item.id_lang || '').trim().toLocaleLowerCase('id-ID'), Number(item.id)]));
    const migrated = {};

    Object.entries(stored || {}).forEach(([rawKey, value]) => {
      const numeric = Number(rawKey);
      const resolvedId = Number.isInteger(numeric) && idSet.has(numeric)
        ? numeric
        : wordToId.get(String(rawKey || '').trim().toLocaleLowerCase('id-ID'));
      if (!Number.isInteger(resolvedId) || !value || typeof value !== 'object') return;

      const key = String(resolvedId);
      const normalized = normalizeSrsRecord(value);
      const existing = migrated[key];
      if (!existing) {
        migrated[key] = normalized;
      } else {
        migrated[key] = normalizeSrsRecord({
          ...existing,
          ...normalized,
          level: Math.max(existing.level || 0, normalized.level || 0),
          correct: Math.max(existing.correct || 0, normalized.correct || 0),
          wrong: Math.max(existing.wrong || 0, normalized.wrong || 0),
        });
      }
    });

    if (JSON.stringify(stored) !== JSON.stringify(migrated)) {
      localStorage.setItem(SRS_KEY, JSON.stringify(migrated));
      markSyncDirty('srs-migration');
    }
    return migrated;
  } catch (error) {
    console.error('Error reading SRS state:', error);
    return {};
  }
};

export const gradeSrsWord = (srsState, wordId, grade, now = Date.now()) => {
  const key = String(wordId);
  const current = normalizeSrsRecord(srsState[key] || {}, now);
  let ease = current.ease;
  let repetitions = current.repetitions;
  let intervalDays = current.intervalDays;
  let level = current.level;
  let nextReviewMs = now;
  let correct = current.correct;
  let wrong = current.wrong;

  if (grade === 'again') {
    repetitions = 0;
    intervalDays = 0;
    level = 0;
    ease = clamp(ease - 0.2, 1.3, 3);
    wrong += 1;
    nextReviewMs = now + (10 * 60 * 1000);
  } else if (grade === 'hard') {
    repetitions += 1;
    intervalDays = Math.max(1, intervalDays ? Math.ceil(intervalDays * 1.2) : 1);
    level = clamp(Math.max(1, level), 0, 5);
    ease = clamp(ease - 0.15, 1.3, 3);
    correct += 1;
    nextReviewMs = now + (intervalDays * DAY_MS);
  } else if (grade === 'easy') {
    repetitions += 1;
    ease = clamp(ease + 0.15, 1.3, 3);
    if (repetitions <= 1) intervalDays = 4;
    else if (repetitions === 2) intervalDays = 7;
    else intervalDays = Math.max(7, Math.round(Math.max(1, intervalDays) * (ease + 0.15) * 1.3));
    level = clamp(level + 2, 0, 5);
    correct += 1;
    nextReviewMs = now + (intervalDays * DAY_MS);
  } else {
    repetitions += 1;
    if (repetitions <= 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.max(3, Math.round(Math.max(1, intervalDays) * ease));
    level = clamp(level + 1, 0, 5);
    correct += 1;
    nextReviewMs = now + (intervalDays * DAY_MS);
  }

  const next = {
    ...current,
    level,
    correct,
    wrong,
    repetitions,
    ease: Number(ease.toFixed(2)),
    intervalDays,
    lastReviewed: new Date(now).toISOString(),
    nextReview: new Date(nextReviewMs).toISOString(),
    lastGrade: grade,
  };
  const updated = { ...srsState, [key]: next };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SRS_KEY, JSON.stringify(updated));
    markSyncDirty('srs-grade');
  }
  return { state: updated, record: next };
};

export const getDueVocabulary = (vocabulary = [], srsState = {}, now = Date.now()) => {
  return vocabulary
    .filter((item) => {
      const record = srsState[String(item.id)];
      if (!record) return false;
      const normalized = normalizeSrsRecord(record, now);
      const hasHistory = normalized.correct > 0 || normalized.wrong > 0 || normalized.repetitions > 0 || normalized.level > 0;
      if (!hasHistory || !normalized.nextReview) return false;
      return new Date(normalized.nextReview).getTime() <= now;
    })
    .sort((a, b) => {
      const aTime = new Date(srsState[String(a.id)]?.nextReview || 0).getTime();
      const bTime = new Date(srsState[String(b.id)]?.nextReview || 0).getTime();
      return aTime - bTime;
    });
};

export const readDailyGoal = () => {
  if (typeof window === 'undefined') return 20;
  const value = Number(localStorage.getItem(DAILY_GOAL_KEY));
  return [5, 10, 20, 30, 50].includes(value) ? value : 20;
};

export const saveDailyGoal = (goal) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAILY_GOAL_KEY, String(goal));
  markSyncDirty('daily-goal');
};

export const readActivity = () => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '{}') || {}; }
  catch { return {}; }
};

export const recordActivity = ({ wordId, type = 'study', correct = null } = {}) => {
  if (typeof window === 'undefined') return {};
  const activity = readActivity();
  const key = localDateKey();
  const day = activity[key] || { words: [], actions: 0, correct: 0, wrong: 0, byType: {} };
  const words = new Set((day.words || []).map(Number));
  if (Number.isInteger(Number(wordId))) words.add(Number(wordId));
  day.words = [...words];
  day.actions = (day.actions || 0) + 1;
  if (correct === true) day.correct = (day.correct || 0) + 1;
  if (correct === false) day.wrong = (day.wrong || 0) + 1;
  day.byType = { ...(day.byType || {}), [type]: ((day.byType || {})[type] || 0) + 1 };
  activity[key] = day;

  const keys = Object.keys(activity).sort().reverse();
  keys.slice(90).forEach((oldKey) => delete activity[oldKey]);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  markSyncDirty('activity');
  return activity;
};

export const getActivitySummary = (activity = readActivity()) => {
  const today = localDateKey();
  const todayEntry = activity[today] || { words: [], actions: 0, correct: 0, wrong: 0, byType: {} };
  const hasToday = (todayEntry.actions || 0) > 0 || (todayEntry.words || []).length > 0;

  let cursor = new Date();
  if (!hasToday) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  for (let i = 0; i < 365; i += 1) {
    const key = localDateKey(cursor);
    const entry = activity[key];
    if (!entry || ((entry.actions || 0) === 0 && (entry.words || []).length === 0)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    todayWords: (todayEntry.words || []).length,
    todayActions: todayEntry.actions || 0,
    todayCorrect: todayEntry.correct || 0,
    todayWrong: todayEntry.wrong || 0,
    streak,
    activeToday: hasToday,
  };
};

export const readMistakes = () => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(MISTAKE_KEY) || '{}') || {}; }
  catch { return {}; }
};

export const recordMistake = (wordId, source = 'practice') => {
  if (typeof window === 'undefined') return {};
  const mistakes = readMistakes();
  const key = String(wordId);
  const current = mistakes[key] || { count: 0, sources: {}, firstWrong: new Date().toISOString() };
  mistakes[key] = {
    ...current,
    count: (current.count || 0) + 1,
    lastWrong: new Date().toISOString(),
    resolvedAt: null,
    sources: { ...(current.sources || {}), [source]: ((current.sources || {})[source] || 0) + 1 },
  };
  localStorage.setItem(MISTAKE_KEY, JSON.stringify(mistakes));
  markSyncDirty('mistakes');
  return mistakes;
};

export const resolveMistake = (wordId) => {
  if (typeof window === 'undefined') return {};
  const mistakes = readMistakes();
  const key = String(wordId);
  if (mistakes[key]) {
    mistakes[key] = { ...mistakes[key], resolvedAt: new Date().toISOString() };
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(mistakes));
    markSyncDirty('mistakes-resolve');
  }
  return mistakes;
};

export const getOpenMistakes = (vocabulary = [], mistakes = readMistakes()) => {
  const map = new Map(vocabulary.map((item) => [String(item.id), item]));
  return Object.entries(mistakes)
    .filter(([, value]) => value && !value.resolvedAt)
    .map(([wordId, meta]) => ({ item: map.get(wordId), meta, wordId: Number(wordId) }))
    .filter((entry) => entry.item)
    .sort((a, b) => new Date(b.meta.lastWrong || 0) - new Date(a.meta.lastWrong || 0));
};
