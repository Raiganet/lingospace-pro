import Link from 'next/link';

export default function Artikel18() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Arab</span>
              <span className="text-gray-400 text-sm">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Belajar Bahasa Arab melalui Lagu dan Film: Metode Menyenangkan</h1>
            <p className="text-gray-300 text-lg">Belajar bahasa Arab tidak harus membosankan. Gunakan hiburan favorit Anda!</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Siapa bilang belajar bahasa Arab harus selalu dengan buku tebal dan grammar yang rumit? Anda bisa belajar sambil menikmati lagu dan film Arab! Metode ini tidak hanya menyenangkan, tapi juga sangat efektif untuk meningkatkan listening skill dan kosakata.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mengapa Lagu dan Film Efektif?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Konteks visual:</strong> Gambar membantu memahami arti kata.</li>
              <li><strong>Emosi:</strong> Lagu dan film membuat memori lebih kuat.</li>
              <li><strong>Bahasa natural:</strong> Mendengar cara native speaker berbicara.</li>
              <li><strong>Motivasi:</strong> Belajar terasa seperti hiburan, bukan beban.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Rekomendasi Film Arab untuk Pemula</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Film Mesir (Dialek Masri):</h3>
              <ul className="space-y-2">
                <li>• <strong>"The Yacoubian Building"</strong> (2006) - Drama sosial yang bagus untuk belajar kosakata sehari-hari.</li>
                <li>• <strong>"Terrorism and Kebab"</strong> (1992) - Komedi klasik dengan bahasa yang mudah dipahami.</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Serial TV (Drama Arab):</h3>
              <ul className="space-y-2">
                <li>• <strong>"Bab Al-Hara"</strong> - Serial Suriah yang sangat populer, bagus untuk dialek Levantine.</li>
                <li>• <strong>"Al-Taghriba Al-Filastiniya"</strong> - Drama Palestina yang menyentuh hati.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Rekomendasi Lagu Arab Populer</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Penyanyi Klasik:</h3>
              <ul className="space-y-2">
                <li>• <strong>Umm Kulthum</strong> - "Alf Leila wa Leila" (Legendaris!)</li>
                <li>• <strong>Abdel Halim Hafez</strong> - "Qariat el Fengan"</li>
                <li>• <strong>Fairuz</strong> - "Li Beirut" (Lagu Lebanon yang indah)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3 text-purple-300">Penyanyi Modern:</h3>
              <ul className="space-y-2">
                <li>• <strong>Amr Diab</strong> - "Tamally Maak" (Sangat populer!)</li>
                <li>• <strong>Nancy Ajram</strong> - "Ah W Noss"</li>
                <li>• <strong>Mohamed Ramadan</strong> - "Mafia"</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Cara Belajar dengan Lagu</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Dengarkan tanpa lirik:</strong> Coba tangkap kata-kata yang Anda kenal.</li>
              <li><strong>Cari lirik:</strong> Buka YouTube atau Google untuk lirik lagu.</li>
              <li><strong>Terjemahkan:</strong> Cari arti kata yang tidak Anda ketahui.</li>
              <li><strong>Nyanyikan:</strong> Coba nyanyikan sambil melihat lirik.</li>
              <li><strong>Hafal kosakata baru:</strong> Tambahkan ke flashcard Anda di LingoSpace Pro!</li>
            </ol>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Cara Belajar dengan Film</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Tonton dengan subtitle Indonesia:</strong> Untuk memahami cerita.</li>
              <li><strong>Tonton ulang dengan subtitle Arab:</strong> Untuk mencocokkan audio dengan tulisan.</li>
              <li><strong>Tonton tanpa subtitle:</strong> Uji pemahaman Anda.</li>
              <li><strong>Catat kosakata baru:</strong> Buat daftar kata yang sering muncul.</li>
              <li><strong>Tiru dialog:</strong> Latihan pronunciation dengan meniru aktor.</li>
            </ol>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300"> Latih Listening dengan LingoSpace Pro!</h3>
              <p className="mb-4">Gunakan fitur Listen & Learn untuk melatih telinga Anda dengan kosakata Arab dan Inggris. Cocok sebagai pelengkap belajar dari lagu dan film!</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Coba Fitur Listen</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}