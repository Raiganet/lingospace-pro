import Link from 'next/link';

export default function Artikel15() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Tips Belajar</span>
              <span className="text-gray-400 text-sm">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Manfaat Menjadi Bilingual: Kenapa Harus Belajar Bahasa Asing?</h1>
            <p className="text-gray-300 text-lg">Bukan hanya untuk komunikasi, belajar bahasa asing mengubah struktur otak Anda.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Di era globalisasi ini, kemampuan berbahasa asing bukan lagi sekadar nilai tambah di CV, melainkan kebutuhan dasar. Tapi tahukah Anda bahwa menjadi bilingual (menguasai dua bahasa) memberikan manfaat luar biasa bagi otak dan kehidupan sosial Anda?</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Meningkatkan Fungsi Kognitif Otak</h2>
            <p>Penelitian neurosains menunjukkan bahwa orang bilingual memiliki <em>grey matter</em> (materi abu-abu) yang lebih padat di otak. Ini berarti:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Lebih cepat dalam memecahkan masalah (problem solving).</li>
              <li>Memiliki memori yang lebih baik.</li>
              <li>Lebih fokus dan mampu melakukan multitasking.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Mencegah Demensia dan Alzheimer</h2>
            <p>Belajar bahasa asing adalah seperti "olahraga" untuk otak. Orang yang aktif menggunakan dua bahasa cenderung mengalami penurunan fungsi otak di usia tua lebih lambat hingga 4-5 tahun dibandingkan monolingual.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Peluang Karir yang Lebih Luas</h2>
            <p>Perusahaan multinasional sangat mencari kandidat yang bisa berbahasa Inggris, Arab, Mandarin, atau Jepang. Kemampuan ini seringkali berbanding lurus dengan gaji yang lebih tinggi dan peluang untuk bekerja di luar negeri.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">4. Memahami Budaya Lain Lebih Dalam</h2>
            <p>Bahasa adalah jendela budaya. Dengan belajar bahasa Arab, Anda tidak hanya belajar kata, tapi juga memahami nilai-nilai Islam dan Timur Tengah. Dengan bahasa Inggris, Anda bisa mengakses 60% konten internet dunia.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mulai Perjalanan Bilingual Anda</h2>
            <p>Tidak pernah ada kata terlambat untuk belajar. Di LingoSpace Pro, kami menyediakan jalur pembelajaran terstruktur untuk Bahasa Arab dan Inggris. Mulailah dari 15 menit sehari, dan lihat bagaimana hidup Anda berubah!</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🚀 Mulai Hidup Bilingual Hari Ini!</h3>
              <p className="mb-4">Bergabunglah dengan ribuan pelajar lain di LingoSpace Pro.</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Daftar Gratis</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}