'use client';
import { useState, useEffect } from 'react';
import { dictionaryData, dictionaryCategories } from '../data/dictionary';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarks, setBookmarks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('dictionary_bookmarks');
    if (s) setBookmarks(JSON.parse(s));
  }, []);

  const toggleBookmark = (id) => {
    const n = bookmarks.includes(id) ? bookmarks.filter(x => x !== id) : [...bookmarks, id];
    setBookmarks(n);
    localStorage.setItem('dictionary_bookmarks', JSON.stringify(n));
  };

  const copy = (t, id) => {
    navigator.clipboard.writeText(t);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const playAudio = (t, l) => {
    if (!t || t.trim() === '') return;
    window.speechSynthesis.cancel();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = l === 'ar' ? 'ar-SA' : l === 'en' ? 'en-US' : 'id-ID';
      u.rate = .8;
      window.speechSynthesis.speak(u);
    } else {
      new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${l}&q=${encodeURIComponent(t)}`).play().catch(e => console.error(e));
    }
  };

  // ✅ PERBAIKAN 1: Filter duplikasi berdasarkan ID ANGKA (bukan id_lang)
  const fd = dictionaryData
    .filter((item, index, self) => {
      return index === self.findIndex(t => t.id === item.id);
    })
    .filter(i => {
      const kategoriCocok = selectedCategory === 'all' || i.category === selectedCategory;
      if (!searchTerm.trim()) return kategoriCocok;
      const kunci = searchTerm.trim().toLowerCase();
      // ✅ PERBAIKAN 2: Gunakan id_lang (bukan id) untuk pencarian
      const cocok =
        i.id_lang.toLowerCase().includes(kunci) ||
        i.en.toLowerCase().includes(kunci) ||
        i.ar.includes(kunci);
      return kategoriCocok && cocok;
    });

  const CI = {
    'Makanan & Minuman': '🍽️', 'Keluarga': '👨‍👩‍', 'Pekerjaan': '💼', 'Angka': '🔢', 'Warna': '🎨',
    'Binatang': '🦁', 'Tempat': '', 'Waktu': '', 'Cuaca': '🌤️', 'Perasaan': '😊',
    'Tubuh Manusia': '👤', 'Kata Kerja': '⚡', 'Kata Sifat': '🎯',
    'Buah-buahan': '🍎', 'Sayur-sayuran': '🥬', 'Benda Sekolah': '',
    'Anggota Tubuh': '', 'Waktu & Hari': '📅', 'Angka & Bilangan': '🔢',
    'Sifat & Perasaan': '', 'Hewan': '', 'Peralatan Rumah': '',
    'Pakaian': '', 'Transportasi': '🚗', 'Kata Tanya': '❓',
    'Alat & Benda': '🔧'
  };

  return (
    <div className="animate-fade-in px-0 md:px-0 py-2">
      <div className="text-center mb-5 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Kamus 3 Bahasa</h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">ID • EN • AR</p>
        <div className="flex justify-center gap-1 mt-2 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{dictionaryData.length} kata</span>
        </div>
      </div>

      <div className="glass-modern rounded-2xl p-3 md:p-5 mb-5">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="🔍 Cari..."
              className="w-full pl-3 pr-3 py-2 text-xs md:text-sm rounded-full glass-modern bg-white/5 outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs md:text-sm rounded-full glass-modern bg-white/5 text-white"
          >
            <option className="bg-slate-800" value="all">📂 Semua</option>
            {dictionaryCategories.map(c => <option key={c.id} className="bg-slate-800" value={c.id}>{CI[c.id] || '📂'} {c.name}</option>)}
          </select>
          <div className="flex gap-1 justify-center">
            <button onClick={() => setViewMode('grid')} className={`flex-1 md:flex-none px-3 py-2 text-xs rounded-full ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'glass-modern'}`}>⊞</button>
            <button onClick={() => setViewMode('list')} className={`flex-1 md:flex-none px-3 py-2 text-xs rounded-full ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'glass-modern'}`}>☰</button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Hasil: <b className="text-purple-300">{fd.length}</b></p>
      </div>

      {viewMode === 'grid'
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {fd.map((it, k) => (
            <div key={it.id} className="glass-modern rounded-2xl p-4 hover-lift">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{CI[it.category] || '📂'} {it.category}</span>
                <button onClick={() => toggleBookmark(it.id)}>{bookmarks.includes(it.id) ? '⭐' : '☆'}</button>
              </div>
              {/* ✅ PERBAIKAN 3: Gunakan id_lang untuk menampilkan kata Indonesia */}
              <div className="space-y-1.5">
                <p className="text-xs text-gray-400">🇮🇩</p>
                <p className="text-lg md:text-xl font-bold">{it.id_lang}</p>
              </div>
              <div className="space-y-1.5 mt-1">
                <p className="text-xs text-gray-400">🇧</p>
                <p className="text-base md:text-lg text-blue-300">{it.en}</p>
              </div>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-gray-400">🇸🇦</p>
                <p className="text-xl md:text-2xl text-right text-purple-300" dir="rtl">{it.ar}</p>
                {it.pronunciation && <p className="text-[10px] text-gray-500 text-center">({it.pronunciation})</p>}
              </div>
              {(it.example_id || it.example_en || it.example_ar) && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs">
                  <p className="text-gray-400 mb-2">Contoh:</p>
                  {it.example_id && (
                    <div className="flex items-start gap-1.5 mb-1">
                      <button onClick={() => playAudio(it.example_id, 'id')} className="shrink-0 px-1.5 py-0.5 rounded-full glass-modern btn-press text-[10px]">🔊</button>
                      <span className="text-gray-200">• {it.example_id}</span>
                    </div>
                  )}
                  {it.example_en && (
                    <div className="flex items-start gap-1.5 mb-1">
                      <button onClick={() => playAudio(it.example_en, 'en')} className="shrink-0 px-1.5 py-0.5 rounded-full glass-modern btn-press text-[10px]">🔊</button>
                      <span className="text-blue-200">• {it.example_en}</span>
                    </div>
                  )}
                  {it.example_ar && (
                    <div className="flex items-start gap-1.5 justify-end">
                      <span className="text-purple-200 text-right" dir="rtl">• {it.example_ar}</span>
                      <button onClick={() => playAudio(it.example_ar, 'ar')} className="shrink-0 px-1.5 py-0.5 rounded-full glass-modern btn-press text-[10px]">🔊</button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-1 mt-3 flex-wrap">
                {/* ✅ PERBAIKAN 4: Gunakan id_lang untuk audio & copy */}
                <button onClick={() => playAudio(it.id_lang, 'id')} className="px-2 py-1 text-[10px] rounded-full glass-modern btn-press">🔊 ID</button>
                <button onClick={() => playAudio(it.en, 'en')} className="px-2 py-1 text-[10px] rounded-full glass-modern btn-press">🔊 EN</button>
                <button onClick={() => playAudio(it.ar, 'ar')} className="px-2 py-1 text-[10px] rounded-full glass-modern btn-press">🔊 AR</button>
                <button onClick={() => copy(`${it.id_lang} | ${it.en} | ${it.ar}`, it.id)} className="px-2 py-1 text-[10px] rounded-full glass-modern btn-press">
                  {copiedId === it.id ? '✓' : '📋'}
                </button>
              </div>
            </div>
          ))}
        </div>
        : <div className="space-y-2">
          {fd.map(it => (
            <div key={it.id} className="glass-modern rounded-xl p-3 md:p-4 hover-lift">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-gray-400">ID</p>
                  <p className="font-bold">{it.id_lang}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">EN</p>
                  <p className="text-blue-300">{it.en}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">AR</p>
                  <p className="text-lg text-right text-purple-300" dir="rtl">{it.ar}</p>
                </div>
              </div>
              {(it.example_id || it.example_en || it.example_ar) && (
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-gray-300 space-y-1">
                  {it.example_id && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => playAudio(it.example_id, 'id')} className="px-1 py-0.5 rounded-full glass-modern btn-press">🔊</button>
                      <span>• {it.example_id}</span>
                    </div>
                  )}
                  {it.example_en && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => playAudio(it.example_en, 'en')} className="px-1 py-0.5 rounded-full glass-modern btn-press">🔊</button>
                      <span>• {it.example_en}</span>
                    </div>
                  )}
                  {it.example_ar && (
                    <div className="flex items-center gap-1.5 justify-end">
                      <span dir="rtl">• {it.example_ar}</span>
                      <button onClick={() => playAudio(it.example_ar, 'ar')} className="px-1 py-0.5 rounded-full glass-modern btn-press"></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      }
      {!fd.length && <div className="text-center py-16 text-gray-400 text-sm">Tidak ditemukan</div>}
      <style>{`
        .animate-fade-in{animation:f .4s ease-out}
        @keyframes f{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .glass-modern{background:rgba(255,255,255,.05);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1)}
        .hover-lift:hover{transform:translateY(-2px);transition:.25s}
        .btn-press:active{transform:scale(.96)}
      `}</style>
    </div>
  );
}
