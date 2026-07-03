import Link from 'next/link';

export default function Artikel4() {
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
              <span className="text-gray-400 text-sm">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Teknik Pronunciation: Cara Melafalkan Bahasa Inggris dengan Benar
            </h1>
            <p className="text-gray-300 text-lg">
              Tips dan latihan untuk meningkatkan kemampuan pronunciation bahasa Inggris Anda.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Pronunciation atau pelafalan adalah salah satu aspek terpenting dalam berkomunikasi 
              menggunakan bahasa Inggris. Banyak pelajar yang menguasai grammar dan vocabulary dengan baik, 
              tapi masih kesulitan dalam pronunciation. Artikel ini akan memberikan teknik-teknik efektif 
              untuk memperbaiki pelafalan Anda.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mengapa Pronunciation Penting?</h2>
            <p>
              Pronunciation yang baik penting karena:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Agar mudah dipahami oleh native speaker</li>
              <li>Meningkatkan kepercayaan diri saat berbicara</li>
              <li>Menghindari kesalahpahaman (misunderstanding)</li>
              <li>Membuat komunikasi lebih lancar dan natural</li>
              <li>Memberikan kesan profesional</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Masalah Umum Pronunciation Orang Indonesia</h2>
            <p>
              Beberapa masalah yang sering dialami pelajar Indonesia:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Bunyi "TH" (θ dan ð)</h3>
            <p>
              Bunyi "th" tidak ada dalam bahasa Indonesia, sehingga banyak yang kesulitan:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Voiceless TH (θ):</strong> think, thank, three, mouth</li>
              <li><strong>Voiced TH (ð):</strong> this, that, the, mother</li>
            </ul>
            <p>
              <strong>Cara melafalkan:</strong> Letakkan ujung lidah di antara gigi atas dan bawah, 
              lalu hembuskan napas (untuk voiceless) atau getarkan pita suara (untuk voiced).
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Bunyi "V" dan "F"</h3>
            <p>
              Banyak yang mengucapkan "very" menjadi "fery" atau "video" menjadi "fideo".
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>V:</strong> Bibir atas menyentuh gigi atas, ada getaran (very, video, love)</li>
              <li><strong>F:</strong> Bibir atas menyentuh gigi atas, tanpa getaran (free, photo, laugh)</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Bunyi "P" dan "B" di Akhir Kata</h3>
            <p>
              Dalam bahasa Indonesia, bunyi akhir sering tidak terdengar jelas. Dalam bahasa Inggris, 
              bunyi akhir HARUS jelas:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Stop (bukan "stopuh")</li>
              <li>Job (bukan "jobuh")</li>
              <li>Like (bukan "laikuh")</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Bunyi "R"</h3>
            <p>
              "R" dalam bahasa Inggris berbeda dengan bahasa Indonesia:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Inggris:</strong> Lidah tidak bergetar, lebih ke belakang</li>
              <li><strong>Indonesia:</strong> Lidah bergetar (rolled R)</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Teknik Latihan Pronunciation</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Shadowing Technique</h3>
            <p>
              Shadowing adalah teknik meniru native speaker secara real-time:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Pilih audio/video dengan transcript (TED Talks, podcast, YouTube)</li>
              <li>Dengarkan dan baca transcript bersamaan</li>
              <li>Ulangi apa yang diucapkan speaker, usahakan sama persis</li>
              <li>Tiru intonasi, stress, dan rhythm-nya</li>
              <li>Lakukan 15-20 menit setiap hari</li>
            </ol>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Record Yourself</h3>
            <p>
              Rekam suara Anda saat berbicara bahasa Inggris:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Baca teks bahasa Inggris dan rekam</li>
              <li>Dengarkan kembali dan bandingkan dengan native speaker</li>
              <li>Identifikasi kesalahan pronunciation</li>
              <li>Perbaiki dan rekam ulang</li>
              <li>Lihat progress Anda dari waktu ke waktu</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Minimal Pairs Practice</h3>
            <p>
              Latihan membedakan kata-kata yang hampir sama:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>ship / sheep</li>
              <li>bit / beat</li>
              <li>full / fool</li>
              <li>live / leave</li>
              <li>cat / cut</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Pelajari Phonetic Alphabet (IPA)</h3>
            <p>
              International Phonetic Alphabet (IPA) membantu Anda memahami cara melafalkan setiap bunyi:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>/θ/ = think, mouth</li>
              <li>/ð/ = this, mother</li>
              <li>/v/ = very, love</li>
              <li>/ŋ/ = sing, long</li>
              <li>/ʃ/ = she, fish</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Stress dan Intonasi</h2>
            <p>
              Selain bunyi individual, stress dan intonasi juga sangat penting:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Word Stress</h3>
            <p>
              Tekanan pada suku kata tertentu dalam kata:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>PHOto (bukan phoTO)</li>
              <li>phoTOGraphy (bukan PHOtography)</li>
              <li>photoGRAPHic (bukan photoGRAPHic)</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Sentence Stress</h3>
            <p>
              Tekanan pada kata penting dalam kalimat:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>I WANT to GO to the STORE</li>
              <li>SHE is STUDying ENGLISH</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Intonation</h3>
            <p>
              Naik turunnya nada dalam kalimat:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Pernyataan:</strong> Nada turun di akhir</li>
              <li><strong>Pertanyaan Yes/No:</strong> Nada naik di akhir</li>
              <li><strong>Pertanyaan WH:</strong> Nada turun di akhir</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Resources untuk Latihan</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>YouTube:</strong> Rachel's English, English with Lucy, mmmEnglish</li>
              <li><strong>Aplikasi:</strong> ELSA Speak, Pronunciation Power</li>
              <li><strong>Website:</strong> Forvo (cara native speaker mengucapkan kata)</li>
              <li><strong>Kamus:</strong> Cambridge Dictionary (dengan audio pronunciation)</li>
              <li><strong>LingoSpace Pro:</strong> Fitur Listen & Learn untuk latihan pronunciation</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Latihan Harian (15-30 Menit)</h2>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Pagi (10 menit)</h4>
              <ul className="space-y-2">
                <li>• Latihan bunyi sulit (TH, V, R) - 5 menit</li>
                <li>• Minimal pairs practice - 5 menit</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Siang (10 menit)</h4>
              <ul className="space-y-2">
                <li>• Shadowing technique - 10 menit</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Malam (10 menit)</h4>
              <ul className="space-y-2">
                <li>• Record yourself - 5 menit</li>
                <li>• Review dan evaluasi - 5 menit</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kesimpulan</h2>
            <p>
              Pronunciation yang baik membutuhkan latihan konsisten dan kesabaran. Fokus pada:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mengidentifikasi dan memperbaiki bunyi yang sulit</li>
              <li>Latihan shadowing setiap hari</li>
              <li>Merekam dan mengevaluasi diri sendiri</li>
              <li>Memperhatikan stress dan intonasi</li>
              <li>Menggunakan resources yang tersedia</li>
            </ul>
            <p>
              Jangan takut untuk membuat kesalahan. Yang terpenting adalah terus berlatih dan 
              berusaha untuk lebih baik setiap hari. Good luck!
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🎧 Latihan Pronunciation di LingoSpace!</h3>
              <p className="mb-4">
                Gunakan fitur Listen & Learn di LingoSpace Pro untuk melatih pronunciation Anda 
                dengan audio native speaker. Tersedia untuk bahasa Inggris dan Arab!
              </p>
              <Link href="/listen" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Coba Fitur Listen Sekarang
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}