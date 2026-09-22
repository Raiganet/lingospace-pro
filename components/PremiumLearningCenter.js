'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  Gamepad2,
  Headphones,
  Mic,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  WandSparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { getActivitySummary, readActivity, recordActivity, recordMistake, readMistakes } from '../lib/learningEngine';
import {
  XP_REWARDS,
  addXp,
  getLessonSummary,
  getLevelInfo,
  PREMIUM_UPDATE_EVENT,
  readLessonProgress,
  readXp,
  readXpHistory,
  scorePronunciation,
} from '../lib/premiumLearning';

const shuffle = (input = []) => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const todayKey = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const dayLabel = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('id-ID', { weekday: 'short' }).replace('.', '');
};

export default function PremiumLearningCenter({ view = 'speaking' }) {
  const [vocabulary, setVocabulary] = useState([]);
  const [englishLessons, setEnglishLessons] = useState([]);
  const [nahwuLessons, setNahwuLessons] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/vocabulary').then((res) => res.json()).catch(() => []),
      fetch('/api/english-lessons').then((res) => res.json()).catch(() => []),
      fetch('/api/nahwu-lessons').then((res) => res.json()).catch(() => []),
    ]).then(([vocab, english, nahwu]) => {
      if (!active) return;
      setVocabulary(Array.isArray(vocab) ? vocab : []);
      setEnglishLessons(Array.isArray(english) ? english : []);
      setNahwuLessons(Array.isArray(nahwu) ? nahwu : []);
      setLoaded(true);
    });
    return () => { active = false; };
  }, []);

  if (!loaded) {
    return <div className="premium-loading-card"><div className="app-loader-ring" /><p className="app-muted">Menyiapkan latihan premium...</p></div>;
  }

  if (view === 'games') return <MiniGames vocabulary={vocabulary} />;
  if (view === 'analytics') return <LearningAnalytics vocabulary={vocabulary} englishLessons={englishLessons} nahwuLessons={nahwuLessons} />;
  return <SpeakingPractice vocabulary={vocabulary} />;
}

