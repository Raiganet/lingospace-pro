'use client';

import { useState, useEffect } from 'react';
import { dailyPrayers, prayerCategories } from '../data/dailyPrayers';

export default function DailyPrayers() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('dailyPrayers_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const filteredPrayers = dailyPrayers.filter(prayer => {
    const matchCategory = selectedCategory === 'Semua' || prayer.category === selectedCategory;
    const matchSearch = prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prayer.translation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleFavorite = (id) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fid => fid !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    localStorage.setItem('dailyPrayers_favorites', JSON.stringify(newFavorites));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-5xl md:text-6xl mb-4">🤲</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Kumpulan Doa Sehari-hari
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Doa-doa pilihan untuk kehidupan Muslim sehari-hari
          </p>
        </div>

        {/* Search & Filter */}
        <div className="glass-modern rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=" Cari doa..."
              className="flex-1 px-4 py-3 rounded-xl glass-modern bg-white/5 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {prayerCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : 'glass-modern text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-center">
          <p className="text-gray-300">
            Menampilkan <span className="text-emerald-400 font-bold">{filteredPrayers.length}</span> dari {dailyPrayers.length} doa
          </p>
        </div>

        {/* Prayer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrayers.map((prayer, index) => (
            <div
              key={prayer.id}
              className="glass-modern rounded-2xl p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    {prayer.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{prayer.title}</h3>
                </div>
                <button
                  onClick={() => toggleFavorite(prayer.id)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {favorites.includes(prayer.id) ? '⭐' : '☆'}
                </button>
              </div>

              {/* Arabic Text */}
              <div className="mb-4 p-4 bg-white/5 rounded-xl">
                <p className="text-2xl md:text-3xl text-right text-emerald-300 leading-loose" dir="rtl">
                  {prayer.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Latin:</p>
                <p className="text-sm italic text-gray-300">{prayer.transliteration}</p>
              </div>

              {/* Translation */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Terjemahan:</p>
                <p className="text-sm text-gray-200">{prayer.translation}</p>
              </div>

              {/* Reference */}
              <div className="mb-4 text-xs text-gray-400">
                📖 {prayer.reference}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => playAudio(prayer.arabic)}
                  className="flex-1 px-4 py-2 rounded-full glass-modern hover:bg-emerald-500/40 transition-all text-sm font-semibold"
                >
                  🔊 Dengarkan
                </button>
                <button
                  onClick={() => copyToClipboard(`${prayer.arabic}\n\n${prayer.transliteration}\n\n${prayer.translation}`, prayer.id)}
                  className="flex-1 px-4 py-2 rounded-full glass-modern hover:bg-cyan-500/40 transition-all text-sm font-semibold"
                >
                  {copiedId === prayer.id ? '✓ Tersalin' : '📋 Salin'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrayers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">Tidak ada doa yang ditemukan</p>
            <p className="text-sm mt-2">Coba kata kunci atau kategori lain</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
