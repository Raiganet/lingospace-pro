"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const LingoSpacePro = dynamic(() => import('../components/LingoSpacePro'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-white">Memuat LingoSpace Pro...</p>
      </div>
    </div>
  )
});

const SmartTranslator = dynamic(() => import('../components/SmartTranslator'), {
  ssr: false,
  loading: () => null 
});

const Dictionary = dynamic(() => import('../components/Dictionary'), {
  ssr: false,
  loading: () => null
});

const DailyPrayers = dynamic(() => import('../components/DailyPrayers'), {
  ssr: false,
  loading: () => null
});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 

  useEffect(() => {
    setMounted(true);
    
    // Listener untuk menangkap event perubahan mode dari Navbar
    const handleModeChange = (event) => {
      if (event.detail) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener('changeMode', handleModeChange);
    return () => window.removeEventListener('changeMode', handleModeChange);
  }, []);

  if (!mounted) return null;

  // Mode yang menggunakan komponen terpisah
  const separateComponents = {
    'smarttranslator': <SmartTranslator />,
    'dictionary': <Dictionary />,
    'prayers': <DailyPrayers />,
  };

  // Mode yang menggunakan LingoSpacePro (dengan mode tertentu)
  const lingoSpaceModes = [
    'dashboard', 'flashcard', 'quiz', 'listen', 
    'bookmarks', 'roadmap', 'nahwu', 'english'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 safe-area-bottom">
        {/* Render komponen terpisah */}
        {separateComponents[activeTab] && separateComponents[activeTab]}
        
        {/* Render LingoSpacePro untuk mode lainnya */}
        {lingoSpaceModes.includes(activeTab) && (
          <LingoSpaceProWrapper mode={activeTab} />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-modern border-t border-white/10 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs sm:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
          <p className="mt-2 text-[10px] sm:text-xs">Dibuat dengan ❤️ untuk pelajar bahasa di Indonesia</p>
        </div>
      </footer>

      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .btn-press:active { transform: scale(0.95); }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .glass-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @supports (padding: max(0px)) {
          .safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
        }
      `}</style>
    </div>
  );
}

// Wrapper component untuk mengirim mode ke LingoSpacePro
function LingoSpaceProWrapper({ mode }) {
  useEffect(() => {
    // Kirim event ke LingoSpacePro untuk mengubah mode
    window.dispatchEvent(new CustomEvent('changeMode', { detail: mode }));
  }, [mode]);

  return <LingoSpacePro />;
}