function SpeakingPractice({ vocabulary }) {
  const [lang, setLang] = useState('en');
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  const candidates = useMemo(() => vocabulary.filter((item) => {
    if (lang === 'ar') return Boolean(item.ar);
    return Boolean(item.en);
  }), [vocabulary, lang]);

  const item = candidates[index % Math.max(1, candidates.length)] || null;
  const target = item ? (lang === 'ar' ? (item.example_ar || item.ar) : (item.example_en || item.en)) : '';
  const meaning = item ? (item.example_id || item.id_lang) : '';

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSupported(Boolean(SpeechRecognition));
    return () => recognitionRef.current?.abort?.();
  }, []);

  useEffect(() => {
    setIndex(0);
    setTranscript('');
    setResult(null);
  }, [lang]);

  const next = () => {
    if (!candidates.length) return;
    setIndex((current) => (current + 1 + Math.floor(Math.random() * 5)) % candidates.length);
    setTranscript('');
    setResult(null);
  };

  const speak = () => {
    if (!target || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = lang === 'ar' ? 0.72 : 0.82;
    window.speechSynthesis.speak(utterance);
  };

  const evaluate = (spoken) => {
    const scored = scorePronunciation(target, spoken, lang);
    setTranscript(spoken);
    setResult(scored);
    recordActivity({ wordId: item?.id, type: 'speaking', correct: scored.score >= 70 });
    if (scored.score < 70 && item?.id) recordMistake(item.id, 'speaking');
    addXp(scored.score >= 90 ? XP_REWARDS.speakingExcellent : scored.score >= 70 ? XP_REWARDS.speaking : 3, 'speaking');
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !target) return;
    recognitionRef.current?.abort?.();
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => evaluate(event.results?.[0]?.[0]?.transcript || '');
    recognitionRef.current = recognition;
    recognition.start();
  };

  const scoreTone = result?.score >= 90 ? 'excellent' : result?.score >= 70 ? 'good' : 'retry';

  return (
    <div className="premium-page animate-fade-in">
      <section className="premium-hero compact">
        <div>
          <span className="eyebrow-badge"><Mic size={14} /> Pronunciation Lab</span>
          <h2 className="premium-page-title">Speaking Practice</h2>
          <p className="premium-page-subtitle">Dengarkan, ucapkan kembali, lalu dapatkan skor kemiripan pengucapan langsung dari browser.</p>
        </div>
        <div className="segmented-control">
          <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>English</button>
          <button className={lang === 'ar' ? 'is-active' : ''} onClick={() => setLang('ar')}>العربية</button>
        </div>
      </section>

      <div className="speaking-layout">
        <section className="premium-panel speaking-card">
          <div className="premium-panel-head">
            <div><p className="panel-kicker">KALIMAT LATIHAN</p><h3 className="panel-title">Ucapkan dengan jelas</h3></div>
            <span className="premium-round-icon"><Volume2 size={20} /></span>
          </div>
          <div className={`speaking-target ${lang === 'ar' ? 'arabic-text' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{target || 'Tidak ada data latihan.'}</div>
          <p className="speaking-meaning">{meaning}</p>
          <div className="speaking-actions">
            <button className="premium-button secondary" onClick={speak}><Volume2 size={18} /> Dengarkan</button>
            <button className={`premium-button primary ${listening ? 'is-listening' : ''}`} disabled={!supported || listening} onClick={startRecognition}><Mic size={18} /> {listening ? 'Mendengarkan...' : 'Mulai Bicara'}</button>
            <button className="premium-button ghost" onClick={next}><RefreshCw size={17} /> Kalimat berikutnya</button>
          </div>
          {!supported && <p className="premium-notice warning">Speech Recognition tidak tersedia di browser ini. Coba Chrome/Edge versi terbaru di perangkat yang mendukung Web Speech API.</p>}
        </section>

        <aside className="premium-panel score-panel">
          <p className="panel-kicker">HASIL PENGUCAPAN</p>
          {!result ? (
            <div className="score-empty"><Mic size={34} /><p>Skor akan muncul setelah kamu berbicara.</p></div>
          ) : (
            <>
              <div className={`pronunciation-score ${scoreTone}`}>{result.score}<span>/100</span></div>
              <div className="score-caption">{result.score >= 90 ? 'Sangat bagus!' : result.score >= 70 ? 'Sudah jelas, teruskan.' : 'Coba perlahan sekali lagi.'}</div>
              <div className="transcript-box"><span>Yang terdengar</span><p dir={lang === 'ar' ? 'rtl' : 'ltr'}>{transcript || '—'}</p></div>
              <div className="score-metrics"><span><CheckCircle2 size={16} /> {result.matchedWords}/{result.totalWords} kata cocok</span><span><Zap size={16} /> +{result.score >= 90 ? XP_REWARDS.speakingExcellent : result.score >= 70 ? XP_REWARDS.speaking : 3} XP</span></div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function MiniGames({ vocabulary }) {
  const [game, setGame] = useState('match');
  return (
    <div className="premium-page animate-fade-in">
      <section className="premium-hero compact">
        <div><span className="eyebrow-badge"><Gamepad2 size={14} /> Mini Games</span><h2 className="premium-page-title">Belajar sambil bermain</h2><p className="premium-page-subtitle">Tiga mode singkat untuk menguatkan recall tanpa terasa seperti ujian.</p></div>
        <div className="game-tabs">
          <button className={game === 'match' ? 'is-active' : ''} onClick={() => setGame('match')}>Match Pair</button>
          <button className={game === 'scramble' ? 'is-active' : ''} onClick={() => setGame('scramble')}>Susun Kata</button>
          <button className={game === 'speed' ? 'is-active' : ''} onClick={() => setGame('speed')}>Speed</button>
        </div>
      </section>
      {game === 'match' && <MatchGame vocabulary={vocabulary} />}
      {game === 'scramble' && <ScrambleGame vocabulary={vocabulary} />}
      {game === 'speed' && <SpeedGame vocabulary={vocabulary} />}
    </div>
  );
}

function MatchGame({ vocabulary }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  // `round` intentionally re-triggers a fresh shuffle each new round.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words = useMemo(() => shuffle(vocabulary.filter((item) => item.en && item.id_lang)).slice(0, 6), [vocabulary, round]);
  const cards = useMemo(() => shuffle(words.flatMap((item) => [
    { key: `en-${item.id}`, id: item.id, side: 'en', text: item.en },
    { key: `id-${item.id}`, id: item.id, side: 'id', text: item.id_lang },
  ])), [words]);

  const choose = (card) => {
    if (matched.includes(card.id)) return;
    if (!selected) return setSelected(card);
    if (selected.key === card.key) return;
    if (selected.id === card.id && selected.side !== card.side) {
      const nextMatched = [...matched, card.id];
      setMatched(nextMatched);
      setSelected(null);
      recordActivity({ wordId: card.id, type: 'game-match', correct: true });
      if (nextMatched.length === words.length) addXp(mistakes === 0 ? XP_REWARDS.gamePerfect : XP_REWARDS.gameRound, 'game-match');
    } else {
      setMistakes((value) => value + 1);
      recordActivity({ wordId: selected.id, type: 'game-match', correct: false });
      recordMistake(selected.id, 'game-match');
      setSelected(card);
    }
  };

  const reset = () => { setRound((value) => value + 1); setSelected(null); setMatched([]); setMistakes(0); };
  const complete = words.length > 0 && matched.length === words.length;

  return (
    <section className="premium-panel game-panel">
      <div className="premium-panel-head"><div><p className="panel-kicker">MATCH PAIR</p><h3 className="panel-title">Pasangkan English ↔ Indonesia</h3></div><span className="game-counter">{matched.length}/{words.length}</span></div>
      <div className="match-grid">{cards.map((card) => <button key={card.key} disabled={matched.includes(card.id)} onClick={() => choose(card)} className={`match-card ${selected?.key === card.key ? 'selected' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}>{matched.includes(card.id) ? <CheckCircle2 size={18} /> : null}<span>{card.text}</span></button>)}</div>
      {complete && <div className="game-complete"><Trophy size={28} /><div><strong>Ronde selesai!</strong><p>{mistakes === 0 ? `Perfect round • +${XP_REWARDS.gamePerfect} XP` : `${mistakes} salah • +${XP_REWARDS.gameRound} XP`}</p></div><button className="premium-button primary" onClick={reset}>Main lagi <ArrowRight size={16} /></button></div>}
    </section>
  );
}

