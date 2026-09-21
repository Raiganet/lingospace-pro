const storage = new Map();
globalThis.window = {};
globalThis.localStorage = {
  getItem: (key) => storage.has(key) ? storage.get(key) : null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};

const engine = await import('../lib/learningEngine.js');
const vocabulary = [
  { id: 1, id_lang: 'Rumah' },
  { id: 2, id_lang: 'Sekolah' },
];

localStorage.setItem('lingospace_srs', JSON.stringify({ Rumah: { level: 2, correct: 3, wrong: 1 } }));
const migrated = engine.readSrsState(vocabulary);
if (!migrated['1']?.nextReview) throw new Error('Migrasi SRS lama gagal.');

const graded = engine.gradeSrsWord(migrated, 1, 'good');
if (graded.record.correct !== 4 || !graded.record.nextReview) throw new Error('Penilaian SRS gagal.');

engine.recordActivity({ wordId: 1, type: 'review', correct: true });
const activity = engine.getActivitySummary();
if (activity.todayWords !== 1 || activity.todayActions !== 1) throw new Error('Pencatatan aktivitas gagal.');

engine.recordMistake(2, 'quiz');
if (engine.getOpenMistakes(vocabulary).length !== 1) throw new Error('Mistake Book gagal mencatat.');
engine.resolveMistake(2);
if (engine.getOpenMistakes(vocabulary).length !== 0) throw new Error('Mistake Book gagal menyelesaikan item.');

console.log('✅ Learning engine smoke test PASS');
