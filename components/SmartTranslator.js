'use client';

import { useState, useEffect, useRef } from 'react';

export default function SmartTranslator() {
  const [sourceLang, setSourceLang] = useState('id-ID');
  const [targetLang, setTargetLang] = useState('ar-SA');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [voiceSetting, setVoiceSetting] = useState('auto');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = () => {
    if (!hasSpeechRecognition) {
      alert('Maaf, browser Anda tidak mendukung fitur mikrofon. Gunakan Google Chrome.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = sourceLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      alert('Terjadi kesalahan saat mendengarkan. Coba lagi!');
    };

    recognition.start();
  };

  const handleTranslate = async (text) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    // Tambahkan pesan user ke chat
    setChatLog(prev => [...prev, {
      sender: 'user',
      text: text,
      lang: sourceLang,
      timestamp: new Date()
    }]);

    try {
      // Simulasi terjemahan (ganti dengan API translation yang sebenarnya)
      setTimeout(() => {
        const targetLangCode = targetLang.split('-')[0];
        let translatedText = '';
        
        // Simple translation simulation (replace with actual API)
        if (targetLangCode === 'en') {
          translatedText = `[English] ${text}`;
        } else if (targetLangCode === 'ar') {
          translatedText = `[العربية] ${text}`;
        } else {
          translatedText = `[Indonesia] ${text}`;
        }
        
        setChatLog(prev => [...prev, {
          sender: 'assistant',
          text: translatedText,
          lang: targetLang,
          originalText: text,
          timestamp: new Date()
        }]);
        
        // Auto speak translation
        speakText(translatedText, targetLang);
        
        setIsLoading(false);
        setInputText('');
      }, 1000);
      
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
      alert('Terjadi kesalahan saat menerjemahkan');
    }
  };

  const speakText = (text, lang) => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      handleTranslate(inputText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setChatLog([]);
  };

  const languages = [
    { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en-US', name: 'English', flag: '🇬🇧' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' }
  ];

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl">🌐</span>
              </div>
              <div>
                <h1 className="text-sm sm:text-base md:text-xl font-bold text-white">LinguaAI Pro</h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-white/80">Smart Translation Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs text-white">Online</span>
            </div>
          </div>
        </div>

        {/* Language Selector - Responsive */}
        <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <label className="text-[10px] sm:text-xs text-gray-400 mb-1 block">Target Bahasa:</label>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {['en-US', 'id-ID', 'ar-SA'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTargetLang(lang)}
                    className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all ${
                      targetLang === lang
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {lang === 'en-US' ? '🇬🇧 English' : lang === 'id-ID' ? '🇮🇩 Indonesia' : '🇸🇦 العربية'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Settings - Responsive */}
        <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <label className="text-[10px] sm:text-xs text-gray-400 mb-1 block">🔊 Voice:</label>
              <select
                value={voiceSetting}
                onChange={(e) => setVoiceSetting(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 text-white text-[10px] sm:text-xs md:text-sm outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="auto" className="bg-slate-800">Auto Detect</option>
                <option value="id-ID" className="bg-slate-800">Google Bahasa Indonesia (id-ID)</option>
                <option value="en-US" className="bg-slate-800">Google English (en-US)</option>
                <option value="ar-SA" className="bg-slate-800">Google Arabic (ar-SA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Area - Responsive dengan tinggi yang sesuai */}
        <div className="bg-white/5 backdrop-blur-sm min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[60vh] sm:max-h-[70vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          {chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💬</div>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-2">Mulai percakapan dengan AI</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Terjemahkan ke <span className="text-purple-400 font-semibold">
                  {targetLang === 'en-US' ? 'English' : targetLang === 'id-ID' ? 'Indonesia' : 'العربية'}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 ${
                    chat.sender === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-white/10 text-white'
                  }`}>
                    <p className="text-xs sm:text-sm md:text-base">{chat.text}</p>
                    {chat.translation && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <p className="text-[10px] sm:text-xs text-white/70 mb-1">Terjemahan:</p>
                        <p className="text-xs sm:text-sm md:text-base italic">{chat.translation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - FIXED: Icon tidak terpotong */}
        <div className="bg-white rounded-b-2xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mic Button - Ukuran diperbesar */}
            <button
              onClick={startListening}
              disabled={isListening}
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110'
              }`}
              title="Klik untuk voice input"
            >
              <span className="text-lg sm:text-xl md:text-2xl">🎤</span>
            </button>

            {/* Input Field - Flex-1 agar mengisi ruang */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ketik untuk diterjemahkan ke ${
                targetLang === 'en-US' ? 'English' : targetLang === 'id-ID' ? 'Indonesia' : 'العربية'
              }...`}
              className="flex-1 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-full bg-gray-100 text-gray-800 text-xs sm:text-sm md:text-base outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
            />

            {/* Send Button - Ukuran diperbesar */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Kirim pesan"
            >
              <span className="text-lg sm:text-xl md:text-2xl"></span>
            </button>
          </div>

          {/* Helper Text - Responsive */}
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
              Tekan Enter untuk mengirim • Klik mic untuk voice input
            </p>
          </div>

          {/* Clear Chat Button */}
          {chatLog.length > 0 && (
            <div className="mt-3 text-center">
              <button
                onClick={clearChat}
                className="text-[10px] sm:text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                ️ Hapus percakapan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