function ScrambleGame({ vocabulary }) {
  const pool = useMemo(() => vocabulary.filter((item) => item.en && item.en.length >= 4 && !item.en.includes(' ')), [vocabulary]);
  const [seed, setSeed] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState(null);
  const item = pool[(seed * 17 + 11) % Math.max(1, pool.length)] || null;
  const scrambled = useMemo(() => {
    if (!item) return '';
    let mixed = shuffle(item.en.toUpperCase().split('')).join('');
    if (mixed === item.en.toUpperCase()) mixed = mixed.slice(1) + mixed[0];
    return mixed;
  }, [item]);

  const check = () => {
    const correct = answer.trim().toLowerCase() === item?.en?.toLowerCase();
    setStatus(correct ? 'correct' : 'wrong');
    recordActivity({ wordId: item?.id, type: 'game-scramble', correct });
    if (correct) addXp(XP_REWARDS.gameRound, 'game-scramble');
    else if (item?.id) recordMistake(item.id, 'game-scramble');
  };
  const next = () => { setSeed((value) => value + 1); setAnswer(''); setStatus(null); };

  return (
    <section className="premium-panel game-panel scramble-panel">
      <div className="premium-panel-head"><div><p className="panel-kicker">SUSUN KATA</p><h3 className="panel-title">Susun huruf menjadi kata English</h3></div><Shuffle size={22} /></div>
      <p className="scramble-clue">Arti: <strong>{item?.id_lang || '—'}</strong></p>
      <div className="scramble-word">{scrambled}</div>
      <div className="scramble-input-row"><input value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder="Ketik jawaban..." /><button className="premium-button primary" onClick={check}>Periksa</button></div>
      {status && <div className={`answer-feedback ${status}`}>{status === 'correct' ? <CheckCircle2 size={19} /> : <XCircle size={19} />}<span>{status === 'correct' ? `Benar! +${XP_REWARDS.gameRound} XP` : `Jawaban: ${item?.en}`}</span><button onClick={next}>Berikutnya <ArrowRight size={15} /></button></div>}
    </section>
  );
}

