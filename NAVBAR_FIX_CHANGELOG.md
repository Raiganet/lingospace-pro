# LingoSpace Pro v1.0.1 — Navbar Responsive Fix

## Perubahan

- Bottom navigation sekarang secara eksplisit hanya tampil pada viewport di bawah 1024px.
- Saat sidebar desktop aktif, bottom navigation dan mobile sheet disembunyikan dengan `display: none !important`.
- Tinggi bottom navigation mobile diperkecil agar tidak terlalu menutup konten.
- Ukuran ikon, label, padding, radius, dan jarak bawah mobile navigation dibuat lebih ringkas.
- Padding bawah konten/footer disesuaikan dengan tinggi navbar mobile yang baru.
- Cache Service Worker dinaikkan ke `lingospace-v1.0.1-20260921-navbar-fix` supaya CSS lama tidak tertahan setelah deploy.

## Hasil yang diharapkan

- Desktop >= 1024px: hanya sidebar kiri, tanpa bottom navigation.
- Mobile/tablet kecil < 1024px: bottom navigation tetap tampil dan lebih ramping.
