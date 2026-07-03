import Link from 'next/link';

export default function Blog() {
  // Daftar semua artikel yang sudah dibuat
  const articles = [
    {
      id: 1,
      title: '10 Tips Efektif Belajar Bahasa Arab untuk Pemula',
      excerpt: 'Pelajari strategi dan tips terbaik untuk memulai perjalanan belajar bahasa Arab Anda dengan langkah yang tepat.',
      category: 'Bahasa Arab',
      readTime: '5 min read',
      date: '2026-07-01',
      slug: 'tips-belajar-bahasa-arab-untuk-pemula'
    },
    {
      id: 2,
      title: 'Cara Menguasai 1000 Kosakata Bahasa Inggris dalam 30 Hari',
      excerpt: 'Metode proven untuk menambah perbendaharaan kata bahasa Inggris Anda dengan cepat dan efektif.',
      category: 'Bahasa Inggris',
      readTime: '7 min read',
      date: '2026-07-02',
      slug: 'menguasai-1000-kosakata-bahasa-inggris'
    },
    {
      id: 3,
      title: 'Memahami Nahwu Dasar: Panduan Lengkap untuk Pemula',
      excerpt: 'Pelajari dasar-dasar ilmu Nahwu (tata bahasa Arab) dengan penjelasan yang mudah dipahami.',
      category: 'Nahwu',
      readTime: '10 min read',
      date: '2026-07-03',
      slug: 'memahami-nahwu-dasar'
    },
    {
      id: 4,
      title: 'Teknik Pronunciation: Cara Melafalkan Bahasa Inggris dengan Benar',
      excerpt: 'Tips dan latihan untuk meningkatkan kemampuan pronunciation bahasa Inggris Anda.',
      category: 'Bahasa Inggris',
      readTime: '6 min read',
      date: '2026-07-04',
      slug: 'teknik-pronunciation-bahasa-inggris'
    },
    {
      id: 5,
      title: 'Spaced Repetition System: Rahasia Mengingat Kosakata Jangka Panjang',
      excerpt: 'Mengapa SRS adalah metode terbaik untuk mengingat kosakata bahasa asing secara permanen.',
      category: 'Tips Belajar',
      readTime: '8 min read',
      date: '2026-07-05',
      slug: 'spaced-repetition-system'
    },
    {
      id: 6,
      title: 'Perbedaan Bahasa Arab Fusha dan Amiyah',
      excerpt: 'Memahami perbedaan antara bahasa Arab formal (Fusha) dan bahasa Arab sehari-hari (Amiyah).',
      category: 'Bahasa Arab',
      readTime: '6 min read',
      date: '2026-07-06',
      slug: 'perbedaan-arab-fusha-dan-amiyah'
    },
    {
      id: 7,
      title: 'Belajar Grammar Inggris: Panduan Lengkap 16 Tenses',
      excerpt: 'Memahami 16 Tenses dalam bahasa Inggris tidak harus rumit. Pelajari rumus, fungsi, dan contoh penggunaannya.',
      category: 'Bahasa Inggris',
      readTime: '12 min read',
      date: '2026-07-07',
      slug: 'belajar-grammar-inggris-tenses'
    },
    {
      id: 8,
      title: '100 Kosakata Arab Paling Sering Digunakan Sehari-hari',
      excerpt: 'Daftar kosakata (Mufrodat) esensial yang wajib dihafal untuk komunikasi dasar.',
      category: 'Bahasa Arab',
      readTime: '10 min read',
      date: '2026-07-08',
      slug: '100-kosakata-arab-sehari-hari'
    },
    {
      id: 9,
      title: 'Cara Cepat Menghafal Huruf Hijaiyah dalam 7 Hari',
      excerpt: 'Panduan step-by-step untuk menguasai 28 huruf Hijaiyah beserta harakatnya.',
      category: 'Bahasa Arab',
      readTime: '7 min read',
      date: '2026-07-09',
      slug: 'cara-menghafal-huruf-hijaiyah'
    },
    {
      id: 10,
      title: 'Tips Menulis Essay dalam Bahasa Inggris untuk Pemula',
      excerpt: 'Struktur, kosakata, dan teknik menulis essay akademik yang efektif.',
      category: 'Bahasa Inggris',
      readTime: '8 min read',
      date: '2026-07-10',
      slug: 'tips-menulis-essay-bahasa-inggris'
    },
    {
      id: 11,
      title: 'Perbedaan Bahasa Inggris British dan American',
      excerpt: 'Memahami perbedaan ejaan, kosakata, dan pelafalan antara UK dan US English.',
      category: 'Bahasa Inggris',
      readTime: '6 min read',
      date: '2026-07-11',
      slug: 'perbedaan-bahasa-inggris-british-dan-american'
    },
    {
      id: 12,
      title: 'Belajar Bahasa Arab untuk Umroh dan Haji: Kosakata Esensial',
      excerpt: 'Persiapan bahasa Arab dasar agar ibadah Anda lebih khusyuk dan lancar di Tanah Suci.',
      category: 'Bahasa Arab',
      readTime: '8 min read',
      date: '2026-07-12',
      slug: 'belajar-bahasa-arab-untuk-umroh-dan-haji'
    },
    {
      id: 13,
      title: 'Cara Meningkatkan Listening Skill Bahasa Inggris dengan Cepat',
      excerpt: 'Strategi ampuh melatih pendengaran agar paham native speaker tanpa subtitle.',
      category: 'Bahasa Inggris',
      readTime: '7 min read',
      date: '2026-07-13',
      slug: 'cara-meningkatkan-listening-skill-bahasa-inggris'
    },
    {
      id: 14,
      title: '5 Kesalahan Umum Orang Indonesia dalam Belajar Bahasa Inggris',
      excerpt: 'Hindari kesalahan fatal ini agar bahasa Inggris Anda terdengar lebih natural.',
      category: 'Bahasa Inggris',
      readTime: '5 min read',
      date: '2026-07-14',
      slug: 'kesalahan-umum-orang-indonesia-belajar-bahasa-inggris'
    },
    {
      id: 15,
      title: 'Manfaat Menjadi Bilingual: Kenapa Harus Belajar Bahasa Asing?',
      excerpt: 'Bukan hanya untuk komunikasi, belajar bahasa asing mengubah struktur otak Anda.',
      category: 'Tips Belajar',
      readTime: '6 min read',
      date: '2026-07-15',
      slug: 'manfaat-bilingual-belajar-bahasa-asing'
    },
    {
      id: 16,
      title: 'Cara Belajar Bahasa Otodidak yang Efektif: Panduan Lengkap',
      excerpt: 'Belajar bahasa asing tanpa kursus mahal? Ini strategi yang terbukti berhasil!',
      category: 'Tips Belajar',
      readTime: '8 min read',
      date: '2026-07-16',
      slug: 'cara-belajar-bahasa-otodidak'
    },
    {
      id: 17,
      title: 'Teknik Membaca Cepat (Speed Reading) dalam Bahasa Inggris',
      excerpt: 'Tingkatkan kecepatan membaca Anda hingga 3x lipat tanpa kehilangan pemahaman.',
      category: 'Bahasa Inggris',
      readTime: '7 min read',
      date: '2026-07-17',
      slug: 'teknik-membaca-cepat-bahasa-inggris'
    },
    {
      id: 18,
      title: 'Belajar Bahasa Arab melalui Lagu dan Film: Metode Menyenangkan',
      excerpt: 'Belajar bahasa Arab tidak harus membosankan. Gunakan hiburan favorit Anda!',
      category: 'Bahasa Arab',
      readTime: '7 min read',
      date: '2026-07-18',
      slug: 'belajar-bahasa-arab-melalui-lagu-dan-film'
    },
    {
      id: 19,
      title: 'Roadmap Lengkap: Dari Pemula hingga Fasih dalam 1 Tahun',
      excerpt: 'Panduan step-by-step untuk menguasai bahasa Arab atau Inggris dalam 12 bulan.',
      category: 'Tips Belajar',
      readTime: '10 min read',
      date: '2026-07-19',
      slug: 'roadmap-lengkap-belajar-bahasa-dari-pemula-hingga-fasih'
    },
    {
      id: 20,
      title: 'Tips Sukses Ujian TOEFL dan IELTS: Panduan Lengkap',
      excerpt: 'Strategi ampuh untuk mendapatkan skor tinggi dalam ujian bahasa Inggris internasional.',
      category: 'Bahasa Inggris',
      readTime: '9 min read',
      date: '2026-07-20',
      slug: 'tips-sukses-ujian-toefl-ielts'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog LingoSpace Pro</h1>
          <p className="text-xl text-gray-300">Tips, trik, dan artikel tentang pembelajaran bahasa</p>
          <p className="text-sm text-gray-400 mt-2">Total {articles.length} artikel</p>
        </div>

        {/* Filter Kategori */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm">
            Semua
          </button>
          <button className="px-4 py-2 rounded-full glass text-sm hover:scale-105 transition-transform">
            Bahasa Arab
          </button>
          <button className="px-4 py-2 rounded-full glass text-sm hover:scale-105 transition-transform">
            Bahasa Inggris
          </button>
          <button className="px-4 py-2 rounded-full glass text-sm hover:scale-105 transition-transform">
            Tips Belajar
          </button>
          <button className="px-4 py-2 rounded-full glass text-sm hover:scale-105 transition-transform">
            Nahwu
          </button>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block">
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(article.date).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                  <span className="text-purple-400">Baca Selengkapnya →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination (Opsional) */}
        <div className="text-center mt-12">
          <p className="text-gray-400">Menampilkan semua {articles.length} artikel</p>
        </div>
      </div>
    </div>
  );
}