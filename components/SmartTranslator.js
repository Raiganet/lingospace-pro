'use client';

import { useState, useEffect, useRef } from 'react';

export default function SmartTranslator() {
  const [sourceLang, setSourceLang] = useState('id-ID');
  const [targetLang, setTargetLang] = useState('en-US');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const messagesEndRef = useRef(null);

  // Cek dukungan Speech Recognition saat komponen dimuat
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
    }
  }, []);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // Fungsi untuk memulai input suara (Mic)
  const startListening = () => {
    if (!hasSpeechRecognition) {
      alert('Maaf, browser Anda tidak mendukung fitur mikrofon. Silakan gunakan Google Chrome.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = sourceLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  // Fungsi untuk menerjemahkan teks menggunakan MyMemory API
  const handleTranslate = async (text) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    // Tambahkan pesan user ke chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      lang: sourceLang,
      timestamp: new Date()
    };
    setChatLog(prev => [...prev, userMessage]);

    try {
      const sourceCode = sourceLang.split('-')[0]; // 'id', 'en', atau 'ar'
      const targetCode = targetLang.split('-')[0]; // 'id', 'en', atau 'ar'
      
      // Panggil API MyMemory (Gratis)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        
        const assistantMessage = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: translatedText,
          lang: targetLang,
          originalText: text,
          timestamp: new Date()
        };
        
        setChatLog(prev => [...prev, assistantMessage]);
        
        // Auto speak terjemahan
        speakText(translatedText, targetLang);
      } else {
        throw new Error('Translation failed');
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      setChatLog(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'assistant',
        text: '⚠️ Gagal menerjemahkan. Pastikan koneksi internet Anda baik.',
        lang: targetLang,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  // Fungsi untuk membacakan teks (Speaker)
  const speakText = (text, lang) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
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
    window.speechSynthesis.cancel();
  };

  const languages = [
    { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en-US', name: 'English', flag: '🇬🇧' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[800px]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl sm:text-2xl"></span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">LinguaAI Pro</h1>
              <p className="text-xs sm:text-sm text-white/80">Smart Translation Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-white font-medium">Online</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-2 block font-semibold">🎯 Target Bahasa:</label>
              <div className="flex gap-2 flex-wrap">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setTargetLang(lang.code)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                      targetLang === lang.code
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{lang.flag}</span> {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">💬</div>
              <p className="text-lg text-gray-300 font-medium mb-2">Mulai percakapan dengan AI</p>
              <p className="text-sm text-gray-500">
                Terjemahkan ke <span className="text-purple-400 font-bold">
                  {languages.find(l => l.code === targetLang)?.name}
                </span>
              </p>
            </div>
          ) : (
            chatLog.map((chat) => (
              <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg ${
                  chat.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <p className="text-sm sm:text-base leading-relaxed" dir={chat.lang === 'ar-SA' ? 'rtl' : 'ltr'}>
                    {chat.text}
                  </p>
                  <p className="text-[10px] text-white/50 mt-2 text-right">
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
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

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mic Button */}
            <button
              onClick={startListening}
              disabled={isListening || isLoading}
              className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
              }`}
              title="Klik untuk voice input"
            >
              <span className="text-xl sm:text-2xl">🎤</span>
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ketik untuk diterjemahkan ke ${languages.find(l => l.code === targetLang)?.name}...`}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-gray-100 text-gray-800 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Kirim pesan"
            >
              <span className="text-xl sm:text-2xl">📤</span>
            </button>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Tekan Enter untuk mengirim • Klik 🎤 untuk voice input
            </p>
            {chatLog.length > 0 && (
              <button
                onClick={clearChat}
                className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                🗑️ Hapus percakapan
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
