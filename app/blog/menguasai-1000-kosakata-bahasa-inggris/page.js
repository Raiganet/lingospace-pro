import Link from 'next/link';

export default function Artikel2() {
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
                Bahasa Inggris
              </span>
              <span className="text-gray-400 text-sm">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Cara Menguasai 1000 Kosakata Bahasa Inggris dalam 30 Hari
            </h1>
            <p className="text-gray-300 text-lg">
              Metode proven untuk menambah perbendaharaan kata bahasa Inggris Anda dengan cepat dan efektif.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Menguasai 1000 kosakata bahasa Inggris dalam 30 hari terdengar ambisius, tapi sebenarnya sangat mungkin! 
              Dengan metode yang tepat dan konsistensi, Anda bisa menambah 33-34 kata baru setiap hari. 
              Artikel ini akan membimbing Anda langkah demi langkah.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mengapa 1000 Kata?</h2>
            <p>
              Penelitian menunjukkan bahwa 1000 kata paling umum dalam bahasa Inggris mencakup sekitar 80% 
              dari percakapan sehari-hari. Dengan menguasai 1000 kata ini, Anda sudah bisa:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Memahami sebagian besar percakapan dasar</li>
              <li>Membaca teks sederhana</li>
              <li>Menulis email dan pesan dasar</li>
              <li>Berkomunikasi dalam situasi sehari-hari</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Strategi 30 Hari</h2>
            
            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Minggu 1: Kata Benda Dasar (Nouns)</h3>
            <p>Fokus pada 250 kata benda yang paling sering digunakan:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Orang: man, woman, child, friend, family</li>
              <li>Waktu: time, day, week, month, year, morning, night</li>
              <li>Tempat: home, school, office, city, country</li>
              <li>Benda: book, pen, phone, computer, car, house</li>
              <li>Makanan: water, food, rice, bread, meat, fruit</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Minggu 2: Kata Kerja (Verbs)</h3>
            <p>Pelajari 250 kata kerja penting:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>be, have, do, say, go, get, make, know</li>
              <li>think, take, see, come, want, use, find</li>
              <li>give, tell, work, call, try, ask, need</li>
              <li>feel, become, leave, put, mean, keep, let</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Minggu 3: Kata Sifat & Keterangan</h3>
            <p>Tambahkan 250 adjective dan adverb:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>good, bad, big, small, new, old, young</li>
              <li>happy, sad, beautiful, ugly, hot, cold</li>
              <li>quickly, slowly, carefully, well, very</li>
              <li>always, never, sometimes, often, usually</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Minggu 4: Kata Fungsi & Review</h3>
            <p>Pelajari 250 kata terakhir dan review semua:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prepositions: in, on, at, to, from, with</li>
              <li>Conjunctions: and, but, or, because, if</li>
              <li>Pronouns: I, you, he, she, it, we, they</li>
              <li>Review dan konsolidasi semua kata</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik Menghafal Efektif</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Spaced Repetition System (SRS)</h3>
            <p>
              SRS adalah teknik menghafal yang menggunakan interval waktu. Kata yang baru dipelajari 
              akan diulang pada hari ke-1, ke-3, ke-7, ke-15, dan ke-30. Ini memastikan kata tersebut 
              masuk ke memori jangka panjang.
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Flashcard</h3>
            <p>
              Buat flashcard untuk setiap kata:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Depan: Kata dalam bahasa Inggris</li>
              <li>Belakang: Arti + contoh kalimat</li>
              <li>Bawa kemana-mana dan review setiap ada waktu luang</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Gunakan dalam Kalimat</h3>
            <p>
              Jangan hanya menghafal arti kata, tapi buatlah kalimat:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Book → I read a book every night</li>
              <li>Beautiful → She has a beautiful voice</li>
              <li>Go → I go to school by bus</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Asosiasi Visual</h3>
            <p>
              Hubungkan kata dengan gambar atau memori:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Apple → Bayangkan buah apel merah</li>
              <li>Elephant → Bayangkan gajah besar</li>
              <li>Sun → Bayangkan matahari terbit</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Jadwal Harian (30-60 Menit/Hari)</h2>
            
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="text-lg font-bold mb-4 text-purple-300">Pagi (15 menit)</h3>
              <ul className="space-y-2">
                <li>• Review kata kemarin (5 menit)</li>
                <li>• Pelajari 10 kata baru (10 menit)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="text-lg font-bold mb-4 text-purple-300">Siang (15 menit)</h3>
              <ul className="space-y-2">
                <li>• Review kata pagi (5 menit)</li>
                <li>• Pelajari 10 kata baru (10 menit)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="text-lg font-bold mb-4 text-purple-300">Malam (15-30 menit)</h3>
              <ul className="space-y-2">
                <li>• Review semua kata hari ini (10 menit)</li>
                <li>• Pelajari 10-14 kata baru (15 menit)</li>
                <li>• Buat kalimat dengan kata baru (5 menit)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Tambahan</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Gunakan aplikasi:</strong> LingoSpace Pro, Anki, atau Quizlet untuk SRS</li>
              <li><strong>Baca setiap hari:</strong> Artikel, berita, atau cerita sederhana</li>
              <li><strong>Tonton film:</strong> Dengan subtitle Inggris untuk context</li>
              <li><strong>Dengarkan podcast:</strong> Untuk mendengar pronunciation yang benar</li>
              <li><strong>Bicara sendiri:</strong> Latihan menggunakan kata-kata baru</li>
              <li><strong>Tulis jurnal:</strong> Tulis 3-5 kalimat setiap hari menggunakan kata baru</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tracking Progress</h2>
            <p>
              Buat spreadsheet atau gunakan aplikasi untuk tracking:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kata yang sudah dipelajari</li>
              <li>Tanggal belajar</li>
              <li>Tingkat penguasaan (1-5)</li>
              <li>Tanggal review selanjutnya</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kesimpulan</h2>
            <p>
              Menguasai 1000 kosakata dalam 30 hari adalah target yang menantang tapi bisa dicapai. 
              Kuncinya adalah konsistensi, metode yang tepat (SRS), dan praktik setiap hari. 
              Jangan menyerah jika ada hari yang terlewat, yang penting terus bergerak maju!
            </p>
            <p>
              Setelah 30 hari, Anda akan memiliki fondasi kosakata yang kuat untuk melanjutkan 
              ke level berikutnya. Selamat belajar!
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">📚 Mulai Challenge 30 Hari!</h3>
              <p className="mb-4">
                LingoSpace Pro memiliki fitur khusus untuk challenge 1000 kata dalam 30 hari. 
                Dapatkan akses gratis dan mulai perjalanan Anda hari ini!
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Challenge Sekarang
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}