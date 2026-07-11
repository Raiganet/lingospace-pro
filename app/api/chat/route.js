import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Gunakan Gemini API

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { text, targetLang, mode } = await req.json();
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Anda adalah asisten penerjemah profesional "Lingua AI".
    Mode: ${mode === 'translate' ? 'Terjemahan Natural' : 'AI Assistant'}
    Tujuan Bahasa: ${targetLang}
    Input: "${text}"
    
    Tugas:
    1. Deteksi bahasa asal secara otomatis.
    2. Terjemahkan dengan menjaga konteks, idiom, dan nuansa (bukan literal).
    3. Jika mode translate, berikan hasil terjemahan, IPA (cara baca), dan penjelasan singkat (vocabulary/grammar).
    4. Format output dalam JSON: { "detectedLang": "...", "translation": "...", "ipa": "...", "explanation": "..." }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  
  return NextResponse.json(JSON.parse(response));
}
