'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kebijakan Privasi</h1>
        
        <div className="glass rounded-2xl p-8 space-y-6 border border-white/10">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">1. Informasi yang Kami Kumpulkan</h2>
            <p className="text-gray-300 mb-4">
              LingoSpace Pro mengumpulkan informasi untuk meningkatkan pengalaman belajar Anda:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Informasi yang Anda berikan secara langsung (nama, email)</li>
              <li>Data penggunaan aplikasi (progress belajar, kosakata yang dipelajari)</li>
              <li>Cookie dan teknologi pelacakan untuk meningkatkan layanan</li>
              <li>Data perangkat dan browser yang Anda gunakan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p className="text-gray-300 mb-4">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Menyediakan dan memelihara layanan pembelajaran bahasa</li>
              <li>Memantau progress belajar Anda</li>
              <li>Meningkatkan kualitas aplikasi</li>
              <li>Mengirim notifikasi dan update (jika Anda setuju)</li>
              <li>Mendeteksi dan mencegah penipuan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">3. Cookies</h2>
            <p className="text-gray-300 mb-4">
              Kami menggunakan cookies untuk:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Menyimpan preferensi Anda</li>
              <li>Menyimpan progress belajar</li>
              <li>Menganalisis penggunaan aplikasi</li>
              <li>Menampilkan iklan yang relevan (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">4. Google AdSense</h2>
            <p className="text-gray-300 mb-4">
              Kami menggunakan Google AdSense untuk menampilkan iklan. Google menggunakan cookies untuk menampilkan iklan yang relevan dengan minat Anda. 
              Anda dapat memilih untuk tidak menerima iklan yang dipersonalisasi dengan mengunjungi 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-1">
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">5. Keamanan Data</h2>
            <p className="text-gray-300 mb-4">
              Kami berkomitmen untuk melindungi data Anda. Namun, tidak ada metode transmisi data melalui internet yang 100% aman. 
              Kami menggunakan langkah-langkah keamanan standar industri untuk melindungi informasi Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">6. Hak Anda</h2>
            <p className="text-gray-300 mb-4">Anda memiliki hak untuk:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Mengakses data pribadi Anda</li>
              <li>Memperbaiki data yang tidak akurat</li>
              <li>Menghapus data Anda (hak untuk dilupakan)</li>
              <li>Menarik persetujuan penggunaan data</li>
              <li>Ekspor data Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">7. Perubahan Kebijakan Privasi</h2>
            <p className="text-gray-300 mb-4">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal update yang baru. 
              Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">8. Hubungi Kami</h2>
            <p className="text-gray-300 mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
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

        {/* ✅ FOOTER SAMA PERSIS DENGAN HALAMAN LAIN */}
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
