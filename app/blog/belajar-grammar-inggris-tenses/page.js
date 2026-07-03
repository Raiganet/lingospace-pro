import Link from 'next/link';

export default function Artikel7() {
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
              <span className="text-gray-400 text-sm">12 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Belajar Grammar Inggris: Panduan Lengkap 16 Tenses
            </h1>
            <p className="text-gray-300 text-lg">
              Memahami 16 Tenses dalam bahasa Inggris tidak harus rumit. Pelajari rumus, fungsi, dan contoh penggunaannya dengan mudah.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Tenses adalah fondasi utama dalam grammar bahasa Inggris. Banyak pelajar yang merasa 
              16 tenses itu terlalu banyak dan membingungkan. Padahal, jika Anda memahami polanya, 
              Anda hanya perlu menghafal 3 bentuk waktu (Past, Present, Future) dan 4 aspek 
              (Simple, Continuous, Perfect, Perfect Continuous).
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Konsep Dasar Tenses</h2>
            <p>Sebelum masuk ke rumus, pahami dulu 3 waktu utama:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Present:</strong> Masa sekarang / kebiasaan</li>
              <li><strong>Past:</strong> Masa lampau / sudah terjadi</li>
              <li><strong>Future:</strong> Masa depan / belum terjadi</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Simple Present Tense</h2>
            <p><strong>Fungsi:</strong> Menyatakan fakta, kebiasaan, atau kebenaran umum.</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="text-sm text-purple-300 mb-2">Rumus: S + V1 (s/es) + O</p>
              <ul className="list-disc list-inside space-y-2">
                <li>(+) She <strong>reads</strong> a book every day.</li>
                <li>(-) She <strong>does not read</strong> a book every day.</li>
                <li>(?) <strong>Does</strong> she <strong>read</strong> a book every day?</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Present Continuous Tense</h2>
            <p><strong>Fungsi:</strong> Aksi yang sedang berlangsung sekarang.</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="text-sm text-purple-300 mb-2">Rumus: S + am/is/are + V-ing + O</p>
              <ul className="list-disc list-inside space-y-2">
                <li>(+) I <strong>am studying</strong> English right now.</li>
                <li>(-) I <strong>am not studying</strong> English right now.</li>
                <li>(?) <strong>Are</strong> you <strong>studying</strong> English right now?</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Simple Past Tense</h2>
            <p><strong>Fungsi:</strong> Aksi yang terjadi dan selesai di masa lampau.</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="text-sm text-purple-300 mb-2">Rumus: S + V2 + O</p>
              <ul className="list-disc list-inside space-y-2">
                <li>(+) They <strong>visited</strong> Bali last year.</li>
                <li>(-) They <strong>did not visit</strong> Bali last year.</li>
                <li>(?) <strong>Did</strong> they <strong>visit</strong> Bali last year?</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">4. Simple Future Tense</h2>
            <p><strong>Fungsi:</strong> Aksi yang akan terjadi di masa depan.</p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="text-sm text-purple-300 mb-2">Rumus: S + will + V1 + O</p>
              <ul className="list-disc list-inside space-y-2">
                <li>(+) He <strong>will come</strong> to the party tomorrow.</li>
                <li>(-) He <strong>will not come</strong> to the party tomorrow.</li>
                <li>(?) <strong>Will</strong> he <strong>come</strong> to the party tomorrow?</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Menghafal Tenses</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Pahami Konsep, Bukan Hafal Rumus:</strong> Fokus pada kapan tenses digunakan.</li>
              <li><strong>Buat Kalimat Sendiri:</strong> Gunakan tenses untuk menceritakan kegiatan sehari-hari.</li>
              <li><strong>Latihan dengan LingoSpace Pro:</strong> Gunakan fitur Quiz untuk menguji pemahaman grammar Anda.</li>
              <li><strong>Baca dan Dengarkan:</strong> Perhatikan tenses yang digunakan dalam film atau artikel.</li>
            </ol>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300"> Kuasai Grammar dengan Quiz!</h3>
              <p className="mb-4">
                Jangan hanya membaca teori. Uji pemahaman Anda dengan fitur Quiz interaktif di LingoSpace Pro.
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Latihan Grammar
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}