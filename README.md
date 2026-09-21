# LingoSpace Pro

LingoSpace Pro adalah PWA pembelajaran Bahasa Indonesia–English–Arabic dengan vocabulary, Flashcard SRS, Review Hari Ini, Quiz, Listening, Speaking Practice, English/Nahwu lesson, mini games, Mistake Book, XP/level, analytics belajar, LingoSpace AI, offline cache, backup/restore, serta login dan cloud sync Firebase opsional.

## Requirements
- Node.js >= 20.9
- npm
- Gemini API key untuk fitur AI/fallback translator
- Firebase Web project jika login/cloud sync diperlukan

## Local development
```bash
cp .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Validasi release
```bash
npm run release:check
npm run lint
npm run build
```

`release:check` menjalankan validator data, Learning Engine, Premium Learning, cloud-sync production, dan baseline release/security.

## Environment
Gunakan `.env.example` sebagai daftar environment variable. Jangan commit `.env.local` atau credential Firebase Admin/service-account.

## Production
Baca:
- `PRODUCTION_SETUP.md`
- `RELEASE_CHECKLIST.md`
- `firestore.rules`

Mode tamu tetap berjalan secara lokal tanpa Firebase. Fitur AI memerlukan konfigurasi server-side.

## Version
Target paket ini: **LingoSpace Pro v1.0.0 — Stage 6 Final QA / Production Launch**.
