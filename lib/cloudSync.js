'use client';

export const SYNC_EVENT = 'lingospace:data-changed';
export const AUTH_EVENT = 'lingospace:auth-changed';
export const SYNC_STATUS_EVENT = 'lingospace:sync-status';
export const BACKUP_SCHEMA_VERSION = 1;

const SYNC_KEYS = [
  'lingospace_srs',
  'lingospace_activity',
  'lingospace_mistakes',
  'lingospace_daily_goal',
  'lingospace_bookmarks',
  'lingospace_xp',
  'lingospace_xp_history',
  'lingospace_lesson_progress',
  'dailyPrayers_favorites',
  'lingospace_theme',
];

const JSON_KEYS = new Set([
  'lingospace_srs',
  'lingospace_activity',
  'lingospace_mistakes',
  'lingospace_bookmarks',
  'lingospace_xp_history',
  'lingospace_lesson_progress',
  'dailyPrayers_favorites',
]);

const safeParse = (value, fallback) => {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
};

const asTime = (value) => {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
};

export const markSyncDirty = (source = 'learning') => {
  if (typeof window === 'undefined') return;
  const at = Date.now();
  localStorage.setItem('lingospace_sync_dirty_at', String(at));
  window.dispatchEvent?.(new CustomEvent(SYNC_EVENT, { detail: { source, at } }));
};

export const captureLocalSnapshot = () => {
  if (typeof window === 'undefined') return { schemaVersion: BACKUP_SCHEMA_VERSION, values: {}, capturedAt: null };
  const values = {};
  SYNC_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) values[key] = value;
  });
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    capturedAt: new Date().toISOString(),
    values,
  };
};

const mergeSrs = (local = {}, remote = {}) => {
  const output = { ...remote, ...local };
  const keys = new Set([...Object.keys(remote || {}), ...Object.keys(local || {})]);
  keys.forEach((key) => {
    const a = local?.[key];
    const b = remote?.[key];
    if (!a) return;
    if (!b) { output[key] = a; return; }
    const aTime = asTime(a.lastReviewed || a.nextReview);
    const bTime = asTime(b.lastReviewed || b.nextReview);
    const newer = aTime >= bTime ? a : b;
    output[key] = {
      ...b,
      ...a,
      ...newer,
      correct: Math.max(Number(a.correct) || 0, Number(b.correct) || 0),
      wrong: Math.max(Number(a.wrong) || 0, Number(b.wrong) || 0),
      level: Math.max(Number(a.level) || 0, Number(b.level) || 0),
      repetitions: Math.max(Number(a.repetitions) || 0, Number(b.repetitions) || 0),
    };
  });
  return output;
};

const mergeActivity = (local = {}, remote = {}) => {
  const output = {};
  const days = new Set([...Object.keys(remote || {}), ...Object.keys(local || {})]);
  days.forEach((day) => {
    const a = local?.[day] || {};
    const b = remote?.[day] || {};
    const words = [...new Set([...(a.words || []), ...(b.words || [])].map(Number).filter(Number.isFinite))];
    const types = new Set([...Object.keys(a.byType || {}), ...Object.keys(b.byType || {})]);
    const byType = {};
    types.forEach((type) => { byType[type] = Math.max(Number(a.byType?.[type]) || 0, Number(b.byType?.[type]) || 0); });
    output[day] = {
      words,
      actions: Math.max(Number(a.actions) || 0, Number(b.actions) || 0),
      correct: Math.max(Number(a.correct) || 0, Number(b.correct) || 0),
      wrong: Math.max(Number(a.wrong) || 0, Number(b.wrong) || 0),
      byType,
    };
  });
  return output;
};

