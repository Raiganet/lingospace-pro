# Stage 6 — Final QA, Security & Production Launch

## Perubahan
- Menambahkan release validator dan satu perintah `npm run release:check`.
- Menandai package sebagai ES module dan menetapkan baseline Node.js.
- Menghapus route AI legacy `/chat` yang tidak memakai guard production.
- Translator tidak lagi bergantung pada endpoint GAS hardcoded; GAS bersifat opsional dan Gemini menjadi fallback server-side.
- Menambahkan metadata base/canonical, Twitter metadata, `robots.txt`, dan `sitemap.xml`.
- Menambahkan loading, not-found, route error, dan global error state.
- Menambah security headers production serta no-store untuk endpoint API.
- Mengubah cache service worker ke versi release v1.0.0.
- Memperbaiki halaman Contact agar tidak lagi menampilkan status “terkirim” palsu; form menyiapkan email pengguna secara transparan.
- Memperbarui Privacy Policy dan Terms agar sesuai fitur nyata (Firebase, Gemini, speech recognition, notification, PWA, backup/sync) dan menghapus klaim AdSense yang tidak diimplementasikan.
- Menambahkan checklist QA/deployment v1.0.
