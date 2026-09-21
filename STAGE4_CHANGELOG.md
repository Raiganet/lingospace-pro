# Stage 4 — Premium Learning

Tahap ini menambahkan lapisan pembelajaran premium di atas Learning Engine Stage 3 tanpa menghapus data progres lama.

## Fitur baru

### Speaking / Pronunciation Practice
- Latihan English dan Arabic dengan Web Speech Recognition.
- Audio contoh memakai Speech Synthesis.
- Skor kemiripan pengucapan berbasis normalisasi teks + Levenshtein + kecocokan kata.
- Hasil di bawah 70 otomatis masuk Mistake Book.
- Reward XP berdasarkan kualitas pengucapan.
- Fallback UI bila browser tidak mendukung Speech Recognition.

### Mini Games
- Match Pair: pasangkan English dengan Indonesia.
- Susun Kata: susun huruf English berdasarkan arti Indonesia.
- Speed Challenge: jawab arti sebanyak mungkin dalam 30 detik.
- Semua game terhubung ke activity log, Mistake Book, dan XP.

### XP & Level
- Penyimpanan XP lokal di `lingospace_xp`.
- Level progresif dan title: New Explorer, Active Learner, Language Builder, Fluent Explorer, Polyglot.
- Aktivitas SRS reguler sekarang juga memberi XP untuk Hard/Good/Easy.
- Dashboard menampilkan level, XP, progress ke level berikutnya, serta shortcut Premium Learning.

### Learning Analytics
- Ringkasan XP, level, streak, akurasi 7 hari, aktivitas 7 hari.
- Grafik aktivitas 7 hari tanpa dependency chart tambahan.
- Progress lesson English dan Nahwu.
- Jumlah Mistake Book aktif.
- Riwayat XP terbaru.

### English & Nahwu Lesson Practice
- Status lesson selesai / belum selesai.
- Mini practice 4 pilihan di setiap detail materi.
- Best score dan practice count disimpan lokal.
- Lesson dengan skor >=70 dianggap selesai.
- Tombol manual "Tandai materi selesai" tersedia untuk materi yang sudah dipahami.
- Reward XP untuk penyelesaian dan latihan lesson.

### LingoSpace AI
LingoSpace AI tidak lagi hanya translator. Mode baru:
- Translate
- Explain
- Correct
- Examples
- Conversation

Translator memakai `/api/translate`, sedangkan fitur tutor memakai `/api/chat`. API key Gemini tetap berada di server melalui `GEMINI_API_KEY`. Model dapat dioverride dengan `GEMINI_MODEL`, default `gemini-2.5-flash`.

## File penting
- `lib/premiumLearning.js`
- `components/PremiumLearningCenter.js`
- `components/LessonPractice.js`
- `components/SmartTranslator.js`
- `app/api/chat/route.js`
- `components/Navbar.js`
- `components/LingoSpacePro.js`
- `app/globals.css`
- `scripts/validate-premium-learning.mjs`

## Validasi
```bash
npm run validate:data
npm run validate:learning
npm run validate:premium
npm run build
```

Catatan: Speech Recognition bergantung pada dukungan browser/perangkat. Chrome/Edge biasanya memiliki dukungan terbaik. Data XP, lesson progress, analytics, SRS, Mistake Book dan activity masih bersifat local-first pada Stage 4. Cloud sync direncanakan untuk tahap production.
