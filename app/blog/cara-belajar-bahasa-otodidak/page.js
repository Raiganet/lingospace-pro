import Link from 'next/link';

export default function Artikel16() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Tips Belajar</span>
              <span className="text-gray-400 text-sm">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cara Belajar Bahasa Otodidak yang Efektif: Panduan Lengkap</h1>
            <p className="text-gray-300 text-lg">Belajar bahasa asing tanpa kursus mahal? Ini strategi yang terbukti berhasil!</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Belajar bahasa asing secara otodidak (self-taught) semakin populer di era digital. Dengan akses ke internet, aplikasi, dan konten gratis, siapa pun bisa menguasai bahasa baru tanpa harus mengeluarkan biaya kursus yang mahal. Tapi bagaimana caranya agar efektif?</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Tetapkan Tujuan yang Jelas</h2>
            <p>Sebelum mulai belajar, tanyakan pada diri sendiri:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Mengapa saya ingin belajar bahasa ini?</strong> (Untuk kerja, travel, hobi, atau akademik?)</li>
              <li><strong>Berapa lama target waktu saya?</strong> (3 bulan, 6 bulan, 1 tahun?)</li>
              <li><strong>Level apa yang ingin saya capai?</strong> (Dasar, menengah, atau fasih?)</li>
            </ul>
            <p>Tujuan yang jelas akan membantu Anda tetap termotivasi dan fokus.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Mulai dari Dasar yang Kuat</h2>
            <p>Jangan langsung melompat ke materi advanced. Mulailah dari:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Alfabet/Huruf:</strong> Kenali sistem tulisan bahasa target.</li>
              <li><strong>Pelafalan:</strong> Dengarkan dan tirukan bunyi-bunyi dasar.</li>
              <li><strong>Kosakata Inti:</strong> Hafal 100-500 kata paling sering digunakan.</li>
              <li><strong>Grammar Dasar:</strong> Pahami struktur kalimat sederhana.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Gunakan Metode Immersion (Pencelupan)</h2>
            <p>Immerse diri Anda dalam bahasa target sebanyak mungkin:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Ganti bahasa HP:</strong> Ubah setting HP ke bahasa target.</li>
              <li><strong>Tonton film/series:</strong> Dengan subtitle bahasa target (bukan Indonesia).</li>
              <li><strong>Dengar podcast:</strong> Saat commuting atau olahraga.</li>
              <li><strong>Baca berita:</strong> Mulai dari berita anak-anak, lalu naik level.</li>
              <li><strong>Ikuti social media:</strong> Follow akun berbahasa target.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">4. Manfaatkan Teknologi</h2>
            <p>Ada banyak tools gratis yang bisa membantu:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Aplikasi Flashcard:</strong> Anki, Quizlet, atau LingoSpace Pro untuk menghafal kosakata.</li>
              <li><strong>YouTube:</strong> Channel pembelajaran bahasa gratis.</li>
              <li><strong>Podcast:</strong> Coffee Break Languages, LanguagePod101.</li>
              <li><strong>Language Exchange:</strong> HelloTalk, Tandem untuk praktik dengan native speaker.</li>
              <li><strong>Kamus Online:</strong> WordReference, Cambridge Dictionary.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">5. Buat Jadwal Belajar Konsisten</h2>
            <p>Konsistensi lebih penting daripada durasi. Lebih baik belajar 30 menit setiap hari daripada 5 jam sekali seminggu. Contoh jadwal:</p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <ul className="space-y-2">
                <li><strong>Pagi (15 menit):</strong> Review flashcard kosakata.</li>
                <li><strong>Siang (10 menit):</strong> Dengar podcast saat makan siang.</li>
                <li><strong>Sore (15 menit):</strong> Latihan grammar atau menulis jurnal.</li>
                <li><strong>Malam (20 menit):</strong> Tonton video/film berbahasa target.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">6. Praktik Berbicara Sejak Hari Pertama</h2>
            <p>Jangan tunggu sampai "siap" untuk berbicara. Mulailah sejak hari pertama:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Bicara sendiri:</strong> Narasikan kegiatan sehari-hari dalam bahasa target.</li>
              <li><strong>Rekam suara:</strong> Dengarkan kembali dan evaluasi pronunciation.</li>
              <li><strong>Language partner:</strong> Cari teman belajar online.</li>
              <li><strong>Tutor online:</strong> Jika ada budget, pakai iTalki atau Preply.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">7. Jangan Takut Salah</h2>
            <p>Kesalahan adalah bagian dari proses belajar. Setiap kali Anda salah, itu berarti Anda sedang belajar. Jangan biarkan rasa takut membuat Anda berhenti.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">8. Rayakan Progress Kecil</h2>
            <p>Setiap kali Anda mencapai milestone (misalnya: hafal 100 kata, bisa membaca artikel pertama, atau berhasil ngobrol 5 menit), rayakan! Ini akan menjaga motivasi Anda tetap tinggi.</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🚀 Mulai Belajar Otodidak dengan LingoSpace Pro!</h3>
              <p className="mb-4">LingoSpace Pro dirancang untuk pembelajar otodidak dengan fitur flashcard, quiz, listen, dan roadmap yang terstruktur. Mulai perjalanan bahasa Anda hari ini!</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Belajar Gratis</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}