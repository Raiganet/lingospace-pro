'use client';
import { useState } from 'react';

export default function LinguaAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Bubble User
    const newUserMsg = { text: input, isUser: true, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // Panggil API AI
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ text: input, mode: 'translate', targetLang: 'en' })
    });
    const data = await res.json();

    // Bubble AI
    setMessages(prev => [...prev, { 
      text: data.translation, 
      isUser: false, 
      explanation: data.explanation,
      ipa: data.ipa 
    }]);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-[20px] shadow-2xl overflow-hidden border border-gray-100">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${m.isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
              <p className="text-md">{m.text}</p>
              {!m.isUser && <p className="text-xs mt-2 text-gray-500 italic">{m.ipa}</p>}
              {/* Quick Actions */}
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <button className="text-xs hover:text-blue-500">🔊 Play</button>
                <button className="text-xs hover:text-blue-500">Copy</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex items-center gap-3">
        <button className="text-3xl p-2 rounded-full hover:bg-gray-100">🎙️</button>
        <input 
          className="flex-1 p-3 bg-gray-100 rounded-full outline-none" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Tulis sesuatu..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold">Kirim</button>
      </div>
    </div>
  );
}
