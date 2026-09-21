'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass-modern border-t border-white/10 mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LingoSpace Pro</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris dengan metode latihan bertahap.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Menu</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">📊 Dashboard</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">📝 Blog</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">ℹ️ Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">🔒 Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">📄 Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">📧 Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Hubungi Kami</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">📧 diky.hermansyah91@gmail.com</li>
              <li className="flex items-center gap-2">🌐 www.raiganet.my.id</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 md:pt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
          <p className="mt-2 text-[10px] sm:text-xs">Dibuat dengan ❤️ untuk pelajar bahasa di Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
