import fs from 'node:fs';

class StorageMock {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

globalThis.localStorage = new StorageMock();
globalThis.window = { dispatchEvent() {} };
globalThis.CustomEvent = class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } };

const cloud = await import('../lib/cloudSync.js');

localStorage.setItem('lingospace_bookmarks', JSON.stringify([1, 2]));
localStorage.setItem('lingospace_xp', '20');
localStorage.setItem('lingospace_xp_history', JSON.stringify([{ amount: 20, source: 'local', at: '2026-09-21T00:00:00.000Z' }]));
localStorage.setItem('lingospace_srs', JSON.stringify({ '1': { correct: 2, wrong: 1, lastReviewed: '2026-09-20T00:00:00.000Z' } }));

const local = cloud.captureLocalSnapshot();
const remote = {
  schemaVersion: 1,
  values: {
    lingospace_bookmarks: JSON.stringify([2, 3]),
    lingospace_xp: '15',
    lingospace_xp_history: JSON.stringify([{ amount: 15, source: 'remote', at: '2026-09-20T00:00:00.000Z' }]),
    lingospace_srs: JSON.stringify({ '1': { correct: 5, wrong: 1, lastReviewed: '2026-09-21T00:00:00.000Z' } }),
  },
};

const merged = cloud.mergeSnapshots(local, remote);
const bookmarks = JSON.parse(merged.values.lingospace_bookmarks);
if (![1, 2, 3].every((id) => bookmarks.includes(id))) throw new Error('Bookmark merge gagal');
if (Number(merged.values.lingospace_xp) !== 35) throw new Error(`XP history merge gagal: ${merged.values.lingospace_xp}`);
const mergedSrs = JSON.parse(merged.values.lingospace_srs);
if (mergedSrs['1']?.correct !== 5) throw new Error('SRS merge gagal memilih progres terbaik');

cloud.applySnapshot(merged, { merge: true });
if (!localStorage.getItem('lingospace_sync_dirty_at')) throw new Error('Restore tidak menandai data berubah');

const manifest = JSON.parse(fs.readFileSync(new URL('../public/manifest.json', import.meta.url), 'utf8'));
if (!manifest.start_url || !Array.isArray(manifest.icons) || manifest.icons.length < 2) throw new Error('Manifest PWA tidak lengkap');
if (!fs.existsSync(new URL('../app/sw.js/route.js', import.meta.url))) throw new Error('Service worker route tidak ditemukan');
if (!fs.existsSync(new URL('../firestore.rules', import.meta.url))) throw new Error('Firestore rules tidak ditemukan');
if (!fs.existsSync(new URL('../.env.example', import.meta.url))) throw new Error('.env.example tidak ditemukan');

console.log('✅ Production smoke test PASS');
console.log(`ℹ️  Sync keys=${cloud.getSyncableKeys().length}, merged bookmarks=${bookmarks.length}, merged XP=${merged.values.lingospace_xp}`);
