# Stage 3 — Learning Engine

Tahap ini mengubah LingoSpace Pro dari sekadar pencatat level menjadi mesin belajar yang memiliki jadwal review, target harian, streak, Mistake Book, dan sesi listening yang terstruktur.

## Fitur baru

- SRS 4 tingkat penilaian: **Lupa / Sulit / Bagus / Mudah**.
- Setiap kosakata sekarang memiliki `ease`, `repetitions`, `intervalDays`, `lastReviewed`, dan `nextReview`.
- Progres SRS lama dimigrasikan otomatis tanpa menghapus data pengguna.
- Halaman **Review Hari Ini** menampilkan kosakata yang sudah jatuh tempo.
- Review memakai alur recall yang benar: soal → tampilkan jawaban → beri rating.
- **Daily Goal** 5/10/20/30/50 kosakata per hari.
- **Streak belajar** dihitung dari aktivitas nyata per tanggal lokal perangkat.
- **Mistake Book** mengumpulkan kata yang salah dari Flashcard, Quiz, Review, dan Listening.
- Kata dapat ditandai sudah dipahami atau langsung dilatih kembali melalui Flashcard.
- Quiz terhubung ke SRS dan Mistake Book.
- Listening diubah menjadi sesi sampai 10 soal dengan opsi baru pada setiap soal, skor, progress, dan hasil akhir.
- Dashboard menampilkan target hari ini, review jatuh tempo, jumlah kesalahan aktif, dan streak.
- Navigasi desktop/mobile ditambah Review Hari Ini dan Mistake Book.

## Penyimpanan lokal baru

- `lingospace_activity`
- `lingospace_mistakes`
- `lingospace_daily_goal`

Data SRS tetap memakai `lingospace_srs` agar progres lama tetap kompatibel.

## Validasi

Jalankan:

```bash
npm run validate:data
npm run validate:learning
npm run build
```

`validate:learning` melakukan smoke test untuk migrasi SRS, grading, aktivitas harian, dan Mistake Book.
