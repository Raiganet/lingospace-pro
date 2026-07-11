'use client';
import { useState, useRef, useEffect } from 'react';

export default function LinguaAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [targetLang, setTargetLang] = useState('en'); // 'en', 'id', 'ar'
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceLang, setVoiceLang] = useState('auto');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Load available voices
  useEffect(() => {
    if (!synthRef.current) return;
    
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      setAvailableVoices(voices);
      
      // Cari voice default
      const idVoice = voices.find(v => v.lang.startsWith('id-ID') || v.lang.startsWith('id'));
      const enVoice = voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
      
      if (idVoice) {
        setSelectedVoice(idVoice);
      } else if (enVoice) {
        setSelectedVoice(enVoice);
      }
    };

    loadVoices();
    
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Deteksi bahasa dari teks
  const detectLanguage = (text) => {
    const indonesianWords = ['yang', 'dan', 'atau', 'tidak', 'dengan', 'untuk', 'bisa', 'apakah', 'ini', 'itu', 'saya', 'aku', 'kamu', 'dia', 'mereka'];
    const arabicRegex = /[\u0600-\u06FF]/;
    const lowerText = text.toLowerCase();
    
    if (arabicRegex.test(text)) return 'ar';
    
    const hasIndonesian = indonesianWords.some(word => lowerText.includes(word));
    return hasIndonesian ? 'id' : 'en';
  };

  // Text to Speech dengan voice yang sesuai
  const speakText = (text) => {
    if (!synthRef.current) {
      alert('Browser Anda tidak mendukung text-to-speech');
      return;
    }

    // Cancel speech yang sedang berjalan
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    let targetVoice = selectedVoice;
    let detectedLang = detectLanguage(text);
    
    // Jika targetLang adalah arab, gunakan voice arab
    if (targetLang === 'ar' || detectedLang === 'ar') {
      targetVoice = availableVoices.find(v => 
        v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
      );
      utterance.lang = 'ar-SA';
    } else if (voiceLang === 'auto') {
      if (detectedLang === 'id') {
        targetVoice = availableVoices.find(v => 
          v.lang.startsWith('id-ID') || v.lang.startsWith('id')
        ) || availableVoices.find(v => v.lang.startsWith('en'));
      } else {
        targetVoice = availableVoices.find(v => 
          v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')
        );
      }
    } else if (voiceLang === 'id') {
      targetVoice = availableVoices.find(v => 
        v.lang.startsWith('id-ID') || v.lang.startsWith('id')
      );
    } else if (voiceLang === 'en') {
      targetVoice = availableVoices.find(v => 
        v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')
      );
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setInput('');
    setIsLoading(true);

    const newUserMsg = { 
      text: userText, 
      isUser: true, 
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: userText, 
          targetLang: targetLang
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      const aiMsg = { 
        text: data.translation || 'Maaf, saya tidak mengerti', 
        isUser: false, 
        explanation: data.explanation || '',
        ipa: data.ipa || '',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error:', err);
      
      const errorMsg = { 
        text: '⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.', 
        isUser: false, 
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLanguageLabel = () => {
    if (targetLang === 'en') return '🇧 English';
    if (targetLang === 'id') return '🇮🇩 Indonesia';
    if (targetLang === 'ar') return '🇸🇦 العربية';
    return 'English';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">LinguaAI Pro</h1>
                <p className="text-blue-100 text-sm">Smart Translation Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-white/5 border-b border-white/10 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-white text-sm font-medium">Target Bahasa:</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTargetLang('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetLang === 'en' 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setTargetLang('id')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetLang === 'id' 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                onClick={() => setTargetLang('ar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetLang === 'ar' 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                🇸🇦 العربية
              </button>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white/5 border-b border-white/10 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm font-medium">🔊 Voice:</label>
              <select 
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="auto" className="bg-slate-800">Auto Detect</option>
                <option value="id" className="bg-slate-800">Bahasa Indonesia</option>
                <option value="en" className="bg-slate-800">English</option>
                <option value="ar" className="bg-slate-800">Arabic</option>
              </select>
            </div>
            
            {availableVoices.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-white/70 text-xs">Specific:</label>
                <select 
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                    setVoiceLang('auto');
                  }}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-400 max-w-xs truncate"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name} className="bg-slate-800">
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-lg">Mulai percakapan dengan AI</p>
              <p className="text-gray-400 text-sm mt-2">
                Terjemahkan ke: <span className="font-semibold text-purple-600">{getLanguageLabel()}</span>
              </p>
            </div>
          )}

          {messages.map((m, i) => {
            const isArabic = /[\u0600-\u06FF]/.test(m.text);
            
            return (
              <div key={i} className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'} animate-fade-in`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${m.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                    <span className="text-white text-sm">{m.isUser ? '👤' : '🤖'}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl shadow-lg ${m.isUser ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                    <p 
                      className={`text-base leading-relaxed ${m.isUser ? 'text-white' : 'text-gray-800'}`}
                      dir={isArabic ? 'rtl' : 'ltr'}
                      style={isArabic ? { fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: '1.3rem' } : {}}
                    >
                      {m.text}
                    </p>
                    
                    {!m.isUser && m.ipa && (
                      <p className="text-xs mt-2 text-gray-500 italic font-mono bg-gray-100 px-2 py-1 rounded">{m.ipa}</p>
                    )}
                    
                    <p className={`text-xs mt-2 ${m.isUser ? 'text-blue-200' : 'text-gray-400'}`}>{m.timestamp}</p>

                    {/* Quick Actions untuk AI */}
                    {!m.isUser && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                        <button 
                          onClick={() => speakText(m.text)}
                          disabled={isSpeaking}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all disabled:opacity-50"
                        >
                          <span>🔊</span>
                          <span>{isSpeaking ? 'Playing...' : 'Play'}</span>
                        </button>
                        <button 
                          onClick={() => navigator.clipboard.writeText(m.text)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                        >
                          <span>📋</span>
                          <span>Copy</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            {/* Mic Button */}
            <button 
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-600 hover:bg-gray-200 shadow-sm'}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Text Input */}
            <input 
              className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 placeholder-gray-400" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : `Ketik untuk diterjemahkan ke ${getLanguageLabel()}...`}
              disabled={isListening || isLoading}
            />

            {/* Send Button */}
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <span>Kirim</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-3">
            Tekan Enter untuk mengirim • Klik mic untuk voice input
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
