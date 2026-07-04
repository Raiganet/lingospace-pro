'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-modern sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Baris 1: Logo + Blog */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-2xl shadow-lg">
              L
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LingoSpace Pro
              </h1>
              <p className="text-xs text-gray-400">Premium Learning Platform</p>
            </div>
          </Link>
          
          <div className="flex gap-2">
            <Link href="/blog" className="px-4 py-2 rounded-full glass-modern hover:bg-white/10 transition-all text-sm font-medium">
              📝 Blog
            </Link>
          </div>
        </div>

        {/* Baris 2: Mode Navigation */}
        <div className="flex gap-3 overflow-x-auto py-2 flex-wrap">
          {[
            { id: 'dashboard', label: '📊 Dashboard', href: '/' },
            { id: 'flashcard', label: '🎴 Flashcard', href: '/#flashcard' },
            { id: 'quiz', label: '🎯 Quiz', href: '/#quiz' },
            { id: 'listen', label: '🎧 Listen', href: '/#listen' },
            { id: 'bookmarks', label: '⭐ Favorit', href: '/#bookmarks' },
            { id: 'roadmap', label: '🗺️ Roadmap', href: '/#roadmap' },
            { id: 'nahwu', label: '📖 Nahwu', href: '/#nahwu' },
            { id: 'english', label: '📚 English', href: '/#english' }
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 glass-modern hover:bg-white/10 text-gray-300 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
