'use client';

import { useState, useEffect, useRef } from 'react';

export default function SmartTranslator() {
  // ✅ 1. Tambahkan state untuk bahasa sumber (default: 'id-ID' atau auto)
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en-US');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatLog.length > 0) {
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [chatLog]);

  // Daftar bahasa yang didukung
  const languages = [
    { code: 'auto', name: 'Auto Detect', flag: '🤖' },
    { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en-US', name: 'English', flag: '🇬🇧' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' }
  ];

  // Fungsi untuk menerjemahkan atau memproses teks
  const handleTranslate = async (text) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    // Ambil kode bahasa murni (misal: 'id-ID' jadi 'id')
    const sourceCode = sourceLang === 'auto' ? '' : sourceLang.split('-')[0];
    const targetCode = targetLang.split('-')[0];

    // ✅ 2. CEK LOGIKA: Jika bahasa sumber sama dengan target, langsung tampilkan tanpa API!
    if (sourceCode && sourceCode === targetCode) {
      setChatLog(prev => [
        ...prev, 
        {
          id: Date.now(),
          sender: 'user',
          text: text,
          lang: sourceLang,
          timestamp: new Date()
        },
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: text, // Tampilkan teks asli
          lang: targetLang,
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
      setInputText('');
      return;
    }

    // Tambahkan pesan user ke chat log
    setChatLog(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: text,
      lang: sourceLang,
      timestamp: new Date()
    }]);

    try {
      const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw3wHhpZp9nTUoV7SMHdg_ql5aqLfppRcgKK2HJtryKjTM9ubDEtw8Ky5c3yHshS1pkmw/exec";
      
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          text: text,
          source: sourceCode, // Kirim kode bahasa sumber pilihan user (atau kosong jika auto)
          target: targetCode
        })
      });

      const data = await response.json();

      if (data.success) {
        const translatedText = data.translatedText;
        
        setChatLog(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'assistant',
          text: translatedText,
          lang: targetLang,
          originalText: text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Translation failed');
      }

    } catch (error) {
      console.error('Translation error:', error);
      setChatLog(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'assistant',
        text: '⚠️ Gagal menerjemahkan. Periksa koneksi atau deployment Apps Script.',
        lang: targetLang,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setInputText('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[800px]">
          
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl sm:text-2xl">🌐</span>
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

        {/* Language Selector (Sumber & Target) */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col gap-3">
          {/* Dari Bahasa */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-semibold">📥 Dari Bahasa (Sumber):</label>
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang) => (
                <button
                  key={'source-' + lang.code}
                  onClick={() => setSourceLang(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    sourceLang === lang.code
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span>{lang.flag}</span> {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ke Bahasa */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-semibold">🎯 Target Bahasa (Tujuan):</label>
            <div className="flex gap-2 flex-wrap">
              {languages.filter(l => l.code !== 'auto').map((lang) => (
                <button
                  key={'target-' + lang.code}
                  onClick={() => setTargetLang(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    targetLang === lang.code
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span>{lang.flag}</span> {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">💬</div>
              <p className="text-lg text-gray-300 font-medium mb-2">Mulai percakapan dengan AI</p>
              <p className="text-sm text-gray-500">Pilih bahasa sumber dan target di atas</p>
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
                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan untuk diterjemahkan..."
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-gray-100 text-gray-800 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-xl sm:text-2xl">📤</span>
            </button>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <p className="text-[10px] sm:text-xs text-gray-500">Tekan Enter untuk mengirim</p>
            {chatLog.length > 0 && (
              <button onClick={clearChat} className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 font-semibold">
                🗑️ Hapus percakapan
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
