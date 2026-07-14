'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dictionary from './Dictionary';
import SmartTranslator from './SmartTranslator'; 
import DailyPrayers from './DailyPrayers';

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

  // Quiz State - PERBAIKAN
  const [quizData, setQuizData] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizWrongCount, setQuizWrongCount] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);

  // Listen State
  const [listenLang, setListenLang] = useState('en');
  const [listenData, setListenData] = useState([]);
  const [listenIndex, setListenIndex] = useState(0);
  const [listenAnswered, setListenAnswered] = useState(false);
  const [listenSelected, setListenSelected] = useState(null);

  // Lessons & Roadmap State
  const [englishLessons, setEnglishLessons] = useState([]);
  const [nahwuLessons, setNahwuLessons] = useState([]);
  const [roadmapData, setRoadmapData] = useState([]);
  const [selectedNahwuTopic, setSelectedNahwuTopic] = useState(null);
  const [selectedEnglishTopic, setSelectedEnglishTopic] = useState(null);
  const [roadmapLang, setRoadmapLang] = useState('English');
  const [expandedLevel, setExpandedLevel] = useState(null);

  const [englishLevel, setEnglishLevel] = useState('all');
  const [englishCategory, setEnglishCategory] = useState('all');
  const [englishModal, setEnglishModal] = useState(null);

  const [nahwuLevel, setNahwuLevel] = useState('all');
  const [nahwuCategory, setNahwuCategory] = useState('all');
  const [nahwuModal, setNahwuModal] = useState(null);

  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Sidebar State (Mobile)
  const [showSidebar, setShowSidebar] = useState(false);

  // Set mounted
  useEffect(() => {
    setMounted(true);

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

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
    setShowSidebar(false);
    // Reset quiz state when switching modes
    setQuizData([]);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizWrongCount(0);
    setQuizHistory([]);
    setQuizStarted(false);
    setQuizAnswered(false);
    setQuizSelected(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      const current = srsData[item.id_lang] || { level: 0, correct: 0, wrong: 0 };

      if (isCorrect) {
        current.level = Math.min(current.level + 1, 5);
        current.correct = (current.correct || 0) + 1;
      } else {
        current.level = 0;
        current.wrong = (current.wrong || 0) + 1;
      }

      srsData[item.id_lang] = current;
      localStorage.setItem('lingospace_srs', JSON.stringify(srsData));
    } catch (e) {
      console.error('Error saving SRS:', e);
    }

    nextCard();
  };

  // PERBAIKAN: Fungsi startQuiz yang lebih robust
  const startQuiz = () => {
    if (filteredData.length < 4) {
      alert('Minimal 4 kosakata diperlukan untuk kuis. Silakan tambahkan lebih banyak kosakata atau ubah filter.');
      return;
    }

    try {
      const shuffled = [...filteredData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));

      const quiz = selected.map(item => {
        const others = filteredData.filter(v => v.id !== item.id_lang);
        const wrongOptions = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [
          { text: item.id_lang, correct: true },
          ...wrongOptions.map(w => ({ text: w.id_lang, correct: false }))
        ].sort(() => 0.5 - Math.random());

        return {
          wordId: item.id_lang,
          question: item.en,
          questionAr: item.ar,
          options: options
        };
      });

      setQuizData(quiz);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizWrongCount(0);
      setQuizAnswered(false);
      setQuizSelected(null);
      setQuizHistory([]);
      setQuizStarted(true);
      
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Terjadi kesalahan saat memulai kuis. Silakan coba lagi.');
    }
  };

  // PERBAIKAN: Fungsi answerQuiz
  const answerQuiz = (selectedIndex) => {
    if (quizAnswered || quizData.length === 0) return;
    
    const q = quizData[quizIndex];
    if (!q) return;
    
    const isCorrect = q.options[selectedIndex].correct;

    setQuizSelected(selectedIndex);
    setQuizAnswered(true);

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    } else {
      setQuizWrongCount(prev => prev + 1);
    }

    setQuizHistory(prev => [...prev, {
      question: q.question,
      questionAr: q.questionAr,
      selectedAnswer: q.options[selectedIndex].text,
      correctAnswer: q.options.find(o => o.correct).text,
      isCorrect: isCorrect
    }]);

    const isLastQuestion = quizIndex === quizData.length - 1;
    const delay = isLastQuestion ? 3000 : 2000;

    setTimeout(() => {
      if (isLastQuestion) {
        setQuizStarted(false);
        setQuizIndex(quizData.length);
      } else {
        setQuizIndex(prev => prev + 1);
        setQuizAnswered(false);
        setQuizSelected(null);
      }
    }, delay);
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
    setListenSelected(null);
  };

  const answerListen = (selectedIndex) => {
    if (listenAnswered) return;
    setListenSelected(selectedIndex);
    setListenAnswered(true);

    setTimeout(() => {
      setListenIndex(Math.floor(Math.random() * 4));
      setListenAnswered(false);
      setListenSelected(null);
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

  // ==================== RENDER FUNCTIONS ====================

  const renderDashboard = () => {
    const masteredPct = stats.totalWords > 0 ? Math.round((stats.mastered / stats.totalWords) * 100) : 0;
    const learningPct = stats.totalWords > 0 ? Math.round((stats.learning / stats.totalWords) * 100) : 0;
    const newPct = stats.totalWords > 0 ? Math.round((stats.newWords / stats.totalWords) * 100) : 0;

    return (
      <div className="animate-fade-in">
        {installPrompt && !isInstalled && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="font-bold text-white">Install LingoSpace Pro</h3>
                <p className="text-sm text-gray-300">Belajar offline seperti aplikasi native!</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleInstall}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform btn-press"
              >
                Install
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="px-4 py-2 rounded-full glass-modern text-gray-300 hover:bg-white/10 btn-press"
              >
                Nanti
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          {[
            { icon: '📚', value: stats.totalWords, label: 'Total Kosakata', color: 'from-blue-500 to-cyan-500' },
            { icon: '✅', value: stats.mastered, label: 'Dikuasai', color: 'from-green-500 to-emerald-500' },
            { icon: '📖', value: stats.learning, label: 'Dipelajari', color: 'from-yellow-500 to-orange-500' },
            { icon: '🎯', value: `${stats.accuracy}%`, label: 'Akurasi', color: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-modern rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover-lift cursor-pointer group">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl sm:text-2xl md:text-3xl mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 md:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <span>📈</span> Progress Belajar
          </h3>
          <div className="space-y-4 md:space-y-6">
            {[
              { label: 'Dikuasai', value: masteredPct, color: 'from-green-400 to-emerald-500' },
              { label: 'Dipelajari', value: learningPct, color: 'from-yellow-400 to-orange-500' },
              { label: 'Baru', value: newPct, color: 'from-blue-400 to-purple-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
                <div className="h-2 sm:h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} progress-animated rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <span>🏆</span> Pencapaian
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[
              { icon: '🌱', name: 'Pemula', req: stats.totalWords >= 1, color: 'from-green-400 to-emerald-500' },
              { icon: '📚', name: 'Rajin', req: stats.mastered >= 5, color: 'from-blue-400 to-cyan-500' },
              { icon: '🎯', name: 'Tepat', req: stats.accuracy >= 80, color: 'from-purple-400 to-pink-500' },
              { icon: '⭐', name: 'Kolektor', req: stats.bookmarks >= 5, color: 'from-yellow-400 to-orange-500' }
            ].map((ach, idx) => (
              <div key={idx} className={`p-3 sm:p-4 md:p-5 rounded-xl border transition-all duration-300 hover-lift ${
                ach.req
                  ? `bg-gradient-to-br ${ach.color}/20 border-white/20 shadow-lg`
                  : 'glass opacity-40 grayscale'
              }`}>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 transform hover:scale-110 transition-transform">{ach.icon}</div>
                <div className="font-semibold text-xs sm:text-sm">{ach.name}</div>
                {ach.req && <div className="text-[10px] sm:text-xs text-green-400 mt-1">✓ Unlocked</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFlashcard = () => {
    const item = filteredData[currentIndex] || {};
    const isBookmarked = bookmarks.includes(item.id_lang);

    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4 md:mb-6 flex-wrap gap-2 md:gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">🎴 Flashcard Mode</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Klik kartu untuk membalik</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={prevCard} className="p-2 sm:p-3 rounded-full glass-modern hover:scale-110 transition-transform btn-press">←</button>
            <span className="text-xs sm:text-sm font-semibold">{currentIndex + 1} / {filteredData.length}</span>
            <button onClick={nextCard} className="p-2 sm:p-3 rounded-full glass-modern hover:scale-110 transition-transform btn-press">→</button>
          </div>
        </div>

        <div className="perspective-1000 w-full max-w-2xl mx-auto h-64 sm:h-80 md:h-96 cursor-pointer" onClick={flipCard}>
          <div className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 shadow-2xl">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest mb-2 md:mb-4 opacity-80">Bahasa Indonesia</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center">{item.id_lang || '-'}</h2>
              <p className="text-xs sm:text-sm mt-4 md:mt-8 opacity-60">Tap untuk melihat jawaban</p>
            </div>

            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-pink-600 to-red-600 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 shadow-2xl rotate-y-180">
              <div className="text-center w-full">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest mb-2 opacity-80">English</p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4">{item.en || '-'}</h3>
                <div className="border-t border-white/30 my-2 md:my-3"></div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest mb-2 opacity-80">العربية (Arabic)</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-right" dir="rtl">{item.ar || '-'}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-4 md:mt-8 flex-wrap">
          <button onClick={() => playAudio(item.en, 'en')} className="speaker-btn px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press text-xs sm:text-sm">🔊 English</button>
          <button onClick={() => playAudio(item.ar, 'ar')} className="speaker-btn px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press text-xs sm:text-sm">🔊 العربية</button>
          <button onClick={() => toggleBookmark(item.id_lang)} className="px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press text-xs sm:text-sm">
            {isBookmarked ? '⭐ Tersimpan' : '☆ Favorit'}
          </button>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-3 md:mt-4">
          <button onClick={() => rateCard(false)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 transition-colors btn-press text-xs sm:text-sm">😓 Sulit</button>
          <button onClick={() => rateCard(true)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-green-500/20 border border-green-500/50 hover:bg-green-500/40 transition-colors btn-press text-xs sm:text-sm">😊 Mudah</button>
        </div>

        {(item.ex_en || item.ex_ar) && (
          <div className="max-w-2xl mx-auto mt-4 md:mt-8 glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <p className="text-[10px] sm:text-xs uppercase text-gray-400 mb-2 md:mb-3">Contoh Kalimat</p>
            <p className="text-sm sm:text-base md:text-lg mb-2 text-blue-200">{item.ex_en}</p>
            <p className="text-lg sm:text-xl md:text-2xl text-pink-200 text-right" dir="rtl">{item.ex_ar}</p>
            <div className="flex justify-center gap-2 mt-3 md:mt-4">
              <button onClick={() => playAudio(item.ex_en, 'en')} className="speaker-btn px-3 sm:px-4 py-2 rounded-lg glass-modern text-xs sm:text-sm hover:scale-105 transition-transform btn-press">🔊 EN</button>
              <button onClick={() => playAudio(item.ex_ar, 'ar')} className="speaker-btn px-3 sm:px-4 py-2 rounded-lg glass-modern text-xs sm:text-sm hover:scale-105 transition-transform btn-press">🔊 AR</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PERBAIKAN BESAR: renderQuiz dengan logika yang benar
  const renderQuiz = () => {
    // Tampilkan halaman awal quiz
    if (!quizStarted && quizData.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-modern rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="text-6xl sm:text-7xl md:text-8xl mb-4 animate-bounce">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quiz Mode
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 md:mb-8">
              Uji kemampuan kosakata Anda dengan 10 soal pilihan ganda
            </p>
            <button 
              onClick={startQuiz} 
              className="px-6 sm:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-base sm:text-lg hover:scale-110 hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 btn-press shadow-lg shadow-violet-500/30"
            >
              🚀 Mulai Kuis
            </button>
          </div>
        </div>
      );
    }

    // Tampilkan summary jika quiz selesai
    if (!quizStarted && quizData.length > 0 && quizIndex >= quizData.length) {
      const pct = Math.round((quizScore / quizData.length) * 100);
      const wrongCount = quizData.length - quizScore;
      
      let emoji, message, gradientColor;
      if (pct >= 80) {
        emoji = '🏆';
        message = 'Luar Biasa!';
        gradientColor = 'from-yellow-400 via-orange-500 to-red-500';
      } else if (pct >= 60) {
        emoji = '🎉';
        message = 'Bagus!';
        gradientColor = 'from-green-400 via-emerald-500 to-teal-500';
      } else if (pct >= 40) {
        emoji = '💪';
        message = 'Lumayan!';
        gradientColor = 'from-blue-400 via-cyan-500 to-teal-500';
      } else {
        emoji = '📚';
        message = 'Terus Berlatih!';
        gradientColor = 'from-purple-400 via-pink-500 to-red-500';
      }

      return (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="glass-modern rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center">
            <div className="text-7xl sm:text-8xl md:text-9xl mb-4 animate-bounce">
              {emoji}
            </div>
            
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
              {message}
            </h2>
            
            <div className="mb-6 md:mb-8">
              <p className="text-gray-400 text-sm sm:text-base mb-2">Kuis Selesai! Skor Akhir Anda</p>
              <div className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {quizScore} <span className="text-2xl sm:text-3xl text-gray-500">/ {quizData.length}</span>
              </div>
              <div className="inline-block mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm sm:text-base">
                {pct}% Benar
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 md:mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20">
                <div className="text-4xl sm:text-5xl mb-2">✅</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-green-400 mb-1">
                  {quizScore}
                </div>
                <div className="text-xs sm:text-sm text-green-300 font-semibold">Jawaban Benar</div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border-2 border-red-500/40 p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/20">
                <div className="text-4xl sm:text-5xl mb-2">❌</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-red-400 mb-1">
                  {wrongCount}
                </div>
                <div className="text-xs sm:text-sm text-red-300 font-semibold">Jawaban Salah</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={startQuiz} 
                className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-sm sm:text-base hover:scale-110 hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 btn-press shadow-lg shadow-violet-500/30"
              >
                🔄 Coba Lagi
              </button>
              <button 
                onClick={() => {
                  setQuizData([]);
                  setQuizIndex(0);
                  setQuizScore(0);
                  setQuizWrongCount(0);
                  setQuizHistory([]);
                  setQuizStarted(false);
                }} 
                className="px-6 sm:px-8 py-3 rounded-full bg-white/5 border border-white/20 font-semibold text-sm sm:text-base hover:bg-white/10 hover:scale-105 transition-all duration-300 btn-press"
              >
                📚 Kembali
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Tampilkan soal quiz
    if (quizData.length > 0 && quizIndex < quizData.length) {
      const q = quizData[quizIndex];
      
      return (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="glass-modern rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400">Soal</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold text-xs sm:text-sm">
                  {quizIndex + 1}/{quizData.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400">Skor:</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-bold text-xs sm:text-sm">
                  {quizScore}
                </span>
              </div>
            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6 md:mb-8">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
                style={{ width: `${((quizIndex + 1) / quizData.length) * 100}%` }}
              ></div>
            </div>

            <div className="mb-6 md:mb-8 text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">Apa arti dari:</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {q.question}
              </h2>
              {q.questionAr && (
                <p className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-4 text-right" dir="rtl">
                  {q.questionAr}
                </p>
              )}
              <button 
                onClick={() => playAudio(q.question, 'en')} 
                className="speaker-btn px-4 sm:px-5 py-2 rounded-full glass-modern text-xs sm:text-sm hover:scale-110 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 btn-press inline-flex items-center gap-2"
              >
                🔊 Dengarkan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {q.options.map((opt, i) => {
                const isSelected = quizSelected === i;
                const isCorrect = opt.correct;
                
                let buttonClass = 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-violet-400/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20';
                
                if (quizAnswered) {
                  if (isCorrect) {
                    buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-300 scale-105 shadow-xl shadow-green-500/50 animate-pulse';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-2 border-red-300 scale-95 shadow-xl shadow-red-500/50';
                  } else {
                    buttonClass = 'bg-white/5 border border-white/10 text-gray-500 opacity-40';
                  }
                } else if (isSelected) {
                  buttonClass = 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-2 border-violet-300 scale-105 shadow-xl shadow-violet-500/50';
                }

                return (
                  <button
                    key={i}
                    onClick={() => answerQuiz(i)}
                    disabled={quizAnswered}
                    className={`p-4 sm:p-5 rounded-xl font-semibold transition-all duration-300 btn-press text-sm sm:text-base flex items-center justify-between ${buttonClass}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="truncate">{opt.text}</span>
                    </span>
                    {quizAnswered && isCorrect && (
                      <span className="text-xl sm:text-2xl animate-bounce ml-2">✓</span>
                    )}
                    {quizAnswered && isSelected && !isCorrect && (
                      <span className="text-xl sm:text-2xl ml-2">✕</span>
                    )}
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <div className={`mt-6 p-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 animate-fade-in flex items-center justify-center gap-2 ${
                q.options[quizSelected]?.correct
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-2 border-green-500/40 shadow-lg shadow-green-500/20'
                  : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-2 border-red-500/40 shadow-lg shadow-red-500/20'
              }`}>
                {q.options[quizSelected]?.correct ? (
                  <>
                    <span className="text-2xl">🎉</span>
                    <span>Benar! Hebat!</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">😔</span>
                    <span>Salah! Jawaban yang benar: <strong>{q.options.find(o => o.correct).text}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderListen = () => {
    if (listenData.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-modern rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 md:mb-8">Dengarkan dan tebak artinya</p>
            <button onClick={startListen} className="px-5 sm:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press text-sm sm:text-base">
              Mulai
            </button>
          </div>
        </div>
      );
    }

    const item = listenData[listenIndex];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">🎧 Listen & Learn</h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 md:mb-8">Dengarkan dan tebak artinya</p>

          <button 
            onClick={() => playAudio(listenLang === 'en' ? item.en : item.ar, listenLang)} 
            className="big-play-btn mx-auto mb-4 md:mb-8 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl sm:text-4xl md:text-5xl hover:scale-110 transition-all duration-300 shadow-2xl btn-press hover:shadow-purple-500/50"
          >
            🔊
          </button>

          <div className="flex gap-3 mb-6 md:mb-8 justify-center">
            <button 
              onClick={() => setListenLang('en')} 
              className={`px-5 sm:px-6 py-2.5 rounded-full font-semibold transition-all duration-300 btn-press text-sm ${
                listenLang === 'en' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/50 scale-110 border-2 border-white/30' 
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:scale-105 hover:border-violet-400/50'
              }`}
            >
              🇬 English
            </button>
            <button 
              onClick={() => setListenLang('ar')} 
              className={`px-5 sm:px-6 py-2.5 rounded-full font-semibold transition-all duration-300 btn-press text-sm ${
                listenLang === 'ar' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/50 scale-110 border-2 border-white/30' 
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:scale-105 hover:border-violet-400/50'
              }`}
            >
              🇸🇦 العربية
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {listenData.map((opt, i) => {
              const isSelected = listenSelected === i;
              const isCorrect = i === listenIndex;
              
              let buttonClass = 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:scale-105 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20';
              
              if (listenAnswered) {
                if (isCorrect) {
                  buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-300 scale-105 shadow-xl shadow-green-500/50 animate-pulse';
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-2 border-red-300 scale-95 shadow-xl shadow-red-500/50';
                } else {
                  buttonClass = 'bg-white/5 border border-white/10 text-gray-500 opacity-50';
                }
              } else if (isSelected) {
                buttonClass = 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-2 border-violet-300 scale-105 shadow-xl shadow-violet-500/50';
              }

              return (
                <button
                  key={i}
                  onClick={() => answerListen(i)}
                  disabled={listenAnswered}
                  className={`p-4 sm:p-5 rounded-xl font-semibold transition-all duration-300 btn-press text-sm sm:text-base ${buttonClass}`}
                >
                  {opt.id_lang}
                  {listenAnswered && isCorrect && <span className="ml-2">✓</span>}
                  {listenAnswered && isSelected && !isCorrect && <span className="ml-2">✕</span>}
                </button>
              );
            })}
          </div>

          {listenAnswered && (
            <div className={`mt-6 p-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              listenSelected === listenIndex
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {listenSelected === listenIndex ? '🎉 Benar! Hebat!' : '❌ Salah! Coba lagi ya!'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBookmarks = () => {
    const bookmarkedData = allData.filter(item => bookmarks.includes(item.id_lang));

    return (
      <div className="animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">⭐ Kosakata Favorit</h2>
        {bookmarkedData.length === 0 ? (
          <div className="text-center py-12 md:py-16 text-gray-400">
            <div className="text-5xl sm:text-6xl mb-4">⭐</div>
            <p className="text-sm sm:text-base">Belum ada kosakata favorit</p>
            <p className="text-xs sm:text-sm mt-2">Klik tombol ⭐ di mode Flashcard untuk menambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {bookmarkedData.map((item) => (
              <div key={item.id_lang} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{item.category}</span>
                  <button onClick={() => toggleBookmark(item.id_lang)} className="text-yellow-400 hover:scale-110 transition-transform">⭐</button>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">{item.en}</h3>
                <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-2 text-right" dir="rtl">{item.ar}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{item.id_lang}</p>
                <div className="flex gap-2 mt-3 md:mt-4">
                  <button onClick={() => playAudio(item.en, 'en')} className="flex-1 py-2 rounded-lg glass-modern text-xs sm:text-sm hover:scale-105 transition-transform btn-press">🔊 EN</button>
                  <button onClick={() => playAudio(item.ar, 'ar')} className="flex-1 py-2 rounded-lg glass-modern text-xs sm:text-sm hover:scale-105 transition-transform btn-press">🔊 AR</button>
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
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">🗺️ Roadmap Pembelajaran</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Pilih jalur belajar Anda</p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => { setRoadmapLang('English'); setExpandedLevel(null); }}
            className={`px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all btn-press text-xs sm:text-sm ${
              roadmapLang === 'English'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'glass-modern hover:scale-105'
            }`}
          >
            🇬🇧 Bahasa Inggris
          </button>
          <button
            onClick={() => { setRoadmapLang('Arabic'); setExpandedLevel(null); }}
            className={`px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all btn-press text-xs sm:text-sm ${
              roadmapLang === 'Arabic'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'glass-modern hover:scale-105'
            }`}
          >
            🇸🇦 Bahasa Arab
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredRoadmap.map((level, idx) => {
            const lessons = getLessonsForLevel(level.level);
            const isExpanded = expandedLevel === level.id;
            return (
              <div key={idx} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover-lift">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl ${
                    lessons.length > 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-600'
                  }`}>
                    {lessons.length > 0 ? '📚' : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Level {level.level}: {level.title}</h3>
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{level.category}</span>
                    <p className="text-gray-300 mt-2 text-xs sm:text-sm">{level.description}</p>

                    <div className="mt-3 md:mt-4">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>{lessons.length} materi tersedia</span>
                        <span>{level.requiredWords} kata target</span>
                      </div>
                    </div>

                    {lessons.length > 0 ? (
                      <button
                        onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                        className="mt-3 md:mt-4 px-4 sm:px-5 md:px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press text-xs sm:text-sm"
                      >
                        {isExpanded ? '🔼 Tutup' : '🚀 Mulai Belajar'}
                      </button>
                    ) : (
                      <button disabled className="mt-3 md:mt-4 px-4 sm:px-5 md:px-6 py-2 rounded-full bg-gray-600 font-semibold cursor-not-allowed text-xs sm:text-sm">
                        🔒 Segera Hadir
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && lessons.length > 0 && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10 animate-fade-in">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4 text-purple-300">
                       Daftar Materi - Level {level.level}
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {lessons.map((lesson, lessonIdx) => (
                        <div key={lessonIdx} className="bg-white/5 rounded-lg p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 md:mb-3">
                            <div className="text-xl sm:text-2xl">
                              {roadmapLang === 'Arabic' ? '📖' : '📘'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm sm:text-base md:text-lg font-bold mb-1">{lesson.title}</h5>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                {lesson.content_id}
                              </p>
                            </div>
                          </div>

                          {roadmapLang === 'Arabic' && lesson.content_ar && (
                            <div className="mb-2 md:mb-3 ml-7 sm:ml-8 md:ml-10">
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <p className="text-base sm:text-lg md:text-xl text-right flex-1" dir="rtl">{lesson.content_ar}</p>
                                <button
                                  onClick={() => playLessonAudio(lesson.content_ar, 'ar')}
                                  className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm"
                                >
                                  🔊
                                </button>
                              </div>
                            </div>
                          )}

                          {roadmapLang === 'English' && lesson.content_en && (
                            <div className="mb-2 md:mb-3 ml-7 sm:ml-8 md:ml-10">
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <p className="text-sm sm:text-base md:text-lg flex-1">{lesson.content_en}</p>
                                <button
                                  onClick={() => playLessonAudio(lesson.content_en, 'en')}
                                  className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm"
                                >
                                  🔊
                                </button>
                              </div>
                            </div>
                          )}

                          {(roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en) && (
                            <div className="ml-7 sm:ml-8 md:ml-10 bg-white/5 rounded-lg p-2 sm:p-3">
                              <p className="text-[10px] sm:text-xs text-gray-400 mb-2">Contoh:</p>
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <p className={`text-sm sm:text-base md:text-lg flex-1 ${roadmapLang === 'Arabic' ? 'text-right' : ''}`} dir={roadmapLang === 'Arabic' ? 'rtl' : 'ltr'}>
                                  {roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en}
                                </p>
                                <button
                                  onClick={() => playLessonAudio(
                                    roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en,
                                    roadmapLang === 'Arabic' ? 'ar' : 'en'
                                  )}
                                  className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm"
                                >
                                  🔊
                                </button>
                              </div>
                              {(roadmapLang === 'Arabic' ? lesson.example_id : lesson.example_id) && (
                                <p className="text-xs sm:text-sm text-green-300">
                                  {lesson.example_id}
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
    const levels = [
      { id: '1', label: 'Level 1: Dasar' },
      { id: '2', label: 'Level 2: Menengah' },
      { id: '3', label: 'Level 3: Lanjut' }
    ];

    const nahwuCategories = [...new Set(nahwuLessons.map(l => l.category))];

    const filteredLessons = nahwuLessons.filter(lesson => {
      const matchLevel = nahwuLevel === 'all' || String(lesson.level) === nahwuLevel;
      const matchCategory = nahwuCategory === 'all' || lesson.category === nahwuCategory;
      return matchLevel && matchCategory;
    });

    const navigateNahwu = (direction) => {
      if (!nahwuModal) return;
      const currentIndex = filteredLessons.findIndex(l => l.id === nahwuModal.id);
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < filteredLessons.length) {
        setNahwuModal(filteredLessons[newIndex]);
      }
    };

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">📖 Belajar Nahwu</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Pelajari tata bahasa Arab secara sistematis</p>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-4 md:mb-6 flex-wrap justify-center">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setNahwuLevel(level.id)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${
                nahwuLevel === level.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'
              }`}
            >
              {level.label}
            </button>
          ))}
          <button
            onClick={() => setNahwuLevel('all')}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${
              nahwuLevel === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'
            }`}
          >
            Semua Materi
          </button>
        </div>

        <div className="mb-6 md:mb-8">
          <select
            value={nahwuCategory}
            onChange={(e) => setNahwuCategory(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm bg-transparent outline-none cursor-pointer text-white"
          >
            <option value="all" className="bg-slate-800">Semua Kategori</option>
            {nahwuCategories.map((cat, idx) => (
              <option key={idx} value={cat} className="bg-slate-800">{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {filteredLessons.map((lesson, idx) => (
            <div key={idx} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift cursor-pointer" onClick={() => setNahwuModal(lesson)}>
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold">
                  {lesson.category}
                </span>
                <span className="text-xl sm:text-2xl">📖</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{lesson.content_id}</p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); playArabicAudio(lesson.content_ar); }}
                  className="px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm hover:bg-white/10 transition-all btn-press flex items-center gap-2"
                >
                  🔊 Dengarkan
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setNahwuModal(lesson); }}
                  className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs sm:text-sm font-semibold hover:scale-105 transition-transform btn-press"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12 md:py-16 text-gray-400">
            <div className="text-5xl sm:text-6xl mb-4">📖</div>
            <p className="text-sm sm:text-base">Tidak ada materi untuk filter ini</p>
          </div>
        )}

        {nahwuModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setNahwuModal(null)}>
            <div className="glass-modern rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{nahwuModal.title}</h2>
                  <button onClick={() => setNahwuModal(null)} className="text-gray-400 hover:text-white text-xl sm:text-2xl">✕</button>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-xs sm:text-sm uppercase text-gray-400 mb-2">Penjelasan</h3>
                    {nahwuModal.content_ar && (
                      <p className="text-lg sm:text-xl md:text-2xl text-right mb-2 text-purple-300" dir="rtl">{nahwuModal.content_ar}</p>
                    )}
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">{nahwuModal.content_id}</p>
                  </div>

                  {nahwuModal.example_ar && (
                    <div>
                      <h3 className="text-xs sm:text-sm uppercase text-gray-400 mb-2">Contoh</h3>
                      <p className="text-lg sm:text-xl md:text-2xl text-right mb-2 text-blue-300" dir="rtl">{nahwuModal.example_ar}</p>
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base">{nahwuModal.example_id}</p>
                    </div>
                  )}

                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {nahwuModal.content_ar && (
                      <button
                        onClick={() => playArabicAudio(nahwuModal.content_ar)}
                        className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"
                      >
                        🔊 Dengarkan Penjelasan
                      </button>
                    )}
                    {nahwuModal.example_ar && (
                      <button
                        onClick={() => playArabicAudio(nahwuModal.example_ar)}
                        className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"
                      >
                        🔊 Dengarkan Contoh
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                  <button
                    onClick={() => navigateNahwu('prev')}
                    disabled={filteredLessons.findIndex(l => l.id === nahwuModal.id) === 0}
                    className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    onClick={() => navigateNahwu('next')}
                    disabled={filteredLessons.findIndex(l => l.id === nahwuModal.id) === filteredLessons.length - 1}
                    className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEnglish = () => {
    const levels = [
      { id: '1', label: 'Level 1: Dasar' },
      { id: '2', label: 'Level 2: Menengah' },
      { id: '3', label: 'Level 3: Lanjut' },
      { id: '4', label: 'Level 4: Advanced' },
      { id: '5', label: 'Level 5: Mahir' },
      { id: '6', label: 'Level 6: Native' }
    ];

    const engCategories = [...new Set(englishLessons.map(l => l.category))];

    const filteredLessons = englishLessons.filter(lesson => {
      const matchLevel = englishLevel === 'all' || String(lesson.level) === englishLevel;
      const matchCategory = englishCategory === 'all' || lesson.category === englishCategory;
      return matchLevel && matchCategory;
    });

    const navigateEnglish = (direction) => {
      if (!englishModal) return;
      const currentIndex = filteredLessons.findIndex(l => l.id === englishModal.id);
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < filteredLessons.length) {
        setEnglishModal(filteredLessons[newIndex]);
      }
    };

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">📚 Belajar Bahasa Inggris</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Pelajari grammar dan kosakata Inggris secara sistematis</p>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-4 md:mb-6 flex-wrap justify-center">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setEnglishLevel(level.id)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${
                englishLevel === level.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'
              }`}
            >
              {level.label}
            </button>
          ))}
          <button
            onClick={() => setEnglishLevel('all')}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${
              englishLevel === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'
            }`}
          >
            Semua Materi
          </button>
        </div>

        <div className="mb-6 md:mb-8">
          <select
            value={englishCategory}
            onChange={(e) => setEnglishCategory(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm bg-transparent outline-none cursor-pointer text-white"
          >
            <option value="all" className="bg-slate-800">Semua Kategori</option>
            {engCategories.map((cat, idx) => (
              <option key={idx} value={cat} className="bg-slate-800">{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {filteredLessons.map((lesson, idx) => (
            <div key={idx} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift cursor-pointer" onClick={() => setEnglishModal(lesson)}>
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold">
                  {lesson.category}
                </span>
                <span className="text-xl sm:text-2xl">📘</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{lesson.content_id}</p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); playEnglishAudio(lesson.content_en); }}
                  className="px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm hover:bg-white/10 transition-all btn-press flex items-center gap-2"
                >
                  🔊 Dengarkan
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEnglishModal(lesson); }}
                  className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs sm:text-sm font-semibold hover:scale-105 transition-transform btn-press"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12 md:py-16 text-gray-400">
            <div className="text-5xl sm:text-6xl mb-4">📘</div>
            <p className="text-sm sm:text-base">Tidak ada materi untuk filter ini</p>
          </div>
        )}

        {englishModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setEnglishModal(null)}>
            <div className="glass-modern rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{englishModal.title}</h2>
                  <button onClick={() => setEnglishModal(null)} className="text-gray-400 hover:text-white text-xl sm:text-2xl">✕</button>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-xs sm:text-sm uppercase text-gray-400 mb-2">Penjelasan (English)</h3>
                    <p className="text-base sm:text-lg text-blue-300 mb-2">{englishModal.content_en}</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">{englishModal.content_id}</p>
                  </div>

                  {englishModal.example_en && (
                    <div>
                      <h3 className="text-xs sm:text-sm uppercase text-gray-400 mb-2">Contoh</h3>
                      <p className="text-base sm:text-lg text-green-300 mb-2">{englishModal.example_en}</p>
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base">{englishModal.example_id}</p>
                    </div>
                  )}

                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    <button
                      onClick={() => playEnglishAudio(englishModal.content_en)}
                      className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"
                    >
                      🔊 Dengarkan Penjelasan
                    </button>
                    {englishModal.example_en && (
                      <button
                        onClick={() => playEnglishAudio(englishModal.example_en)}
                        className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"
                      >
                        🔊 Dengarkan Contoh
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                  <button
                    onClick={() => navigateEnglish('prev')}
                    disabled={filteredLessons.findIndex(l => l.id === englishModal.id) === 0}
                    className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    onClick={() => navigateEnglish('next')}
                    disabled={filteredLessons.findIndex(l => l.id === englishModal.id) === filteredLessons.length - 1}
                    className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== LOADING STATE ====================
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-semibold text-white">Memuat LingoSpace Pro...</p>
        </div>
      </div>
    );
  }

  
  const menuItems = [
     { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'flashcard', label: '🎴 Flashcard' },
    { id: 'quiz', label: '🎯 Quiz' },
    { id: 'listen', label: '🎧 Listen' },
    { id: 'bookmarks', label: '⭐ Favorit' },
    { id: 'roadmap', label: '🗺️ Roadmap' },
    { id: 'nahwu', label: '📖 Nahwu' },
    { id: 'english', label: '📘 English' },
    { id: 'dictionary', label: '📖 Kamus' },
    { id: 'smarttranslator', label: '🎙️ SmartTranslator' },
    { id: 'prayers', label: '🤲 Doa' }
  ];


  // ==================== MAIN RENDER ====================
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

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        button, a {
          outline: none;
        }

        button:focus-visible, a:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        @supports (padding: max(0px)) {
          .safe-area-top {
            padding-top: max(env(safe-area-inset-top), 0.75rem);
          }
          .safe-area-bottom {
            padding-bottom: max(env(safe-area-inset-bottom), 1rem);
          }
        }

        @media (max-width: 640px) {
          button, a, select, input {
            min-height: 44px;
          }
        }
      `}</style>

      {/* ==================== DESKTOP & TABLET NAVBAR (2 BARIS) ==================== */}
      <header className="hidden sm:block sticky top-3 z-40 mx-3 sm:mx-4 md:mx-6">
        <nav className="rounded-2xl border border-white/10 bg-slate-900/75 backdrop-blur-2xl shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-2 px-4 py-3">
            
            {/* BARIS 1: Logo + Menu Navigasi */}
            <div className="flex items-center gap-4">
              {/* LOGO - Kiri */}
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[2px] shadow-lg shadow-violet-500/30">
                  <img
                    src="/logo.png"
                    alt="LingoSpace Pro"
                    className="w-full h-full object-contain rounded-2xl bg-slate-900"
                  />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-sm md:text-base lg:text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    LingoSpace Pro
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide">
                    Learn • Practice • Master
                  </p>
                </div>
              </Link>

              {/* MENU NAVIGASI - Tengah/Kanan */}
              <div className="flex-1 flex items-center gap-1 lg:gap-2 overflow-x-auto hide-scrollbar">
                {menuItems.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => switchMode(mode.id)}
                    className={`px-2.5 sm:px-3 lg:px-4 py-2 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0 text-xs sm:text-sm ${
                      currentMode === mode.id
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40 scale-105'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-violet-400/50 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BARIS 2: Blog + Install - Terpisah di bawah, rata kanan */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <Link
                href="/blog"
                className="px-3 sm:px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 whitespace-nowrap text-xs sm:text-sm"
              >
                📝 Blog
              </Link>
              {!isInstalled && installPrompt && (
                <button
                  onClick={handleInstall}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap text-xs sm:text-sm shadow-lg shadow-violet-500/30"
                >
                  📲 Install App
                </button>
              )}
            </div>

          </div>
        </nav>
      </header>

      {/* ==================== MOBILE NAVBAR (Hanya Logo + Burger) ==================== */}
      <header className="sm:hidden sticky top-3 z-40 mx-3">
        <nav className="rounded-2xl border border-white/10 bg-slate-900/75 backdrop-blur-2xl shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* LOGO - Kiri */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[2px] shadow-lg shadow-violet-500/30">
                <img
                  src="/logo.png"
                  alt="LingoSpace Pro"
                  className="w-full h-full object-contain rounded-2xl bg-slate-900"
                />
              </div>
              <div>
                <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LingoSpace Pro
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wide">
                  Learn • Practice • Master
                </p>
              </div>
            </Link>

            {/* BURGER BUTTON - Kanan */}
            <button
              onClick={() => setShowSidebar(true)}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all duration-300 active:scale-95 flex-shrink-0"
              aria-label="Buka menu"
            >
              <span className="text-xl">☰</span>
            </button>

          </div>
        </nav>
      </header>

      {/* ==================== MOBILE SIDEBAR OVERLAY ==================== */}
      {showSidebar && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* ==================== MOBILE SIDEBAR ==================== */}
      <aside
        className={`sm:hidden fixed top-0 left-0 h-full w-[320px] max-w-[85vw] z-50 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
          
          {/* SIDEBAR HEADER */}
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[2px] shadow-lg shadow-violet-500/30">
                  <img
                    src="/logo.png"
                    alt="LingoSpace Pro"
                    className="w-full h-full object-contain rounded-2xl bg-slate-900"
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    LingoSpace Pro
                  </h1>
                  <p className="text-[10px] text-slate-400 tracking-wide">
                    Learn • Practice • Master
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                aria-label="Tutup menu"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>
          </div>

          {/* SIDEBAR MENU NAVIGASI */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="space-y-1.5">
              {menuItems.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => switchMode(mode.id)}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 text-left flex items-center gap-3 ${
                    currentMode === mode.id
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-violet-400/50 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{mode.label.split(' ')[0]}</span>
                  <span>{mode.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SIDEBAR BLOG + INSTALL */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="space-y-2">
              <Link
                href="/blog"
                onClick={() => setShowSidebar(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 flex items-center gap-3"
              >
                <span className="text-lg">📝</span>
                <span className="font-semibold">Blog</span>
              </Link>
              {!isInstalled && installPrompt && (
                <button
                  onClick={() => { handleInstall(); setShowSidebar(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-violet-500/30"
                >
                  <span className="text-lg">📲</span>
                  <span>Install App</span>
                </button>
              )}
            </div>
          </div>

          {/* SIDEBAR FOOTER LINKS */}
          <div className="px-4 py-4 mt-auto">
            <div className="space-y-1.5">
              <Link
                href="/about"
                onClick={() => setShowSidebar(false)}
                className="w-full px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-3 text-sm"
              >
                <span>ℹ️</span>
                <span>About</span>
              </Link>
              <Link
                href="/privacy-policy"
                onClick={() => setShowSidebar(false)}
                className="w-full px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-3 text-sm"
              >
                <span>🔒</span>
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setShowSidebar(false)}
                className="w-full px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-3 text-sm"
              >
                <span>📧</span>
                <span>Contact</span>
              </Link>
            </div>
          </div>

          {/* SIDEBAR BOTTOM CREDIT */}
          <div className="px-5 py-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} LingoSpace Pro
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              Made with ❤️ in Indonesia
            </p>
          </div>

        </div>
      </aside>

      {/* Search & Filter - Only for flashcard/quiz/listen */}
      
{currentMode !== 'dashboard' &&
 currentMode !== 'bookmarks' &&
 currentMode !== 'roadmap' &&
 currentMode !== 'nahwu' &&
 currentMode !== 'english' &&
 currentMode !== 'dictionary' &&
 currentMode !== 'prayers' && 
 currentMode !== 'smarttranslator' && (
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 safe-area-bottom">
         {currentMode === 'dashboard' && renderDashboard()}
        {currentMode === 'flashcard' && renderFlashcard()}
        {currentMode === 'quiz' && renderQuiz()}
        {currentMode === 'listen' && renderListen()}
        {currentMode === 'bookmarks' && renderBookmarks()}
        {currentMode === 'roadmap' && renderRoadmap()}
        {currentMode === 'nahwu' && renderNahwu()}
        {currentMode === 'english' && renderEnglish()}
        {currentMode === 'dictionary' && <Dictionary />}
        {/* PERBAIKAN: Me-render komponen asli SmartTranslator ketika menu dipilih */}
        {currentMode === 'smarttranslator' && <SmartTranslator />}
      </main>

      {/* Footer */}
      <footer className="glass-modern border-t border-white/10 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 md:mb-8">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LingoSpace Pro</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Platform pembelajaran bahasa premium untuk Bahasa Arab dan Inggris dengan metode SRS yang efektif.</p>
            </div>

            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Menu</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">📊 Dashboard</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">📝 Blog</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">ℹ️ Tentang Kami</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">🔒 Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">📄 Terms of Service</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">📧 Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-purple-300 text-sm sm:text-base">Hubungi Kami</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-center gap-2">📧 diky.hermansyah91@gmail.com</li>
                <li className="flex items-center gap-2">🌐 www.raiganet.my.id</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 md:pt-6 text-center text-xs sm:text-sm text-gray-400">
            <p>© {new Date().getFullYear()} LingoSpace Pro. All rights reserved.</p>
            <p className="mt-2 text-[10px] sm:text-xs">Dibuat dengan ❤️ untuk pelajar bahasa di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
