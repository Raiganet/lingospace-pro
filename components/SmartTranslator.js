'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  BookOpenCheck,
  Bot,
  Languages,
  Lightbulb,
  MessageCircle,
  Mic,
  RotateCcw,
  Sparkles,
  SpellCheck2,
  Volume2,
  WandSparkles,
} from 'lucide-react';

const MODES = [
  { id: 'translate', label: 'Translate', icon: Languages, placeholder: 'Ketik teks yang ingin diterjemahkan...' },
  { id: 'explain', label: 'Explain', icon: Lightbulb, placeholder: 'Masukkan grammar, kata, atau kalimat yang ingin dijelaskan...' },
  { id: 'correct', label: 'Correct', icon: SpellCheck2, placeholder: 'Masukkan kalimat yang ingin dikoreksi...' },
  { id: 'example', label: 'Examples', icon: BookOpenCheck, placeholder: 'Masukkan kata/frasa untuk dibuatkan contoh...' },
  { id: 'conversation', label: 'Conversation', icon: MessageCircle, placeholder: 'Mulai percakapan latihan dengan AI...' },
];

const LANGUAGES = [
  { code: 'id-ID', target: 'id', name: 'Indonesia', short: 'ID' },
  { code: 'en-US', target: 'en', name: 'English', short: 'EN' },
  { code: 'ar-SA', target: 'ar', name: 'العربية', short: 'AR' },
];

