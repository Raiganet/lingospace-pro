import Link from 'next/link';

export default function Artikel12() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-purple-400 hover:underline mb-6 inline-block">← Kembali ke Blog</Link>
        <article className="glass rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">Bahasa Arab</span>
              <span className="text-gray-400 text-sm">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Belajar Bahasa Arab untuk Umroh dan Haji: Kosakata Esensial</h1>
            <p className="text-gray-300 text-lg">Persiapan bahasa Arab dasar agar ibadah Anda lebih khusyuk dan lancar di Tanah Suci.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>Bagi umat Muslim, pergi ke Tanah Suci adalah impian yang dinanti. Namun, banyak jamaah yang merasa kesulitan karena kendala bahasa. Mempelajari bahasa Arab dasar sebelum berangkat akan sangat membantu Anda beribadah dengan lebih tenang dan berinteraksi dengan warga lokal.</p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Doa dan Dzikir Esensial</h2>
            <p>Memahami arti doa membuat ibadah lebih bermakna:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Talbiyah:</strong> لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ (Labbaik Allahumma Labbaik) - "Aku penuhi panggilan-Mu ya Allah."</li>
              <li><strong>Doa Safar:</strong> سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا (Subhanalladzi sakhkhara lana hadza) - "Maha Suci Tuhan yang menundukkan kendaraan ini."</li>
              <li><strong>Doa Masuk Masjidil Haram:</strong> اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ (Allahummaftahli abwaba rahmatik).</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Kosakata di Bandara dan Hotel</h2>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <ul className="space-y-2">
                <li>• <strong>Bandara:</strong> مَطَار (Mathaar)</li>
                <li>• <strong>Hotel:</strong> فُنْدُق (Funduq)</li>
                <li>• <strong>Kamar:</strong> غُرْفَة (Ghurfah)</li>
                <li>• <strong>Kunci:</strong> مِفْتَاح (Miftah)</li>
                <li>• <strong>Air:</strong> مَاء (Maa')</li>
                <li>• <strong>Makanan:</strong> طَعَام (Tha'aam)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Bertanya Arah dan Berbelanja</h2>
            <p>Kalimat penting saat di Makkah atau Madinah:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Di mana Masjidil Haram?</strong> أَيْنَ الْمَسْجِدُ الْحَرَام؟ (Ayna al-masjid al-haram?)</li>
              <li><strong>Berapa harganya?</strong> بِكَمْ هَذَا؟ (Bikam hadza?)</li>
              <li><strong>Terlalu mahal!</strong> غَالٍ جِدًّا (Ghali jiddan)</li>
              <li><strong>Tolong!</strong> سَاعِدْنِي (Sa'idni)</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Belajar Cepat</h2>
            <p>Gunakan metode flashcard untuk menghafal kosakata di atas. Di LingoSpace Pro, kami menyediakan kategori khusus "Ibadah & Travel" untuk membantu Anda mempersiapkan perjalanan suci ini.</p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300"> Persiapan Menuju Baitullah</h3>
              <p className="mb-4">Hafalkan kosakata esensial dengan fitur Flashcard dan Audio Pronunciation kami.</p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">Mulai Hafalan</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}