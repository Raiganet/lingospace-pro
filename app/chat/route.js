import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.text;
    const mode = body.mode || 'translate';
    const targetLang = body.targetLang || 'en';

    // Validasi input
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' }, 
        { status: 400 }
      );
    }

    // Validasi API Key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key Gemini belum diatur di server.' }, 
        { status: 500 }
      );
    }

    // System prompt: AI sebagai guru bahasa
    const systemPrompt = `Kamu adalah asisten AI ramah di aplikasi LingoSpace Pro. 
Tugasmu adalah membantu pengguna belajar bahasa Inggris dan bahasa Arab. 
Jawablah dengan santai, informatif, dan mudah dipahami.`;

    // Bangun prompt sesuai mode
    let prompt = '';
    
    if (mode === 'translate') {
      prompt = `${systemPrompt}

Tugas: Terjemahkan teks berikut ke bahasa ${targetLang}.
WAJIB balas HANYA dalam format JSON valid (tanpa markdown, tanpa backtick):
{
  "translation": "teks terjemahan",
  "explanation": "penjelasan singkat grammar/kosakata",
  "ipa": "pelafalan IPA (jika target bahasa Inggris, kosongkan jika bukan)"
}

Teks yang diterjemahkan: "${userMessage}"`;
    } else {
      prompt = `${systemPrompt}\n\nPesan user: "${userMessage}"`;
    }

    // Panggil Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Parse JSON response dari AI
    let data;
    try {
      // Bersihkan response jika ada markdown code block
      const cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      data = JSON.parse(cleanResponse);
    } catch {
      // Fallback jika response bukan JSON valid
      data = {
        translation: response,
        explanation: '',
        ipa: ''
      };
    }

    return NextResponse.json({
      translation: data.translation || response,
      explanation: data.explanation || '',
      ipa: data.ipa || ''
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Maaf, server AI sedang sibuk atau mengalami gangguan.', details: error.message }, 
      { status: 500 }
    );
  }
}
