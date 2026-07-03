import Link from 'next/link';

export default function Artikel14() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Inggris</span>
              <span className="text-gray-400 text-sm">5 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">5 Kesalahan Umum Orang Indonesia dalam Belajar Bahasa Inggris</h1>
            <p className="text-gray-300 text-lg">Hindari kesalahan fatal ini agar bahasa Inggris Anda terdengar lebih natural.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Belajar bahasa Inggris seringkali dipengaruhi oleh struktur bahasa ibu (Indonesia). Hal ini menyebabkan beberapa kesalahan umum yang sering diulang. Mari kita bahas dan perbaiki bersama!</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. "I am agree" ❌</h2>
            <p><strong>Benar:</strong> "I agree" ✅</p>
            <p>Penjelasan: "Agree" adalah kata kerja (verb), jadi tidak perlu menggunakan "to be" (am/is/are). Cukup gunakan subjek + verb.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. "How to say...?" ❌</h2>
            <p><strong>Benar:</strong> "How do you say...?" ✅</p>
            <p>Penjelasan: "How to" biasanya digunakan untuk judul tutorial. Untuk bertanya, gunakan struktur kalimat tanya lengkap.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Menerjemahkan Kata per Kata (Literal Translation) ❌</h2>
            <p><strong>Salah:</strong> "I feel blue" (diterjemahkan: Saya merasa biru) ❌</p>
            <p><strong>Benar:</strong> "I feel sad" atau pahami bahwa "feel blue" adalah idiom untuk sedih. ✅</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">4. Lupa Menggunakan "S" pada Orang Ketiga ❌</h2>
            <p><strong>Salah:</strong> "She go to school" ❌</p>
            <p><strong>Benar:</strong> "She go<strong>es</strong> to school" ✅</p>
            <p>Penjelasan: Dalam Simple Present Tense, subjek He/She/It wajib menambahkan -s/-es pada kata kerja.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">5. Menggunakan "Very much" di Tempat yang Salah ❌</h2>
            <p><strong>Salah:</strong> "I like you very much" (terlalu formal/kaku untuk sehari-hari) ❌</p>
            <p><strong>Lebih Natural:</strong> "I really like you" atau "I like you a lot" ✅</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🎯 Uji Grammar Anda!</h3>
              <p className="mb-4">Sudah paham teorinya? Saatnya menguji diri sendiri dengan fitur Quiz di LingoSpace Pro.</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Quiz</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}