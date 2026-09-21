import Link from 'next/link';

export default function Artikel9() {
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
                Bahasa Arab
              </span>
              <span className="text-gray-400 text-sm">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Cara Cepat Menghafal Huruf Hijaiyah dalam 7 Hari
            </h1>
            <p className="text-gray-300 text-lg">
              Panduan step-by-step untuk menguasai 28 huruf Hijaiyah beserta harakatnya.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Huruf Hijaiyah adalah kunci utama untuk membaca Al-Quran dan bahasa Arab. 
              Banyak yang merasa sulit karena bentuknya yang berbeda dengan alfabet Latin. 
              Namun, dengan metode yang tepat, Anda bisa menghafalnya hanya dalam 1 minggu!
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Jadwal Belajar 7 Hari</h2>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 1: Huruf Alif sampai Ja</h3>
                <p className="text-sm">ا ب ت ث ج (Alif, Ba, Ta, Tsa, Jim)</p>
                <p className="text-xs text-gray-400 mt-2">Fokus: Perbedaan titik di atas dan bawah (Ba, Ta, Tsa).</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 2: Huruf Ha sampai Zai</h3>
                <p className="text-sm">ح خ د ذ ر ز (Ha, Kha, Dal, Dzal, Ra, Zai)</p>
                <p className="text-xs text-gray-400 mt-2">Fokus: Bunyi Ha (ح) dan Kha (خ) yang berbeda.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 3: Huruf Sin sampai Ghain</h3>
                <p className="text-sm">س ش ص ض ط ظ ع غ (Sin, Syin, Shad, Dhad, Tha, Zha, Ain, Ghain)</p>
                <p className="text-xs text-gray-400 mt-2">Fokus: Huruf khusus Arab seperti Shad, Dhad, Tha, Zha.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 4: Huruf Fa sampai Ya</h3>
                <p className="text-sm">ف ق ك ل م ن ه و ي (Fa, Qaf, Kaf, Lam, Mim, Nun, Ha, Waw, Ya)</p>
                <p className="text-xs text-gray-400 mt-2">Fokus: Perbedaan Qaf (ق) dan Kaf (ك).</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 5: Mengenal Harakat</h3>
                <p className="text-sm">Fathah (َ), Kasrah (ِ), Dhammah (ُ), Sukun (ْ)</p>
                <p className="text-xs text-gray-400 mt-2">Latih pengucapan: Ba, Bi, Bu, B.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 6: Tanwin dan Maddah</h3>
                <p className="text-sm">An, In, Un (Tanwin) dan Aa, Ii, Uu (Maddah)</p>
                <p className="text-xs text-gray-400 mt-2">Latih membaca kata dengan tanwin dan mad.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-300">Hari 7: Review & Latihan Membaca</h3>
                <p className="text-sm">Gabungkan semua huruf dan harakat.</p>
                <p className="text-xs text-gray-400 mt-2">Coba baca kata sederhana: كِتَابٌ (Kitaabun).</p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🎴 Belajar Huruf dengan Flashcard!</h3>
              <p className="mb-4">
                Gunakan mode Flashcard di LingoSpace Pro untuk menghafal huruf Hijaiyah 
                dengan visual yang menarik dan audio pronunciation yang benar.
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Coba Flashcard Hijaiyah
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}