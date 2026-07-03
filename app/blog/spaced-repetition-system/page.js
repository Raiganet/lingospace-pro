import Link from 'next/link';

export default function Artikel5() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">
          ← Kembali ke Blog
        </Link>
        
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">
                Tips Belajar
              </span>
              <span className="text-gray-400 text-sm">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Spaced Repetition System: Rahasia Mengingat Kosakata Jangka Panjang
            </h1>
            <p className="text-gray-300 text-lg">
              Mengapa SRS adalah metode terbaik untuk mengingat kosakata bahasa asing secara permanen.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Pernahkah Anda mengalami situasi ini: Anda menghafal 50 kosakata baru hari ini, 
              tapi besoknya hanya ingat 10 kata? Atau mungkin Anda sudah belajar bahasa asing 
              selama berbulan-bulan, tapi kosakata yang Anda pelajari di awal sudah lupa semua?
            </p>
            <p>
              Jika ya, Anda tidak sendirian. Ini adalah masalah klasik dalam pembelajaran bahasa. 
              Tapi ada solusi yang terbukti secara ilmiah: <strong>Spaced Repetition System (SRS)</strong>. 
              Metode ini bisa membantu Anda mengingat kosakata secara permanen dengan usaha yang lebih sedikit.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Apa Itu Spaced Repetition System?</h2>
            <p>
              Spaced Repetition System (SRS) adalah metode pembelajaran yang menggunakan interval waktu 
              yang semakin panjang untuk mengulang materi. Konsep dasarnya sederhana:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Review materi tepat sebelum Anda lupa</li>
              <li>Tingkatkan interval waktu setiap kali Anda berhasil mengingat</li>
              <li>Fokus pada materi yang sulit, kurangi review materi yang sudah dikuasai</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Sejarah SRS</h2>
            <p>
              Konsep spaced repetition pertama kali diteliti oleh Hermann Ebbinghaus pada tahun 1885. 
              Ia menemukan "Forgetting Curve" - kurva yang menunjukkan bagaimana informasi dilupakan 
              seiring waktu.
            </p>
            <p>
              Ebbinghaus menemukan bahwa:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kita melupakan 50% informasi baru dalam 1 jam</li>
              <li>Kita melupakan 70% dalam 24 jam</li>
              <li>Kita melupakan 90% dalam 1 minggu</li>
            </ul>
            <p>
              Tapi, jika kita mengulang informasi pada waktu yang tepat (tepat sebelum lupa), 
              kurva forgetting menjadi lebih landai, dan informasi masuk ke memori jangka panjang.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Cara Kerja SRS</h2>
            <p>
              SRS bekerja dengan algoritma yang menentukan kapan Anda harus mengulang materi. 
              Berikut cara kerjanya:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Interval Bertahap</h3>
            <p>
              Setiap kali Anda berhasil mengingat kata, interval review meningkat:
            </p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <ul className="space-y-3">
                <li><strong>Review 1:</strong> 1 menit setelah belajar</li>
                <li><strong>Review 2:</strong> 10 menit</li>
                <li><strong>Review 3:</strong> 1 hari</li>
                <li><strong>Review 4:</strong> 3 hari</li>
                <li><strong>Review 5:</strong> 1 minggu</li>
                <li><strong>Review 6:</strong> 2 minggu</li>
                <li><strong>Review 7:</strong> 1 bulan</li>
                <li><strong>Review 8:</strong> 3 bulan</li>
                <li><strong>Review 9:</strong> 6 bulan</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Sistem Level</h3>
            <p>
              Di LingoSpace Pro, kami menggunakan sistem level 0-5:
            </p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <ul className="space-y-3">
                <li><strong>Level 0:</strong> Kata baru, belum dipelajari</li>
                <li><strong>Level 1:</strong> Baru dipelajari, perlu review besok</li>
                <li><strong>Level 2:</strong> Sudah review 1x, review dalam 3 hari</li>
                <li><strong>Level 3:</strong> Sudah review 2x, review dalam 1 minggu</li>
                <li><strong>Level 4:</strong> Sudah review 3x, review dalam 2 minggu</li>
                <li><strong>Level 5:</strong> Dikuasai, review dalam 1 bulan</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Reset Level Jika Salah</h3>
            <p>
              Jika Anda salah mengingat kata, level akan direset ke 0. Ini memastikan Anda 
              benar-benar menguasai kata tersebut sebelum lanjut ke level berikutnya.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mengapa SRS Efektif?</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Berdasarkan Science</h3>
            <p>
              SRS didasarkan pada penelitian neurosains tentang bagaimana otak menyimpan informasi. 
              Otak kita lebih mudah mengingat informasi yang diulang pada interval yang tepat.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Efisien Waktu</h3>
            <p>
              Dengan SRS, Anda tidak perlu mengulang semua kata setiap hari. Anda hanya perlu 
              mengulang kata yang hampir dilupakan. Ini menghemat waktu belajar hingga 50%!
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Personalized Learning</h3>
            <p>
              SRS menyesuaikan dengan kecepatan belajar Anda. Kata yang sulit akan diulang lebih sering, 
              kata yang mudah akan diulang lebih jarang.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Long-term Retention</h3>
            <p>
              Penelitian menunjukkan bahwa SRS bisa meningkatkan retensi jangka panjang hingga 200% 
              dibandingkan metode belajar tradisional.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Cara Menggunakan SRS di LingoSpace Pro</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Mulai dengan Flashcard</h3>
            <p>
              Buka mode Flashcard dan mulai belajar kosakata baru. Setiap kali Anda melihat kartu:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Lihat kata di bahasa Indonesia</li>
              <li>Klik untuk membalik kartu</li>
              <li>Lihat arti dalam bahasa Inggris dan Arab</li>
              <li>Dengarkan pronunciation</li>
              <li>Tandai apakah kata tersebut "Mudah" atau "Sulit"</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Gunakan Tombol Rating</h3>
            <p>
              Setelah melihat kartu, Anda akan melihat 2 tombol:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>😓 Sulit:</strong> Kata akan direset ke level 0 dan diulang lebih sering</li>
              <li><strong>😊 Mudah:</strong> Kata akan naik level dan diulang lebih jarang</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Review Setiap Hari</h3>
            <p>
              Luangkan 15-20 menit setiap hari untuk review kosakata. LingoSpace Pro akan 
              otomatis menampilkan kata-kata yang perlu di-review berdasarkan level SRS Anda.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Pantau Progress</h3>
            <p>
              Buka Dashboard untuk melihat:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Total kosakata yang dipelajari</li>
              <li>Kosakata yang dikuasai (level 4-5)</li>
              <li>Kosakata yang sedang dipelajari (level 1-3)</li>
              <li>Akurasi jawaban Anda</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Menggunakan SRS dengan Efektif</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Konsistensi Lebih Penting dari Durasi</h3>
            <p>
              Lebih baik belajar 15 menit setiap hari daripada 2 jam sekali seminggu. 
              Konsistensi adalah kunci keberhasilan SRS.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Jangan Terlalu Banyak Kata Baru</h3>
            <p>
              Batasi kata baru yang dipelajari setiap hari (maksimal 10-20 kata). 
              Terlalu banyak kata baru akan membuat review menjadi overwhelming.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Jujur dengan Rating</h3>
            <p>
              Jangan menandai kata sebagai "Mudah" jika Anda sebenarnya ragu. 
              Kejujuran dalam rating akan membuat SRS bekerja lebih efektif.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Gunakan Multi-Sensory Learning</h3>
            <p>
              Di LingoSpace Pro, setiap kosakata memiliki:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Teks (visual)</li>
              <li>Audio pronunciation (auditory)</li>
              <li>Contoh kalimat (context)</li>
              <li>Arti dalam 3 bahasa (association)</li>
            </ul>
            <p>
              Gunakan semua fitur ini untuk memperkuat memori Anda.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">5. Review di Waktu yang Tepat</h3>
            <p>
              Waktu terbaik untuk review SRS:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Pagi hari:</strong> Otak masih segar, retensi tinggi</li>
              <li><strong>Sebelum tidur:</strong> Otak mengkonsolidasi memori saat tidur</li>
              <li><strong>Hindari:</strong> Saat lelah atau stres</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">SRS vs Metode Belajar Tradisional</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-500/20">
                    <th className="border border-white/20 p-3">Aspek</th>
                    <th className="border border-white/20 p-3">SRS</th>
                    <th className="border border-white/20 p-3">Tradisional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/20 p-3">Retensi Jangka Panjang</td>
                    <td className="border border-white/20 p-3 text-green-400">Tinggi (90%+)</td>
                    <td className="border border-white/20 p-3 text-red-400">Rendah (10-20%)</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3">Waktu Belajar</td>
                    <td className="border border-white/20 p-3 text-green-400">Efisien</td>
                    <td className="border border-white/20 p-3 text-red-400">Boros waktu</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3">Personalisasi</td>
                    <td className="border border-white/20 p-3 text-green-400">Ya</td>
                    <td className="border border-white/20 p-3 text-red-400">Tidak</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3">Motivasi</td>
                    <td className="border border-white/20 p-3 text-green-400">Tinggi (ada progress)</td>
                    <td className="border border-white/20 p-3 text-red-400">Rendah</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3">Ilmiah</td>
                    <td className="border border-white/20 p-3 text-green-400">Terbukti</td>
                    <td className="border border-white/20 p-3 text-red-400">Tidak</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Aplikasi SRS Populer</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>LingoSpace Pro:</strong> Platform lengkap untuk belajar bahasa Arab & Inggris dengan SRS</li>
              <li><strong>Anki:</strong> Aplikasi flashcard open-source yang sangat populer</li>
              <li><strong>Quizlet:</strong> Platform flashcard dengan berbagai mode belajar</li>
              <li><strong>Memrise:</strong> Aplikasi belajar bahasa dengan SRS</li>
              <li><strong>Duolingo:</strong> Menggunakan elemen SRS dalam pembelajaran</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kesimpulan</h2>
            <p>
              Spaced Repetition System adalah metode belajar yang terbukti secara ilmiah efektif 
              untuk mengingat kosakata jangka panjang. Dengan menggunakan SRS, Anda bisa:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mengingat kosakata 200% lebih baik</li>
              <li>Menghemat waktu belajar hingga 50%</li>
              <li>Belajar dengan cara yang personal dan efisien</li>
              <li>Mencapai fluency lebih cepat</li>
            </ul>
            <p>
              Kunci keberhasilan SRS adalah konsistensi. Luangkan 15-20 menit setiap hari untuk 
              review, dan Anda akan melihat hasil yang menakjubkan dalam beberapa minggu.
            </p>
            <p>
              Mulai gunakan SRS hari ini dengan LingoSpace Pro, dan rasakan perbedaannya!
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🚀 Coba SRS di LingoSpace Pro!</h3>
              <p className="mb-4">
                LingoSpace Pro menggunakan SRS untuk membantu Anda mengingat kosakata bahasa Arab 
                dan Inggris secara permanen. Mulai belajar sekarang dan rasakan perbedaannya!
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Belajar dengan SRS
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}