function SpeedGame({ vocabulary }) {
  const pool = useMemo(() => vocabulary.filter((item) => item.en && item.id_lang), [vocabulary]);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);
  const current = pool[(round * 13 + 7) % Math.max(1, pool.length)] || null;
  const options = useMemo(() => {
    if (!current) return [];
    const distractors = shuffle(pool.filter((item) => item.id !== current.id && item.id_lang !== current.id_lang)).slice(0, 3);
    return shuffle([current, ...distractors]);
  }, [current, pool]);

  useEffect(() => {
    if (!running) return undefined;
    if (timeLeft <= 0) {
      setRunning(false); setFinished(true); addXp(Math.max(5, score * 2), 'game-speed');
      return undefined;
    }
    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, timeLeft, score]);

  const start = () => { setRunning(true); setTimeLeft(30); setScore(0); setRound(0); setFinished(false); };
  const answer = (option) => {
    if (!running) return;
    const correct = option.id === current.id;
    recordActivity({ wordId: current.id, type: 'game-speed', correct });
    if (correct) setScore((value) => value + 1); else recordMistake(current.id, 'game-speed');
    setRound((value) => value + 1);
  };

  return (
    <section className="premium-panel game-panel speed-panel">
      <div className="speed-header"><div><p className="panel-kicker">SPEED CHALLENGE</p><h3 className="panel-title">Jawab sebanyak mungkin dalam 30 detik</h3></div><div className="speed-stats"><span><Clock3 size={17} /> {timeLeft}s</span><span><Zap size={17} /> {score}</span></div></div>
      {!running && !finished ? <div className="game-start"><Zap size={42} /><h3>Siap menguji recall?</h3><p>English akan muncul, pilih arti Indonesia secepat mungkin.</p><button className="premium-button primary" onClick={start}>Mulai 30 detik</button></div> : finished ? <div className="game-start"><Trophy size={42} /><h3>{score} jawaban benar</h3><p>Kamu mendapatkan +{Math.max(5, score * 2)} XP dari sesi ini.</p><button className="premium-button primary" onClick={start}><RotateCcw size={17} /> Ulangi</button></div> : <div className="speed-question"><div className="speed-word">{current?.en}</div><div className="speed-options">{options.map((option) => <button key={option.id} onClick={() => answer(option)}>{option.id_lang}</button>)}</div></div>}
    </section>
  );
}

