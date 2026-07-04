'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LingoSpacePro() {
  // --- State Management ---
  const [mounted, setMounted] = useState(false);
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
  
  // Stats State
  const [stats, setStats] = useState({
    totalWords: 0,
    mastered: 0,
    learning: 0,
    newWords: 0,
    accuracy: 0,
    bookmarks: 0
  });

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

  // Lessons & Roadmap State
  const [englishLessons, setEnglishLessons] = useState([]);
  const [nahwuLessons, setNahwuLessons] = useState([]);
  const [roadmapData, setRoadmapData] = useState([]);
  const [roadmapLang, setRoadmapLang] = useState('English');
  const [expandedLevel, setExpandedLevel] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Load Data From APIs ---
  useEffect(() => {
    if (!mounted) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const vocabRes = await fetch('/api/vocabulary');
        const vocabData = await vocabRes.json();
        setAllData(vocabData || []);
        setFilteredData(vocabData || []);
      } catch (error) {
        console.error('Error loading vocabulary:', error);
      }
      
      try {
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
      
      try {
        const englishRes = await fetch('/api/english-lessons');
        if (englishRes.ok) {
          const englishData = await englishRes.json();
          setEnglishLessons(englishData || []);
        }
      } catch (error) {
        console.error('Error loading english lessons:', error);
      }
      
      try {
        const nahwuRes = await fetch('/api/nahwu-lessons');
        if (nahwuRes.ok) {
          const nahwuData = await nahwuRes.json();
          setNahwuLessons(nahwuData || []);
        }
      } catch (error) {
        console.error('Error loading nahwu lessons:', error);
      }
      
      try {
        const roadmapRes = await fetch('/api/roadmap');
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          setRoadmapData(roadmapData || []);
        }
      } catch (error) {
        console.error('Error loading roadmap:', error);
      }
      setLoading(false);
    };

    loadData();
    loadBookmarks();
  }, [mounted]);

  // --- Filter Logic ---
  useEffect(() => {
    if (!mounted || allData.length === 0) return;
    
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
  }, [categoryFilter, searchInput, allData, mounted]);

  // --- SRS Stats calculation ---
  useEffect(() => {
    if (!mounted || allData.length === 0) return;
    
    try {
      const srsData = JSON.parse(localStorage.getItem('lingospace_srs') || '{}');
      let mastered = 0, learning = 0;
      let totalCorrect = 0, totalWrong = 0;

      Object.values(srsData).forEach(srs => {
        const lvl = srs.level || 0;
        if (lvl >= 4) mastered++;
        else if (lvl > 0) learning++;
        
        totalCorrect += (srs.correct || 0);
        totalWrong += (srs.wrong || 0);
      });

      const newWords = allData.length - (mastered + learning);
      const accuracy = (totalCorrect + totalWrong) > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
        : 0;

      setStats({
        totalWords: allData.length,
        mastered,
        learning,
        newWords: newWords < 0 ? 0 : newWords,
        accuracy,
        bookmarks: bookmarks.length
      });
    } catch (e) {
      console.error(e);
    }
  }, [allData, bookmarks, mounted]);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem('lingospace_bookmarks');
      if (saved) setBookmarks(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleBookmark = (wordId) => {
    let newBookmarks = bookmarks.includes(wordId)
      ? bookmarks.filter(id => id !== wordId)
      : [...bookmarks, wordId];
    setBookmarks(newBookmarks);
    localStorage.setItem('lingospace_bookmarks', JSON.stringify(newBookmarks));
  };

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

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const rateCard = (isCorrect) => {
    if (filteredData.length === 0) return;
    const item = filteredData[currentIndex];

    try {
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
    } catch (e) {
      console.error(e);
    }

    nextCard();
  };

  const playAudio = (text, lang) => {
    if (!text || text === '-') return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startQuiz = () => {
    if (filteredData.length < 4) {
      alert('Minimal butuh 4 kosakata untuk memulai kuis.');
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
        options
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

    if (quizData[quizIndex].options[selectedIndex].correct) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
    }, 1800);
  };

  const startListen = () => {
    if (filteredData.length < 4) return;
    const shuffled = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, 4);
    setListenData(shuffled);
    setListenIndex(Math.floor(Math.random() * 4));
    setListenAnswered(false);
  };

  // --- Sub-views (SVG Inline Components) ---
  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { 
            label: 'Total Kosakata', 
            val: stats.totalWords, 
            icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, 
            bg: 'from-blue-500/10 to-indigo-500/5', 
            border: 'border-blue-500/20' 
          },
          { 
            label: 'Dikuasai (Mastered)', 
            val: stats.mastered, 
            icon: <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, 
            bg: 'from-emerald-500/10 to-teal-500/5', 
            border: 'border-emerald-500/20' 
          },
          { 
            label: 'Sedang Dipelajari', 
            val: stats.learning, 
            icon: <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, 
            bg: 'from-amber-500/10 to-orange-500/5', 
            border: 'border-amber-500/20' 
          },
          { 
            label: 'Rata-rata Akurasi', 
            val: `${stats.accuracy}%`, 
            icon: <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, 
            bg: 'from-purple-500/10 to-pink-500/5', 
            border: 'border-purple-500/20' 
          }
        ].map((c, i) => (
          <div key={i} className={`relative bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">{c.label}</span>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-white/5">{c.icon}</div>
            </div>
            <div className="text-3xl font-black tracking-tight text-white">{c.val}</div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          <h3 className="text-base font-bold tracking-wide">Analisis Progres Memori (SRS)</h3>
        </div>
        <div className="space-y-5">
          {[
            { name: 'Dikuasai (Retensi Tinggi)', current: stats.mastered, color: 'from-emerald-400 to-teal-500' },
            { name: 'Dipelajari (Interval Pendek)', current: stats.learning, color: 'from-amber-400 to-orange-500' },
            { name: 'Kosakata Baru', current: stats.newWords, color: 'from-blue-400 to-purple-500' }
          ].map((item, idx) => {
            const percentage = stats.totalWords > 0 ? Math.round((item.current / stats.totalWords) * 100) : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-slate-400 font-mono">{item.current} kata ({percentage}%)</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Pencapaian */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
          <h3 className="text-base font-bold tracking-wide">Pencapaian Pengguna</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🌱', title: 'Pemula', desc: 'Mulai belajar', active: stats.totalWords >= 1 },
            { icon: '📚', title: 'Cendekia', desc: '5+ Kata Mastered', active: stats.mastered >= 5 },
            { icon: '🎯', title: 'Spesialis', desc: 'Akurasi > 80%', active: stats.accuracy >= 80 },
            { icon: '⭐', title: 'Kolektor', desc: '5+ Bookmark', active: stats.bookmarks >= 5 }
          ].map((ach, idx) => (
            <div key={idx} className={`p-4 rounded-xl border text-center transition-all duration-300 ${ach.active ? 'bg-gradient-to-b from-slate-800/60 to-slate-900/60 border-amber-500/30' : 'bg-slate-900/20 border-slate-800/40 opacity-30'}`}>
              <div className="text-3xl mb-2 filter drop-shadow">{ach.icon}</div>
              <div className="font-bold text-sm text-white">{ach.title}</div>
              <div className="text-xxs text-slate-400 mt-0.5">{ach.desc}</div>
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
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-slate-900/20 p-3 rounded-xl border border-slate-800/60">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Materi {currentIndex + 1} dari {filteredData.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={prevCard} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition">◀ Prev</button>
            <button onClick={nextCard} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition">Next ▶</button>
          </div>
        </div>

        <div className="perspective-1000 w-full h-80 relative cursor-pointer" onClick={flipCard}>
          <div className={`w-full h-full duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front Card */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl">
              <span className="text-xxs tracking-widest text-purple-400 font-bold uppercase mb-4">Bahasa Indonesia</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white text-center">{item.id_lang || '-'}</h2>
              <p className="text-xs text-slate-500 mt-6 animate-pulse">Klik kartu untuk melihat jawaban</p>
            </div>
            {/* Back Card */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl rotate-y-180">
              <div className="text-center w-full space-y-4">
                <div>
                  <span className="text-xxs tracking-wider text-slate-400 uppercase">English Translation</span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{item.en || '-'}</h3>
                </div>
                <div className="w-12 h-[1px] bg-slate-800 mx-auto" />
                <div>
                  <span className="text-xxs tracking-wider text-slate-400 uppercase">العربية (Arabic)</span>
                  <h3 className="text-3xl font-bold text-amber-200 font-arabic mt-1" dir="rtl">{item.ar || '-'}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={(e) => { e.stopPropagation(); playAudio(item.en, 'en'); }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg> 
            English Audio
          </button>
          <button onClick={(e) => { e.stopPropagation(); playAudio(item.ar, 'ar'); }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg> 
            Arabic Audio
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition">
            <svg className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> 
            {isBookmarked ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>

        <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">Bagaimana tingkat kesulitan kosa kata ini bagi Anda?</span>
          <div className="flex gap-2">
            <button onClick={() => rateCard(false)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition">Sulit (Ulang)</button>
            <button onClick={() => rateCard(true)} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition">Mudah (Lanjut)</button>
          </div>
        </div>

        {(item.ex_en || item.ex_ar) && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <span className="text-xxs text-purple-400 uppercase font-black tracking-widest">Contoh Penggunaan Kalimat</span>
            <div className="space-y-2">
              <p className="text-base text-slate-200 italic">"{item.ex_en}"</p>
              <p className="text-2xl text-amber-100/90 font-arabic text-right leading-relaxed" dir="rtl">{item.ex_ar}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (quizData.length === 0) {
      return (
        <div className="max-w-md mx-auto text-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
          <svg className="w-12 h-12 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-xl font-bold mb-2">Quiz Evaluasi</h2>
          <p className="text-slate-400 text-xs mb-6">Uji pemahaman memori Anda dari 10 soal acak kategori aktif.</p>
          <button onClick={startQuiz} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-sm rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-500/20">
            Mulai Sesi Kuis
          </button>
        </div>
      );
    }

    if (quizIndex >= quizData.length) {
      const percentage = Math.round((quizScore / quizData.length) * 100);
      return (
        <div className="max-w-md mx-auto text-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
          <svg className="w-14 h-14 text-amber-400 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <h2 className="text-2xl font-black tracking-tight text-white">Kuis Selesai!</h2>
          <p className="text-slate-400 text-xs mt-1 mb-4">Hasil rekaman akurasi kuis Anda</p>
          <div className="text-4xl font-extrabold text-purple-400 font-mono mb-2">{percentage}%</div>
          <p className="text-sm text-slate-300 mb-6">Benar {quizScore} dari {quizData.length} Pertanyaan</p>
          <button onClick={startQuiz} className="w-full py-2.5 bg-slate-800 border border-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-700 transition">
            🔄 Ulangi Latihan
          </button>
        </div>
      );
    }

    const currentQuizItem = quizData[quizIndex];

    return (
      <div className="max-w-xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-6">
          <span>PROGRES: {quizIndex + 1} / {quizData.length}</span>
          <span>SKOR: <span className="text-emerald-400 font-bold">{quizScore}</span></span>
        </div>

        <div className="text-center mb-8">
          <span className="text-xxs uppercase tracking-widest text-purple-400 font-bold">Terjemahkan Kosa Kata Berikut</span>
          <h2 className="text-3xl font-black mt-2 text-white">{currentQuizItem.question}</h2>
          {currentQuizItem.questionAr && (
            <p className="text-2xl text-amber-200 mt-2 font-arabic" dir="rtl">{currentQuizItem.questionAr}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuizItem.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => answerQuiz(idx)}
              disabled={quizAnswered}
              className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                quizAnswered && option.correct 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                  : quizAnswered && !option.correct 
                  ? 'bg-slate-900/20 border-slate-800 text-slate-500 opacity-60' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <span className="font-mono text-xs text-purple-400 mr-2">{String.fromCharCode(65 + idx)}.</span> {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderListen = () => {
    if (listenData.length === 0) {
      return (
        <div className="max-w-md mx-auto text-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl">
          <svg className="w-12 h-12 text-pink-400 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          <h2 className="text-xl font-bold mb-2">Listen & Learn</h2>
          <p className="text-slate-400 text-xs mb-6">Latih kepekaan mendengarkan pelafalan bahasa asing native audio.</p>
          <button onClick={startListen} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-sm rounded-xl hover:opacity-90 transition">
            Mulai Audio Pemelajaran
          </button>
        </div>
      );
    }

    const item = listenData[listenIndex];

    return (
      <div className="max-w-md mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <span className="text-xxs uppercase tracking-widest text-slate-400 font-bold block mb-6">Klik Tombol Speaker Untuk Memutar</span>
        
        <button 
          onClick={() => playAudio(listenLang === 'en' ? item.en : item.ar, listenLang)} 
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-3xl flex items-center justify-center mx-auto hover:scale-105 transition shadow-xl shadow-purple-600/20 mb-6"
        >
          🔊
        </button>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 max-w-xs mx-auto mb-8">
          <button onClick={() => setListenLang('en')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${listenLang === 'en' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>English</button>
          <button onClick={() => setListenLang('ar')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${listenLang === 'ar' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>العربية</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {listenData.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setListenAnswered(true); setTimeout(() => { setListenAnswered(false); startListen(); }, 1500); }}
              className={`p-3 text-xs font-medium border rounded-xl transition ${listenAnswered && i === listenIndex ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900/40 border-slate-800'}`}
            >
              {opt.id_lang}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBookmarks = () => {
    const bookmarkedData = allData.filter(item => bookmarks.includes(item.id));

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold">⭐ Kosakata Favorit Anda</h2>
          <p className="text-xs text-slate-400 mt-0.5">Daftar kata terenkripsi lokal yang Anda simpan untuk ulasan intensif.</p>
        </div>

        {bookmarkedData.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            <p className="text-sm text-slate-400">Belum ada koleksi tersimpan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedData.map((item) => (
              <div key={item.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xxs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 uppercase tracking-wider font-bold">{item.category}</span>
                    <button onClick={() => toggleBookmark(item.id)} className="text-yellow-400 text-sm">⭐</button>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.en}</h3>
                  <p className="text-2xl text-amber-200 text-right font-arabic my-2" dir="rtl">{item.ar}</p>
                  <p className="text-xs text-slate-400 italic">"{item.id_lang}"</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 border-t border-slate-800/60 pt-3">
                  <button onClick={() => playAudio(item.en, 'en')} className="py-1.5 text-xxs font-bold bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition">🔊 EN</button>
                  <button onClick={() => playAudio(item.ar, 'ar')} className="py-1.5 text-xxs font-bold bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition">🔊 AR</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRoadmap = () => {
    const filteredRoadmap = roadmapData.filter(item => item.language === roadmapLang);
    const getLessonsForLevel = (level) => roadmapLang === 'Arabic' ? nahwuLessons.filter(l => l.level === level) : englishLessons.filter(l => l.level === level);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight">🗺️ Kurikulum & Roadmap</h2>
          <p className="text-xs text-slate-400">Jalur pemelajaran berjenjang standar kompetensi CEFR.</p>
        </div>

        <div className="flex justify-center bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto">
          <button onClick={() => { setRoadmapLang('English'); setExpandedLevel(null); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${roadmapLang === 'English' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>English Route</button>
          <button onClick={() => { setRoadmapLang('Arabic'); setExpandedLevel(null); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${roadmapLang === 'Arabic' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Arabic Route</button>
        </div>

        <div className="space-y-4">
          {filteredRoadmap.map((level, idx) => {
            const lessons = getLessonsForLevel(level.level);
            const isExpanded = expandedLevel === level.id;

            return (
              <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 transition hover:border-slate-700 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${lessons.length > 0 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                    {lessons.length > 0 ? '✓' : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">Level {level.level}: {level.title}</h3>
                      <span className="text-xxs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{level.category}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{level.description}</p>
                    
                    {lessons.length > 0 ? (
                      <button 
                        onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                        className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        {isExpanded ? 'Sembunyikan Modul ▲' : 'Buka Modul Kelas ▼'}
                      </button>
                    ) : (
                      <span className="mt-4 inline-block text-xxs text-slate-500 font-medium">Modul kurikulum terkunci otomatis oleh sistem</span>
                    )}
                  </div>
                </div>

                {isExpanded && lessons.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 animate-fade-in">
                    {lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex justify-between items-center gap-4">
                        <div>
                          <h5 className="text-xs font-bold text-white">{lesson.title}</h5>
                          <p className="text-xxs text-slate-400 mt-0.5">{lesson.description || 'Pelatihan tatah bahasa dan struktur teks'}</p>
                        </div>
                        <button onClick={() => playAudio(lesson.title, roadmapLang === 'Arabic' ? 'ar' : 'en')} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition">🔊 Play</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Main View Wrapper ---
  return (
    <div className="min-h-screen bg-[#0b0f19] bg-radial-gradient text-slate-100 font-sans antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-[#0b0f19]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => switchMode('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="font-black text-sm tracking-widest bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">LINGOSPACE PRO</span>
          </div>
          
          <nav className="flex items-center gap-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg> },
              { id: 'flashcard', name: 'Flashcard', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
              { id: 'quiz', name: 'Quiz', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { id: 'roadmap', name: 'Roadmap', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchMode(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  currentMode === tab.id 
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
            
            <Link href="/blog" className="ml-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:opacity-90 transition">
              📰 Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {['flashcard', 'bookmarks'].includes(currentMode) && (
          <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between backdrop-blur-md">
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Cari kata (EN, AR, ID)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-purple-500 text-white placeholder-slate-600"
              />
            </div>
            
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button 
                onClick={() => setCategoryFilter('all')} 
                className={`px-3 py-1.5 rounded-lg text-xxs font-bold uppercase tracking-wider transition whitespace-nowrap ${categoryFilter === 'all' ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' : 'bg-slate-950 text-slate-400 border border-transparent'}`}
              >
                All
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xxs font-bold uppercase tracking-wider transition whitespace-nowrap ${categoryFilter === cat ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' : 'bg-slate-950 text-slate-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="min-h-[26rem]">
          {currentMode === 'dashboard' && renderDashboard()}
          {currentMode === 'flashcard' && renderFlashcard()}
          {currentMode === 'quiz' && renderQuiz()}
          {currentMode === 'listen' && renderListen()}
          {currentMode === 'bookmarks' && renderBookmarks()}
          {currentMode === 'roadmap' && renderRoadmap()}
        </div>
      </main>

      <footer className="border-t border-slate-900/60 bg-slate-950/40 py-8 backdrop-blur-md mt-16 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 LingoSpace Pro Dashboard. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
