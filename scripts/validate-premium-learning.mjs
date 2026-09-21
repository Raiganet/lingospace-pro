class StorageMock {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  clear() { this.map.clear(); }
}

global.localStorage = new StorageMock();
global.window = { dispatchEvent() {} };
global.CustomEvent = class CustomEvent { constructor(type) { this.type = type; } };

const premium = await import('../lib/premiumLearning.js');

const start = premium.getLevelInfo(0);
if (start.level !== 1 || start.totalXp !== 0) throw new Error('Level awal invalid');

premium.addXp(150, 'test');
const afterXp = premium.getLevelInfo(premium.readXp());
if (afterXp.totalXp !== 150 || afterXp.level < 2) throw new Error('XP/level gagal');

let progress = premium.completeLesson('english', 'EB1');
if (!progress.english.EB1?.completed) throw new Error('Lesson completion gagal');
progress = premium.recordLessonPractice('nahwu', 'NI1', 100);
if (!progress.nahwu.NI1?.completed || progress.nahwu.NI1.bestScore !== 100) throw new Error('Lesson practice gagal');

const exact = premium.scorePronunciation('I love learning English', 'I love learning English', 'en');
if (exact.score !== 100) throw new Error('Pronunciation exact score invalid');
const close = premium.scorePronunciation('Good morning teacher', 'Good morning', 'en');
if (!(close.score > 40 && close.score < 100)) throw new Error('Pronunciation partial score invalid');
const arabic = premium.scorePronunciation('مَدْرَسَةٌ', 'مدرسة', 'ar');
if (arabic.score !== 100) throw new Error('Arabic normalization invalid');

console.log('✅ Premium learning smoke test PASS');
console.log(`ℹ️  XP=${premium.readXp()}, level=${premium.getLevelInfo(premium.readXp()).level}, English lesson EB1 completed.`);
