import Link from 'next/link';

export default function Artikel19() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Tips Belajar</span>
              <span className="text-gray-400 text-sm">10 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Roadmap Lengkap: Dari Pemula hingga Fasih dalam 1 Tahun</h1>
            <p className="text-gray-300 text-lg">Panduan step-by-step untuk menguasai bahasa Arab atau Inggris dalam 12 bulan.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Belajar bahasa asing seringkali terasa seperti perjalanan tanpa arah. Anda mulai dengan semangat, tapi setelah beberapa minggu, Anda bingung harus belajar apa selanjutnya. Artikel ini akan memberikan roadmap jelas untuk 12 bulan ke depan.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Bulan 1-3: Fondasi (Foundation)</h2>
            <p><strong>Target:</strong> Menguasai dasar-dasar bahasa.</p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Yang Harus Dipelajari:</h3>
              <ul className="space-y-2">
                <li>✓ Alfabet/Huruf (Hijaiyah untuk Arab, Alphabet untuk Inggris)</li>
                <li>✓ 500 kosakata paling sering digunakan</li>
                <li>✓ Grammar dasar (struktur kalimat sederhana)</li>
                <li>✓ Pelafalan (pronunciation) yang benar</li>
                <li>✓ Angka, hari, bulan, warna</li>
              </ul>
            </div>
            <p><strong>Waktu belajar:</strong> 30-60 menit/hari</p>
            <p><strong>Tools:</strong> Flashcard, aplikasi dasar, video YouTube pemula.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Bulan 4-6: Menengah (Intermediate)</h2>
            <p><strong>Target:</strong> Bisa berkomunikasi dalam situasi sederhana.</p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Yang Harus Dipelajari:</h3>
              <ul className="space-y-2">
                <li>✓ 1000-2000 kosakata tambahan</li>
                <li>✓ Grammar menengah (tenses, conjugation)</li>
                <li>✓ Listening: podcast dan video sederhana</li>
                <li>✓ Speaking: latihan ngobrol dengan partner</li>
                <li>✓ Reading: artikel dan cerita pendek</li>
              </ul>
            </div>
            <p><strong>Waktu belajar:</strong> 45-90 menit/hari</p>
            <p><strong>Tools:</strong> LingoSpace Pro (mode Quiz & Listen), podcast, language exchange.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Bulan 7-9: Lanjut (Advanced)</h2>
            <p><strong>Target:</strong> Bisa memahami konten native dan berbicara dengan lancar.</p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Yang Harus Dipelajari:</h3>
              <ul className="space-y-2">
                <li>✓ 3000-5000 kosakata (termasuk idiom dan slang)</li>
                <li>✓ Grammar advanced (conditional, subjunctive)</li>
                <li>✓ Listening: film dan berita tanpa subtitle</li>
                <li>✓ Speaking: diskusi topik kompleks</li>
                <li>✓ Writing: essay dan email formal</li>
              </ul>
            </div>
            <p><strong>Waktu belajar:</strong> 60-120 menit/hari</p>
            <p><strong>Tools:</strong> Film, berita, buku, tutor online.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Bulan 10-12: Mahir (Proficient)</h2>
            <p><strong>Target:</strong> Hampir seperti native speaker.</p>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Yang Harus Dipelajari:</h3>
              <ul className="space-y-2">
                <li>✓ 5000+ kosakata (spesialisasi bidang tertentu)</li>
                <li>✓ Nuansa bahasa (formal vs informal, dialek)</li>
                <li>✓ Listening: konten akademik dan profesional</li>
                <li>✓ Speaking: presentasi dan debat</li>
                <li>✓ Writing: paper akademik atau profesional</li>
              </ul>
            </div>
            <p><strong>Waktu belajar:</strong> 30-60 menit/hari (maintenance)</p>
            <p><strong>Tools:</strong> Konten native, komunitas, mentor.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Sukses Mengikuti Roadmap</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Konsistensi:</strong> Belajar setiap hari, meski hanya 15 menit.</li>
              <li><strong>Tracking progress:</strong> Gunakan fitur Dashboard di LingoSpace Pro untuk memantau kemajuan.</li>
              <li><strong>Jangan perfeksionis:</strong> Fokus pada komunikasi, bukan kesempurnaan grammar.</li>
              <li><strong>Immerse yourself:</strong> Kelilingi diri dengan bahasa target.</li>
              <li><strong>Celebrate milestones:</strong> Rayakan setiap pencapaian kecil.</li>
            </ol>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🗺️ Ikuti Roadmap di LingoSpace Pro!</h3>
              <p className="mb-4">Kami sudah menyiapkan roadmap terstruktur untuk Bahasa Arab dan Inggris. Mulai dari level pemula hingga mahir, semua ada di satu platform!</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Lihat Roadmap</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}