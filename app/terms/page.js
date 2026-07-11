'use client';

import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* ✅ TOMBOL KEMBALI SAMA PERSIS */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 border border-white/10 hover:border-purple-500/50 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Kembali ke Beranda
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Syarat & Ketentuan</h1>
        
        <div className="glass rounded-2xl p-8 space-y-6 border border-white/10">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">1. Persetujuan Terhadap Syarat</h2>
            <p className="text-gray-300 mb-4">
              Dengan mengakses dan menggunakan LingoSpace Pro, Anda setuju untuk terikat dengan Syarat & Ketentuan ini. 
              Jika Anda tidak setuju dengan syarat-syarat ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">2. Deskripsi Layanan</h2>
            <p className="text-gray-300 mb-4">
              LingoSpace Pro adalah platform pembelajaran bahasa yang menyediakan:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Flashcard untuk belajar kosakata</li>
              <li>Kuis dan latihan interaktif</li>
              <li>Fitur dengar & pelajari untuk pelafalan</li>
              <li>Pemantauan kemajuan dan sistem SRS (Spaced Repetition System)</li>
              <li>Materi pembelajaran Nahwu dan Bahasa Inggris</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">3. Akun Pengguna</h2>
            <p className="text-gray-300 mb-4">
              Untuk menggunakan layanan ini, Anda setuju untuk:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Memberikan informasi yang akurat dan lengkap</li>
              <li>Menjaga kerahasiaan akun Anda</li>
              <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
              <li>Segera memberitahu kami jika ada penggunaan yang tidak sah</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">4. Penggunaan yang Diterima</h2>
            <p className="text-gray-300 mb-4">Anda setuju untuk TIDAK:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Menggunakan layanan untuk tujuan ilegal</li>
              <li>Mencoba mengakses akun orang lain</li>
              <li>Mengganggu atau merusak server dan jaringan</li>
              <li>Menggunakan bot, perayap, atau sistem otomatis lainnya</li>
              <li>Menyalin, memodifikasi, atau mendistribusikan konten tanpa izin</li>
              <li>Mengiklankan atau mempromosikan layanan komersial</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">5. Hak Kekayaan Intelektual</h2>
            <p className="text-gray-300 mb-4">
              Semua konten di LingoSpace Pro termasuk tetapi tidak terbatas pada:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Teks, grafik, logo, dan ikon</li>
              <li>Rekaman audio dan unduhan digital</li>
              <li>Perangkat lunak dan kode sumber</li>
              <li>Struktur dan organisasi situs web</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Adalah milik LingoSpace Pro dan dilindungi oleh hukum hak cipta Indonesia dan internasional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">6. Penyangkalan Jaminan</h2>
            <p className="text-gray-300 mb-4">
              LingoSpace Pro disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak menjamin:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Layanan akan selalu tersedia dan bebas kesalahan</li>
              <li>Hasil belajar yang spesifik</li>
              <li>Akurasi 100% dari semua materi pembelajaran</li>
              <li>Keamanan absolut dari data Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">7. Pembatasan Tanggung Jawab</h2>
            <p className="text-gray-300 mb-4">
              Dalam batas yang diizinkan oleh hukum, LingoSpace Pro tidak bertanggung jawab atas:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Kerugian tidak langsung, insidental, atau konsekuensial</li>
              <li>Kehilangan data atau keuntungan</li>
              <li>Gangguan operasional bisnis</li>
              <li>Klaim dari pihak ketiga</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">8. Iklan (Google AdSense)</h2>
            <p className="text-gray-300 mb-4">
              Situs web ini menggunakan Google AdSense untuk menampilkan iklan. Dengan menggunakan layanan ini, 
              Anda setuju untuk melihat iklan yang ditampilkan. Kami tidak bertanggung jawab atas konten iklan yang ditampilkan oleh pihak ketiga.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">9. Pengakhiran Layanan</h2>
            <p className="text-gray-300 mb-4">
              Kami berhak untuk menangguhkan atau mengakhiri akun Anda jika:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Anda melanggar Syarat & Ketentuan ini</li>
              <li>Ada aktivitas mencurigakan atau penipuan</li>
              <li>Atas kebijakan kami sendiri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">10. Perubahan Syarat</h2>
            <p className="text-gray-300 mb-4">
              Kami dapat mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di halaman ini. 
              Penggunaan berkelanjutan Anda terhadap layanan setelah perubahan merupakan penerimaan Anda terhadap syarat yang baru.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">11. Hukum yang Berlaku</h2>
            <p className="text-gray-300 mb-4">
              Syarat & Ketentuan ini diatur oleh dan sesuai dengan hukum Indonesia. 
              Setiap sengketa akan diselesaikan di pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">12. Hubungi Kami</h2>
            <p className="text-gray-300 mb-4">
              Untuk pertanyaan tentang Syarat & Ketentuan ini, hubungi kami di:
            </p>
            <p className="text-gray-300">
              Email: <a href="mailto:diky.hermansyah91@gmail.com" className="text-purple-400 hover:underline">diky.hermansyah91@gmail.com</a>
            </p>
          </section>

          <div className="border-t border-white/20 pt-6 mt-8">
            <p className="text-sm text-gray-400">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* ✅ FOOTER SAMA PERSIS DENGAN SEMUA HALAMAN LAIN */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Tentang Kami */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Tentang</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-300">Info</h3>
              <p className="text-gray-400 text-sm">
                LingoSpace Pro adalah platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                diky.hermansyah91@gmail.com
              </p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LingoSpace Pro. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
