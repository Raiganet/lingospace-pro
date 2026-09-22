'use client';

import { markSyncDirty } from '../lib/cloudSync';
import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Heart, Library, Sparkles, Target, Trophy, TrendingUp, CalendarClock, Flame, AlertTriangle, RotateCcw, Check, Volume2, Headphones } from 'lucide-react';
import { SRS_GRADES, readSrsState, gradeSrsWord, getDueVocabulary, readDailyGoal, saveDailyGoal, recordActivity, readActivity, getActivitySummary, recordMistake, resolveMistake, readMistakes, getOpenMistakes } from '../lib/learningEngine';
import LessonPractice from './LessonPractice';
import { addXp, getLevelInfo, getLessonSummary, PREMIUM_UPDATE_EVENT, readLessonProgress, readXp } from '../lib/premiumLearning';


const normalizeWordKey = (value) => String(value ?? '').trim().toLocaleLowerCase('id-ID');

const normalizeBookmarkIds = (storedBookmarks, vocabulary) => {
  if (!Array.isArray(storedBookmarks)) return [];

  const idSet = new Set(vocabulary.map((item) => Number(item.id)));
  const legacyWordToId = new Map(
    vocabulary.map((item) => [normalizeWordKey(item.id_lang), Number(item.id)])
  );

  const normalized = storedBookmarks
    .map((value) => {
      const numeric = Number(value);
      if (Number.isInteger(numeric) && idSet.has(numeric)) return numeric;
      return legacyWordToId.get(normalizeWordKey(value));
    })
    .filter((value) => Number.isInteger(value));

  return [...new Set(normalized)];
};

