import { markSyncDirty } from './cloudSync.js';

const XP_KEY = 'lingospace_xp';
const LESSON_PROGRESS_KEY = 'lingospace_lesson_progress';
const PREMIUM_EVENT = 'lingospace:premium-updated';

const safeParse = (value, fallback) => {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
};

const emitUpdate = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(PREMIUM_EVENT));
};

export const XP_REWARDS = {
  lesson: 25,
  lessonPractice: 15,
  speaking: 10,
  speakingExcellent: 20,
  gameRound: 10,
  gamePerfect: 20,
};

export const getLevelInfo = (xp = 0) => {
  const totalXp = Math.max(0, Number(xp) || 0);
  // Kurva progresif ringan: setiap level membutuhkan sedikit lebih banyak XP.
  let level = 1;
  let floor = 0;
  let next = 120;
  while (totalXp >= next && level < 100) {
    level += 1;
    floor = next;
    next += 100 + (level * 20);
  }
  const span = Math.max(1, next - floor);
  return {
    level,
    totalXp,
    currentLevelXp: totalXp - floor,
    nextLevelXp: span,
    progress: Math.min(100, Math.round(((totalXp - floor) / span) * 100)),
    remaining: Math.max(0, next - totalXp),
    title: level >= 20 ? 'Polyglot' : level >= 12 ? 'Fluent Explorer' : level >= 7 ? 'Language Builder' : level >= 3 ? 'Active Learner' : 'New Explorer',
  };
};

export const readXp = () => {
  if (typeof window === 'undefined') return 0;
  return Math.max(0, Number(localStorage.getItem(XP_KEY)) || 0);
};

export const addXp = (amount, source = 'practice') => {
  if (typeof window === 'undefined') return getLevelInfo(0);
  const delta = Math.max(0, Math.round(Number(amount) || 0));
  const next = readXp() + delta;
  localStorage.setItem(XP_KEY, String(next));
  const history = safeParse(localStorage.getItem(`${XP_KEY}_history`) || '[]', []);
  history.push({ amount: delta, source, at: new Date().toISOString() });
  localStorage.setItem(`${XP_KEY}_history`, JSON.stringify(history.slice(-200)));
  markSyncDirty('xp');
  emitUpdate();
  return getLevelInfo(next);
};

export const readXpHistory = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(`${XP_KEY}_history`) || '[]', []);
};

export const readLessonProgress = () => {
  if (typeof window === 'undefined') return { english: {}, nahwu: {} };
  const stored = safeParse(localStorage.getItem(LESSON_PROGRESS_KEY) || '{}', {});
  return {
    english: stored.english && typeof stored.english === 'object' ? stored.english : {},
    nahwu: stored.nahwu && typeof stored.nahwu === 'object' ? stored.nahwu : {},
  };
};

export const completeLesson = (type, lessonId, { score = 100, awardXp = true } = {}) => {
  if (typeof window === 'undefined' || !['english', 'nahwu'].includes(type) || !lessonId) return readLessonProgress();
  const progress = readLessonProgress();
  const previous = progress[type][lessonId];
  progress[type][lessonId] = {
    completed: true,
    bestScore: Math.max(Number(previous?.bestScore) || 0, Math.round(Number(score) || 0)),
    completedAt: previous?.completedAt || new Date().toISOString(),
    lastPracticedAt: new Date().toISOString(),
  };
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(progress));
  markSyncDirty(`${type}-lesson`);
  if (!previous?.completed && awardXp) addXp(XP_REWARDS.lesson, `${type}-lesson`);
  else emitUpdate();
  return progress;
};

export const recordLessonPractice = (type, lessonId, score) => {
  if (typeof window === 'undefined' || !['english', 'nahwu'].includes(type) || !lessonId) return readLessonProgress();
  const progress = readLessonProgress();
  const previous = progress[type][lessonId] || {};
  const rounded = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  progress[type][lessonId] = {
    ...previous,
    bestScore: Math.max(Number(previous.bestScore) || 0, rounded),
    practiceCount: (Number(previous.practiceCount) || 0) + 1,
    lastPracticedAt: new Date().toISOString(),
    completed: previous.completed || rounded >= 70,
    completedAt: previous.completedAt || (rounded >= 70 ? new Date().toISOString() : null),
  };
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(progress));
  markSyncDirty(`${type}-lesson-practice`);
  addXp(rounded >= 70 ? XP_REWARDS.lessonPractice : 5, `${type}-lesson-practice`);
  return progress;
};

export const getLessonSummary = (englishTotal = 0, nahwuTotal = 0, progress = readLessonProgress()) => {
  const englishDone = Object.values(progress.english || {}).filter((item) => item?.completed).length;
  const nahwuDone = Object.values(progress.nahwu || {}).filter((item) => item?.completed).length;
  const total = englishTotal + nahwuTotal;
  const completed = englishDone + nahwuDone;
  return {
    englishDone,
    nahwuDone,
    completed,
    total,
    percentage: total ? Math.round((completed / total) * 100) : 0,
  };
};

export const normalizeSpeechText = (value = '', lang = 'en') => {
  let text = String(value).toLocaleLowerCase(lang === 'ar' ? 'ar' : 'en-US');
  text = text.normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g, '');
  text = text.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  return text;
};

const levenshtein = (a, b) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
};

export const scorePronunciation = (target, transcript, lang = 'en') => {
  const expected = normalizeSpeechText(target, lang);
  const actual = normalizeSpeechText(transcript, lang);
  if (!expected || !actual) return { score: 0, expected, actual, matchedWords: 0, totalWords: expected.split(' ').filter(Boolean).length };
  const distance = levenshtein(expected, actual);
  const charScore = Math.max(0, 1 - (distance / Math.max(expected.length, actual.length, 1)));
  const expectedWords = expected.split(' ').filter(Boolean);
  const actualWords = new Set(actual.split(' ').filter(Boolean));
  const matchedWords = expectedWords.filter((word) => actualWords.has(word)).length;
  const wordScore = expectedWords.length ? matchedWords / expectedWords.length : 0;
  const score = Math.round(((charScore * 0.65) + (wordScore * 0.35)) * 100);
  return { score: Math.max(0, Math.min(100, score)), expected, actual, matchedWords, totalWords: expectedWords.length };
};

export const PREMIUM_UPDATE_EVENT = PREMIUM_EVENT;