const mergeMistakes = (local = {}, remote = {}) => {
  const output = {};
  const keys = new Set([...Object.keys(remote || {}), ...Object.keys(local || {})]);
  keys.forEach((key) => {
    const a = local?.[key];
    const b = remote?.[key];
    if (!a) { output[key] = b; return; }
    if (!b) { output[key] = a; return; }
    const newer = asTime(a.lastWrong) >= asTime(b.lastWrong) ? a : b;
    const sources = {};
    new Set([...Object.keys(a.sources || {}), ...Object.keys(b.sources || {})]).forEach((source) => {
      sources[source] = Math.max(Number(a.sources?.[source]) || 0, Number(b.sources?.[source]) || 0);
    });
    output[key] = {
      ...b,
      ...a,
      ...newer,
      count: Math.max(Number(a.count) || 0, Number(b.count) || 0),
      sources,
      firstWrong: [a.firstWrong, b.firstWrong].filter(Boolean).sort()[0] || null,
      resolvedAt: newer.resolvedAt || null,
    };
  });
  return output;
};

const mergeLessonProgress = (local = {}, remote = {}) => {
  const output = { english: {}, nahwu: {} };
  ['english', 'nahwu'].forEach((type) => {
    const aGroup = local?.[type] || {};
    const bGroup = remote?.[type] || {};
    const ids = new Set([...Object.keys(aGroup), ...Object.keys(bGroup)]);
    ids.forEach((id) => {
      const a = aGroup[id];
      const b = bGroup[id];
      if (!a) { output[type][id] = b; return; }
      if (!b) { output[type][id] = a; return; }
      const newer = asTime(a.lastPracticedAt || a.completedAt) >= asTime(b.lastPracticedAt || b.completedAt) ? a : b;
      output[type][id] = {
        ...b,
        ...a,
        ...newer,
        completed: Boolean(a.completed || b.completed),
        bestScore: Math.max(Number(a.bestScore) || 0, Number(b.bestScore) || 0),
        practiceCount: Math.max(Number(a.practiceCount) || 0, Number(b.practiceCount) || 0),
      };
    });
  });
  return output;
};

const historySignature = (item = {}) => `${item.at || ''}|${item.source || ''}|${Number(item.amount) || 0}`;

const mergeValues = (localValues = {}, remoteValues = {}) => {
  const result = { ...remoteValues, ...localValues };

  const parse = (values, key, fallback) => safeParse(values?.[key] || '', fallback);
  const stringify = (value) => JSON.stringify(value);

  result.lingospace_srs = stringify(mergeSrs(parse(localValues, 'lingospace_srs', {}), parse(remoteValues, 'lingospace_srs', {})));
  result.lingospace_activity = stringify(mergeActivity(parse(localValues, 'lingospace_activity', {}), parse(remoteValues, 'lingospace_activity', {})));
  result.lingospace_mistakes = stringify(mergeMistakes(parse(localValues, 'lingospace_mistakes', {}), parse(remoteValues, 'lingospace_mistakes', {})));
  result.lingospace_lesson_progress = stringify(mergeLessonProgress(parse(localValues, 'lingospace_lesson_progress', {}), parse(remoteValues, 'lingospace_lesson_progress', {})));

  const bookmarkUnion = [...new Set([
    ...parse(remoteValues, 'lingospace_bookmarks', []),
    ...parse(localValues, 'lingospace_bookmarks', []),
  ].map(Number).filter(Number.isFinite))];
  result.lingospace_bookmarks = stringify(bookmarkUnion);

  const prayerUnion = [...new Set([
    ...parse(remoteValues, 'dailyPrayers_favorites', []),
    ...parse(localValues, 'dailyPrayers_favorites', []),
  ])];
  result.dailyPrayers_favorites = stringify(prayerUnion);

  const localHistory = parse(localValues, 'lingospace_xp_history', []);
  const remoteHistory = parse(remoteValues, 'lingospace_xp_history', []);
  const historyMap = new Map();
  [...remoteHistory, ...localHistory].forEach((item) => historyMap.set(historySignature(item), item));
  const history = [...historyMap.values()].sort((a, b) => asTime(a.at) - asTime(b.at)).slice(-500);
  result.lingospace_xp_history = stringify(history);
  const historyXp = history.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
  result.lingospace_xp = String(Math.max(
    Number(localValues.lingospace_xp) || 0,
    Number(remoteValues.lingospace_xp) || 0,
    historyXp
  ));

  const localGoal = Number(localValues.lingospace_daily_goal);
  const remoteGoal = Number(remoteValues.lingospace_daily_goal);
  result.lingospace_daily_goal = String([5, 10, 20, 30, 50].includes(localGoal) ? localGoal : ([5, 10, 20, 30, 50].includes(remoteGoal) ? remoteGoal : 20));

  return result;
};

