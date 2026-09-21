# LingoSpace Pro v1.0 — Production Setup

## 1. Environment Variables
Salin `.env.example` menjadi `.env.local` saat development. Di Vercel, masukkan nilai yang sama melalui Project Settings → Environment Variables.

### URL & contact
- `NEXT_PUBLIC_SITE_URL` — URL final production; digunakan metadata, canonical, sitemap, dan robots.
- `NEXT_PUBLIC_CONTACT_EMAIL` — email publik untuk halaman Contact.
- `NEXT_PUBLIC_MAIN_WEBSITE` — website publik utama (opsional).

### AI / translator
- `GEMINI_API_KEY` — server-side, jangan memakai prefix `NEXT_PUBLIC_`.
- `GEMINI_MODEL` — opsional; default `gemini-2.5-flash`.
- `TRANSLATE_GAS_URL` — opsional. Jika kosong, endpoint translate memakai Gemini sebagai fallback. Tidak ada lagi endpoint GAS hardcoded di source.

### Firebase client
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` — opsional untuk FCM.

### Guard API
- `ALLOWED_ORIGINS` — origin tambahan, dipisahkan koma. Same-origin selalu diterima.
- `AI_RATE_LIMIT_MAX`
- `AI_RATE_LIMIT_WINDOW_MS`
- `TRANSLATE_RATE_LIMIT_MAX`

Rate limit bawaan bersifat per-instance/in-memory. Untuk traffic besar/multi-instance, gunakan rate limiter terdistribusi pada infrastruktur production.

## 2. Firebase Authentication
1. Authentication → Sign-in method.
2. Aktifkan Email/Password.
3. Aktifkan Google jika login Google akan digunakan.
4. Tambahkan domain production ke Authorized domains.

## 3. Firestore
1. Buat Cloud Firestore database.
2. Deploy `firestore.rules`.
3. Progres sinkronisasi disimpan di `users/{uid}/sync/state`.
4. Token FCM disimpan di `users/{uid}/devices/{deviceId}`.
5. Jangan mengubah rules menjadi akses publik.

## 4. PWA
Service worker tersedia di `/sw.js`; manifest di `/manifest.json`.

Setelah deployment HTTPS:
1. Buka aplikasi online dan refresh.
2. Pastikan service worker berstatus activated.
3. Buka beberapa lesson/vocabulary.
4. Aktifkan offline pada DevTools/perangkat dan ulangi halaman yang sudah pernah dibuka.
5. Uji tombol Install LingoSpace dari menu Akun & Data.

## 5. Review Reminder & FCM
Reminder lokal dapat tampil ketika aplikasi dibuka/kembali aktif dan browser memberikan izin notifikasi. Token FCM dapat didaftarkan jika VAPID key tersedia. Push terjadwal saat aplikasi benar-benar tertutup tetap memerlukan backend pengirim FCM/Cloud Functions + scheduler.

## 6. Release check
```bash
npm ci
npm run release:check
npm run lint
npm run build
```

Jika `npm ci` tidak cocok karena lockfile sedang diubah, jalankan `npm install`, commit lockfile yang baru, lalu ulangi pemeriksaan.

## 7. Deploy Vercel
1. Push repository ke GitHub.
2. Import repository di Vercel.
3. Isi Environment Variables untuk Production (dan Preview jika diperlukan).
4. Deploy.
5. Jalankan seluruh checklist di `RELEASE_CHECKLIST.md` terhadap URL production.

## 8. Catatan keamanan
- `NEXT_PUBLIC_FIREBASE_*` adalah config client dan memang terlihat di browser; keamanan data tetap bergantung pada Auth + Firestore Rules.
- `GEMINI_API_KEY` harus tetap server-side.
- Jangan commit `.env.local`, service-account JSON, private key, atau backup pengguna.
- Rate limit in-memory cukup sebagai baseline, bukan proteksi distributed-rate-limit untuk traffic tinggi.
