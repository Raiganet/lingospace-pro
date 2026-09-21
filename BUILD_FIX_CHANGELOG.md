# LingoSpace Pro v1.0.3 — Vercel Build Fix

## Fix
- Menghapus import `Install` dari `lucide-react` karena export tersebut tidak tersedia pada dependency yang dipakai Vercel.
- Area Install PWA sekarang menggunakan icon `Download`, yang sudah tersedia dan sebelumnya juga digunakan oleh project.
- Cache Service Worker dinaikkan ke `lingospace-v1.0.3-20260921-build-fix` agar client tidak tertahan pada asset lama setelah deploy.
- Version project dinaikkan dari `1.0.2` menjadi `1.0.3`.

## Error Vercel yang diperbaiki
`Export Install doesn't exist in target module` pada `components/AccountCenter.js`.