function LearningAnalytics({ vocabulary, englishLessons, nahwuLessons }) {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const update = () => setVersion((value) => value + 1);
    window.addEventListener(PREMIUM_UPDATE_EVENT, update);
    return () => window.removeEventListener(PREMIUM_UPDATE_EVENT, update);
  }, []);

  const activity = readActivity();
  const summary = getActivitySummary(activity);
  const level = getLevelInfo(readXp());
  const lessonProgress = readLessonProgress();
  const lessonSummary = getLessonSummary(englishLessons.length, nahwuLessons.length, lessonProgress);
  const mistakes = readMistakes();
  const openMistakes = Object.values(mistakes).filter((item) => item && !item.resolvedAt).length;
  const xpHistory = readXpHistory();
  void version;

  const last7 = Array.from({ length: 7 }, (_, idx) => idx - 6).map((offset) => {
    const entry = activity[todayKey(offset)] || {};
    return { label: dayLabel(offset), actions: entry.actions || 0, words: (entry.words || []).length, correct: entry.correct || 0, wrong: entry.wrong || 0 };
  });
  const maxActions = Math.max(1, ...last7.map((day) => day.actions));
  const total7Actions = last7.reduce((sum, day) => sum + day.actions, 0);
  const total7Correct = last7.reduce((sum, day) => sum + day.correct, 0);
  const total7Wrong = last7.reduce((sum, day) => sum + day.wrong, 0);
  const accuracy7 = total7Correct + total7Wrong ? Math.round((total7Correct / (total7Correct + total7Wrong)) * 100) : 0;
  const recentXp = xpHistory.slice(-10).reverse();

  return (
    <div className="premium-page animate-fade-in">
      <section className="premium-hero compact"><div><span className="eyebrow-badge"><BarChart3 size={14} /> Learning Analytics</span><h2 className="premium-page-title">Lihat pola belajarmu</h2><p className="premium-page-subtitle">Analytics disimpan lokal di perangkat dan dirangkum dari aktivitas belajar nyata.</p></div><div className="level-badge"><Trophy size={21} /><div><span>Level {level.level}</span><strong>{level.title}</strong></div></div></section>

      <section className="analytics-stat-grid">
        <article><span className="tone-violet"><Zap size={20} /></span><p>{level.totalXp}</p><small>Total XP</small></article>
        <article><span className="tone-emerald"><Flame size={20} /></span><p>{summary.streak}</p><small>Hari streak</small></article>
        <article><span className="tone-cyan"><Target size={20} /></span><p>{accuracy7}%</p><small>Akurasi 7 hari</small></article>
        <article><span className="tone-amber"><Activity size={20} /></span><p>{total7Actions}</p><small>Aktivitas 7 hari</small></article>
      </section>

      <section className="analytics-grid">
        <article className="premium-panel">
          <div className="premium-panel-head"><div><p className="panel-kicker">7 HARI TERAKHIR</p><h3 className="panel-title">Konsistensi aktivitas</h3></div><Activity size={20} /></div>
          <div className="activity-chart">{last7.map((day) => <div key={day.label} className="activity-bar-col"><div className="activity-bar-track"><div className="activity-bar-fill" style={{ height: `${Math.max(4, Math.round((day.actions / maxActions) * 100))}%` }} title={`${day.actions} aktivitas`} /></div><strong>{day.actions}</strong><span>{day.label}</span></div>)}</div>
        </article>

        <article className="premium-panel level-panel">
          <div className="premium-panel-head"><div><p className="panel-kicker">LEVEL & XP</p><h3 className="panel-title">Level {level.level} • {level.title}</h3></div><Trophy size={20} /></div>
          <div className="level-big-number">{level.totalXp}<span> XP</span></div>
          <div className="progress-track-v2"><div className="progress-bar-v2 progress-primary" style={{ width: `${level.progress}%` }} /></div>
          <p className="app-muted text-sm mt-2">{level.remaining} XP lagi menuju level berikutnya.</p>
          <div className="lesson-progress-row"><span>English lesson</span><strong>{lessonSummary.englishDone}/{englishLessons.length}</strong></div>
          <div className="lesson-progress-row"><span>Nahwu lesson</span><strong>{lessonSummary.nahwuDone}/{nahwuLessons.length}</strong></div>
          <div className="lesson-progress-row"><span>Mistake aktif</span><strong>{openMistakes}</strong></div>
        </article>
      </section>

      <section className="premium-panel xp-history-panel">
        <div className="premium-panel-head"><div><p className="panel-kicker">XP TERBARU</p><h3 className="panel-title">Riwayat reward</h3></div><Sparkles size={20} /></div>
        {recentXp.length === 0 ? <p className="app-muted py-6">Belum ada reward XP. Selesaikan Speaking, Games, atau lesson practice.</p> : <div className="xp-history-list">{recentXp.map((entry, idx) => <div key={`${entry.at}-${idx}`}><span className="xp-source-icon"><WandSparkles size={16} /></span><div><strong>+{entry.amount} XP</strong><p>{String(entry.source || 'practice').replaceAll('-', ' ')}</p></div><time>{new Date(entry.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time></div>)}</div>}
      </section>
    </div>
  );
}
