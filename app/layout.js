// Tambahkan di bagian bawah, sebelum closing tag </html>
<footer className="glass border-t border-white/10 mt-auto">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h3 className="font-bold text-lg mb-4">LingoSpace Pro</h3>
        <p className="text-gray-400 text-sm">
          Platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Menu</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><Link href="/" className="hover:text-white transition-colors">Dashboard</Link></li>
          <li><Link href="/#flashcard" className="hover:text-white transition-colors">Flashcard</Link></li>
          <li><Link href="/#quiz" className="hover:text-white transition-colors">Quiz</Link></li>
          <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Resources</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
          <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Kontak</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>📧 diky.hermansyah91@gmail.com</li>
          <li>🌐 www.raiganet.my.id</li>
          <li className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
    </div>
  </div>
</footer>