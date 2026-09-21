import Link from 'next/link';

export default function Artikel17() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Inggris</span>
              <span className="text-gray-400 text-sm">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Teknik Membaca Cepat (Speed Reading) dalam Bahasa Inggris</h1>
            <p className="text-gray-300 text-lg">Tingkatkan kecepatan membaca Anda hingga 3x lipat tanpa kehilangan pemahaman.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Apakah Anda sering merasa lambat saat membaca artikel atau buku berbahasa Inggris? Atau bahkan kehilangan fokus di tengah bacaan? Speed reading adalah skill yang bisa dipelajari dan akan sangat membantu Anda dalam belajar bahasa Inggris lebih efisien.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Manfaat Speed Reading</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Hemat waktu:</strong> Baca buku 300 halaman dalam 2-3 jam, bukan 2-3 minggu.</li>
              <li><strong>Tingkatkan pemahaman:</strong> Fokus lebih baik saat membaca cepat.</li>
              <li><strong>Perluas kosakata:</strong> Lebih banyak eksposur = lebih banyak kata baru.</li>
              <li><strong>Siap ujian:</strong> TOEFL, IELTS, dan tes lainnya membutuhkan kecepatan membaca tinggi.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik 1: Eliminasi Subvokalisasi</h2>
            <p>Subvokalisasi adalah "membaca dalam hati" dengan mengucapkan kata di kepala. Ini memperlambat kecepatan membaca Anda hingga kecepatan bicara (150-200 kata/menit).</p>
            <p><strong>Cara mengatasi:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kunyah permen karet saat membaca.</li>
              <li>Dengarkan musik instrumental.</li>
              <li>Paksa mata bergerak lebih cepat dari suara dalam kepala.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik 2: Gunakan Pointer (Penunjuk)</h2>
            <p>Gunakan jari, pulpen, atau mouse untuk menunjuk kata yang sedang dibaca. Ini membantu mata fokus dan bergerak lebih cepat.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gerakkan pointer lebih cepat dari kecepatan normal Anda.</li>
              <li>Jangan kembali ke kata sebelumnya (no regression).</li>
              <li>Latih selama 10 menit setiap hari.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik 3: Chunking (Baca Kelompok Kata)</h2>
            <p>Jangan baca kata per kata, tapi baca 3-5 kata sekaligus dalam satu "chunk".</p>
            <p><strong>Contoh:</strong></p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="mb-2"><strong>Normal:</strong> The | cat | sat | on | the | mat</p>
              <p><strong>Chunking:</strong> [The cat sat] | [on the mat]</p>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik 4: Skimming dan Scanning</h2>
            <p><strong>Skimming:</strong> Baca cepat untuk mendapat gambaran umum (judul, subjudul, kalimat pertama paragraf).</p>
            <p><strong>Scanning:</strong> Cari informasi spesifik (nama, tanggal, angka) tanpa membaca seluruh teks.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Latihan Harian (15 Menit)</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <ul className="space-y-2">
                <li><strong>Menit 1-5:</strong> Baca artikel dengan pointer, fokus pada kecepatan.</li>
                <li><strong>Menit 5-10:</strong> Skimming berita, cari ide utama.</li>
                <li><strong>Menit 10-15:</strong> Scanning teks, cari kata kunci tertentu.</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300"> Perluas Kosakata untuk Reading Lebih Cepat!</h3>
              <p className="mb-4">Semakin banyak kosakata yang Anda kuasai, semakin cepat Anda membaca. Gunakan fitur Flashcard di LingoSpace Pro!</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Hafalan</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}