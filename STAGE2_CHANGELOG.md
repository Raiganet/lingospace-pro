# Stage 2 — UI/UX Redesign

Tahap ini berfokus pada pengalaman aplikasi, navigasi, konsistensi visual, dan fondasi tema. Tidak mengubah algoritma belajar/SRS inti dari Stage 1.

## App Shell & Navigation
- Mengganti navbar desktop yang padat menjadi sidebar desktop permanen.
- Menambahkan topbar ringkas dengan nama halaman aktif, shortcut Kamus, dan toggle tema.
- Menambahkan bottom navigation mobile: Home, Belajar, Kamus, AI, Lainnya.
- Menambahkan mobile feature sheet untuk mengakses seluruh modul tanpa menu hamburger panjang.
- Active state sekarang benar-benar mengikuti mode yang sedang dibuka.
- Mode terakhir disimpan di `localStorage` (`lingospace_active_mode`).
- Menambahkan validasi mode agar nilai localStorage yang rusak tidak membuat halaman kosong.

## Theme & Accessibility
- Menambahkan Dark/Light theme premium berbasis CSS variables.
- Pilihan tema disimpan di `localStorage` (`lingospace_theme`).
- Menghapus pembatas `maximumScale` / `userScalable: false` agar pinch zoom tetap dapat digunakan.
- Memindahkan viewport ke export `viewport` sesuai pola Next.js modern.
- Menambahkan `prefers-reduced-motion` support.
- Menambahkan typography fallback khusus teks Arab (`Noto Naskh Arabic` / `Noto Sans Arabic` / fallback sistem) tanpa dependency font remote.
- Memindahkan `@import "tailwindcss"` ke posisi awal stylesheet agar urutan CSS valid.

## Dashboard V2
- Hero dashboard baru dengan CTA langsung ke Flashcard dan Quiz.
- Progress ring keseluruhan berdasarkan kosakata yang sudah mulai dipelajari.
- Stat cards baru untuk total kosakata, dikuasai, sedang dipelajari, dan akurasi.
- Panel progress kosakata yang lebih jelas.
- Quick actions ke Flashcard, Quiz, Kamus, dan Favorit.
- Achievement / milestone dibuat lebih rapi tanpa mengubah aturan pencapaian yang sudah ada.
- Banner install PWA disederhanakan dan diselaraskan dengan design system baru.

## Consistency
- Mengganti icon navigasi/dashboard utama dari emoji menjadi `lucide-react` yang konsisten.
- Smart Translator diubah branding UI menjadi `LingoSpace AI`.
- Label status statis `Online` di translator diganti menjadi `Siap` agar tidak mengklaim status koneksi yang tidak benar-benar dicek.
- Smart Translator dan Doa Harian tidak lagi membuat background full-screen sendiri sehingga menyatu dengan App Shell.
- Search/filter vocabulary disesuaikan dengan toolbar baru.
- Footer mengikuti layout sidebar dan tidak tertutup bottom navigation di mobile.

## Validation
- 45 file JS/MJS berhasil diparse dengan TypeScript parser tanpa error sintaks.
- `app/globals.css` berhasil diparse dengan PostCSS.
- `npm run validate:data` ekuivalen (`node scripts/validate-data.mjs`) tetap PASS:
  - 1.046 vocabulary
  - 1.046 ID unik
  - 40 kategori
  - 155 pronunciation
  - 155 contoh Bahasa Indonesia

## Catatan Build
`npm ci` tidak selesai di environment audit karena batas koneksi/waktu container. Jalankan di komputer lokal:

```bash
npm install
npm run validate:data
npm run build
```
