'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const pathname = usePathname();
  const navbarRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup dropdown saat route berubah
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpenGroup(null);
  }, [pathname]);

  // Struktur menu grup
  const menuGroups = [
    {
      id: 'belajar',
      label: 'Belajar',
      icon: '📚',
      items: [
        { name: 'Flashcard', href: '#', mode: 'flashcard', icon: '🎴' },
        { name: 'Quiz', href: '#', mode: 'quiz', icon: '🎯' },
        { name: 'Listen', href: '#', mode: 'listen', icon: '🎧' },
        { name: 'Roadmap', href: '#', mode: 'roadmap', icon: '🗺️' },
      ],
    },
    {
      id: 'bahasa',
      label: 'Bahasa',
      icon: '🌐',
      items: [
        { name: 'English', href: '#', mode: 'english', icon: '🇬🇧' },
        { name: 'Nahwu', href: '#', mode: 'nahwu', icon: '📖' },
        { name: 'Kamus', href: '#', mode: 'dictionary', icon: '' },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🛠️',
      items: [
        { name: 'Smart Translator', href: '#', mode: 'smarttranslator', icon: '🎙️' },
        { name: 'Doa', href: '#', mode: 'prayers', icon: '🤲' },
      ],
    },
  ];

  const singleMenus = [
    { name: 'Dashboard', href: '#', mode: 'dashboard', icon: '📊' },
    { name: 'Favorit', href: '#', mode: 'bookmarks', icon: '⭐' },
  ];

  // Cek apakah menu aktif
  const isActive = (mode) => {
    // Sesuaikan dengan cara Anda mengelola active state
    // Jika menggunakan query params atau state global, sesuaikan di sini
    return false;
  };

const handleModeChange = (mode) => {
  window.dispatchEvent(new CustomEvent('changeMode', { detail: mode }));
};

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 w-full glass-navbar border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => handleModeChange('dashboard')}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
              <span className="text-white font-bold text-lg sm:text-xl relative z-10">L</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                LingoSpace Pro
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight">Learn • Practice • Master</p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1">
            
            {/* Single Menu Items */}
            {singleMenus.map((item) => (
              <button
                key={item.name}
                onClick={() => handleModeChange(item.mode)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}

            {/* Dropdown Menu Groups */}
            {menuGroups.map((group) => (
              <div key={group.id} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.id ? null : group.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    openDropdown === group.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{group.icon}</span>
                  {group.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === group.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Content */}
                {openDropdown === group.id && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass-card rounded-xl p-2 shadow-2xl border border-white/10 animate-fade-in">
                    {group.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleModeChange(item.mode);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all flex items-center gap-3 group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Blog Button */}
            <Link
              href="/blog"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <span>📝</span>
              Blog
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
            
            {/* Single Menu Items */}
            {singleMenus.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  handleModeChange(item.mode);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </button>
            ))}

            {/* Dropdown Groups (Accordion) */}
            {menuGroups.map((group) => (
              <div key={group.id} className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setMobileOpenGroup(mobileOpenGroup === group.id ? null : group.id)}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{group.icon}</span>
                    {group.label}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      mobileOpenGroup === group.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileOpenGroup === group.id && (
                  <div className="ml-4 mt-1 space-y-1 animate-fade-in">
                    {group.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleModeChange(item.mode);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors flex items-center gap-3"
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Blog */}
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 mt-2"
            >
              <span className="text-xl">📝</span>
              Blog
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}