export default function SmartTranslator() {
  const [mode, setMode] = useState('translate');
  const [sourceLang, setSourceLang] = useState('id-ID');
  const [targetLang, setTargetLang] = useState('en-US');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedMode = useMemo(() => MODES.find((item) => item.id === mode) || MODES[0], [mode]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setHasSpeechRecognition(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    if (chatLog.length === 0) return undefined;
    const timer = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 80);
    return () => clearTimeout(timer);
  }, [chatLog]);

  const speakText = (text, lang = targetLang) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith('ar') ? 0.78 : 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const submit = async (text = inputText) => {
    const clean = String(text || '').trim();
    if (!clean || isLoading) return;
    const messageId = Date.now();
    setChatLog((prev) => [...prev, { id: messageId, sender: 'user', text: clean, mode, timestamp: new Date() }]);
    setInputText('');
    setIsLoading(true);

    try {
      let response;
      if (mode === 'translate') {
        response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean, source: '', target: LANGUAGES.find((item) => item.code === targetLang)?.target || 'en' }),
        });
      } else {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean, task: mode }),
        });
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Permintaan gagal');
      const reply = mode === 'translate'
        ? (data.translatedText || data.translation || data.text || data.reply)
        : data.reply;
      if (!reply) throw new Error('Respons kosong');

      setChatLog((prev) => [...prev, { id: messageId + 1, sender: 'assistant', text: reply, mode, timestamp: new Date() }]);
      if (mode === 'translate') speakText(reply, targetLang);
    } catch (error) {
      setChatLog((prev) => [...prev, {
        id: messageId + 1,
        sender: 'assistant',
        text: `Gagal memproses permintaan: ${error.message}`,
        mode: 'error',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || isLoading) return;
    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInputText(transcript);
    };
    recognition.start();
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setChatLog([]);
    setInputText('');
    window.speechSynthesis?.cancel?.();
  };

  return (
    <div className="ai-workspace animate-fade-in">
      <section className="ai-hero">
        <div className="ai-brand-mark"><Sparkles size={25} /></div>
        <div className="min-w-0 flex-1">
          <span className="eyebrow-badge"><WandSparkles size={14} /> AI Language Tutor</span>
          <h2 className="premium-page-title mt-3">LingoSpace AI</h2>
          <p className="premium-page-subtitle">Terjemahkan, koreksi, jelaskan grammar, buat contoh, atau latihan percakapan dalam satu ruang.</p>
        </div>
        <div className="ai-ready"><span /> Siap</div>
      </section>

      <div className="ai-mode-tabs" role="tablist" aria-label="Mode LingoSpace AI">
        {MODES.map((item) => {
          const Icon = item.icon;
          return <button type="button" key={item.id} onClick={() => changeMode(item.id)} className={mode === item.id ? 'is-active' : ''}><Icon size={17} /><span>{item.label}</span></button>;
        })}
      </div>

      {mode === 'translate' && (
        <div className="ai-language-row">
          <div><span>Input suara</span><div className="language-pills">{LANGUAGES.map((lang) => <button key={lang.code} className={sourceLang === lang.code ? 'is-active' : ''} onClick={() => setSourceLang(lang.code)}>{lang.short}</button>)}</div></div>
          <ArrowUp className="rotate-90 app-muted hidden sm:block" size={18} />
          <div><span>Terjemahkan ke</span><div className="language-pills">{LANGUAGES.map((lang) => <button key={lang.code} className={targetLang === lang.code ? 'is-active' : ''} onClick={() => setTargetLang(lang.code)}>{lang.name}</button>)}</div></div>
        </div>
      )}

      <section className="ai-chat-panel">
        <div className="ai-chat-scroll">
          {chatLog.length === 0 ? (
            <div className="ai-empty-state">
              <span className="ai-empty-icon"><Bot size={34} /></span>
              <h3>{selectedMode.label} siap digunakan</h3>
              <p>{mode === 'translate' ? 'Masukkan teks Indonesia, English, atau Arab. Bahasa sumber akan dideteksi otomatis.' : 'LingoSpace AI akan membantu sebagai tutor, bukan hanya mesin terjemahan.'}</p>
              <div className="ai-suggestion-row">
                {(mode === 'correct' ? ['I goes to school every day.', 'She don’t like coffee.'] : mode === 'example' ? ['although', 'مَدْرَسَةٌ'] : mode === 'explain' ? ['Present perfect vs past simple', 'Apa itu mubtada dan khabar?'] : mode === 'conversation' ? ['Hello, I want to practice English.', 'أَنَا أَتَعَلَّمُ اللُّغَةَ العَرَبِيَّةَ'] : ['Saya sedang belajar bahasa Inggris.', 'Where is the nearest station?']).map((text) => <button key={text} onClick={() => submit(text)}>{text}</button>)}
              </div>
            </div>
          ) : chatLog.map((chat) => (
            <div key={chat.id} className={`ai-message ${chat.sender === 'user' ? 'user' : 'assistant'} ${chat.mode === 'error' ? 'error' : ''}`}>
              <div className="ai-message-avatar">{chat.sender === 'user' ? 'You' : <Bot size={17} />}</div>
              <div className="ai-message-bubble">
                <p dir={/^[\u0600-\u06FF]/.test(chat.text) ? 'rtl' : 'ltr'}>{chat.text}</p>
                <div className="ai-message-meta"><span>{chat.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>{chat.sender === 'assistant' && <button onClick={() => speakText(chat.text, mode === 'translate' ? targetLang : 'id-ID')} title="Dengarkan"><Volume2 size={14} /></button>}</div>
              </div>
            </div>
          ))}
          {isLoading && <div className="ai-message assistant"><div className="ai-message-avatar"><Bot size={17} /></div><div className="ai-typing"><span /><span /><span /></div></div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-composer">
          <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder={selectedMode.placeholder} rows={2} maxLength={3000} />
          <div className="ai-composer-actions">
            <div className="flex items-center gap-2">
              <button type="button" className={`ai-icon-button ${isListening ? 'is-listening' : ''}`} onClick={startListening} disabled={!hasSpeechRecognition || isListening || isLoading} title={hasSpeechRecognition ? 'Input suara' : 'Speech recognition tidak didukung'}><Mic size={18} /></button>
              {chatLog.length > 0 && <button type="button" className="ai-icon-button" onClick={() => setChatLog([])} title="Bersihkan percakapan"><RotateCcw size={17} /></button>}
            </div>
            <div className="flex items-center gap-3"><span className="ai-char-count">{inputText.length}/3000</span><button type="button" className="ai-send-button" onClick={() => submit()} disabled={!inputText.trim() || isLoading}><ArrowUp size={18} /></button></div>
          </div>
        </div>
      </section>
    </div>
  );
}
