'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* ✅ TOMBOL KEMBALI SAMA PERSIS DENGAN BLOG */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 border border-white/10 hover:border-purple-500/50 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Kembali ke Beranda
          </Link>
        </div>

        {/* ✅ HEADER HALAMAN */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            L
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">About LingoSpace Pro</h1>
          <p className="text-xl text-gray-300">Premium Language Learning Platform</p>
        </div>

        {/* ✅ KONTEN UTAMA — TIDAK DIUBAH */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">🎯 Visi Kami</h2>
            <p className="text-gray-300 leading-relaxed">
              Menjadi platform pembelajaran bahasa terdepan yang membantu jutaan orang menguasai bahasa asing 
              dengan cara yang menyenangkan, efektif, dan terjangkau. Kami percaya bahwa setiap orang berhak 
              mendapatkan akses ke pendidikan bahasa berkualitas tinggi.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">💡 Misi Kami</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">✓</span>
                <span>Menyediakan materi pembelajaran bahasa yang komprehensif dan terstruktur</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">✓</span>
                <span>Menggunakan teknologi modern untuk pengalaman belajar yang interaktif</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">✓</span>
                <span>Membantu pelajar menguasai bahasa dengan sistem SRS (Spaced Repetition System)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">✓</span>
                <span>Memberikan akses pembelajaran yang fleksibel dan dapat diakses kapan saja</span>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">📚 Fitur Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">🎴 Flashcard Interaktif</h3>
                <p className="text-sm text-gray-400">Belajar kosakata dengan kartu bolak-balik yang menarik</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">🎯 Quiz & Latihan</h3>
                <p className="text-sm text-gray-400">Uji pemahaman Anda dengan berbagai soal interaktif</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">🎧 Listen & Learn</h3>
                <p className="text-sm text-gray-400">Latih pronunciation dengan audio native speaker</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">📊 Progress Tracking</h3>
                <p className="text-sm text-gray-400">Pantau perkembangan belajar Anda secara real-time</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">🗺️ Roadmap Belajar</h3>
                <p className="text-sm text-gray-400">Panduan belajar terstruktur dari pemula hingga mahir</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">📖 Nahwu & Grammar</h3>
                <p className="text-sm text-gray-400">Pelajari tata bahasa Arab dan Inggris secara mendalam</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">👨‍💻 Tentang Developer</h2>
            <p className="text-gray-300 mb-4">
              LingoSpace Pro dikembangkan oleh tim yang passionate dalam pendidikan bahasa dan teknologi. 
              Kami memahami tantangan dalam belajar bahasa asing dan berkomitmen untuk membuat proses 
              pembelajaran menjadi lebih mudah dan menyenangkan.
            </p>
            <p className="text-gray-300">
              Platform ini terus dikembangkan dengan menambahkan fitur-fitur baru dan materi pembelajaran 
              yang lebih lengkap untuk memenuhi kebutuhan para pelajar bahasa di Indonesia.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">📧 Hubungi Kami</h2>
            <p className="text-gray-300 mb-4">
              Punya pertanyaan, saran, atau ingin berkolaborasi? Kami senang mendengar dari Anda!
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <strong>Email:</strong> <a href="mailto:diky.hermansyah91@gmail.com" className="text-purple-400 hover:underline">diky.hermansyah91@gmail.com</a>
              </p>
              <p className="text-gray-300">
                <strong>Website:</strong> <a href="https://www.raiganet.my.id" className="text-purple-400 hover:underline">www.raiganet.my.id</a>
              </p>
            </div>
          </div>
        </div>

        {/* ✅ FOOTER SAMA PERSIS DENGAN HALAMAN BLOG */}
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
