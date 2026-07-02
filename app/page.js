'use client';

import { useState, useEffect } from 'react';

export default function LingoSpacePro() {
  // State Management
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [quizData, setQuizData] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  
  // Listen State
  const [listenLang, setListenLang] = useState('en');
  const [listenData, setListenData] = useState([]);
  const [listenIndex, setListenIndex] = useState(0);
  const [listenAnswered, setListenAnswered] = useState(false);

  // Load Data dari API
  useEffect(() => {
    loadData();
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      filterData();
    }
  }, [categoryFilter, searchInput, allData]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vocabRes, categoriesRes] = await Promise.all([
        fetch('/api/vocabulary'),
        fetch('/api/categories')
      ]);
      
      const vocabData = await vocabRes.json();
      const categoriesData = await categoriesRes.json();
      
      setAllData(vocabData);
      setFilteredData(vocabData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data: ' + error.message);
    }
    setLoading(false);
  };

  const filterData = () => {
    let filtered = [...allData];
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (searchInput.trim()) {
      const search = searchInput.toLowerCase();
      filtered = filtered.filter(item => 
        (item.en && item.en.toLowerCase().includes(search)) ||
        (item.ar && item.ar.includes(search)) ||
        (item.id_lang && item.id_lang.toLowerCase().includes(search))
      );
    }
    
    setFilteredData(filtered);
    setCurrentIndex(0);
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem('lingospace_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Flashcard Functions
  const flipCard = () => setIsFlipped(!isFlipped);
  
  const nextCard = () => {
    if (filteredData.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
    setIsFlipped(false);
  };
  
  const prevCard = () => {
    if (filteredData.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
    setIsFlipped(false);
  };

  const toggleBookmark = (wordId) => {
    let newBookmarks;
    if (bookmarks.includes(wordId)) {
      newBookmarks = bookmarks.filter(id => id !== wordId);
    } else {
      newBookmarks = [...bookmarks, wordId];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('lingospace_bookmarks', JSON.stringify(newBookmarks));
  };

  const rateCard = async (isCorrect) => {
    if (filteredData.length === 0) return;
    const item = filteredData[currentIndex];
    
    // Update SRS di LocalStorage
    const srsData = JSON.parse(localStorage.getItem('lingospace_srs') || '{}');
    const current = srsData[item.id] || { level: 0, correct: 0, wrong: 0 };
    
    if (isCorrect) {
      current.level = Math.min(current.level + 1, 5);
      current.correct = (current.correct || 0) + 1;
    } else {
      current.level = 0;
      current.wrong = (current.wrong || 0) + 1;
    }
    
    srsData[item.id] = current;
    localStorage.setItem('lingospace_srs', JSON.stringify(srsData));
    
    // Sync ke API (background)
    try {
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: item.id, isCorrect })
      });
    } catch (error) {
      console.error('Error updating SRS:', error);
    }
    
    nextCard();
  };

  // Quiz Functions
  const startQuiz = () => {
    if (filteredData.length < 4) {
      alert('Minimal 4 kosakata diperlukan untuk kuis');
      return;
    }
    
    const shuffled = [...filteredData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    
    const quiz = selected.map(item => {
      const others = filteredData.filter(v => v.id !== item.id);
      const wrongOptions = others.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [
        { text: item.id_lang, correct: true },
        ...wrongOptions.map(w => ({ text: w.id_lang, correct: false }))
      ].sort(() => 0.5 - Math.random());
      
      return {
        wordId: item.id,
        question: item.en,
        questionAr: item.ar,
        options: options
      };
    });
    
    setQuizData(quiz);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
  };

  const answerQuiz = (selectedIndex) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    
    const q = quizData[quizIndex];
    const isCorrect = q.options[selectedIndex].correct;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (quizIndex < quizData.length - 1) {
        setQuizIndex(prev => prev + 1);
        setQuizAnswered(false);
      }
    }, 2000);
  };

  // Listen Functions
  const startListen = () => {
    if (filteredData.length < 4) {
      alert('Minimal 4 kosakata diperlukan');
      return;
    }
    
    const shuffled = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, 4);
    setListenData(shuffled);
    setListenIndex(Math.floor(Math.random() * 4));
    setListenAnswered(false);
  };

  const answerListen = (selectedIndex) => {
    if (listenAnswered) return;
    setListenAnswered(true);
    
    setTimeout(() => {
      setListenIndex(Math.floor(Math.random() * 4));
      setListenAnswered(false);
    }, 2500);
  };

  // Audio Functions
  const playAudio = (text, lang) => {
    if (!text || text === '-') return;
    
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.play().catch(() => {
      // Fallback ke Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';
      window.speechSynthesis.speak(utterance);
    });
  };

  // Stats Calculation
  const getStats = () => {
    const srsData = JSON.parse(localStorage.getItem('lingospace_srs') || '{}');
    let mastered = 0, learning = 0, newWords = 0;
    let totalCorrect = 0, totalWrong = 0;
    
    Object.values(srsData).forEach(srs => {
      const level = srs.level || 0;
      if (level >= 4) mastered++;
      else if (level > 0) learning++;
      else newWords++;
      totalCorrect += (srs.correct || 0);
      totalWrong += (srs.wrong || 0);
    });
    
    if (mastered === 0 && learning === 0) newWords = allData.length;
    
    const accuracy = (totalCorrect + totalWrong) > 0 
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) 
      : 0;
    
    return { totalWords: allData.length, mastered, learning, newWords, accuracy, bookmarks: bookmarks.length };
  };

  const stats = getStats();

  // Render Functions
  const renderDashboard = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-2xl p-6 hover:scale-105 transition">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-3xl font-bold">{stats.totalWords}</div>
          <div className="text-sm text-gray-400">Total Kosakata</div>
        </div>
        <div className="glass rounded-2xl p-6 hover:scale-105 transition">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-400">{stats.mastered}</div>
          <div className="text-sm text-gray-400">Dikuasai</div>
        </div>
        <div className="glass rounded-2xl p-6 hover:scale-105 transition">
          <div className="text-3xl mb-2">📖</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.learning}</div>
          <div className="text-sm text-gray-400">Sedang Dipelajari</div>
        </div>
        <div className="glass rounded-2xl p-6 hover:scale-105 transition">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-purple-400">{stats.accuracy}%</div>
          <div className="text-sm text-gray-400">Akurasi</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📈 Progress Belajar</h3>
        <div className="space-y-4">
          {['Dikuasai', 'Dipelajari', 'Baru'].map((label, idx) => {
            const values = [stats.mastered, stats.learning, stats.newWords];
            const total = stats.totalWords || 1;
            const pct = Math.round((values[idx] / total) * 100);
            const colors = ['from-green-400 to-emerald-500', 'from-yellow-400 to-orange-500', 'from-blue-400 to-purple-500'];
            
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${colors[idx]} transition-all`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🏆 Pencapaian</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🌱', name: 'Pemula', req: stats.totalWords >= 1 },
            { icon: '📚', name: 'Rajin', req: stats.mastered >= 5 },
            { icon: '🎯', name: 'Tepat', req: stats.accuracy >= 80 },
            { icon: '⭐', name: 'Kolektor', req: stats.bookmarks >= 5 }
          ].map((ach, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${ach.req ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' : 'glass opacity-40'}`}>
              <div className="text-3xl mb-2">{ach.icon}</div>
              <div className="font-semibold text-sm">{ach.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFlashcard = () => {
    const item = filteredData[currentIndex] || {};
    const isBookmarked = bookmarks.includes(item.id);
    
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">🎴 Flashcard Mode</h2>
            <p className="text-gray-400 text-sm">Klik kartu untuk membalik</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevCard} className="p-3 rounded-full glass hover:scale-110 transition">←</button>
            <span className="text-sm font-semibold">{currentIndex + 1} / {filteredData.length}</span>
            <button onClick={nextCard} className="p-3 rounded-full glass hover:scale-110 transition">→</button>
          </div>
        </div>

        <div className="card-container perspective-1000 w-full max-w-2xl mx-auto h-96 cursor-pointer" onClick={flipCard}>
          <div className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-widest mb-4 opacity-80">Bahasa Indonesia</p>
              <h2 className="text-4xl md:text-5xl font-bold text-center">{item.id_lang || '-'}</h2>
              <p className="text-sm mt-8 opacity-60">Tap untuk melihat jawaban</p>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl rotate-y-180">
              <div className="text-center w-full">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">English</p>
                <h3 className="text-3xl font-bold mb-4">{item.en || '-'}</h3>
                <div className="border-t border-white/30 my-3"></div>
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">العربية (Arabic)</p>
                <h3 className="text-4xl font-bold text-right" dir="rtl">{item.ar || '-'}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button onClick={() => playAudio(item.en, 'en')} className="speaker-btn px-5 py-3 rounded-full glass hover:scale-105 transition flex items-center gap-2">🔊 English</button>
          <button onClick={() => playAudio(item.ar, 'ar')} className="speaker-btn px-5 py-3 rounded-full glass hover:scale-105 transition flex items-center gap-2">🔊 العربية</button>
          <button onClick={() => toggleBookmark(item.id)} className="px-5 py-3 rounded-full glass hover:scale-105 transition flex items-center gap-2">
            {isBookmarked ? '⭐ Tersimpan' : '☆ Favorit'}
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={() => rateCard(false)} className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 transition">😓 Sulit</button>
          <button onClick={() => rateCard(true)} className="px-6 py-3 rounded-full bg-green-500/20 border border-green-500/50 hover:bg-green-500/40 transition">😊 Mudah</button>
        </div>

        {(item.ex_en || item.ex_ar) && (
          <div className="max-w-2xl mx-auto mt-8 glass rounded-2xl p-6 text-center">
            <p className="text-xs uppercase text-gray-400 mb-3">Contoh Kalimat</p>
            <p className="text-lg mb-2 text-blue-200">{item.ex_en}</p>
            <p className="text-2xl text-pink-200 text-right" dir="rtl">{item.ex_ar}</p>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => playAudio(item.ex_en, 'en')} className="speaker-btn px-4 py-2 rounded-lg glass text-sm hover:scale-105 transition">🔊 EN</button>
              <button onClick={() => playAudio(item.ex_ar, 'ar')} className="speaker-btn px-4 py-2 rounded-lg glass text-sm hover:scale-105 transition">🔊 AR</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (quizData.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Quiz Mode</h2>
            <button onClick={startQuiz} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition">
              🚀 Mulai Kuis
            </button>
          </div>
        </div>
      );
    }

    if (quizIndex >= quizData.length) {
      const pct = Math.round((quizScore / quizData.length) * 100);
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8">
            <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold mb-2">{pct >= 80 ? 'Luar Biasa!' : pct >= 60 ? 'Bagus!' : 'Terus Berlatih!'}</h2>
            <p className="text-gray-400 mb-6">Skor Anda: {quizScore}/{quizData.length} ({pct}%)</p>
            <button onClick={startQuiz} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition">
              🔄 Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    const q = quizData[quizIndex];
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-400">Soal {quizIndex + 1}/{quizData.length}</span>
            <span className="text-sm font-semibold">Skor: <span className="text-green-400">{quizScore}</span></span>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Apa arti dari:</p>
            <h2 className="text-4xl font-bold mb-2">{q.question}</h2>
            {q.questionAr && <p className="text-3xl text-purple-300 mb-4 text-right" dir="rtl">{q.questionAr}</p>}
            <button onClick={() => playAudio(q.question, 'en')} className="speaker-btn px-4 py-2 rounded-full glass text-sm hover:scale-105 transition">🔊 Dengarkan</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerQuiz(i)}
                disabled={quizAnswered}
                className={`p-4 rounded-xl glass hover:scale-105 transition text-left font-medium ${
                  quizAnswered && opt.correct ? 'bg-green-500/40 border-green-500' : ''
                } ${quizAnswered && !opt.correct && i === q.options.findIndex(o => o.correct) ? 'bg-red-500/40 border-red-500' : ''}`}
              >
                {String.fromCharCode(65 + i)}. {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderListen = () => {
    if (listenData.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
            <p className="text-gray-400 text-sm mb-8">Dengarkan dan tebak artinya</p>
            <button onClick={startListen} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition">
              🎧 Mulai
            </button>
          </div>
        </div>
      );
    }

    const item = listenData[listenIndex];
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
          <p className="text-gray-400 text-sm mb-8">Dengarkan dan tebak artinya</p>
          
          <button onClick={() => playAudio(listenLang === 'en' ? item.en : item.ar, listenLang)} className="big-play-btn mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-5xl hover:scale-110 transition shadow-2xl">
            🔊
          </button>
          
          <div className="flex gap-2 mb-6 justify-center">
            <button onClick={() => setListenLang('en')} className={`px-4 py-2 rounded-full glass text-sm transition ${listenLang === 'en' ? 'bg-purple-500/40' : ''}`}>English</button>
            <button onClick={() => setListenLang('ar')} className={`px-4 py-2 rounded-full glass text-sm transition ${listenLang === 'ar' ? 'bg-purple-500/40' : ''}`}>العربية</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {listenData.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerListen(i)}
                disabled={listenAnswered}
                className={`p-4 rounded-xl glass hover:scale-105 transition font-medium ${
                  listenAnswered && i === listenIndex ? 'bg-green-500/40' : ''
                }`}
              >
                {opt.id_lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBookmarks = () => {
    const bookmarkedData = allData.filter(item => bookmarks.includes(item.id));
    
    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">⭐ Kosakata Favorit</h2>
        {bookmarkedData.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">⭐</div>
            <p>Belum ada kosakata favorit</p>
            <p className="text-sm mt-2">Klik tombol ⭐ di mode Flashcard untuk menambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedData.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-6 hover:scale-105 transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{item.category}</span>
                  <button onClick={() => toggleBookmark(item.id)} className="text-yellow-400 hover:scale-110">⭐</button>
                </div>
                <h3 className="text-xl font-bold mb-1">{item.en}</h3>
                <p className="text-2xl text-purple-300 mb-2 text-right" dir="rtl">{item.ar}</p>
                <p className="text-gray-400 text-sm">{item.id_lang}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => playAudio(item.en, 'en')} className="flex-1 py-2 rounded-lg glass text-sm hover:scale-105 transition">🔊 EN</button>
                  <button onClick={() => playAudio(item.ar, 'ar')} className="flex-1 py-2 rounded-lg glass text-sm hover:scale-105 transition">🔊 AR</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Memuat LingoSpace Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Custom CSS for 3D transforms */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">L</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LingoSpace Pro</h1>
              <p className="text-xs text-gray-400">Premium Learning</p>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); alert('Cache dibersihkan!'); }} className="px-3 py-2 rounded-full glass text-xs hover:scale-105 transition">
            🗑️ Cache
          </button>
        </div>
      </nav>

      {/* Mode Buttons */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'flashcard', label: '🎴 Flashcard' },
            { id: 'quiz', label: '🎯 Quiz' },
            { id: 'listen', label: '🎧 Listen' },
            { id: 'bookmarks', label: '⭐ Favorit' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => switchMode(mode.id)}
              className={`px-5 py-2.5 rounded-full glass text-sm font-medium whitespace-nowrap transition hover:scale-105 ${
                currentMode === mode.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      {currentMode !== 'dashboard' && currentMode !== 'bookmarks' && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-full glass text-sm bg-transparent outline-none cursor-pointer text-white"
            >
              <option value="all" className="bg-slate-800">Semua Kategori</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name} className="bg-slate-800">{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="🔍 Cari kosakata..."
              className="px-4 py-2 rounded-full glass text-sm bg-transparent outline-none flex-1 min-w-[200px] text-white placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentMode === 'dashboard' && renderDashboard()}
        {currentMode === 'flashcard' && renderFlashcard()}
        {currentMode === 'quiz' && renderQuiz()}
        {currentMode === 'listen' && renderListen()}
        {currentMode === 'bookmarks' && renderBookmarks()}
      </main>
    </div>
  );
}