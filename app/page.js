"use client";

// ✅ PASTIKAN BARIS INI ADA DI PALING ATAS
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

// Dynamic Import untuk mencegah error SSR
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
    
    // ✅ Listener untuk menangkap event perubahan mode dari Navbar
    const handleModeChange = (event) => {
      if (event.detail) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener('changeMode', handleModeChange);
    
    // Cleanup listener saat komponen unmount
    return () => {
      window.removeEventListener('changeMode', handleModeChange);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-white">Memuat LingoSpace Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      
      {/* ✅ Navbar Component */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 safe-area-bottom">
        {activeTab === 'dashboard' && <LingoSpacePro />}
        {activeTab === 'smarttranslator' && <SmartTranslator />}
        {activeTab === 'dictionary' && <Dictionary />}
        {activeTab === 'prayers' && <DailyPrayers />}
        
        {/* Fallback untuk tab lain yang belum diimplementasi di page.js */}
        {!['dashboard', 'smarttranslator', 'dictionary', 'prayers'].includes(activeTab) && (
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Fitur "{activeTab}" sedang dalam pengembangan</h2>
            <p className="text-gray-400">Silakan gunakan menu Dashboard untuk mengakses fitur utama.</p>
          </div>
        )}
      </main>

      {/* Footer Sederhana */}
      <footer className="glass-modern border-t border-white/10 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs sm:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
          <p className="mt-2 text-[10px] sm:text-xs">Dibuat dengan ❤️ untuk pelajar bahasa di Indonesia</p>
        </div>
      </footer>

      {/* Global Styles */}
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
