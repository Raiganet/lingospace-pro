# LingoSpace Pro — Tahap 1 Stabilization

Perubahan utama:

- Satu sumber data kosakata: `data/vocabulary.json` sekarang dipakai oleh Kamus, Flashcard, Quiz, Listen, dan Favorit.
- Data Kamus lama digabung tanpa dibuang: 117 entri memperkaya vocabulary lama dan 38 entri unik ditambahkan.
- Kategori sekarang dibuat otomatis dari vocabulary melalui `/api/categories`, sehingga tidak bisa lagi kosong karena file kategori terpisah.
- Favorit memakai `id` numerik secara konsisten dan memigrasikan format lama (`id_lang`) secara otomatis.
- Favorit Kamus dan Flashcard disatukan ke `lingospace_bookmarks`; bookmark Kamus lama dimigrasikan lewat `legacy-dictionary-id-map.json`.
- SRS lama yang memakai kata sebagai key dimigrasikan ke ID kosakata.
- Perhitungan statistik kata baru/dipelajari/dikuasai diperbaiki agar seluruh vocabulary dihitung, bukan hanya item yang sudah memiliki histori.
- Statistik SRS langsung diperbarui setelah rating Flashcard.
- Generator Quiz diperbaiki agar jawaban benar tidak masuk sebagai opsi salah dan opsi jawaban tidak duplikat berdasarkan label Indonesia.
- Footer ganda dihapus. Sekarang hanya ada satu shared footer di `components/Footer.js`.
- File duplikat/artefak kosong di root project dibersihkan.
- `data/dictionary.js` dan `data/categories.json` dihapus karena sudah tidak menjadi sumber data terpisah.
- Ditambahkan `npm run validate:data` untuk mengecek konsistensi vocabulary.
