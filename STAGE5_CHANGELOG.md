# Stage 5 — Production Readiness

## Akun & Cloud Sync
- Menambahkan menu **Akun & Sinkronisasi**.
- Firebase Authentication opsional: email/password, reset password, Google Sign-In.
- Cloud Firestore sync untuk progres belajar per user.
- Strategi merge untuk SRS, activity, Mistake Book, bookmarks, XP history, lesson progress, target harian, favorit doa, dan tema.
- Auto-sync saat data berubah, interval saat login, saat koneksi kembali online, dan saat aplikasi masuk background.
- Aplikasi tetap berjalan penuh dalam mode tamu/local jika Firebase belum dikonfigurasi.
- Menambahkan `firestore.rules` dengan isolasi data berdasarkan `request.auth.uid`.

## Backup & Restore
- Export progress ke file JSON.
- Restore JSON dengan merge, bukan overwrite buta.
- Batas file restore 3 MB.

## PWA & Offline
- Service worker `/sw.js` dengan versioned cache.
- Navigation fallback ke cache/offline page.
- Runtime cache untuk Next static assets dan image/font.
- Stale-while-revalidate untuk vocabulary, categories, English lessons, Nahwu lessons, dan roadmap API.
- Manifest diperbarui: id/scope/lang/categories, icon proper, dan shortcuts Review/Flashcard/AI.
- Menambahkan `public/offline.html`.
- Install prompt ditangkap global dan tersedia di Akun & Data.

## Reminder & Push Readiness
- Local review reminder menggunakan Notification API + service worker.
- Optional Firebase Messaging token registration jika VAPID key dikonfigurasi.
- FCM background handler ditanam di service worker dinamis.
- Token perangkat login disimpan di `users/{uid}/devices/{deviceId}` untuk kesiapan pengiriman push dari backend/Firebase Messaging.

> Catatan: web app tidak dapat menjadwalkan push harian yang benar-benar berjalan sendiri ketika perangkat/browser tidak aktif tanpa backend scheduler. Untuk reminder server-side terjadwal, gunakan Firebase Cloud Functions/Cloud Scheduler atau backend setara untuk membaca token device dan mengirim FCM.

## API Hardening
- Menambahkan per-IP in-memory rate limiter untuk `/api/chat` dan `/api/translate`.
- Same-origin validation untuk browser requests dan optional `ALLOWED_ORIGINS`.
- Request size limit.
- Batas input AI/translator 3000 karakter.
- Translator timeout 15 detik.
- Bahasa translator divalidasi (`id`, `en`, `ar`).
- `TRANSLATE_GAS_URL` dapat dipindahkan ke environment variable.
- Security response headers di `next.config.mjs`.

> Catatan: in-memory rate limiter adalah perlindungan dasar per instance serverless. Untuk trafik tinggi/multi-instance, pindahkan rate limit ke Redis/KV/Upstash atau gateway terpusat.

## Environment
Lihat `.env.example` dan `PRODUCTION_SETUP.md`.

## Validator
- `npm run validate:data`
- `npm run validate:learning`
- `npm run validate:premium`
- `npm run validate:production`
