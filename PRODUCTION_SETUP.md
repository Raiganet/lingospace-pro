# LingoSpace Pro — Production Setup

## 1. Environment Variables
Copy `.env.example` menjadi `.env.local` untuk development, lalu masukkan key yang sama di Vercel Project Settings → Environment Variables.

Wajib untuk LingoSpace AI:
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (opsional, default `gemini-2.5-flash`)

Opsional untuk translator GAS:
- `TRANSLATE_GAS_URL`

Untuk login + cloud sync Firebase:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` (opsional, hanya push/FCM)

## 2. Firebase Authentication
Di Firebase Console:
1. Authentication → Sign-in method.
2. Aktifkan **Email/Password**.
3. Aktifkan **Google** jika tombol Google akan digunakan.
4. Tambahkan domain production/Vercel yang sesuai ke Authorized domains bila diperlukan.

## 3. Firestore
1. Buat Cloud Firestore database.
2. Deploy isi `firestore.rules`.
3. Data sinkronisasi disimpan di `users/{uid}/sync/state`.
4. Device token untuk FCM disimpan di `users/{uid}/devices/{deviceId}`.

## 4. PWA
Tidak memerlukan library tambahan. Service worker tersedia dari `/sw.js` dan manifest dari `/manifest.json`.

Setelah deploy HTTPS:
- buka web,
- refresh satu kali,
- buka **Akun & Sinkronisasi**,
- gunakan **Install LingoSpace** jika browser menyediakan install prompt.

## 5. Review Reminder & FCM
Local notification dapat aktif setelah user memberikan izin browser.

Untuk background push dari server, isi `NEXT_PUBLIC_FIREBASE_VAPID_KEY`. Web app akan mendaftarkan token device untuk user yang login. Pengiriman terjadwal tetap memerlukan Firebase Cloud Functions/Cloud Scheduler atau backend pengirim FCM.

## 6. Pre-deploy Check
Jalankan:

```bash
npm install
npm run validate:data
npm run validate:learning
npm run validate:premium
npm run validate:production
npm run build
```

## 7. Firestore Security Principle
Rules yang disertakan hanya mengizinkan user authenticated membaca/menulis dokumen di bawah UID miliknya sendiri. Jangan mengganti rules production menjadi `allow read, write: if true`.
