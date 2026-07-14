'use client';

import { useState, useEffect } from 'react';
import { dictionaryData, dictionaryCategories } from '../data/dictionary';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarks, setBookmarks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dictionary_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (id) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('dictionary_bookmarks', JSON.stringify(newBookmarks));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const playAudio = (text, lang) => {
    if (!text || text === '-') return;
    window.speechSynthesis.cancel();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredData = dictionaryData.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase().trim();
    
    const matchSearch = searchTerm === '' ||
      (item.id_lang && item.id_lang.toLowerCase().includes(searchLower)) ||
      (item.en && item.en.toLowerCase().includes(searchLower)) ||
      (item.ar && item.ar.includes(searchTerm)) ||
      (item.category && item.category.toLowerCase().includes(searchLower));
    
    return matchCategory && matchSearch;
  });

  const categoryIcons = {
    'Makanan & Minuman': '️',
    'Keluarga': '‍👩‍👧👦',
    'Pekerjaan': '💼',
    'Angka': '🔢',
    'Warna': '🎨',
    'Binatang': '🦁',
    'Tempat': '🏠',
    'Waktu': '',
    'Cuaca': '️',
    'Perasaan': '😊',
    'Tubuh Manusia': '',
    'Kata Kerja': '',
    'Kata Sifat': ''
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-slide-down">
        <div className="inline-block mb-4">
          <span className="text-6xl animate-bounce"></span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
          Kamus Tematik 3 Bahasa
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">Indonesia • English • العربية</p>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            {dictionaryData.length} Kata
          </span>
          <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm">
            {dictionaryCategories.length - 1} Kategori
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-modern rounded-2xl p-4 sm:p-6 mb-8 animate-fade-in shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kata dalam bahasa Indonesia, Inggris, atau Arab..."
              className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-2.5 sm:py-3 rounded-full glass-modern bg-white/5 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full glass-modern bg-white/5 outline-none text-white cursor-pointer focus:ring-2 focus:ring-purple-500 transition-all appearance-none pr-10 sm:pr-12 text-sm sm:text-base"
            >
              {dictionaryCategories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-slate-800">
                  {categoryIcons[cat.id] || ''} {cat.name}
                </option>
              ))}
            </select>
            <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sm sm:text-base">▼</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-full transition-all transform hover:scale-105 text-sm sm:text-base ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'glass-modern text-gray-300 hover:bg-white/10'
              }`}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-full transition-all transform hover:scale-105 text-sm sm:text-base ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'glass-modern text-gray-300 hover:bg-white/10'
              }`}
            >
              ☰ List
            </button>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 animate-fade-in">
          Menampilkan <span className="text-purple-400 font-bold text-base sm:text-lg">{filteredData.length}</span> dari {dictionaryData.length} kata
        </div>
      </div>

      {/* Dictionary Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredData.map((item, index) => (
            <div 
              key={item.id} 
              className="glass-modern rounded-2xl p-4 sm:p-6 hover-lift cursor-pointer transform transition-all duration-300 animate-fade-in-up relative"
              style={{ animationDelay: `${index * 30}ms` }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                  {categoryIcons[item.category] || ''} {item.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(item.id);
                  }}
                  className="text-xl sm:text-2xl hover:scale-125 transition-transform transform"
                >
                  {bookmarks.includes(item.id) ? '⭐' : '☆'}
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <span>🇮🇩</span> Indonesia
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{item.id_lang}</p>
                </div>
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <span>🇬</span> English
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300">{item.en}</p>
                </div>
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <span>🇸🇦</span> العربية
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-right text-purple-300 mb-1" dir="rtl">{item.ar}</p>
                  {item.pronunciation && (
                    <p className="text-[10px] sm:text-xs text-gray-500 text-center">({item.pronunciation})</p>
                  )}
                </div>
              </div>

              {item.example_id && (
                <div className="border-t border-white/10 pt-3 sm:pt-4 mb-3 sm:mb-4 bg-white/5 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <span>💬</span> Contoh:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.example_id, 'id');
                        }}
                        className="flex-shrink-0 px-2 py-1 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-purple-500/40 transition-all"
                      >
                        🔊 ID
                      </button>
                      <p className="text-xs sm:text-sm text-gray-300 flex-1">{item.example_id}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.example_en, 'en');
                        }}
                        className="flex-shrink-0 px-2 py-1 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-purple-500/40 transition-all"
                      >
                         EN
                      </button>
                      <p className="text-xs sm:text-sm text-blue-300 flex-1">{item.example_en}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.example_ar, 'ar');
                        }}
                        className="flex-shrink-0 px-2 py-1 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-purple-500/40 transition-all"
                      >
                        🔊 AR
                      </button>
                      <p className="text-xs sm:text-sm text-purple-300 flex-1 text-right" dir="rtl">{item.example_ar}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(item.id_lang, 'id');
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  🔊 ID
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(item.en, 'en');
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  🔊 EN
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(item.ar, 'ar');
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  🔊 AR
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(`${item.id_lang} | ${item.en} | ${item.ar}`, item.id);
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  {copiedId === item.id ? '✓' : '📋'}
                </button>
              </div>

              {hoveredCard === item.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl pointer-events-none animate-fade-in"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredData.map((item, index) => (
            <div 
              key={item.id} 
              className="glass-modern rounded-2xl p-4 sm:p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                  {categoryIcons[item.category] || ''} {item.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(item.id);
                  }}
                  className="text-xl sm:text-2xl hover:scale-125 transition-transform"
                >
                  {bookmarks.includes(item.id) ? '⭐' : '☆'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">🇮🇩 Indonesia</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold">{item.id_lang}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">🇬🇧 English</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-blue-300">{item.en}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">🇸🇦 العربية</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-right text-purple-300" dir="rtl">{item.ar}</p>
                  {item.pronunciation && (
                    <p className="text-[10px] sm:text-xs text-gray-500 text-right">({item.pronunciation})</p>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                <button onClick={() => playAudio(item.id_lang, 'id')} className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all">🔊 ID</button>
                <button onClick={() => playAudio(item.en, 'en')} className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all">🔊 EN</button>
                <button onClick={() => playAudio(item.ar, 'ar')} className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all">🔊 AR</button>
                <button onClick={() => copyToClipboard(`${item.id_lang} | ${item.en} | ${item.ar}`, item.id)} className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full glass-modern text-[10px] sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all">
                  {copiedId === item.id ? '✓' : '📋'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-400 animate-fade-in">
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-base sm:text-xl">Tidak ada kata yang ditemukan</p>
          <p className="text-xs sm:text-sm mt-2">Coba kata kunci atau kategori lain</p>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </div>
  );
}
