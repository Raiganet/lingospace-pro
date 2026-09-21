# LingoSpace Pro v1.0 — Release Checklist

## A. Sebelum deploy
- [ ] Gunakan Node.js >= 20.9.
- [ ] Jalankan `npm ci` (atau `npm install` jika lockfile sedang diperbarui).
- [ ] Jalankan `npm run release:check`.
- [ ] Jalankan `npm run lint`.
- [ ] Jalankan `npm run build`.
- [ ] Pastikan `.env.local`, `.env.*.local`, service-account JSON, dan API key tidak masuk Git.

## B. Environment Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` berisi URL production final.
- [ ] `GEMINI_API_KEY` tersedia untuk AI dan fallback translator.
- [ ] `GEMINI_MODEL` opsional (default `gemini-2.5-flash`).
- [ ] Firebase Web config terisi jika login/cloud sync dipakai.
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY` terisi jika push notification dipakai.
- [ ] `TRANSLATE_GAS_URL` hanya diisi jika masih ingin memakai translator GAS; tanpa GAS, Gemini dipakai sebagai fallback.
- [ ] `ALLOWED_ORIGINS` hanya berisi origin yang benar-benar diperlukan.

## C. Firebase
- [ ] Email/Password Auth aktif.
- [ ] Google provider aktif jika tombol Google dipakai.
- [ ] Domain production ada di Authorized domains.
- [ ] `firestore.rules` sudah dideploy.
- [ ] Test dua akun: akun A tidak bisa membaca data akun B.
- [ ] Test sinkronisasi dua perangkat/browser dengan akun yang sama.

## D. PWA & offline
- [ ] `/manifest.json` bisa dibuka dan ikon tampil.
- [ ] `/sw.js` merespons JavaScript, bukan HTML.
- [ ] Install dari Android/desktop berhasil.
- [ ] Buka Flashcard/lesson saat online, lalu ulangi saat offline.
- [ ] Deploy versi baru dan pastikan cache lama berganti ke `lingospace-v1.0.0-20260921`.

## E. QA perangkat nyata
- [ ] Android Chrome — portrait.
- [ ] Android Chrome — landscape.
- [ ] Desktop Chrome/Edge.
- [ ] Lebar 320px, 375px, 768px, 1024px, 1440px.
- [ ] Sidebar desktop tidak menutup konten.
- [ ] Bottom navigation tidak menutup tombol terakhir.
- [ ] Modal lesson dapat discroll.
- [ ] Teks Arab tidak terpotong.
- [ ] Keyboard mobile tidak menutup composer AI.

## F. Learning regression
- [ ] Flashcard: flip lalu Lupa/Sulit/Bagus/Mudah.
- [ ] Review Hari Ini memperbarui `nextReview`.
- [ ] Quiz salah masuk Mistake Book.
- [ ] Listening menyelesaikan satu sesi penuh.
- [ ] Speaking menampilkan fallback jika browser tidak mendukung speech recognition.
- [ ] Mini Games menambah XP.
- [ ] English/Nahwu practice tersimpan.
- [ ] Backup JSON lalu restore di profile browser baru.

## G. AI & error handling
- [ ] AI menjawab mode Translate/Explain/Correct/Examples/Conversation.
- [ ] Request terlalu panjang ditolak.
- [ ] Rate limit mengembalikan HTTP 429.
- [ ] GEMINI_API_KEY kosong menghasilkan pesan konfigurasi, bukan crash.
- [ ] Translator bekerja dengan GAS atau fallback Gemini.
- [ ] Mode offline tidak membuat aplikasi blank.

## H. SEO & legal
- [ ] `/robots.txt` tersedia.
- [ ] `/sitemap.xml` memuat home, halaman legal, blog, dan artikel.
- [ ] Open Graph image tampil saat URL dibagikan.
- [ ] Privacy Policy sesuai layanan yang benar-benar digunakan.
- [ ] Terms tidak menyebut integrasi yang tidak tersedia.
- [ ] Contact form tidak menampilkan sukses palsu; pengguna diarahkan ke aplikasi email.

## I. Launch
- [ ] Production deployment sukses.
- [ ] Tidak ada error fatal di browser console pada halaman utama.
- [ ] Uji login, logout, reset password, cloud sync, backup dan restore.
- [ ] Uji PWA setelah hard refresh.
- [ ] Simpan tag/release Git `v1.0.0` setelah QA nyata selesai.
