"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Layers 
} from "lucide-react";

export default function LingoSpacePro({ level, allData, onBack }) {
  // --- States ---
  const [mounted, setMounted] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Stats SRS State
  const [stats, setStats] = useState({
    mastered: 0,
    learning: 0,
    newWords: 0
  });

  // Quiz States
  const [quizData, setQuizData] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // --- Effects ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch & Filter Data berdasarkan Level
  useEffect(() => {
    if (!mounted) return;

    const filtered = allData.filter(item => item.level === level.level);
    setLessons(filtered);
    setLoading(false);

    // Hitung statistik SRS dari localStorage
    let masteredCount = 0;
    let learningCount = 0;

    filtered.forEach(item => {
      const srsData = localStorage.getItem(`srs_${item.id}`);
      if (srsData) {
        const { stage } = JSON.parse(srsData);
        if (stage >= 5) masteredCount++;
        else if (stage > 0) learningCount++;
      }
    });

    setStats({
      mastered: masteredCount,
      learning: learningCount,
      newWords: filtered.length - (masteredCount + learningCount)
    });

    // Setup Kuis (Ambil acak maksimal 5 soal dari materi level ini)
    if (filtered.length > 0) {
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selectedQuiz = shuffled.slice(0, Math.random() > 0.5 ? 5 : Math.min(5, filtered.length));
      
      const formattedQuiz = selectedQuiz.map(item => {
        // Buat pilihan ganda acak
        const wrongOptions = allData
          .filter(d => d.english !== item.english)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(d => d.english);
        
        const options = [...wrongOptions, item.english].sort(() => 0.5 - Math.random());

        return {
          id: item.id,
          arabic: item.arabic,
          correctAnswer: item.english,
          options: options
        };
      });

      setQuizData(formattedQuiz);
    }
  }, [mounted, level.level, allData]);

  // --- Handlers ---
  const playAudio = (text, lang = "ar-SA") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSRSAction = (id, isCorrect) => {
    const key = `srs_${id}`;
    const srsData = localStorage.getItem(key);
    let currentStage = 0;

    if (srsData) {
      currentStage = JSON.parse(srsData).stage || 0;
    }

    let newStage = isCorrect ? currentStage + 1 : Math.max(0, currentStage - 1);
    localStorage.setItem(key, JSON.stringify({ stage: newStage, lastReview: Date.now() }));

    // Update state stats secara real-time
    setStats(prev => {
      let mastered = prev.mastered;
      let learning = prev.learning;

      // Logika perubahan status kartu
      if (currentStage === 0 && newStage > 0) {
        learning++;
      } else if (currentStage < 5 && newStage >= 5) {
        learning--;
        mastered++;
      } else if (currentStage >= 5 && newStage < 5) {
        mastered--;
        learning++;
      } else if (currentStage > 0 && newStage === 0) {
        learning--;
      }

      return {
        mastered,
        learning,
        newWords: lessons.length - (mastered + learning)
      };
    });
  };

  const answerQuiz = (option) => {
    if (quizAnswered) return;

    setSelectedAnswer(option);
    setQuizAnswered(true);

    const isCorrect = option === quizData[quizIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Update SRS berdasarkan performa kuis
    handleSRSAction(quizData[quizIndex].id, isCorrect);

    // Pindah otomatis ke soal berikutnya / menyelesaikan kuis setelah 2 detik
    setTimeout(() => {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizAnswered(false);
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizAnswered(false);
    // Acak ulang kuis dari data pelajaran yang ada
    if (lessons.length > 0) {
      const shuffled = [...lessons].sort(() => 0.5 - Math.random());
      const selectedQuiz = shuffled.slice(0, Math.min(5, lessons.length));
      const formattedQuiz = selectedQuiz.map(item => {
        const wrongOptions = allData
          .filter(d => d.english !== item.english)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(d => d.english);
        const options = [...wrongOptions, item.english].sort(() => 0.5 - Math.random());
        return {
          id: item.id,
          arabic: item.arabic,
          correctAnswer: item.english,
          options: options
        };
      });
      setQuizData(formattedQuiz);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mr-3" />
        <span>Memuat Modul Pro...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto p-4">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 p-6 rounded-2xl border border-purple-500/30 shadow-xl backdrop-blur-md">
        <div>
          <button 
            onClick={onBack}
            className="text-sm text-purple-300 hover:text-white transition flex items-center gap-1 mb-2"
          >
            ← Kembali ke Dashboard
          </button>
          <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            {level.title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-1">{level.description}</p>
        </div>
        
        {/* SRS Mini Trackers */}
        <div className="flex gap-3 bg-black/30 p-3 rounded-xl border border-white/5 self-start md:self-center">
          <div className="text-center px-2">
            <span className="block text-xs text-gray-400">Baru</span>
            <span className="text-sm font-bold text-blue-400">{stats.newWords}</span>
          </div>
          <div className="w-[1px] bg-white/10 self-stretch" />
          <div className="text-center px-2">
            <span className="block text-xs text-gray-400">Belajar</span>
            <span className="text-sm font-bold text-yellow-400">{stats.learning}</span>
          </div>
          <div className="w-[1px] bg-white/10 self-stretch" />
          <div className="text-center px-2">
            <span className="block text-xs text-gray-400">Master</span>
            <span className="text-sm font-bold text-green-400">{stats.mastered}</span>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KIRI: Interactive Challenge Area */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between min-h-[400px]">
          {quizData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
              <BookOpen className="w-12 h-12 text-purple-400 mb-3 animate-pulse" />
              <p className="text-gray-400">Belum ada data kuis untuk level ini.</p>
            </div>
          ) : quizIndex >= quizData.length ? (
            /* LAYAR SKOR AKHIR */
            <div className="text-center py-8 flex flex-col items-center justify-center flex-1 animate-fade-in">
              <div className="bg-gradient-to-tr from-yellow-400 to-amber-500 p-4 rounded-full shadow-lg shadow-yellow-500/20 mb-4 animate-bounce">
                <Award className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300">Sesi Latihan Selesai!</h3>
              <p className="text-gray-300 mt-2">
                Skor Anda: <span className="text-white font-black text-xl">{score}</span> dari {quizData.length} soal benar.
              </p>
              <p className="text-xs text-purple-300 max-w-sm mt-2">
                Sistem Spaced Repetition otomatis mengadaptasi interval memori Anda berdasarkan hasil tadi!
              </p>
              <button 
                onClick={resetQuiz}
                className="mt-6 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-xl font-medium tracking-wide transition shadow-lg shadow-purple-600/30"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Sesi
              </button>
            </div>
          ) : (
            /* PROSES KUIS AKTIF */
            <div className="flex flex-col justify-between flex-1">
              <div>
                {/* Progress Mini Bar */}
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span className="font-mono">SOAL {quizIndex + 1} / {quizData.length}</span>
                  <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800">
                    Sesi Aktif
                  </span>
                </div>
                
                <div className="w-full bg-white/5 h-1.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${((quizIndex + 1) / quizData.length) * 100}%` }}
                  />
                </div>

                {/* Stimulus Utama */}
                <div className="bg-black/20 rounded-xl p-8 text-center border border-white/5 mb-6 relative group">
                  <span className="absolute top-3 right-3 text-xs tracking-widest text-white/20 font-mono uppercase">Target</span>
                  <h3 className="text-4xl md:text-5xl font-bold text-right dir-rtl font-arabic text-amber-100 mb-4 drop-shadow">
                    {quizData[quizIndex].arabic}
                  </h3>
                  <button 
                    onClick={() => playAudio(quizData[quizIndex].arabic, "ar-SA")}
                    className="mx-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-full transition border border-white/10"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Dengarkan Audio
                  </button>
                </div>

                {/* Grid Pilihan Jawaban */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizData[quizIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === quizData[quizIndex].correctAnswer;
                    
                    let btnStyle = "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10";
                    if (quizAnswered) {
                      if (isCorrect) btnStyle = "bg-green-500/20 border-green-500 text-green-300 font-semibold";
                      else if (isSelected) btnStyle = "bg-red-500/20 border-red-500 text-red-300";
                      else btnStyle = "bg-white/5 border-white/5 text-gray-500 opacity-60";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => answerQuiz(option)}
                        className={`p-4 rounded-xl text-left border text-sm md:text-base transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {quizAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />}
                        {quizAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Feedback Bawah */}
              {quizAnswered && (
                <div className="mt-6 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between animate-fade-in text-xs md:text-sm">
                  <p className="text-gray-300">
                    {selectedAnswer === quizData[quizIndex].correctAnswer ? (
                      <span className="text-green-400 font-medium">✨ Jawaban Benar!</span>
                    ) : (
                      <span>
                        Jawaban tepat: <span className="text-amber-300 font-medium">{quizData[quizIndex].correctAnswer}</span>
                      </span>
                    )}
                  </p>
                  <span className="text-gray-500 italic flex items-center gap-1 animate-pulse">
                    Melangkah maju <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KANAN: Panduan Singkat Level */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-lg">Metode LingoSpace Pro</h3>
            </div>
            
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <span>Setiap jawaban kuis Anda akan dianalisis secara real-time oleh algoritma SRS internal.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <span>Kata yang salah dijawab otomatis diturunkan peringkat memorinya agar lebih sering diujikan kembali.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <span>Klik tombol daftar materi di bawah ini untuk mengulang pelafalan mandiri kapan saja.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER COLLAPSIBLE: Kamus Kosakata Komplit */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-lg">
              Kamus Kosa Kata Level Ini ({lessons.length} Item)
            </h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {isExpanded && lessons.length === 0 && (
          <p className="text-gray-400 text-sm mt-4 text-center py-4">Tidak ada materi terdaftar pada level ini.</p>
        )}

        {isExpanded && lessons.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
            <h4 className="text-lg font-semibold mb-4 text-purple-300">
              📖 Daftar Materi - Level {level.level}
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {lessons.map((item, idx) => {
                // Ambil stage saat ini dari localStorage
                const srsKey = `srs_${item.id}`;
                let currentStage = 0;
                if (typeof window !== "undefined") {
                  const srsData = localStorage.getItem(srsKey);
                  if (srsData) currentStage = JSON.parse(srsData).stage || 0;
                }

                return (
                  <div 
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/20 border border-white/5 p-4 rounded-xl hover:border-purple-500/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => playAudio(item.arabic, "ar-SA")}
                        className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 p-2.5 rounded-lg transition border border-purple-500/20"
                        title="Putar Audio Arab"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <div>
                        <p className="text-xl font-bold text-amber-100 font-arabic text-right sm:text-left dir-rtl">
                          {item.arabic}
                        </p>
                        <p className="text-sm text-gray-300 mt-0.5">
                          {item.english} <span className="text-gray-500 mx-1">•</span> <span className="text-xs text-gray-400 italic">{item.indonesian || "N/A"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Badge Status Review */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${
                        currentStage >= 5 ? "bg-green-500/10 border-green-500/30 text-green-400" :
                        currentStage > 0 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                        "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      }`}>
                        {currentStage >= 5 ? "Mastered" : currentStage > 0 ? `Learning (Lvl ${currentStage})` : "New Word"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
