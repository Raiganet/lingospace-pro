import Link from 'next/link';

export default function Blog() {
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog LingoSpace Pro</h1>
          <p className="text-xl text-gray-300">Tips, trik, dan artikel tentang pembelajaran bahasa</p>
        </div>

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

        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
            Muat Lebih Banyak Artikel
          </button>
        </div>
      </div>
    </div>
  );
}