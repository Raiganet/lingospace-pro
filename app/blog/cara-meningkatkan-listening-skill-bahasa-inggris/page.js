import Link from 'next/link';

export default function Artikel13() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cara Meningkatkan Listening Skill Bahasa Inggris dengan Cepat</h1>
            <p className="text-gray-300 text-lg">Strategi ampuh melatih pendengaran agar paham native speaker tanpa subtitle.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Listening adalah skill yang paling sering dikeluhkan oleh pelajar bahasa Inggris. "Kenapa saya tidak paham saat native speaker berbicara cepat?" Jawabannya bukan karena Anda bodoh, tapi karena telinga Anda belum terbiasa dengan <em>connected speech</em> dan <em>slang</em>.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Active vs Passive Listening</h2>
            <p>Anda perlu melakukan keduanya:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Passive Listening:</strong> Memutar podcast atau lagu bahasa Inggris saat sedang mengerjakan hal lain. Ini membantu otak terbiasa dengan ritme bahasa.</li>
              <li><strong>Active Listening:</strong> Duduk tenang, mendengarkan audio, dan mencoba menuliskan apa yang Anda dengar (transkripsi). Ini sangat efektif!</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Teknik Shadowing</h2>
            <p>Shadowing adalah meniru ucapan native speaker secara bersamaan. Caranya:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Pilih video YouTube dengan subtitle.</li>
              <li>Dengarkan satu kalimat.</li>
              <li>Jeda, lalu ucapkan ulang persis seperti intonasi dan kecepatannya.</li>
              <li>Ulangi hingga lidah Anda terbiasa.</li>
            </ol>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Pahami Connected Speech</h2>
            <p>Native speaker sering menggabungkan kata. Contoh:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>"What are you going to do?" menjadi <em>"Whatcha gonna do?"</em></li>
              <li>"Let me" menjadi <em>"Lemme"</em></li>
              <li>"Give me" menjadi <em>"Gimme"</em></li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">4. Gunakan Fitur Listen di LingoSpace Pro</h2>
            <p>Kami memiliki mode <strong>Listen & Learn</strong> yang dirancang khusus untuk melatih telinga Anda. Anda akan mendengar kosakata dan harus menebak artinya. Ini adalah bentuk active listening yang menyenangkan!</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🎧 Latih Telinga Anda Sekarang!</h3>
              <p className="mb-4">Coba mode Listen di LingoSpace Pro dan rasakan peningkatan listening skill Anda.</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Listening</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}