const readAndMigrateSrs = (vocabulary) => readSrsState(vocabulary);

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
  const [srsVersion, setSrsVersion] = useState(0);
  const [learningVersion, setLearningVersion] = useState(0);
  const [learningStats, setLearningStats] = useState({ dueCount: 0, todayWords: 0, todayActions: 0, streak: 0, activeToday: false, dailyGoal: 20, mistakes: 0 });
  const [lessonProgress, setLessonProgress] = useState({ english: {}, nahwu: {} });
  const [premiumStats, setPremiumStats] = useState({ level: 1, totalXp: 0, progress: 0, remaining: 120, title: 'New Explorer', lessonPct: 0 });
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [reviewRevealed, setReviewRevealed] = useState(false);

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
  const [listenScore, setListenScore] = useState(0);
  const [listenHistory, setListenHistory] = useState([]);
  const [listenStarted, setListenStarted] = useState(false);

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

  // Set mounted dan listen untuk event dari Navbar
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

    // ✅ LISTEN UNTUK EVENT DARI NAVBAR
    const handleModeChange = (event) => {
      if (event.detail) {
        setCurrentMode(event.detail);
        setCurrentIndex(0);
        setIsFlipped(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    window.addEventListener('changeMode', handleModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('changeMode', handleModeChange);
    };
  }, []);


  useEffect(() => {
    if (!mounted) return undefined;
    const refreshPremium = () => {
      const progress = readLessonProgress();
      const level = getLevelInfo(readXp());
      const lessonSummary = getLessonSummary(englishLessons.length, nahwuLessons.length, progress);
      setLessonProgress(progress);
      setPremiumStats({ ...level, lessonPct: lessonSummary.percentage });
    };
    refreshPremium();
    window.addEventListener(PREMIUM_UPDATE_EVENT, refreshPremium);
    return () => window.removeEventListener(PREMIUM_UPDATE_EVENT, refreshPremium);
  }, [mounted, englishLessons.length, nahwuLessons.length]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const loadBookmarks = (vocabulary) => {
    try {
      const saved = JSON.parse(localStorage.getItem('lingospace_bookmarks') || '[]');
      const normalized = normalizeBookmarkIds(saved, vocabulary);
      setBookmarks(normalized);
      localStorage.setItem('lingospace_bookmarks', JSON.stringify(normalized));
      markSyncDirty('bookmarks-migration');
    } catch (e) {
      console.error('Error loading bookmarks:', e);
      setBookmarks([]);
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
        const safeVocabData = Array.isArray(vocabData) ? vocabData : [];
        setAllData(safeVocabData);
        setFilteredData(safeVocabData);
        loadBookmarks(safeVocabData);
        readAndMigrateSrs(safeVocabData);
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
      const srsData = readAndMigrateSrs(allData);
      let mastered = 0, learning = 0, newWords = 0;
      let totalCorrect = 0, totalWrong = 0;

      allData.forEach((item) => {
        const srs = srsData[String(item.id)];
        const level = srs?.level || 0;
        const correct = srs?.correct || 0;
        const wrong = srs?.wrong || 0;
        const hasHistory = Boolean(srs) && (level > 0 || correct > 0 || wrong > 0);

        if (!hasHistory) newWords++;
        else if (level >= 4) mastered++;
        else learning++;

        totalCorrect += correct;
        totalWrong += wrong;
      });

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
  }, [allData, bookmarks, mounted, srsVersion]);

  useEffect(() => {
    if (!mounted || allData.length === 0) return;
    try {
      const srsData = readAndMigrateSrs(allData);
      const activitySummary = getActivitySummary(readActivity());
      const dailyGoal = readDailyGoal();
      const openMistakes = getOpenMistakes(allData, readMistakes());
      const due = getDueVocabulary(allData, srsData);
      setLearningStats({
        dueCount: due.length,
        todayWords: activitySummary.todayWords,
        todayActions: activitySummary.todayActions,
        streak: activitySummary.streak,
        activeToday: activitySummary.activeToday,
        dailyGoal,
        mistakes: openMistakes.length,
      });
    } catch (error) {
      console.error('Error calculating learning engine stats:', error);
    }
  }, [allData, mounted, srsVersion, learningVersion]);

  const refreshLearningEngine = () => {
    setSrsVersion((version) => version + 1);
    setLearningVersion((version) => version + 1);
  };

  const applyLearningGrade = (item, grade, source = 'flashcard') => {
    if (!item?.id) return null;
    try {
      const srsData = readAndMigrateSrs(allData);
      const result = gradeSrsWord(srsData, item.id, grade);
      const isCorrect = grade !== 'again';
      recordActivity({ wordId: item.id, type: source, correct: isCorrect });
      if (grade === 'again') recordMistake(item.id, source);
      if (grade === 'good' || grade === 'easy') resolveMistake(item.id);
      if (grade === 'easy') addXp(4, source);
      else if (grade === 'good') addXp(3, source);
      else if (grade === 'hard') addXp(1, source);
      refreshLearningEngine();
      return result.record;
    } catch (error) {
      console.error('Error applying SRS grade:', error);
      return null;
    }
  };

  const updateDailyGoal = (goal) => {
    const numericGoal = Number(goal);
    saveDailyGoal(numericGoal);
    setLearningStats((current) => ({ ...current, dailyGoal: numericGoal }));
  };

  const startReviewSession = () => {
    const srsData = readAndMigrateSrs(allData);
    const due = getDueVocabulary(allData, srsData).slice(0, 30);
    setReviewQueue(due);
    setReviewIndex(0);
    setReviewComplete(false);
    setReviewRevealed(false);
  };

  const rateReviewCard = (grade) => {
    const item = reviewQueue[reviewIndex];
    if (!item) return;
    applyLearningGrade(item, grade, 'review');
    setReviewRevealed(false);
    if (reviewIndex >= reviewQueue.length - 1) {
      setReviewComplete(true);
      setReviewIndex(reviewQueue.length);
    } else {
      setReviewIndex((index) => index + 1);
    }
  };

  useEffect(() => {
    if (!mounted) return undefined;
    const handleRestoredData = () => {
      if (allData.length) {
        try {
          const saved = JSON.parse(localStorage.getItem('lingospace_bookmarks') || '[]');
          setBookmarks(normalizeBookmarkIds(saved, allData));
        } catch { setBookmarks([]); }
      }
      setSrsVersion((version) => version + 1);
      setLearningVersion((version) => version + 1);
      const progress = readLessonProgress();
      const level = getLevelInfo(readXp());
      const lessonSummary = getLessonSummary(englishLessons.length, nahwuLessons.length, progress);
      setLessonProgress(progress);
      setPremiumStats({ ...level, lessonPct: lessonSummary.percentage });
    };
    window.addEventListener('lingospace:local-data-restored', handleRestoredData);
    return () => window.removeEventListener('lingospace:local-data-restored', handleRestoredData);
  }, [mounted, allData, englishLessons.length, nahwuLessons.length]);

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
      markSyncDirty('bookmarks');
    } catch (e) {
      console.error('Error saving bookmarks:', e);
    }
  };

  const rateCard = (grade) => {
    if (filteredData.length === 0) return;
    const item = filteredData[currentIndex];
    applyLearningGrade(item, grade, 'flashcard');
    nextCard();
  };


  const startQuiz = () => {
    if (filteredData.length < 4) {
      alert('Minimal 4 kosakata diperlukan untuk kuis. Silakan tambahkan lebih banyak kosakata atau ubah filter.');
      return;
    }
    
    try {
      const shuffled = [...filteredData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));
      
      const quiz = selected.map(item => {
        const correctLabel = normalizeWordKey(item.id_lang);
        const uniqueWrongOptions = [];
        const seenLabels = new Set([correctLabel]);
        [...filteredData]
          .sort(() => 0.5 - Math.random())
          .forEach((candidate) => {
            const label = normalizeWordKey(candidate.id_lang);
            if (candidate.id === item.id || !label || seenLabels.has(label) || uniqueWrongOptions.length >= 3) return;
            seenLabels.add(label);
            uniqueWrongOptions.push(candidate);
          });
        const wrongOptions = uniqueWrongOptions;
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
      setQuizWrongCount(0);
      setQuizHistory([]);
      setQuizStarted(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Terjadi kesalahan saat memulai kuis. Silakan coba lagi.');
    }
  };

  const answerQuiz = (selectedIndex) => {
    if (quizAnswered || quizData.length === 0) return;
    
    const q = quizData[quizIndex];
    if (!q) return;
    
    const isCorrect = q.options[selectedIndex].correct;
    setQuizSelected(selectedIndex);
    setQuizAnswered(true);
    
    const word = allData.find((item) => item.id === q.wordId);
    if (word) applyLearningGrade(word, isCorrect ? 'good' : 'again', 'quiz');

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

    const selected = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, Math.min(10, filteredData.length));
    const questions = selected.map((item) => {
      const seen = new Set([normalizeWordKey(item.id_lang)]);
      const wrong = [];
      [...filteredData].sort(() => 0.5 - Math.random()).forEach((candidate) => {
        const label = normalizeWordKey(candidate.id_lang);
        if (candidate.id === item.id || !label || seen.has(label) || wrong.length >= 3) return;
        seen.add(label);
        wrong.push(candidate);
      });
      const options = [
        { id: item.id, text: item.id_lang, correct: true },
        ...wrong.map((entry) => ({ id: entry.id, text: entry.id_lang, correct: false })),
      ].sort(() => 0.5 - Math.random());
      return { wordId: item.id, item, options };
    });

    setListenData(questions);
    setListenIndex(0);
    setListenScore(0);
    setListenHistory([]);
    setListenAnswered(false);
    setListenSelected(null);
    setListenStarted(true);
  };

  const answerListen = (selectedIndex) => {
    if (listenAnswered || !listenStarted) return;
    const question = listenData[listenIndex];
    if (!question) return;
    const selected = question.options[selectedIndex];
    const isCorrect = Boolean(selected?.correct);

    setListenSelected(selectedIndex);
    setListenAnswered(true);
    if (isCorrect) setListenScore((score) => score + 1);
    applyLearningGrade(question.item, isCorrect ? 'good' : 'again', 'listening');
    setListenHistory((history) => [...history, {
      wordId: question.wordId,
      prompt: listenLang === 'en' ? question.item.en : question.item.ar,
      selectedAnswer: selected?.text,
      correctAnswer: question.item.id_lang,
      isCorrect,
    }]);

    const isLast = listenIndex >= listenData.length - 1;
    setTimeout(() => {
      if (isLast) {
        setListenStarted(false);
        setListenIndex(listenData.length);
      } else {
        setListenIndex((index) => index + 1);
        setListenAnswered(false);
        setListenSelected(null);
      }
    }, 1500);
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
    const learnedTotal = stats.mastered + stats.learning;
    const overallPct = stats.totalWords > 0 ? Math.round((learnedTotal / stats.totalWords) * 100) : 0;

    const goTo = (mode) => {
      window.dispatchEvent(new CustomEvent('changeMode', { detail: mode }));
    };

    return (
      <div className="animate-fade-in dashboard-v2">
        {installPrompt && !isInstalled && (
          <div className="install-banner">
            <div className="flex items-center gap-3 min-w-0">
              <span className="install-banner-icon"><Sparkles size={20} /></span>
              <div className="min-w-0">
                <h3 className="font-bold app-heading">Install LingoSpace Pro</h3>
                <p className="text-sm app-muted">Buka lebih cepat seperti aplikasi dari layar utama perangkat.</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleInstall} className="btn-primary-v2">Install</button>
              <button onClick={() => setInstallPrompt(null)} className="btn-secondary-v2">Nanti</button>
            </div>
          </div>
        )}

        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <span className="eyebrow-badge"><Sparkles size={14} /> Belajar lebih terarah</span>
            <h2 className="dashboard-title">Bangun kebiasaan bahasa, sedikit demi sedikit.</h2>
            <p className="dashboard-subtitle">
              Selesaikan target harian, review kosakata tepat waktu, dan fokuskan latihan pada kata yang masih sering salah.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => goTo(learningStats.dueCount > 0 ? 'review' : 'flashcard')} className="dashboard-primary-cta">
                {learningStats.dueCount > 0 ? <CalendarClock size={18} /> : <BookOpen size={18} />}
                {learningStats.dueCount > 0 ? `Review ${learningStats.dueCount} kata` : 'Lanjutkan Flashcard'} <ArrowRight size={17} />
              </button>
              <button onClick={() => goTo('quiz')} className="dashboard-secondary-cta">
                <Brain size={18} /> Mulai Quiz
              </button>
            </div>
          </div>

          <div className="dashboard-progress-orb-wrap">
            <div className="dashboard-progress-orb" style={{ '--progress': `${overallPct * 3.6}deg` }}>
              <div className="dashboard-progress-orb-inner">
                <span className="text-3xl sm:text-4xl font-black app-heading">{overallPct}%</span>
                <span className="text-xs app-muted">sudah dipelajari</span>
              </div>
            </div>
            <p className="text-xs app-muted text-center mt-3">{learnedTotal} dari {stats.totalWords} kosakata</p>
          </div>
        </section>

        <section className="learning-pulse-grid">
          <article className="learning-pulse-card">
            <span className="learning-pulse-icon tone-violet"><Target size={20} /></span>
            <div className="min-w-0 flex-1"><p className="text-xs app-muted">Target hari ini</p><p className="text-lg font-black app-heading mt-1">{learningStats.todayWords}/{learningStats.dailyGoal} kata</p><div className="progress-track-v2 mt-3"><div className="progress-bar-v2 progress-primary" style={{ width: `${Math.min(100, Math.round((learningStats.todayWords / Math.max(1, learningStats.dailyGoal)) * 100))}%` }} /></div></div>
            <select value={learningStats.dailyGoal} onChange={(e) => updateDailyGoal(e.target.value)} className="goal-select" aria-label="Target harian">{[5,10,20,30,50].map((goal) => <option key={goal} value={goal}>{goal}</option>)}</select>
          </article>
          <button onClick={() => goTo('review')} className="learning-pulse-card text-left">
            <span className="learning-pulse-icon tone-cyan"><CalendarClock size={20} /></span><div><p className="text-xs app-muted">Review hari ini</p><p className="text-lg font-black app-heading mt-1">{learningStats.dueCount} kata</p><p className="text-xs app-muted mt-1">SRS siap dijalankan</p></div><ArrowRight size={17} className="ml-auto app-muted" />
          </button>
          <button onClick={() => goTo('mistakes')} className="learning-pulse-card text-left">
            <span className="learning-pulse-icon tone-amber"><AlertTriangle size={20} /></span><div><p className="text-xs app-muted">Mistake Book</p><p className="text-lg font-black app-heading mt-1">{learningStats.mistakes} kata</p><p className="text-xs app-muted mt-1">Perlu diperkuat</p></div><ArrowRight size={17} className="ml-auto app-muted" />
          </button>
          <article className="learning-pulse-card"><span className="learning-pulse-icon tone-emerald"><Flame size={20} /></span><div><p className="text-xs app-muted">Streak belajar</p><p className="text-lg font-black app-heading mt-1">{learningStats.streak} hari</p><p className="text-xs app-muted mt-1">{learningStats.activeToday ? 'Aktif hari ini' : 'Belum belajar hari ini'}</p></div></article>
        </section>

        <section className="premium-dashboard-strip">
          <div className="premium-level-summary">
            <span className="premium-level-icon"><Trophy size={22} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-xs app-muted">Level {premiumStats.level} • {premiumStats.title}</p>
              <div className="flex items-end justify-between gap-3 mt-1"><strong className="app-heading">{premiumStats.totalXp} XP</strong><span className="text-xs app-muted">{premiumStats.remaining} XP ke level berikutnya</span></div>
              <div className="progress-track-v2 mt-2"><div className="progress-bar-v2 progress-primary" style={{ width: `${premiumStats.progress}%` }} /></div>
            </div>
          </div>
          <button onClick={() => goTo('speaking')}><Sparkles size={18} /><span><strong>Speaking</strong><small>Latih pronunciation</small></span><ArrowRight size={16} /></button>
          <button onClick={() => goTo('games')}><Brain size={18} /><span><strong>Mini Games</strong><small>Belajar lebih seru</small></span><ArrowRight size={16} /></button>
          <button onClick={() => goTo('analytics')}><TrendingUp size={18} /><span><strong>Analytics</strong><small>{premiumStats.lessonPct}% lesson selesai</small></span><ArrowRight size={16} /></button>
        </section>

        <section className="dashboard-stat-grid">
          {[
            { icon: Library, value: stats.totalWords, label: 'Total kosakata', note: 'Database belajar', tone: 'violet' },
            { icon: CheckCircle2, value: stats.mastered, label: 'Dikuasai', note: `${masteredPct}% dari seluruh kata`, tone: 'emerald' },
            { icon: TrendingUp, value: stats.learning, label: 'Sedang dipelajari', note: `${learningPct}% masih berproses`, tone: 'amber' },
            { icon: Target, value: `${stats.accuracy}%`, label: 'Akurasi', note: 'Berdasarkan riwayat latihan', tone: 'cyan' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="dashboard-stat-card">
                <span className={`dashboard-stat-icon tone-${stat.tone}`}><Icon size={20} /></span>
                <div className="mt-5">
                  <p className="dashboard-stat-value">{stat.value}</p>
                  <p className="text-sm font-bold app-heading mt-1">{stat.label}</p>
                  <p className="text-xs app-muted mt-1">{stat.note}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="dashboard-two-column">
          <article className="dashboard-panel">
            <div className="panel-heading-row">
              <div>
                <p className="panel-kicker">PROGRESS KOSAKATA</p>
                <h3 className="panel-title">Perjalanan belajarmu</h3>
              </div>
              <span className="panel-icon"><TrendingUp size={19} /></span>
            </div>

            <div className="space-y-5 mt-6">
              {[
                { label: 'Dikuasai', value: masteredPct, count: stats.mastered, className: 'progress-success' },
                { label: 'Sedang dipelajari', value: learningPct, count: stats.learning, className: 'progress-warning' },
                { label: 'Belum dimulai', value: newPct, count: stats.newWords, className: 'progress-primary' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-end justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm font-semibold app-heading">{item.label}</p>
                      <p className="text-xs app-muted">{item.count} kosakata</p>
                    </div>
                    <span className="text-sm font-bold app-heading">{item.value}%</span>
                  </div>
                  <div className="progress-track-v2">
                    <div className={`progress-bar-v2 ${item.className}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="panel-heading-row">
              <div>
                <p className="panel-kicker">AKSES CEPAT</p>
                <h3 className="panel-title">Pilih aktivitas</h3>
              </div>
              <span className="panel-icon"><Sparkles size={19} /></span>
            </div>

            <div className="quick-action-grid mt-6">
              {[
                { mode: 'review', icon: CalendarClock, label: 'Review', note: `${learningStats.dueCount} jatuh tempo` },
                { mode: 'flashcard', icon: BookOpen, label: 'Flashcard', note: `${stats.newWords} kata baru` },
                { mode: 'quiz', icon: Brain, label: 'Quiz', note: 'Uji pemahaman' },
                { mode: 'listen', icon: Volume2, label: 'Listening', note: 'Sesi 10 soal' },
                { mode: 'mistakes', icon: AlertTriangle, label: 'Mistake Book', note: `${learningStats.mistakes} perlu dilatih` },
                { mode: 'bookmarks', icon: Heart, label: 'Favorit', note: `${stats.bookmarks} tersimpan` },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.mode} onClick={() => goTo(item.mode)} className="quick-action-card">
                    <span className="quick-action-icon"><Icon size={19} /></span>
                    <span className="min-w-0 text-left">
                      <span className="block text-sm font-bold app-heading">{item.label}</span>
                      <span className="block text-xs app-muted mt-0.5">{item.note}</span>
                    </span>
                    <ArrowRight size={16} className="quick-action-arrow" />
                  </button>
                );
              })}
            </div>
          </article>
        </section>

        <section className="dashboard-panel mt-5 sm:mt-6">
          <div className="panel-heading-row">
            <div>
              <p className="panel-kicker">PENCAPAIAN</p>
              <h3 className="panel-title">Milestone belajarmu</h3>
            </div>
            <span className="panel-icon"><Trophy size={19} /></span>
          </div>
          <div className="achievement-grid mt-6">
            {[
              { name: 'Langkah Pertama', note: 'Mulai belajar kosakata', req: learnedTotal >= 1, icon: BookOpen },
              { name: 'Mulai Mahir', note: 'Kuasai 5 kosakata', req: stats.mastered >= 5, icon: Trophy },
              { name: 'Akurat', note: 'Capai akurasi 80%', req: stats.accuracy >= 80, icon: Target },
              { name: 'Kolektor', note: 'Simpan 5 favorit', req: stats.bookmarks >= 5, icon: Heart },
            ].map((ach) => {
              const Icon = ach.icon;
              return (
                <div key={ach.name} className={`achievement-card ${ach.req ? 'is-unlocked' : ''}`}>
                  <span className="achievement-icon"><Icon size={19} /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold app-heading">{ach.name}</p>
                    <p className="text-xs app-muted mt-0.5">{ach.note}</p>
                  </div>
                  <span className={`achievement-state ${ach.req ? 'is-unlocked' : ''}`}>
                    {ach.req ? 'Tercapai' : 'Terkunci'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
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
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-widest mb-4 opacity-80">🇮🇩 Bahasa Indonesia</p>
              <h2 className="text-4xl md:text-5xl font-bold text-center">{item.id_lang || '-'}</h2>
              <p className="text-sm mt-8 opacity-60">Tap untuk melihat jawaban</p>
            </div>
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-pink-600 to-red-600 text-white rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl rotate-y-180">
              <div className="text-center w-full">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">🇬 English</p>
                <h3 className="text-3xl font-bold mb-4">{item.en || '-'}</h3>
                <div className="border-t border-white/30 my-3"></div>
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">🇸🇦 العربية (Arabic)</p>
                <h3 className="text-4xl font-bold text-right" dir="rtl">{item.ar || '-'}</h3>
                {item.pronunciation && (
                  <p className="text-sm mt-3 text-pink-200 italic">({item.pronunciation})</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button onClick={() => playAudio(item.id_lang, 'id')} className="speaker-btn px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press"> Indonesia</button>
          <button onClick={() => playAudio(item.en, 'en')} className="speaker-btn px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press"> English</button>
          <button onClick={() => playAudio(item.ar, 'ar')} className="speaker-btn px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press"> العربية</button>
          <button onClick={() => toggleBookmark(item.id)} className="px-5 py-3 rounded-full glass-modern hover:scale-105 transition-transform flex items-center gap-2 btn-press">
            {isBookmarked ? '⭐ Tersimpan' : '☆ Favorit'}
          </button>
        </div>

        {isFlipped && (
          <div className="srs-rating-grid max-w-2xl mx-auto mt-4 animate-fade-in">
            {Object.entries(SRS_GRADES).map(([grade, meta]) => (
              <button key={grade} onClick={() => rateCard(grade)} className={`srs-grade-button grade-${meta.tone}`}>
                <span>{meta.label}</span><small>{meta.hint}</small>
              </button>
            ))}
          </div>
        )}

        {(item.example_id || item.example_en || item.example_ar) && (
          <div className="max-w-2xl mx-auto mt-8 glass-modern rounded-2xl p-6">
            <p className="text-xs uppercase text-gray-400 mb-4 text-center tracking-widest">💬 Contoh Kalimat</p>
            <div className="space-y-4">
              {item.example_id && (
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span>🇮🇩</span> Indonesia
                    </span>
                    <button onClick={() => playAudio(item.example_id, 'id')} className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs flex items-center gap-1">🔊 Dengarkan</button>
                  </div>
                  <p className="text-base text-gray-200">{item.example_id}</p>
                </div>
              )}
              {item.example_en && (
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span>🇬🇧</span> English
                    </span>
                    <button onClick={() => playAudio(item.example_en, 'en')} className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors btn-press text-xs flex items-center gap-1">🔊 Listen</button>
                  </div>
                  <p className="text-base text-blue-200 italic">{item.example_en}</p>
                </div>
              )}
              {item.example_ar && (
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span>🇸🇦</span> العربية
                    </span>
                    <button onClick={() => playAudio(item.example_ar, 'ar')} className="px-3 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/40 transition-colors btn-press text-xs flex items-center gap-1">🔊 استمع</button>
                  </div>
                  <p className="text-xl text-purple-300 text-right mb-2 leading-loose" dir="rtl">{item.example_ar}</p>
                  {item.example_pronunciation && (
                    <p className="text-sm text-pink-200 italic text-center mt-2">({item.example_pronunciation})</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (!quizStarted && quizData.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-modern rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="text-6xl sm:text-7xl md:text-8xl mb-4 animate-bounce">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quiz Mode</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 md:mb-8">Uji kemampuan kosakata Anda dengan 10 soal pilihan ganda</p>
            <button onClick={startQuiz} className="px-6 sm:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-base sm:text-lg hover:scale-110 hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 btn-press shadow-lg shadow-violet-500/30">🚀 Mulai Kuis</button>
          </div>
        </div>
      );
    }

    if (!quizStarted && quizData.length > 0 && quizIndex >= quizData.length) {
      const pct = Math.round((quizScore / quizData.length) * 100);
      const wrongCount = quizData.length - quizScore;
      let emoji, message, gradientColor;
      
      if (pct >= 80) {
        emoji = '';
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
            <div className="text-7xl sm:text-8xl md:text-9xl mb-4 animate-bounce">{emoji}</div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>{message}</h2>
            <div className="mb-6 md:mb-8">
              <p className="text-gray-400 text-sm sm:text-base mb-2">Kuis Selesai! Skor Akhir Anda</p>
              <div className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {quizScore} <span className="text-2xl sm:text-3xl text-gray-500">/ {quizData.length}</span>
              </div>
              <div className="inline-block mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm sm:text-base">{pct}% Benar</div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 md:mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20">
                <div className="text-4xl sm:text-5xl mb-2">✅</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-green-400 mb-1">{quizScore}</div>
                <div className="text-xs sm:text-sm text-green-300 font-semibold">Jawaban Benar</div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border-2 border-red-500/40 p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/20">
                <div className="text-4xl sm:text-5xl mb-2">❌</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-red-400 mb-1">{wrongCount}</div>
                <div className="text-xs sm:text-sm text-red-300 font-semibold">Jawaban Salah</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={startQuiz} className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-sm sm:text-base hover:scale-110 hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 btn-press shadow-lg shadow-violet-500/30">🔄 Coba Lagi</button>
              <button onClick={() => { setQuizData([]); setQuizIndex(0); setQuizScore(0); setQuizWrongCount(0); setQuizHistory([]); setQuizStarted(false); }} className="px-6 sm:px-8 py-3 rounded-full bg-white/5 border border-white/20 font-semibold text-sm sm:text-base hover:bg-white/10 hover:scale-105 transition-all duration-300 btn-press">📚 Kembali</button>
            </div>
          </div>
        </div>
      );
    }

    if (quizData.length > 0 && quizIndex < quizData.length) {
      const q = quizData[quizIndex];
      return (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="glass-modern rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400">Soal</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold text-xs sm:text-sm">{quizIndex + 1}/{quizData.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400">Skor:</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-bold text-xs sm:text-sm">{quizScore}</span>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6 md:mb-8">
              <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out" style={{ width: `${((quizIndex + 1) / quizData.length) * 100}%` }}></div>
            </div>
            <div className="mb-6 md:mb-8 text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">Apa arti dari:</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{q.question}</h2>
              {q.questionAr && (
                <p className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-4 text-right" dir="rtl">{q.questionAr}</p>
              )}
              <button onClick={() => playAudio(q.question, 'en')} className="speaker-btn px-4 sm:px-5 py-2 rounded-full glass-modern text-xs sm:text-sm hover:scale-110 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 btn-press inline-flex items-center gap-2">🔊 Dengarkan</button>
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
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                      <span className="truncate">{opt.text}</span>
                    </span>
                    {quizAnswered && isCorrect && <span className="text-xl sm:text-2xl animate-bounce ml-2">✓</span>}
                    {quizAnswered && isSelected && !isCorrect && <span className="text-xl sm:text-2xl ml-2">✕</span>}
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
                  <><span className="text-2xl">🎉</span><span>Benar! Hebat!</span></>
                ) : (
                  <><span className="text-2xl">😔</span><span>Salah! Jawaban yang benar: <strong>{q.options.find(o => o.correct).text}</strong></span></>
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
    if (!listenStarted && listenData.length > 0 && listenIndex >= listenData.length) {
      const pct = Math.round((listenScore / listenData.length) * 100);
      return (
        <div className="learning-session-wrap animate-fade-in">
          <div className="learning-result-card">
            <span className="learning-result-icon"><Headphones size={30} /></span>
            <p className="panel-kicker">LISTENING SELESAI</p>
            <h2 className="text-3xl font-black app-heading mt-2">{listenScore}/{listenData.length} benar</h2>
            <p className="app-muted mt-2">Akurasi sesi {pct}%. Kata yang salah otomatis masuk Mistake Book dan dijadwalkan ulang.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button onClick={startListen} className="dashboard-primary-cta"><RotateCcw size={17} /> Ulangi Sesi</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('changeMode', { detail: 'mistakes' }))} className="dashboard-secondary-cta"><AlertTriangle size={17} /> Mistake Book</button>
            </div>
          </div>
        </div>
      );
    }

    if (!listenStarted || listenData.length === 0) {
      return (
        <div className="learning-session-wrap">
          <div className="learning-start-card">
            <span className="learning-start-icon"><Headphones size={28} /></span>
            <p className="panel-kicker">LISTEN & LEARN</p>
            <h2 className="text-2xl sm:text-3xl font-black app-heading mt-2">Sesi listening 10 soal</h2>
            <p className="app-muted mt-2">Setiap soal mengambil kosakata dan opsi baru. Jawaban salah akan masuk ke Mistake Book.</p>
            <div className="flex gap-3 mt-5 justify-center">
              <button onClick={() => setListenLang('en')} className={`language-pill ${listenLang === 'en' ? 'is-active' : ''}`}>English</button>
              <button onClick={() => setListenLang('ar')} className={`language-pill ${listenLang === 'ar' ? 'is-active' : ''}`}>العربية</button>
            </div>
            <button onClick={startListen} className="dashboard-primary-cta mt-6"><Volume2 size={18} /> Mulai Listening</button>
          </div>
        </div>
      );
    }

    const question = listenData[listenIndex];
    const item = question?.item || {};
    return (
      <div className="learning-session-wrap">
        <div className="glass-modern rounded-2xl p-5 sm:p-8 text-center">
          <div className="session-meta-row">
            <span>Soal {listenIndex + 1}/{listenData.length}</span>
            <strong>{listenScore} benar</strong>
          </div>
          <div className="progress-track-v2 mt-3 mb-8"><div className="progress-bar-v2 progress-primary" style={{ width: `${((listenIndex + 1) / listenData.length) * 100}%` }} /></div>
          <button onClick={() => playAudio(listenLang === 'en' ? item.en : item.ar, listenLang)} className="listening-play-button" aria-label="Putar audio"><Volume2 size={38} /></button>
          <p className="app-muted text-sm mt-4">Dengarkan lalu pilih arti Bahasa Indonesia.</p>
          <div className="flex gap-2 mt-4 justify-center">
            <button onClick={() => setListenLang('en')} className={`language-pill ${listenLang === 'en' ? 'is-active' : ''}`}>English</button>
            <button onClick={() => setListenLang('ar')} className={`language-pill ${listenLang === 'ar' ? 'is-active' : ''}`}>العربية</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
            {question.options.map((opt, i) => {
              const selected = listenSelected === i;
              const stateClass = listenAnswered ? (opt.correct ? 'is-correct' : selected ? 'is-wrong' : 'is-dimmed') : '';
              return (
                <button key={`${question.wordId}-${opt.id}`} onClick={() => answerListen(i)} disabled={listenAnswered} className={`learning-option ${stateClass}`}>
                  <span>{String.fromCharCode(65 + i)}</span><strong>{opt.text}</strong>
                  {listenAnswered && opt.correct && <Check size={18} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const dueNow = getDueVocabulary(allData, readAndMigrateSrs(allData));
    if (reviewComplete) {
      return (
        <div className="learning-session-wrap animate-fade-in">
          <div className="learning-result-card">
            <span className="learning-result-icon"><CheckCircle2 size={30} /></span>
            <p className="panel-kicker">REVIEW SELESAI</p>
            <h2 className="text-3xl font-black app-heading mt-2">Sesi review beres</h2>
            <p className="app-muted mt-2">Kamu menyelesaikan {reviewQueue.length} kartu. Jadwal berikutnya sudah dihitung otomatis.</p>
            <button onClick={startReviewSession} className="dashboard-primary-cta mt-6"><RotateCcw size={17} /> Cek Review Lagi</button>
          </div>
        </div>
      );
    }

    if (reviewQueue.length === 0 || reviewIndex >= reviewQueue.length) {
      return (
        <div className="learning-session-wrap">
          <div className="learning-start-card">
            <span className="learning-start-icon"><CalendarClock size={28} /></span>
            <p className="panel-kicker">SPACED REPETITION</p>
            <h2 className="text-2xl sm:text-3xl font-black app-heading mt-2">{dueNow.length ? `${dueNow.length} kata siap direview` : 'Semua review sudah beres'}</h2>
            <p className="app-muted mt-2">LingoSpace menjadwalkan ulang setiap kosakata berdasarkan tingkat kesulitan yang kamu pilih.</p>
            {dueNow.length > 0 && <button onClick={startReviewSession} className="dashboard-primary-cta mt-6"><CalendarClock size={18} /> Mulai Review</button>}
          </div>
        </div>
      );
    }

    const item = reviewQueue[reviewIndex];
    return (
      <div className="learning-session-wrap animate-fade-in">
        <div className="session-meta-row mb-3"><span>Review {reviewIndex + 1}/{reviewQueue.length}</span><strong>{reviewQueue.length - reviewIndex - 1} tersisa</strong></div>
        <div className="review-card-v3">
          <p className="panel-kicker">BAHASA INDONESIA</p>
          <h2 className="text-3xl sm:text-5xl font-black app-heading mt-4">{item.id_lang}</h2>
          {!reviewRevealed ? (
            <button onClick={() => setReviewRevealed(true)} className="dashboard-primary-cta mt-8"><Sparkles size={17} /> Tampilkan Jawaban</button>
          ) : (
            <div className="animate-fade-in">
              <div className="review-answer-grid mt-8">
                <div><span>English</span><strong>{item.en}</strong></div>
                <div><span>العربية</span><strong dir="rtl" className="arabic-text">{item.ar}</strong></div>
              </div>
              <div className="flex justify-center gap-2 mt-5">
                <button onClick={() => playAudio(item.en, 'en')} className="dashboard-secondary-cta"><Volume2 size={16} /> English</button>
                <button onClick={() => playAudio(item.ar, 'ar')} className="dashboard-secondary-cta"><Volume2 size={16} /> العربية</button>
              </div>
            </div>
          )}
        </div>
        {reviewRevealed && (
          <div className="srs-rating-grid mt-4 animate-fade-in">
            {Object.entries(SRS_GRADES).map(([grade, meta]) => (
              <button key={grade} onClick={() => rateReviewCard(grade)} className={`srs-grade-button grade-${meta.tone}`}><span>{meta.label}</span><small>{meta.hint}</small></button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMistakes = () => {
    const openMistakes = getOpenMistakes(allData, readMistakes());
    const practiceWord = (item) => {
      setSearchInput(item.id_lang);
      window.dispatchEvent(new CustomEvent('changeMode', { detail: 'flashcard' }));
    };
    return (
      <div className="animate-fade-in dashboard-v2">
        <div className="panel-heading-row mb-5">
          <div><p className="panel-kicker">MISTAKE BOOK</p><h2 className="text-2xl sm:text-3xl font-black app-heading mt-1">Kosakata yang perlu diperkuat</h2><p className="app-muted text-sm mt-2">Jawaban salah dari Flashcard, Quiz, Review, dan Listening dikumpulkan otomatis di sini.</p></div>
          <span className="panel-icon"><AlertTriangle size={20} /></span>
        </div>
        {openMistakes.length === 0 ? (
          <div className="learning-start-card"><span className="learning-start-icon"><CheckCircle2 size={28} /></span><h3 className="text-xl font-bold app-heading mt-3">Tidak ada kesalahan aktif</h3><p className="app-muted mt-2">Bagus. Kata yang sudah kamu pahami akan keluar dari daftar ini.</p></div>
        ) : (
          <div className="mistake-grid">
            {openMistakes.map(({ item, meta }) => (
              <article key={item.id} className="mistake-card">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs app-muted">Salah {meta.count}×</p><h3 className="text-xl font-black app-heading mt-1">{item.id_lang}</h3></div>
                  <button onClick={() => playAudio(item.en, 'en')} className="icon-button"><Volume2 size={17} /></button>
                </div>
                <p className="text-sm app-muted mt-3">{item.en}</p><p className="arabic-text text-xl app-heading mt-1" dir="rtl">{item.ar}</p>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => practiceWord(item)} className="dashboard-primary-cta flex-1">Latih</button>
                  <button onClick={() => { resolveMistake(item.id); setLearningVersion((v) => v + 1); }} className="dashboard-secondary-cta">Dipahami</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };


  const renderBookmarks = () => {
    const bookmarkedData = allData.filter(item => bookmarks.includes(item.id));
    
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
              <div key={item.id} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">{item.category}</span>
                  <button onClick={() => toggleBookmark(item.id)} className="text-yellow-400 hover:scale-110 transition-transform">⭐</button>
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
          <button onClick={() => { setRoadmapLang('English'); setExpandedLevel(null); }} className={`px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all btn-press text-xs sm:text-sm ${roadmapLang === 'English' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'glass-modern hover:scale-105'}`}>🇬🇧 Bahasa Inggris</button>
          <button onClick={() => { setRoadmapLang('Arabic'); setExpandedLevel(null); }} className={`px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all btn-press text-xs sm:text-sm ${roadmapLang === 'Arabic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'glass-modern hover:scale-105'}`}>🇸 Bahasa Arab</button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {filteredRoadmap.map((level, idx) => {
            const lessons = getLessonsForLevel(level.level);
            const isExpanded = expandedLevel === level.id;
            
            return (
              <div key={idx} className="glass-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover-lift">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl ${lessons.length > 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-600'}`}>
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
                      <button onClick={() => setExpandedLevel(isExpanded ? null : level.id)} className="mt-3 md:mt-4 px-4 sm:px-5 md:px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition-transform btn-press text-xs sm:text-sm">{isExpanded ? '🔼 Tutup' : '🚀 Mulai Belajar'}</button>
                    ) : (
                      <button disabled className="mt-3 md:mt-4 px-4 sm:px-5 md:px-6 py-2 rounded-full bg-gray-600 font-semibold cursor-not-allowed text-xs sm:text-sm">🔒 Segera Hadir</button>
                    )}
                  </div>
                </div>
                {isExpanded && lessons.length > 0 && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10 animate-fade-in">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4 text-purple-300">📚 Daftar Materi - Level {level.level}</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {lessons.map((lesson, lessonIdx) => (
                        <div key={lessonIdx} className="bg-white/5 rounded-lg p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 md:mb-3">
                            <div className="text-xl sm:text-2xl">{roadmapLang === 'Arabic' ? '' : '📘'}</div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm sm:text-base md:text-lg font-bold mb-1">{lesson.title}</h5>
                              <p className="text-gray-400 text-xs sm:text-sm">{lesson.content_id}</p>
                            </div>
                          </div>
                          {roadmapLang === 'Arabic' && lesson.content_ar && (
                            <div className="mb-2 md:mb-3 ml-7 sm:ml-8 md:ml-10">
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <p className="text-base sm:text-lg md:text-xl text-right flex-1" dir="rtl">{lesson.content_ar}</p>
                                <button onClick={() => playLessonAudio(lesson.content_ar, 'ar')} className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm"></button>
                              </div>
                            </div>
                          )}
                          {roadmapLang === 'English' && lesson.content_en && (
                            <div className="mb-2 md:mb-3 ml-7 sm:ml-8 md:ml-10">
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <p className="text-sm sm:text-base md:text-lg flex-1">{lesson.content_en}</p>
                                <button onClick={() => playLessonAudio(lesson.content_en, 'en')} className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm">🔊</button>
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
                                <button onClick={() => playLessonAudio(roadmapLang === 'Arabic' ? lesson.example_ar : lesson.example_en, roadmapLang === 'Arabic' ? 'ar' : 'en')} className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors btn-press text-xs sm:text-sm">🔊</button>
                              </div>
                              {(roadmapLang === 'Arabic' ? lesson.example_id : lesson.example_id) && (
                                <p className="text-xs sm:text-sm text-green-300">{lesson.example_id}</p>
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
            <button key={level.id} onClick={() => setNahwuLevel(level.id)} className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${nahwuLevel === level.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'}`}>{level.label}</button>
          ))}
          <button onClick={() => setNahwuLevel('all')} className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${nahwuLevel === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'}`}>Semua Materi</button>
        </div>
        <div className="mb-6 md:mb-8">
          <select value={nahwuCategory} onChange={(e) => setNahwuCategory(e.target.value)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm bg-transparent outline-none cursor-pointer text-white">
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
                <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold">{lesson.category}</span>
                <span className={`lesson-list-status ${lessonProgress.nahwu?.[lesson.id]?.completed ? 'done' : 'pending'}`}>{lessonProgress.nahwu?.[lesson.id]?.completed ? '✓ Selesai' : `Lv ${lesson.level}`}</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{lesson.content_id}</p>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); playArabicAudio(lesson.content_ar); }} className="px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm hover:bg-white/10 transition-all btn-press flex items-center gap-2">🔊 Dengarkan</button>
                <button onClick={(e) => { e.stopPropagation(); setNahwuModal(lesson); }} className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs sm:text-sm font-semibold hover:scale-105 transition-transform btn-press">Detail</button>
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
                      <button onClick={() => playArabicAudio(nahwuModal.content_ar)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"> Dengarkan Penjelasan</button>
                    )}
                    {nahwuModal.example_ar && (
                      <button onClick={() => playArabicAudio(nahwuModal.example_ar)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm"> Dengarkan Contoh</button>
                    )}
                  </div>
                </div>
                <LessonPractice type="nahwu" lesson={nahwuModal} allLessons={nahwuLessons} progress={lessonProgress} onProgressChange={setLessonProgress} />
                <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                  <button onClick={() => navigateNahwu('prev')} disabled={filteredLessons.findIndex(l => l.id === nahwuModal.id) === 0} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">← Sebelumnya</button>
                  <button onClick={() => navigateNahwu('next')} disabled={filteredLessons.findIndex(l => l.id === nahwuModal.id) === filteredLessons.length - 1} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">Selanjutnya →</button>
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
            <button key={level.id} onClick={() => setEnglishLevel(level.id)} className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${englishLevel === level.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'}`}>{level.label}</button>
          ))}
          <button onClick={() => setEnglishLevel('all')} className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all btn-press ${englishLevel === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 text-gray-300'}`}>Semua Materi</button>
        </div>
        <div className="mb-6 md:mb-8">
          <select value={englishCategory} onChange={(e) => setEnglishCategory(e.target.value)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm bg-transparent outline-none cursor-pointer text-white">
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
                <span className="px-2 sm:px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold">{lesson.category}</span>
                <span className={`lesson-list-status ${lessonProgress.english?.[lesson.id]?.completed ? 'done' : 'pending'}`}>{lessonProgress.english?.[lesson.id]?.completed ? '✓ Selesai' : `Lv ${lesson.level}`}</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{lesson.content_id}</p>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); playEnglishAudio(lesson.content_en); }} className="px-3 sm:px-4 py-2 rounded-full glass-modern text-xs sm:text-sm hover:bg-white/10 transition-all btn-press flex items-center gap-2">🔊 Dengarkan</button>
                <button onClick={(e) => { e.stopPropagation(); setEnglishModal(lesson); }} className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs sm:text-sm font-semibold hover:scale-105 transition-transform btn-press">Detail</button>
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
                    <button onClick={() => playEnglishAudio(englishModal.content_en)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm">🔊 Dengarkan Penjelasan</button>
                    {englishModal.example_en && (
                      <button onClick={() => playEnglishAudio(englishModal.example_en)} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press flex items-center gap-2 text-xs sm:text-sm">🔊 Dengarkan Contoh</button>
                    )}
                  </div>
                </div>
                <LessonPractice type="english" lesson={englishModal} allLessons={englishLessons} progress={lessonProgress} onProgressChange={setLessonProgress} />
                <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                  <button onClick={() => navigateEnglish('prev')} disabled={filteredLessons.findIndex(l => l.id === englishModal.id) === 0} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">← Sebelumnya</button>
                  <button onClick={() => navigateEnglish('next')} disabled={filteredLessons.findIndex(l => l.id === englishModal.id) === filteredLessons.length - 1} className="px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">Selanjutnya →</button>
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
      <div className="app-loader">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-semibold app-heading">Memuat LingoSpace Pro...</p>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="lingospace-workspace">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-modern {
          background: var(--app-surface);
          backdrop-filter: blur(18px) saturate(145%);
          border: 1px solid var(--app-border);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.08);
          color: var(--app-text);
        }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
        .btn-press { transition: transform 0.1s ease; }
        .btn-press:active { transform: scale(0.95); }
        .progress-animated {
          background: linear-gradient(90deg, var(--primary, #8b5cf6), var(--secondary, #ec4899));
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        button, a { outline: none; }
        button:focus-visible, a:focus-visible { outline: 2px solid #8b5cf6; outline-offset: 2px; }
        @supports (padding: max(0px)) {
          .safe-area-top { padding-top: max(env(safe-area-inset-top), 0.75rem); }
          .safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
        }
        @media (max-width: 640px) {
          button, a, select, input { min-height: 44px; }
        }
      `}</style>

      {/* Search & Filter - Only for flashcard/quiz/listen */}
      {currentMode !== 'dashboard' &&
       currentMode !== 'review' &&
       currentMode !== 'mistakes' &&
       currentMode !== 'bookmarks' &&
       currentMode !== 'roadmap' &&
       currentMode !== 'nahwu' &&
       currentMode !== 'english' &&
       currentMode !== 'dictionary' &&
       currentMode !== 'prayers' &&
       currentMode !== 'smarttranslator' && (
        <div className="content-toolbar mt-2 sm:mt-4">
          <div className="flex flex-wrap gap-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="workspace-select">
              <option value="all" className="bg-slate-800">Semua Kategori</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name} className="bg-slate-800">{cat.name}</option>
              ))}
            </select>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="🔍 Cari kosakata..." className="workspace-search" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="workspace-inner safe-area-bottom">
        {currentMode === 'dashboard' && renderDashboard()}
        {currentMode === 'flashcard' && renderFlashcard()}
        {currentMode === 'quiz' && renderQuiz()}
        {currentMode === 'listen' && renderListen()}
        {currentMode === 'review' && renderReview()}
        {currentMode === 'mistakes' && renderMistakes()}
        {currentMode === 'bookmarks' && renderBookmarks()}
        {currentMode === 'roadmap' && renderRoadmap()}
        {currentMode === 'nahwu' && renderNahwu()}
        {currentMode === 'english' && renderEnglish()}
      </main>

    </div>
  );
}
