'use client';

import { useState, useEffect } from 'react';
import { dictionaryData, dictionaryCategories } from '../data/dictionary';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'list'
  const [bookmarks, setBookmarks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

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
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredData = dictionaryData.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = searchTerm === '' ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ar.includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          📚 Kamus Tematik 3 Bahasa
        </h2>
        <p className="text-gray-400">Indonesia • English • العربية</p>
      </div>

      {/* Search & Filter */}
      <div className="glass-modern rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Cari kata dalam bahasa Indonesia, Inggris, atau Arab..."
            className="flex-1 px-6 py-3 rounded-full glass-modern bg-transparent outline-none text-white placeholder-gray-400"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 rounded-full glass-modern bg-transparent outline-none text-white cursor-pointer"
          >
            {dictionaryCategories.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-slate-800">
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'glass-modern text-gray-300'
              }`}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-full transition-all ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'glass-modern text-gray-300'
              }`}
            >
              ☰ List
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Menampilkan <span className="text-purple-400 font-semibold">{filteredData.length}</span> dari {dictionaryData.length} kata
        </div>
      </div>

      {/* Dictionary Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(item => (
            <div key={item.id} className="glass-modern rounded-2xl p-6 hover-lift">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                  {item.category}
                </span>
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {bookmarks.includes(item.id) ? '⭐' : '☆'}
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Indonesia</p>
                  <p className="text-xl font-bold">{item.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">English</p>
                  <p className="text-xl font-bold text-blue-300">{item.en}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">العربية</p>
                  <p className="text-2xl font-bold text-right text-purple-300" dir="rtl">{item.ar}</p>
                  <p className="text-xs text-gray-500 mt-1">({item.pronunciation})</p>
                </div>
              </div>

              {item.example_id && (
                <div className="border-t border-white/10 pt-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Contoh:</p>
                  <p className="text-sm text-gray-300">{item.example_id}</p>
                  <p className="text-sm text-blue-300">{item.example_en}</p>
                  <p className="text-sm text-purple-300 text-right" dir="rtl">{item.example_ar}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => playAudio(item.id, 'id')}
                  className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all flex items-center gap-1"
                >
                   ID
                </button>
                <button
                  onClick={() => playAudio(item.en, 'en')}
                  className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  🔊 EN
                </button>
                <button
                  onClick={() => playAudio(item.ar, 'ar')}
                  className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  🔊 AR
                </button>
                <button
                  onClick={() => copyToClipboard(`${item.id} | ${item.en} | ${item.ar}`, item.id)}
                  className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  {copiedId === item.id ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map(item => (
            <div key={item.id} className="glass-modern rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                  {item.category}
                </span>
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {bookmarks.includes(item.id) ? '⭐' : '☆'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Indonesia</p>
                  <p className="text-lg font-bold">{item.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">English</p>
                  <p className="text-lg font-bold text-blue-300">{item.en}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">العربية</p>
                  <p className="text-xl font-bold text-right text-purple-300" dir="rtl">{item.ar}</p>
                  <p className="text-xs text-gray-500">({item.pronunciation})</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => playAudio(item.id, 'id')} className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all"> ID</button>
                <button onClick={() => playAudio(item.en, 'en')} className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all">🔊 EN</button>
                <button onClick={() => playAudio(item.ar, 'ar')} className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all">🔊 AR</button>
                <button onClick={() => copyToClipboard(`${item.id} | ${item.en} | ${item.ar}`, item.id)} className="px-3 py-2 rounded-full glass-modern text-xs hover:bg-white/10 transition-all">
                  {copiedId === item.id ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl">Tidak ada kata yang ditemukan</p>
          <p className="text-sm mt-2">Coba kata kunci atau kategori lain</p>
        </div>
      )}
    </div>
  );
}