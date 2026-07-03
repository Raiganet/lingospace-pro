import Link from 'next/link';

export default function Artikel10() {
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
              <span className="text-gray-400 text-sm">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Tips Menulis Essay dalam Bahasa Inggris untuk Pemula
            </h1>
            <p className="text-gray-300 text-lg">
              Struktur, kosakata, dan teknik menulis essay akademik yang efektif.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Menulis essay dalam bahasa Inggris seringkali menjadi momok bagi pelajar. 
              Namun, dengan memahami struktur dasar dan menggunakan kosakata yang tepat, 
              Anda bisa menulis essay yang jelas dan meyakinkan.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Struktur Essay Standar</h2>
            <p>Essay yang baik biasanya terdiri dari 3 bagian utama:</p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Introduction (Pendahuluan)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Hook:</strong> Kalimat pembuka yang menarik perhatian.</li>
              <li><strong>Background:</strong> Latar belakang topik.</li>
              <li><strong>Thesis Statement:</strong> Pernyataan utama/argumen Anda.</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Body Paragraphs (Isi)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Topic Sentence:</strong> Ide utama paragraf.</li>
              <li><strong>Evidence/Example:</strong> Bukti atau contoh pendukung.</li>
              <li><strong>Explanation:</strong> Penjelasan bagaimana bukti mendukung argumen.</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Conclusion (Kesimpulan)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Restate Thesis:</strong> Nyatakan ulang argumen utama.</li>
              <li><strong>Summary:</strong> Ringkasan poin-poin penting.</li>
              <li><strong>Final Thought:</strong> Penutup yang berkesan.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kosakata Transisi (Transition Words)</h2>
            <p>Gunakan kata transisi untuk membuat tulisan lebih mengalir:</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <ul className="grid grid-cols-2 gap-2">
                <li>• <strong>Furthermore:</strong> Selain itu</li>
                <li>• <strong>However:</strong> Namun</li>
                <li>• <strong>In addition:</strong> Sebagai tambahan</li>
                <li>• <strong>Therefore:</strong> Oleh karena itu</li>
                <li>• <strong>For example:</strong> Sebagai contoh</li>
                <li>• <strong>In conclusion:</strong> Sebagai kesimpulan</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300"> Tingkatkan Vocabulary Anda!</h3>
              <p className="mb-4">
                Kosakata yang kaya adalah kunci menulis essay yang baik. 
                Pelajari kosakata akademik di LingoSpace Pro.
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Belajar Kosakata Baru
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}