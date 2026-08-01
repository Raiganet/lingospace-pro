'use client';

import { useState, useEffect } from 'react';

export default function BrowserCheck({ children }) {
  const [isCompatible, setIsCompatible] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkCompatibility = () => {
      const checks = {
        // Cek CSS backdrop-filter
        hasBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
        // Cek Speech Recognition
        hasSpeechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        // Cek Clipboard API
        hasClipboard: navigator.clipboard !== undefined,
        // Cek Optional Chaining support (via eval)
        hasModernJS: (() => {
          try {
            new Function('const a = {}; return a?.b;');
            return true;
          } catch {
            return false;
          }
        })(),
        // Cek User Agent untuk Android lama
        isOldAndroid: /Android\s[1-8]\./i.test(navigator.userAgent),
        // Cek RAM device
        hasLowMemory: navigator.deviceMemory !== undefined && navigator.deviceMemory < 3,
      };

      // Jika browser sangat lama (Android 8 ke bawah)
      if (checks.isOldAndroid || !checks.hasModernJS) {
        setIsCompatible(false);
        setShowWarning(true);
      }
      // Jika hanya beberapa fitur yang tidak ada, tetap jalan dengan warning
      else if (!checks.hasBackdropFilter || checks.hasLowMemory) {
        setShowWarning(true);
      }
    };

    checkCompatibility();
  }, []);

  if (!isCompatible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md text-center border border-white/20">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-3">Browser Tidak Didukung</h2>
          <p className="text-gray-300 mb-4 text-sm">
            Browser Anda terlalu lama untuk menjalankan LingoSpace Pro. 
            Silakan update browser atau gunakan Chrome versi terbaru.
          </p>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
            <p className="text-yellow-300 text-xs">
               <strong>Rekomendasi:</strong> Update Google Chrome ke versi 90+ atau gunakan browser modern lainnya.
            </p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.android.chrome"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            📥 Update Chrome
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {showWarning && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-yellow-500/90 text-black px-4 py-3 rounded-lg shadow-lg flex items-center justify-between text-sm">
          <span>⚠️ Beberapa fitur mungkin tidak berjalan optimal</span>
          <button 
            onClick={() => setShowWarning(false)}
            className="ml-2 font-bold"
          >
            ✕
          </button>
        </div>
      )}
      {children}
    </>
  );
}
