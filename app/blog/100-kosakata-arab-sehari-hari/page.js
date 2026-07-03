import Link from 'next/link';

export default function Artikel8() {
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
              <span className="text-gray-400 text-sm">10 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              100 Kosakata Arab Paling Sering Digunakan Sehari-hari
            </h1>
            <p className="text-gray-300 text-lg">
              Daftar kosakata (Mufrodat) esensial yang wajib dihafal untuk komunikasi dasar.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Menguasai 100 kosakata paling sering digunakan akan membantu Anda memahami 
              hingga 50% percakapan sehari-hari dalam bahasa Arab. Berikut adalah daftar 
              kosakata yang dibagi berdasarkan kategori.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">1. Kata Ganti (Dhamir)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">أَنَا (Ana) - Saya</p>
                <p className="text-right text-xl mb-1" dir="rtl">أَنْتَ (Anta) - Kamu (Lk)</p>
                <p className="text-right text-xl mb-1" dir="rtl">أَنْتِ (Anti) - Kamu (Pr)</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">هُوَ (Huwa) - Dia (Lk)</p>
                <p className="text-right text-xl mb-1" dir="rtl">هِيَ (Hiya) - Dia (Pr)</p>
                <p className="text-right text-xl mb-1" dir="rtl">نَحْنُ (Nahnu) - Kami/Kita</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">2. Kata Tanya (Istifham)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">مَاذَا (Madza) - Apa</p>
                <p className="text-right text-xl mb-1" dir="rtl">مَنْ (Man) - Siapa</p>
                <p className="text-right text-xl mb-1" dir="rtl">أَيْنَ (Ayna) - Di mana</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">مَتَى (Mata) - Kapan</p>
                <p className="text-right text-xl mb-1" dir="rtl">كَيْفَ (Kayfa) - Bagaimana</p>
                <p className="text-right text-xl mb-1" dir="rtl">لِمَاذَا (Limadza) - Mengapa</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">3. Kata Kerja Dasar (Fi'il)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">ذَهَبَ (Dzahaba) - Pergi</p>
                <p className="text-right text-xl mb-1" dir="rtl">جَلَسَ (Jalasa) - Duduk</p>
                <p className="text-right text-xl mb-1" dir="rtl">أَكَلَ (Akala) - Makan</p>
                <p className="text-right text-xl mb-1" dir="rtl">شَرِبَ (Syariba) - Minum</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-right text-xl mb-1" dir="rtl">نَامَ (Naama) - Tidur</p>
                <p className="text-right text-xl mb-1" dir="rtl">قَرَأَ (Qara'a) - Baca</p>
                <p className="text-right text-xl mb-1" dir="rtl">كَتَبَ (Kataba) - Tulis</p>
                <p className="text-right text-xl mb-1" dir="rtl">عَلِمَ (Alima) - Tahu</p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">📚 Hafalkan dengan SRS!</h3>
              <p className="mb-4">
                Menghafal 100 kata sekaligus sulit? Gunakan fitur Flashcard di LingoSpace Pro 
                dengan metode Spaced Repetition System agar kosakata menempel di ingatan jangka panjang.
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Hafalan SRS
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}