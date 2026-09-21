import Link from 'next/link';

export default function Artikel20() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Inggris</span>
              <span className="text-gray-400 text-sm">9 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Tips Sukses Ujian TOEFL dan IELTS: Panduan Lengkap</h1>
            <p className="text-gray-300 text-lg">Strategi ampuh untuk mendapatkan skor tinggi dalam ujian bahasa Inggris internasional.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>TOEFL (Test of English as a Foreign Language) dan IELTS (International English Language Testing System) adalah dua ujian bahasa Inggris paling diakui di dunia. Baik untuk kuliah di luar negeri, kerja, atau imigrasi, skor tinggi dalam ujian ini bisa membuka banyak peluang. Tapi bagaimana cara mendapatkannya?</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Perbedaan TOEFL dan IELTS</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-2">Aspek</th>
                    <th className="text-left p-2">TOEFL</th>
                    <th className="text-left p-2">IELTS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Format</td>
                    <td className="p-2">100% Computer-based</td>
                    <td className="p-2">Paper atau Computer</td>
                  </tr>
                  <tr>
                    <td className="p-2">Aksen</td>
                    <td className="p-2">American</td>
                    <td className="p-2">British & International</td>
                  </tr>
                  <tr>
                    <td className="p-2">Speaking</td>
                    <td className="p-2">Rekam ke komputer</td>
                    <td className="p-2">Interview langsung</td>
                  </tr>
                  <tr>
                    <td className="p-2">Skor</td>
                    <td className="p-2">0-120</td>
                    <td className="p-2">0-9 (band score)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Strategi untuk Section Reading</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Skimming:</strong> Baca cepat untuk mendapat gambaran umum.</li>
              <li><strong>Scanning:</strong> Cari kata kunci dari soal di teks.</li>
              <li><strong>Vocabulary in context:</strong> Tebak arti kata dari konteks kalimat.</li>
              <li><strong>Time management:</strong> Maksimal 20 menit per passage.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Strategi untuk Section Listening</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Catat poin penting:</strong> Nama, tanggal, angka, dan ide utama.</li>
              <li><strong>Fokus pada sinyal:</strong> "However", "But", "Therefore" menunjukkan informasi penting.</li>
              <li><strong>Latihan dengan podcast:</strong> TED Talks, BBC, CNN.</li>
              <li><strong>Jangan panik jika ketinggalan:</strong> Fokus pada pertanyaan berikutnya.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Strategi untuk Section Speaking</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Struktur jawaban:</strong> Opening → Point 1 → Point 2 → Conclusion.</li>
              <li><strong>Gunakan transition words:</strong> "First", "Furthermore", "In conclusion".</li>
              <li><strong>Latihan dengan timer:</strong> Biasakan bicara dalam waktu terbatas.</li>
              <li><strong>Rekam diri sendiri:</strong> Evaluasi pronunciation dan fluency.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Strategi untuk Section Writing</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>TOEFL:</strong> 2 essay (Integrated & Independent).</li>
              <li><strong>IELTS:</strong> 2 tasks (Graph description & Essay).</li>
              <li><strong>Struktur jelas:</strong> Introduction → Body paragraphs → Conclusion.</li>
              <li><strong>Grammar & vocabulary:</strong> Gunakan variasi kalimat dan kosakata advanced.</li>
              <li><strong>Proofreading:</strong> Sisakan 2-3 menit untuk cek kesalahan.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Jadwal Persiapan 3 Bulan</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Bulan 1: Building Foundation</h3>
              <ul className="space-y-2">
                <li>• Pelajari format ujian secara detail.</li>
                <li>• Perluas kosakata akademik (500 kata).</li>
                <li>• Latihan grammar advanced.</li>
                <li>• Dengar podcast akademik setiap hari.</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Bulan 2: Intensive Practice</h3>
              <ul className="space-y-2">
                <li>• Kerjakan 1 full practice test per minggu.</li>
                <li>• Analisis kesalahan dan perbaiki.</li>
                <li>• Latihan speaking dengan partner.</li>
                <li>• Tulis 2 essay per minggu.</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Bulan 3: Final Preparation</h3>
              <ul className="space-y-2">
                <li>• Kerjakan 2-3 practice test per minggu.</li>
                <li>• Fokus pada kelemahan.</li>
                <li>• Simulasi kondisi ujian (waktu, tempat).</li>
                <li>• Istirahat cukup sebelum hari-H.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Resources Rekomendasi</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Buku:</strong> "The Official Guide to TOEFL", "Cambridge IELTS Series"</li>
              <li><strong>Website:</strong> Magoosh, TST Prep, IELTS Liz</li>
              <li><strong>YouTube:</strong> TOEFL TV, IELTS Advantage</li>
              <li><strong>Aplikasi:</strong> LingoSpace Pro (untuk vocabulary & grammar)</li>
            </ul>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🎯 Persiapkan TOEFL/IELTS dengan LingoSpace Pro!</h3>
              <p className="mb-4">Perluas kosakata akademik dan kuasai grammar dengan fitur Flashcard, Quiz, dan Roadmap kami. Raih skor impian Anda!</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Persiapan</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}