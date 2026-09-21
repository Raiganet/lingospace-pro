import Link from 'next/link';

export default function Artikel3() {
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
                Nahwu (Grammar Arab)
              </span>
              <span className="text-gray-400 text-sm">10 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Memahami Nahwu Dasar: Panduan Lengkap untuk Pemula
            </h1>
            <p className="text-gray-300 text-lg">
              Pelajari dasar-dasar ilmu Nahwu (tata bahasa Arab) dengan penjelasan yang mudah dipahami.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              Nahwu adalah ilmu yang mempelajari tentang perubahan akhir kata dalam bahasa Arab 
              berdasarkan posisinya dalam kalimat. Bagi pemula, nahwu seringkali terlihat menakutkan. 
              Tapi sebenarnya, dengan memahami dasar-dasarnya, Anda akan menemukan bahwa nahwu 
              adalah kunci untuk menguasai bahasa Arab dengan benar.
            </p>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Apa Itu Nahwu?</h2>
            <p>
              Secara sederhana, nahwu adalah tata bahasa Arab yang mengatur:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Perubahan harakat akhir kata (I'rob)</li>
              <li>Fungsi kata dalam kalimat</li>
              <li>Hubungan antar kata</li>
              <li>Struktur kalimat yang benar</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Pembagian Kata dalam Bahasa Arab</h2>
            <p>
              Dalam bahasa Arab, kata dibagi menjadi 3 jenis:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Isim (اِسْمٌ) - Kata Benda</h3>
            <p>
              Isim adalah kata yang menunjukkan makna benda, orang, tempat, waktu, atau konsep. 
              Ciri-ciri isim:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bisa diawali Alif Lam (ال)</li>
              <li>Bisa bertanwin (ـٌـٍـً)</li>
              <li>Bisa menjadi subjek atau objek</li>
            </ul>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="mb-2"><strong>Contoh:</strong></p>
              <ul className="list-disc list-inside space-y-2">
                <li>كِتَابٌ (kitabun) = buku</li>
                <li>مَدْرَسَةٌ (madrasatun) = sekolah</li>
                <li>مُعَلِّمٌ (mu'allimun) = guru</li>
                <li>يَوْمٌ (yaumun) = hari</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Fi'il (فِعْلٌ) - Kata Kerja</h3>
            <p>
              Fi'il adalah kata yang menunjukkan pekerjaan atau tindakan yang terjadi pada waktu tertentu. 
              Fi'il dibagi menjadi 3:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Fi'il Madhi:</strong> Kata kerja lampau (كَتَبَ = telah menulis)</li>
              <li><strong>Fi'il Mudhari:</strong> Kata kerja sekarang/akan datang (يَكْتُبُ = sedang menulis)</li>
              <li><strong>Fi'il Amar:</strong> Kata kerja perintah (اُكْتُبْ = tulislah!)</li>
            </ul>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">3. Huruf (حَرْفٌ) - Kata Tugas</h3>
            <p>
              Huruf adalah kata yang tidak memiliki makna sempurna kecuali bersama isim atau fi'il.
            </p>
            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="mb-2"><strong>Contoh huruf:</strong></p>
              <ul className="list-disc list-inside space-y-2">
                <li>فِي (fii) = di dalam</li>
                <li>عَلَى ('alaa) = di atas</li>
                <li>مِنْ (min) = dari</li>
                <li>إِلَى (ilaa) = ke</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Jumlah (Kalimat) dalam Bahasa Arab</h2>
            <p>
              Ada 2 jenis kalimat dalam bahasa Arab:
            </p>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">1. Jumlah Ismiyah (جُمْلةٌ اِسْمِيَّةٌ)</h3>
            <p>
              Kalimat yang diawali dengan Isim. Terdiri dari:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Mubtada' (مُبْتَدَأ):</strong> Subjek/topik kalimat</li>
              <li><strong>Khabar (خَبَر):</strong> Predikat/keterangan tentang subjek</li>
            </ul>

            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="mb-2"><strong>Contoh:</strong></p>
              <p className="text-right text-xl mb-2" dir="rtl">الْكِتَابُ جَدِيْدٌ</p>
              <p><strong>Al-Kitaabu jadiidun</strong></p>
              <ul className="list-disc list-inside space-y-2">
                <li>الْكِتَابُ (Al-Kitaabu) = Mubtada' (buku itu)</li>
                <li>جَدِيْدٌ (jadiidun) = Khabar (baru)</li>
                <li>Arti: "Buku itu baru"</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3">2. Jumlah Fi'liyah (جُمْلةٌ فِعْلِيَّةٌ)</h3>
            <p>
              Kalimat yang diawali dengan Fi'il (kata kerja). Terdiri dari:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Fi'il (فِعْل):</strong> Kata kerja</li>
              <li><strong>Fa'il (فَاعِل):</strong> Pelaku/subjek</li>
              <li><strong>Maf'ul Bih (مَفْعُوْل بِهِ):</strong> Objek (opsional)</li>
            </ul>

            <div className="bg-white/5 rounded-lg p-4 my-4">
              <p className="mb-2"><strong>Contoh:</strong></p>
              <p className="text-right text-xl mb-2" dir="rtl">كَتَبَ الطَّالِبُ الدَّرْسَ</p>
              <p><strong>Kataba ath-thalibu ad-darsa</strong></p>
              <ul className="list-disc list-inside space-y-2">
                <li>كَتَبَ (kataba) = Fi'il (telah menulis)</li>
                <li>الطَّالِبُ (ath-thalibu) = Fa'il (siswa)</li>
                <li>الدَّرْسَ (ad-darsa) = Maf'ul Bih (pelajaran)</li>
                <li>Arti: "Siswa telah menulis pelajaran"</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">I'rob (Perubahan Akhir Kata)</h2>
            <p>
              I'rob adalah perubahan harakat akhir kata berdasarkan posisinya dalam kalimat. 
              Ada 4 jenis i'rob:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-purple-300 mb-2">Rafa' (رَفْع)</h4>
                <p className="text-sm">Tanda: Dhammah (ـُ)</p>
                <p className="text-sm">Untuk: Subjek (Fa'il, Mubtada')</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-purple-300 mb-2">Nashab (نَصْب)</h4>
                <p className="text-sm">Tanda: Fathah (ـَ)</p>
                <p className="text-sm">Untuk: Objek (Maf'ul Bih)</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-purple-300 mb-2">Jar (جَرّ)</h4>
                <p className="text-sm">Tanda: Kasrah (ـِ)</p>
                <p className="text-sm">Untuk: Setelah huruf jar</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-purple-300 mb-2">Jazm (جَزْم)</h4>
                <p className="text-sm">Tanda: Sukun (ـْ)</p>
                <p className="text-sm">Untuk: Fi'il Mudhari setelah alat jazm</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Dhamir (Kata Ganti)</h2>
            <p>
              Dhamir adalah kata ganti yang harus Anda hafal di awal belajar nahwu:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-500/20">
                    <th className="border border-white/20 p-3 text-right">Arab</th>
                    <th className="border border-white/20 p-3 text-right">Transliterasi</th>
                    <th className="border border-white/20 p-3 text-right">Arti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/20 p-3 text-right" dir="rtl">أَنَا</td>
                    <td className="border border-white/20 p-3">Ana</td>
                    <td className="border border-white/20 p-3">Saya</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3 text-right" dir="rtl">أَنْتَ</td>
                    <td className="border border-white/20 p-3">Anta</td>
                    <td className="border border-white/20 p-3">Kamu (laki-laki)</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3 text-right" dir="rtl">أَنْتِ</td>
                    <td className="border border-white/20 p-3">Anti</td>
                    <td className="border border-white/20 p-3">Kamu (perempuan)</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3 text-right" dir="rtl">هُوَ</td>
                    <td className="border border-white/20 p-3">Huwa</td>
                    <td className="border border-white/20 p-3">Dia (laki-laki)</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 p-3 text-right" dir="rtl">هِيَ</td>
                    <td className="border border-white/20 p-3">Hiya</td>
                    <td className="border border-white/20 p-3">Dia (perempuan)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Tips Belajar Nahwu untuk Pemula</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Mulai dari dasar:</strong> Jangan loncat ke materi advanced sebelum paham dasar</li>
              <li><strong>Hafal dhamir:</strong> Kata ganti adalah fondasi nahwu</li>
              <li><strong>Praktik setiap hari:</strong> Buat kalimat sederhana setiap hari</li>
              <li><strong>Baca contoh:</strong> Pelajari contoh-contoh dari Al-Quran atau hadits</li>
              <li><strong>Gunakan flashcard:</strong> Untuk menghafal kaidah-kaidah</li>
              <li><strong>Jangan takut salah:</strong> Kesalahan adalah bagian dari belajar</li>
              <li><strong>Cari guru/mentor:</strong> Untuk koreksi dan bimbingan</li>
            </ol>

            <h2 className="text-2xl font-bold text-purple-300 mt-8 mb-4">Kesimpulan</h2>
            <p>
              Nahwu adalah kunci untuk memahami bahasa Arab dengan benar. Meskipun terlihat rumit di awal, 
              dengan memahami dasar-dasar seperti pembagian kata, jenis kalimat, dan i'rob, 
              Anda sudah memiliki fondasi yang kuat.
            </p>
            <p>
              Teruslah berlatih dan jangan menyerah. Semakin sering Anda praktik, semakin mudah nahwu akan dipahami. 
              Selamat belajar!
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-3 text-purple-300">📖 Pelajari Nahwu Lebih Dalam!</h3>
              <p className="mb-4">
                LingoSpace Pro memiliki modul Nahwu lengkap dengan penjelasan, contoh, dan latihan interaktif. 
                Mulai belajar sekarang dengan metode yang menyenangkan!
              </p>
              <Link href="/nahwu" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform">
                Mulai Belajar Nahwu
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}