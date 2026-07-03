import Link from 'next/link';

export default function Artikel6() {
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
              <span className="text-gray-400 text-sm">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Perbedaan Bahasa Arab Fusha dan Amiyah
            </h1>
            <p className="text-gray-300 text-lg">
              Memahami perbedaan antara bahasa Arab formal (Fusha) dan bahasa Arab sehari-hari (Amiyah).
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Salah satu kebingungan terbesar bagi pemula yang belajar bahasa Arab adalah 
              perbedaan antara bahasa Arab Fusha (فُصْحَى) dan Amiyah (عَامِّيَّة). 
              Banyak yang bertanya: "Yang mana yang harus saya pelajari?"
            </p>
            <p>
              Artikel ini akan menjelaskan perbedaan kedua jenis bahasa Arab ini, 
              kapan harus menggunakan masing-masing, dan mana yang lebih baik untuk dipelajari pertama kali.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Apa Itu Bahasa Arab Fusha?</h2>
            <p>
              Bahasa Arab Fusha (الفصحى) adalah bahasa Arab standar atau formal. 
              Ini adalah bahasa yang digunakan dalam:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Al-Quran:</strong> Bahasa Al-Quran adalah Fusha klasik</li>
              <li><strong>Hadits:</strong> Hadits Nabi Muhammad SAW ditulis dalam Fusha</li>
              <li><strong>Berita:</strong> Al Jazeera, BBC Arabic menggunakan Fusha</li>
              <li><strong>Buku & Literatur:</strong> Buku akademik, novel, puisi</li>
              <li><strong>Pidato Resmi:</strong> Pidato politik, ceramah agama</li>
              <li><strong>Dokumen Resmi:</strong> Hukum, kontrak, surat resmi</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Apa Itu Bahasa Arab Amiyah?</h2>
            <p>
              Bahasa Arab Amiyah (العامية) adalah bahasa Arab sehari-hari atau dialek. 
              Ini adalah bahasa yang digunakan dalam:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Percakapan Sehari-hari:</strong> Di rumah, pasar, jalanan</li>
              <li><strong>Film & Serial TV:</strong> Drama Mesir, Lebanon, Suriah</li>
              <li><strong>Lagu Pop:</strong> Musik Arab modern</li>
              <li><strong>Social Media:</strong> WhatsApp, Instagram, TikTok</li>
              <li><strong>Pasar & Toko:</strong> Transaksi jual beli</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Perbedaan Utama</h2>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Grammar (Nahwu)</h3>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <p className="font-bold mb-3 text-purple-300">Fusha:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Memiliki sistem i'rob lengkap (perubahan akhir kata)</li>
                <li>Grammar kompleks dan terstruktur</li>
                <li>Menggunakan dual form (مُثَنَّى) untuk 2 orang/benda</li>
                <li>Memiliki kasus nominatif, akusatif, genitif</li>
              </ul>
              <p className="font-bold mb-3 text-purple-300">Amiyah:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Grammar disederhanakan</li>
                <li>Tidak ada i'rob (akhir kata tidak berubah)</li>
                <li>Dual form jarang digunakan</li>
                <li>Struktur kalimat lebih fleksibel</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Kosakata</h3>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <p className="font-bold mb-3 text-purple-300">Contoh Perbedaan Kosakata:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-500/20">
                      <th className="border border-white/20 p-3">Arti</th>
                      <th className="border border-white/20 p-3">Fusha</th>
                      <th className="border border-white/20 p-3">Amiyah (Mesir)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-white/20 p-3">Apa</td>
                      <td className="border border-white/20 p-3" dir="rtl">مَاذَا</td>
                      <td className="border border-white/20 p-3" dir="rtl">إيه</td>
                    </tr>
                    <tr>
                      <td className="border border-white/20 p-3">Bagaimana</td>
                      <td className="border border-white/20 p-3" dir="rtl">كَيْفَ</td>
                      <td className="border border-white/20 p-3" dir="rtl">إزاي</td>
                    </tr>
                    <tr>
                      <td className="border border-white/20 p-3">Sekarang</td>
                      <td className="border border-white/20 p-3" dir="rtl">الآنَ</td>
                      <td className="border border-white/20 p-3" dir="rtl">دلوقتي</td>
                    </tr>
                    <tr>
                      <td className="border border-white/20 p-3">Sangat</td>
                      <td className="border border-white/20 p-3" dir="rtl">جِدًّا</td>
                      <td className="border border-white/20 p-3" dir="rtl">أوي</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Pronunciation</h3>
            <div className="bg-white/5 rounded-lg p-6 my-6">
              <p className="font-bold mb-3 text-purple-300">Perbedaan Pengucapan:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Fusha:</strong> Mengucapkan semua huruf dengan jelas, termasuk huruf qaf (ق)</li>
                <li><strong>Amiyah Mesir:</strong> Huruf qaf (ق) diucapkan sebagai hamzah (ء)</li>
                <li><strong>Amiyah Teluk:</strong> Huruf qaf (ق) diucapkan sebagai 'g'</li>
                <li><strong>Amiyah Levantine:</strong> Huruf qaf (ق) diucapkan sebagai hamzah (ء)</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">4. Dialek Regional</h3>
            <p>
              Amiyah berbeda-beda di setiap negara Arab:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Mesir (Masri):</strong> Paling populer karena film dan musik</li>
              <li><strong>Levant (Syam):</strong> Suriah, Lebanon, Yordania, Palestina</li>
              <li><strong>Teluk (Khaleeji):</strong> Arab Saudi, UAE, Qatar, Kuwait</li>
              <li><strong>Maghreb:</strong> Maroko, Aljazair, Tunisia (paling sulit dipahami)</li>
              <li><strong>Irak:</strong> Dialek Irak yang unik</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kapan Menggunakan Fusha?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Membaca Al-Quran:</strong> Wajib menggunakan Fusha</li>
              <li><strong>Studi Islam:</strong> Hadits, fiqh, tafsir</li>
              <li><strong>Akademik:</strong> Penelitian, paper, presentasi formal</li>
              <li><strong>Berita & Media:</strong> Menulis atau membaca berita</li>
              <li><strong>Komunikasi Formal:</strong> Email bisnis, surat resmi</li>
              <li><strong>Pidato & Ceramah:</strong> Situasi formal</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kapan Menggunakan Amiyah?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Percakapan Sehari-hari:</strong> Dengan teman, keluarga</li>
              <li><strong>Traveling:</strong> Berbelanja, tanya arah, restoran</li>
              <li><strong>Nonton Film/Series:</strong> Drama Arab modern</li>
              <li><strong>Dengar Musik:</strong> Lagu pop Arab</li>
              <li><strong>Social Media:</strong> Chat, komentar, post</li>
              <li><strong>Bekerja di Negara Arab:</strong> Interaksi dengan lokal</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Mana yang Harus Dipelajari Pertama?</h2>
            <p>
              Ini tergantung tujuan Anda:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Pilih Fusha Jika:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ingin membaca Al-Quran dan memahami Islam</li>
              <li>Ingin membaca literatur Arab klasik</li>
              <li>Ingin bekerja di bidang akademik atau jurnalistik</li>
              <li>Ingin memahami semua dialek Arab (Fusha adalah fondasi)</li>
              <li>Ingin komunikasi formal di negara Arab manapun</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">Pilih Amiyah Jika:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ingin berbicara dengan orang Arab sehari-hari</li>
              <li>Akan tinggal atau bekerja di negara Arab tertentu</li>
              <li>Suka film dan musik Arab</li>
              <li>Ingin komunikasi casual dan natural</li>
              <li>Tidak terlalu peduli dengan grammar kompleks</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Rekomendasi: Pelajari Keduanya!</h2>
            <p>
              Idealnya, pelajari Fusha terlebih dahulu sebagai fondasi, lalu tambahkan Amiyah 
              untuk komunikasi sehari-hari. Berikut roadmap yang disarankan:
            </p>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3 text-purple-300">Tahap 1: Fusha Dasar (3-6 bulan)</h4>
              <ul className="space-y-2">
                <li>• Pelajari huruf Hijaiyah dan harakat</li>
                <li>• Hafal 500-1000 kosakata dasar Fusha</li>
                <li>• Pelajari nahwu dasar (isim, fi'il, huruf)</li>
                <li>• Latihan membaca teks sederhana</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3 text-purple-300">Tahap 2: Fusha Menengah (6-12 bulan)</h4>
              <ul className="space-y-2">
                <li>• Perluas kosakata hingga 2000-3000 kata</li>
                <li>• Pelajari nahwu lanjut (i'rob, jumlah)</li>
                <li>• Baca artikel berita dan cerita pendek</li>
                <li>• Tonton berita Arab (Al Jazeera)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3 text-purple-300">Tahap 3: Tambahkan Amiyah (12+ bulan)</h4>
              <ul className="space-y-2">
                <li>• Pilih satu dialek (rekomendasi: Mesir atau Levant)</li>
                <li>• Tonton film dan series Arab</li>
                <li>• Dengar musik dan podcast</li>
                <li>• Latihan berbicara dengan native speaker</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Contoh Kalimat: Fusha vs Amiyah</h2>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <p className="font-bold mb-3 text-purple-300">"Apa kabar?"</p>
              <ul className="space-y-2">
                <li><strong>Fusha:</strong> كَيْفَ حَالُكَ؟ (Kayfa haaluka?)</li>
                <li><strong>Amiyah Mesir:</strong> إزايك؟ (Izzayyak?)</li>
                <li><strong>Amiyah Levant:</strong> كيفك؟ (Kifak?)</li>
                <li><strong>Amiyah Teluk:</strong> شلونك؟ (Shlonak?)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 my-6">
              <p className="font-bold mb-3 text-purple-300">"Saya ingin pergi ke pasar"</p>
              <ul className="space-y-2">
                <li><strong>Fusha:</strong> أُرِيدُ أَنْ أَذْهَبَ إِلَى السُّوقِ (Uridu an adhhaba ila as-suuq)</li>
                <li><strong>Amiyah Mesir:</strong> عايز أروح السوق (Ayiz aruh as-suuq)</li>
                <li><strong>Amiyah Levant:</strong> بددي روح للسوق (Baddi ruh la-s-suuq)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kesimpulan</h2>
            <p>
              Bahasa Arab Fusha dan Amiyah memiliki peran yang berbeda:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Fusha:</strong> Untuk formal, akademik, agama, dan literatur</li>
              <li><strong>Amiyah:</strong> Untuk percakapan sehari-hari dan komunikasi casual</li>
            </ul>
            <p>
              Keduanya penting dan saling melengkapi. Mulailah dengan Fusha untuk membangun 
              fondasi yang kuat, lalu tambahkan Amiyah untuk kemampuan komunikasi yang natural.
            </p>
            <p>
              Di LingoSpace Pro, kami mengajarkan Fusha sebagai dasar, dengan rencana untuk 
              menambahkan modul Amiyah di masa depan. Stay tuned!
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">📚 Mulai Belajar Bahasa Arab!</h3>
              <p className="mb-4">
                LingoSpace Pro mengajarkan bahasa Arab Fusha dengan metode SRS yang efektif. 
                Mulai perjalanan Anda hari ini!
              </p>
              <Link href="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Belajar Sekarang
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}