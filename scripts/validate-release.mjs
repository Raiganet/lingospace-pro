import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const expect = (condition, message) => { if (!condition) errors.push(message); };

const requiredFiles = [
  'app/error.js',
  'app/global-error.js',
  'app/loading.js',
  'app/not-found.js',
  'app/robots.js',
  'app/sitemap.js',
  'app/sw.js/route.js',
  'firestore.rules',
  'public/manifest.json',
  'public/offline.html',
  'PRODUCTION_SETUP.md',
  'RELEASE_CHECKLIST.md',
];
for (const file of requiredFiles) expect(exists(file), `File release wajib tidak ditemukan: ${file}`);

const pkg = JSON.parse(read('package.json'));
expect(pkg.type === 'module', 'package.json harus memakai type=module.');
expect(Boolean(pkg.engines?.node), 'Node engine belum ditentukan.');
expect(Boolean(pkg.scripts?.['release:check']), 'Script release:check belum tersedia.');

const manifest = JSON.parse(read('public/manifest.json'));
expect(manifest.display === 'standalone', 'Manifest PWA harus display=standalone.');
expect(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Manifest harus memiliki ikon PWA.');
for (const icon of manifest.icons || []) {
  const localPath = String(icon.src || '').replace(/^\//, '');
  expect(Boolean(localPath) && exists(`public/${localPath.replace(/^public\//, '')}`), `Ikon manifest tidak ditemukan: ${icon.src}`);
}

const env = read('.env.example');
for (const key of [
  'NEXT_PUBLIC_SITE_URL', 'GEMINI_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID',
]) expect(env.includes(`${key}=`), `.env.example belum memuat ${key}.`);

const rules = read('firestore.rules');
expect(rules.includes('request.auth.uid == userId'), 'Firestore rules belum membatasi akses berdasarkan UID.');
expect(!rules.includes('allow read, write: if true'), 'Firestore rules mengandung rule publik berbahaya.');

const guards = read('lib/serverGuards.js');
expect(guards.includes('x-forwarded-for') && guards.includes('Retry-After'), 'API guard belum lengkap.');
for (const api of ['app/api/chat/route.js', 'app/api/translate/route.js']) {
  const source = read(api);
  expect(source.includes('guardApiRequest'), `${api} belum memakai API guard.`);
  expect(source.includes('maxBytes'), `${api} belum membatasi ukuran request.`);
}
expect(!exists('app/chat/route.js'), 'Route legacy app/chat masih ada dan melewati guard produksi.');

const nextConfig = read('next.config.mjs');
for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
  expect(nextConfig.includes(header), `Security header ${header} belum tersedia.`);
}

const swModule = await import(new URL('../app/sw.js/route.js', import.meta.url));
const response = await swModule.GET();
const worker = await response.text();
try { new vm.Script(worker, { filename: 'generated-sw.js' }); }
catch (error) { errors.push(`Generated service worker tidak valid: ${error.message}`); }
for (const marker of ['notificationclick', 'staleWhileRevalidate', 'CACHE_VERSION', 'offline.html']) {
  expect(worker.includes(marker), `Generated service worker kehilangan ${marker}.`);
}

const sourceFiles = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(?:js|mjs|json|md|txt|rules)$/i.test(entry.name)) sourceFiles.push(full);
  }
};
walk(root);
const secretPatterns = [
  /AIza[0-9A-Za-z_-]{25,}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) errors.push(`Kemungkinan secret ter-hardcode di ${path.relative(root, file)}.`);
    pattern.lastIndex = 0;
  }
}

for (const forbidden of ['.env.local', '.env.production.local']) {
  if (exists(forbidden)) warnings.push(`${forbidden} ada di working tree. Pastikan tidak masuk commit/ZIP.`);
}

if (errors.length) {
  console.error('❌ Release validation FAILED');
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('✅ Release validation PASS');
console.log(`ℹ️  ${requiredFiles.length} release files checked, service worker parsed, security baseline verified.`);
warnings.forEach((message) => console.log(`⚠️  ${message}`));
