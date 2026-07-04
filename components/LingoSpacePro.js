'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LingoSpacePro() {
  // State Management
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
  const [selectedNahwuTopic, setSelectedNahwuTopic] = useState(null);
  const [selectedEnglishTopic, setSelectedEnglishTopic] = useState(null);
  const [roadmapLang, setRoadmapLang] = useState('English');
  const [expandedLevel, setExpandedLevel] = useState(null);

  // Set mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Data
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
        setAllData([]);
        setFilteredData([]);
      }
      
      try {
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
      
      try {
        const englishRes = await fetch('/api/english-lessons');
        if (englishRes.ok) {
          const englishData = await englishRes.json();
          setEnglishLessons(englishData || []);
        } else {
          setEnglishLessons([]);
        }
      } catch (error) {
        console.error('Error loading english lessons:', error);
        setEnglishLessons([]);
      }
      
      try {
        const nahwuRes = await fetch('/api/nahwu-lessons');
        if (nahwuRes.ok) {
          const nahwuData = await nahwuRes.json();
          setNahwuLessons(nahwuData || []);
        } else {
          setNahwuLessons([]);
        }
      } catch (error) {
        console.error('Error loading nahwu lessons:', error);
        setNahwuLessons([]);
      }
      
      try {
        const roadmapRes = await fetch('/api/roadmap');
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          setRoadmapData(roadmapData || []);
        } else {
          setRoadmapData([]);
        }
      } catch (error) {
        console.error('Error loading roadmap:', error);
        setRoadmapData([]);
      }
      
      setLoading(false);
    };

    loadData();
    loadBookmarks();
  }, [mounted]);

  // Filter Data
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

  // Calculate Stats
  useEffect(() => {
    if (!mounted || allData.length === 0) return;
    
    try {
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

      setStats({
        totalWords: allData.length,
        mastered,
        learning,
        newWords,
        accuracy,
        bookmarks: bookmarks.length
      });
    } catch (e) {
      console.error('Error calculating stats:', e);
    }
  }, [allData, bookmarks, mounted]);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem('lingospace_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading bookmarks:', e);
    }
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedNahwuTopic(null);
    setSelectedEnglishTopic(null);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
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

  const toggleBookmark = (wordId) => {
    let newBookmarks;
    if (bookmarks.includes(wordId)) {
      newBookmarks = bookmarks.filter(id => id !== wordId);
    } else {
      newBookmarks = [...bookmarks, wordId];
    }
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem('lingospace_bookmarks', JSON.stringify(newBookmarks));
    } catch (e) {
      console.error('Error saving bookmarks:', e);
    }
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
      console.error('Error saving SRS:', e);
    }

    nextCard();
  };

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
    } else {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      audio.play().catch(e => console.error('Audio error:', e));
    }
  };

  const playArabicAudio = (text) => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.75;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      audio.play().catch(e => console.error('Audio error:', e));
    }
  };

  const playEnglishAudio = (text) => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      audio.play().catch(e => console.error('Audio error:', e));
    }
  };

  // Render Functions
  const renderDashboard = () => {
    const masteredPct = stats.totalWords > 0 ? Math.round((stats.mastered / stats.totalWords) * 100) : 0;
    const learningPct = stats.totalWords > 0 ? Math.round((stats.learning / stats.totalWords) * 100) : 0;
    const newPct = stats.totalWords > 0 ? Math.round((stats.newWords / stats.totalWords) * 100) : 0;

    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: '📚', value: stats.totalWords, label: 'Total Kosakata', color: 'from-blue-500 to-cyan-500' },
            { icon: '✅', value: stats.mastered, label: 'Dikuasai', color: 'from-green-500 to-emerald-500' },
            { icon: '📖', value: stats.learning, label: 'Dipelajari', color: 'from-yellow-500 to-orange-500' },
            { icon: '🎯', value: `${stats.accuracy}%`, label: 'Akurasi', color: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-modern rounded-2xl p-6 hover-lift cursor-pointer group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-modern rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span>📈</span> Progress Belajar
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Dikuasai', value: masteredPct, color: 'from-green-400 to-emerald-500' },
              { label: 'Dipelajari', value: learningPct, color: 'from-yellow-400 to-orange-500' },
              { label: 'Baru', value: newPct, color: 'from-blue-400 to-purple-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} progress-animated rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-modern rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span>🏆</span> Pencapaian
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🌱', name: 'Pemula', req: stats.totalWords >= 1, color: 'from-green-400 to-emerald-500' },
              { icon: '📚', name: 'Rajin', req: stats.mastered >= 5, color: 'from-blue-400 to-cyan-500' },
              { icon: '🎯', name: 'Tepat', req: stats.accuracy >= 80, color: 'from-purple-400 to-pink-500' },
              { icon: '⭐', name: 'Kolektor', req: stats.bookmarks >= 5, color: 'from-yellow-400 to-orange-500' }
            ].map((ach, idx) => (
              <div key={idx} className={`p-5 rounded-xl border transition-all duration-300 hover-lift ${
                ach.req 
                  ? `bg-gradient-to-br ${ach.color}/20 border-white/20 shadow-lg` 
                  : 'glass opacity-40 grayscale'
              }`}>
                <div className="text-4xl mb-2 transform hover:scale-110 transition-transform">{ach.icon}</div>
                <div className="font-semibold text-sm">{ach.name}</div>
                {ach.req && <div className="text-xs text-green-400 mt-1">✓ Unlocked</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
            <button onClick={prevCard} className="p-3 rounded-full glass-modern hover:scale-110 transition-transform btn-press">←</button>
            <span className="text-sm font-semibold">{currentIndex + 1} / {filteredData.length}</span>
            <button onClick={nextCard} className="p-3 rounded-full glass-modern hover:scale-110 transition-transform btn-press">→</button>
          </div>
        </div>

        <div className="perspective-1000 w-full max-w-2xl mx-auto h-96 cursor-pointer" onClick={flipCard}>
          <div className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-widest mb-4 opacity-80">Bahasa Indonesia</p>
              <h2 className="text-4xl md:text-5xl font-bold text-center">{item.id_lang || '-'}</h2>
              <p className="text-sm mt-8 opacity-60">Tap untuk melihat jawaban</p>
            </div>

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
          <button onClick={() => playAudio(item.en, 'en')} className="speaker-btn px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press">🔊 English</button>
          <button onClick={() => playAudio(item.ar, 'ar')} className="speaker-btn px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press">🔊 العربية</button>
          <button onClick={() => toggleBookmark(item.id)} className="px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press">
            {isBookmarked ? '⭐ Tersimpan' : '☆ Favorit'}
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={() => rateCard(false)} className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 transition-colors btn-press">😓 Sulit</button>
          <button onClick={() => rateCard(true)} className="px-6 py-3 rounded-full bg-green-500/20 border border-green-500/50 hover:bg-green-500/40 transition-colors btn-press">😊 Mudah</button>
        </div>

        {(item.ex_en || item.ex_ar) && (
          <div className="max-w-2xl mx-auto mt-8 glass-modern rounded-2xl p-6 text-center">
            <p className="text-xs uppercase text-gray-400 mb-3">Contoh Kalimat</p>
            <p className="text-lg mb-2 text-blue-200">{item.ex_en}</p>
            <p className="text-2xl text-pink-200 text-right" dir="rtl">{item.ex_ar}</p>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => playAudio(item.ex_en, 'en')} className="speaker-btn px-4 py-2 rounded-lg glass-modern text-sm hover:scale-105 transition-transform btn-press">🔊 EN</button>
              <button onClick={() => playAudio(item.ex_ar, 'ar')} className="speaker-btn px-4 py-2 rounded-lg glass-modern text-sm hover:scale-105 transition-transform btn-press">🔊 AR</button>
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
          <div className="glass-modern rounded-2xl p-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Quiz Mode</h2>
            <button onClick={startQuiz} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press">
               Mulai Kuis
            </button>
          </div>
        </div>
      );
    }

    if (quizIndex >= quizData.length) {
      const pct = Math.round((quizScore / quizData.length) * 100);
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-modern rounded-2xl p-8">
            <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold mb-2">{pct >= 80 ? 'Luar Biasa!' : pct >= 60 ? 'Bagus!' : 'Terus Berlatih!'}</h2>
            <p className="text-gray-400 mb-6">Skor Anda: {quizScore}/{quizData.length} ({pct}%)</p>
            <button onClick={startQuiz} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press">
              🔄 Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    const q = quizData[quizIndex];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-modern rounded-2xl p-8 text-center">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-400">Soal {quizIndex + 1}/{quizData.length}</span>
            <span className="text-sm font-semibold">Skor: <span className="text-green-400">{quizScore}</span></span>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Apa arti dari:</p>
            <h2 className="text-4xl font-bold mb-2">{q.question}</h2>
            {q.questionAr && <p className="text-3xl text-purple-300 mb-4 text-right" dir="rtl">{q.questionAr}</p>}
            <button onClick={() => playAudio(q.question, 'en')} className="speaker-btn px-4 py-2 rounded-full glass-modern text-sm hover:scale-105 transition-transform btn-press">🔊 Dengarkan</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerQuiz(i)}
                disabled={quizAnswered}
                className={`p-4 rounded-xl glass-modern hover:scale-105 transition-transform text-left font-medium btn-press ${
                  quizAnswered && opt.correct ? 'bg-green-500/40 border-2 border-green-500' : ''
                } ${quizAnswered && !opt.correct && i === q.options.findIndex(o => o.correct) ? 'bg-red-500/40 border-2 border-red-500' : ''}`}
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
          <div className="glass-modern rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
            <p className="text-gray-400 text-sm mb-8">Dengarkan dan tebak artinya</p>
            <button onClick={startListen} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press">
               Mulai
            </button>
          </div>
        </div>
      );
    }

    const item = listenData[listenIndex];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-modern rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
          <p className="text-gray-400 text-sm mb-8">Dengarkan dan tebak artinya</p>

          <button onClick={() => playAudio(listenLang === 'en' ? item.en : item.ar, listenLang)} className="big-play-btn mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-5xl hover:scale-110 transition-transform shadow-2xl btn-press">
            🔊
          </button>

          <div className="flex gap-2 mb-6 justify-center">
            <button onClick={() => setListenLang('en')} className={`px-4 py-2 rounded-full glass-modern text-sm transition-all btn-press ${listenLang === 'en' ? 'bg-purple-500/40' : ''}`}>English</button>
            <button onClick={() => setListenLang('ar')} className={`px-4 py-2 rounded-full glass-modern text-sm transition-all btn-press ${listenLang === 'ar' ? 'bg-purple-500/40' : ''}`}>العربية</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {listenData.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerListen(i)}
                disabled={listenAnswered}
                className={`p-4 rounded-xl glass-modern hover:scale-105 transition-transform font-medium btn-press ${
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
              <div key={item.id} className="glass-modern rounded-2xl p-6 hover-lift">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{item.category}</span>
                  <button onClick={() => toggleBookmark(item.id)} className="text-yellow-400 hover:scale-110 transition-transform">⭐</button>
                </div>
                <h3 className="text-xl font-bold mb-1">{item.en}</h3>
                <p className="text-2xl text-purple-300 mb-2 text-right" dir="rtl">{item.ar}</p>
                <p className="text-gray-400 text-sm">{item.id_lang}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => playAudio(item.en, 'en')} className="flex-1 py-2 rounded-lg glass-modern text-sm hover:scale-105 transition-transform btn-press">🔊 EN</button>
                  <button onClick={() => playAudio(item.ar, 'ar')} className="flex-1 py-2 rounded-lg glass-modern text-sm hover:scale-105 transition-transform btn-press">🔊 AR</button>
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

    const getLessonsForLevel = (level) => {
      if (roadmapLang === 'Arabic') {
        return nahwuLessons.filter(lesson => lesson.level === level);
      } else {
        return englishLessons.filter(lesson => lesson.level === level);
      }
    };

    const playLessonAudio = (text, lang) => {
      if (!text) return;
      
      window.speechSynthesis.cancel();
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
        const audio = new Audio(url);
        audio.play().catch(e => console.error('Audio error:', e));
      }
    };

    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">🗺️ Roadmap Pembelajaran</h2>
          <p className="text-gray-400">Pilih jalur belajar Anda</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => {
              setRoadmapLang('English');
              setExpandedLevel(null);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all btn-press ${
              roadmapLang === 'English' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'glass-modern hover:scale-105'
            }`}
          >
             Bahasa Inggris
          </button>
          <button 
            onClick={() => {
              setRoadmapLang('Arabic');
              setExpandedLevel(null);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all btn-press ${
              roadmapLang === 'Arabic' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'glass-modern hover:scale-105'
            }`}
          >
            🇸 Bahasa Arab
          </button>
        </div>

        <div className="space-y-4">
          {filteredRoadmap.map((level, idx) => {
            const lessons = getLessonsForLevel(level.level);
            const isExpanded = expandedLevel === level.id;

            return (
              <div key={idx} className="glass-modern rounded-2xl p-6 transition-all hover-lift">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                    lessons.length > 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-600'
                  }`}>
                    {lessons.length > 0 ? '📚' : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Level {level.level}: {level.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{level.category}</span>
                    <p className="text-gray-300 mt-2">{level.description}</p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{lessons.length} materi tersedia</span>
                        <span>{level.requiredWords} kata target</span>
                      </div>
                    </div>

                    {lessons.length > 0 ? (
                      <button 
                        onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                        className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press"
                      >
                        {isExpanded ? '🔼 Tutup' : '🚀 Mulai Belajar'}
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="mt-4 px-6 py-2 rounded-full bg-gray-600 font-semibold cursor-not-allowed"
                      >
                        🔒 Segera Hadir
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && lessons.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                    <h4 className="text-lg font-semibold mb-4 text-purple-300">
                      📖 Daftar Materi - Level {level.level}
                    </h4>
                    <div className="space-y-3">
                      {lessons.map((lesson, lessonIdx) => (
                        <div key={lessonIdx} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="text-2xl">
                              {roadmapLang === 'Arabic' ? '📖' : ''}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-lg font-bold mb-1">{lesson.title}</h5>
                              <p className="text-gray-400 text-sm">
                                {roadmapLang === 'Arabic' ? lesson.content_id : lesson.content_id}
                              </p>
                            </div>
                          </div>

                          {roadmapLang === 'Arabic' && lesson.content_ar && (
                            <div className="mb-3 ml-8">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xl text-right flex-1" dir="rtl">{lesson.content_ar}</p>
                                <button 
                                  onClick={() => playLessonAudio(lesson.content_ar, 'ar')}
                                  className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                                >
                                  🔊
                                </button>
                              </div>
                            </div>
                          )}

                          {roadmapLang === 'English' && lesson.content_en && (
                            <div className="mb-3 ml-8">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-lg flex-1">{lesson.content_en}</p>
                                <button 
                                  onClick={() => playLessonAudio(lesson.content_en, 'en')}
                                  className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                                >
                                  🔊
                                </button>
                              </div>
                            </div>
                          )}

                          {(roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en) && (
                            <div className="ml-8 bg-white/5 rounded-lg p-3">
                              <p className="text-sm text-gray-400 mb-2">Contoh:</p>
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-lg flex-1 ${roadmapLang === 'Arabic' ? 'text-right' : ''}`} dir={roadmapLang === 'Arabic' ? 'rtl' : 'ltr'}>
                                  {roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en}
                                </p>
                                <button 
                                  onClick={() => playLessonAudio(
                                    roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en,
                                    roadmapLang === 'Arabic' ? 'ar' : 'en'
                                  )}
                                  className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                                >
                                  🔊
                                </button>
                              </div>
                              {(roadmapLang === 'Arabic' ? lesson.example_id : lesson.example_id) && (
                                <p className="text-sm text-green-300">
                                  {roadmapLang === 'Arabic' ? lesson.example_id : lesson.example_id}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNahwu = () => {
    const groupedLessons = nahwuLessons.reduce((acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = [];
      }
      acc[lesson.category].push(lesson);
      return acc;
    }, {});

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2"> Belajar Nahwu</h2>
          <p className="text-gray-400">Pelajari tata bahasa Arab secara sistematis</p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedLessons).map(([category, lessons], idx) => (
            <div key={idx} className="glass-modern rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">{category}</h3>
              <div className="space-y-4">
                {lessons.map((lesson, lessonIdx) => (
                  <div key={lessonIdx} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">📚</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1">{lesson.title}</h4>
                        <p className="text-gray-400 text-sm">{lesson.content_id}</p>
                      </div>
                    </div>

                    {lesson.content_ar && (
                      <div className="mb-3 ml-8">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xl text-right flex-1" dir="rtl">{lesson.content_ar}</p>
                          <button 
                            onClick={() => playArabicAudio(lesson.content_ar)}
                            className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                          >
                            🔊
                          </button>
                        </div>
                      </div>
                    )}

                    {lesson.example_ar && (
                      <div className="ml-8 bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-2">Contoh:</p>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-lg text-right flex-1" dir="rtl">{lesson.example_ar}</p>
                          <button 
                            onClick={() => playArabicAudio(lesson.example_ar)}
                            className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                          >
                            🔊
                          </button>
                        </div>
                        {lesson.example_id && <p className="text-sm text-green-300">{lesson.example_id}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnglish = () => {
    const groupedLessons = englishLessons.reduce((acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = [];
      }
      acc[lesson.category].push(lesson);
      return acc;
    }, {});

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">📚 Belajar Bahasa Inggris</h2>
          <p className="text-gray-400">Pelajari grammar dan kosakata Inggris secara sistematis</p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedLessons).map(([category, lessons], idx) => (
            <div key={idx} className="glass-modern rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">{category}</h3>
              <div className="space-y-4">
                {lessons.map((lesson, lessonIdx) => (
                  <div key={lessonIdx} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">📖</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1">{lesson.title}</h4>
                        <p className="text-gray-400 text-sm">{lesson.content_id}</p>
                      </div>
                    </div>

                    {lesson.content_en && (
                      <div className="mb-3 ml-8">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-lg flex-1">{lesson.content_en}</p>
                          <button 
                            onClick={() => playEnglishAudio(lesson.content_en)}
                            className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                          >
                            🔊
                          </button>
                        </div>
                      </div>
                    )}

                    {lesson.example_en && (
                      <div className="ml-8 bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-2">Contoh:</p>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-lg flex-1">{lesson.example_en}</p>
                          <button 
                            onClick={() => playEnglishAudio(lesson.example_en)}
                            className="ml-3 px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press"
                          >
                            
                          </button>
                        </div>
                        {lesson.example_id && <p className="text-sm text-green-300">{lesson.example_id}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mounted || loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .btn-press {
          transition: transform 0.1s ease;
        }
        
        .btn-press:active {
          transform: scale(0.95);
        }
        
        .progress-animated {
          background: linear-gradient(90deg, var(--primary, #8b5cf6), var(--secondary, #ec4899));
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Navigation - SERAGAM dengan Blog */}
      <nav className="glass-modern sticky top-0 z-50 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl shadow-lg">
                L
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LingoSpace Pro
                </h1>
                <p className="text-xs text-gray-400">Premium Learning</p>
              </div>
            </Link>

            {/* Semua Tombol dalam Satu Container Scroll */}
            <div className="flex gap-2 overflow-x-auto flex-1">
              {[
                { id: 'dashboard', label: '📊 Dashboard' },
                { id: 'flashcard', label: '🎴 Flashcard' },
                { id: 'quiz', label: '🎯 Quiz' },
                { id: 'listen', label: '🎧 Listen' },
                { id: 'bookmarks', label: '⭐ Favorit' },
                { id: 'roadmap', label: '🗺️ Roadmap' },
                { id: 'nahwu', label: '📖 Nahwu' },
                { id: 'english', label: '📚 English' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => switchMode(mode.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover-lift btn-press whitespace-nowrap ${
                    currentMode === mode.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105' 
                      : 'glass-modern hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
              
              {/* Blog Button - SERAGAM dengan tombol lainnya */}
              <Link 
                href="/blog" 
                className="px-4 py-2 rounded-full glass-modern hover:bg-white/10 transition-all btn-press text-sm font-semibold text-gray-300 whitespace-nowrap"
              >
                📝 Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-2"></div>

      {/* Search & Filter */}
      {currentMode !== 'dashboard' && currentMode !== 'bookmarks' && currentMode !== 'roadmap' && currentMode !== 'nahwu' && currentMode !== 'english' && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-full glass-modern text-sm bg-transparent outline-none cursor-pointer text-white"
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
              className="px-4 py-2 rounded-full glass-modern text-sm bg-transparent outline-none flex-1 min-w-[200px] text-white placeholder-gray-400"
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
        {currentMode === 'roadmap' && renderRoadmap()}
        {currentMode === 'nahwu' && renderNahwu()}
        {currentMode === 'english' && renderEnglish()}
      </main>

      {/* Footer */}
      <footer className="glass-modern border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LingoSpace Pro</h3>
              <p className="text-gray-400 text-sm">Platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris dengan metode SRS yang efektif.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-purple-300">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">📊 Dashboard</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">📝 Blog</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">ℹ️ Tentang Kami</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-purple-300">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">🔒 Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">📄 Terms of Service</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">📧 Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-purple-300">Hubungi Kami</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">📧 diky.hermansyah91@gmail.com</li>
                <li className="flex items-center gap-2">🌐 www.raiganet.my.id</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
            <p className="mt-2 text-xs">Dibuat dengan ❤️ untuk pelajar bahasa di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