export const mergeSnapshots = (localSnapshot, remoteSnapshot) => ({
  schemaVersion: BACKUP_SCHEMA_VERSION,
  capturedAt: new Date().toISOString(),
  values: mergeValues(localSnapshot?.values || {}, remoteSnapshot?.values || {}),
});

export const applySnapshot = (snapshot, { merge = true } = {}) => {
  if (typeof window === 'undefined') return captureLocalSnapshot();
  if (!snapshot || typeof snapshot !== 'object' || !snapshot.values || typeof snapshot.values !== 'object') {
    throw new Error('Format backup tidak valid.');
  }
  const next = merge ? mergeSnapshots(captureLocalSnapshot(), snapshot) : snapshot;
  SYNC_KEYS.forEach((key) => {
    const value = next.values?.[key];
    if (value === undefined || value === null) return;
    localStorage.setItem(key, String(value));
  });
  localStorage.setItem('lingospace_sync_dirty_at', String(Date.now()));
  window.dispatchEvent?.(new CustomEvent(SYNC_EVENT, { detail: { source: 'restore', at: Date.now() } }));
  window.dispatchEvent?.(new CustomEvent('lingospace:local-data-restored'));
  window.dispatchEvent?.(new CustomEvent('lingospace:premium-updated')); 
  return captureLocalSnapshot();
};

export const snapshotFingerprint = (snapshot = captureLocalSnapshot()) => JSON.stringify(snapshot.values || {});

export const notifySyncStatus = (detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent?.(new CustomEvent(SYNC_STATUS_EVENT, { detail }));
};

export const syncToCloud = async ({ db, firebase, uid, snapshot = captureLocalSnapshot() }) => {
  if (!db || !firebase || !uid) throw new Error('Sesi cloud belum siap.');
  notifySyncStatus({ state: 'syncing', direction: 'upload' });
  const ref = db.collection('users').doc(uid).collection('sync').doc('state');
  await ref.set({
    schemaVersion: BACKUP_SCHEMA_VERSION,
    values: snapshot.values,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    clientUpdatedAt: Date.now(),
  }, { merge: true });
  localStorage.setItem('lingospace_sync_last_success', new Date().toISOString());
  localStorage.setItem('lingospace_sync_last_fingerprint', snapshotFingerprint(snapshot));
  notifySyncStatus({ state: 'synced', direction: 'upload', at: new Date().toISOString() });
  return snapshot;
};

export const syncFromCloud = async ({ db, firebase, uid, merge = true }) => {
  if (!db || !firebase || !uid) throw new Error('Sesi cloud belum siap.');
  notifySyncStatus({ state: 'syncing', direction: 'download' });
  const ref = db.collection('users').doc(uid).collection('sync').doc('state');
  const doc = await ref.get();
  if (!doc.exists) {
    const local = captureLocalSnapshot();
    await syncToCloud({ db, firebase, uid, snapshot: local });
    return { snapshot: local, created: true };
  }

  const data = doc.data() || {};
  const remote = { schemaVersion: data.schemaVersion || 1, capturedAt: null, values: data.values || {} };
  const applied = applySnapshot(remote, { merge });
  await syncToCloud({ db, firebase, uid, snapshot: applied });
  notifySyncStatus({ state: 'synced', direction: 'merge', at: new Date().toISOString() });
  return { snapshot: applied, created: false };
};

export const getSyncableKeys = () => [...SYNC_KEYS];
