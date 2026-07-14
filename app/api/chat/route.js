import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Trik 1: Paksa Vercel untuk menunggu hingga 60 detik (batas maksimal akun gratis)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Ambil teks pesan dan target bahasa yang dikirim dari Frontend
    const userText = body.text || body.message || body.input;
    // Default ke bahasa Inggris jika frontend tidak mengirimkan target bahasa
    const targetLanguage = body.targetLang || body.target || "Inggris"; 

    if (!userText) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        temperature: 0.2, // Turunkan sedikit lagi agar respon lebih cepat & presisi
        maxOutputTokens: 800, 
      }
    });

    // Trik 2: Prompt dinamis mengikuti tombol bahasa di UI Anda
    const prompt = `
You are the best professional translator.

Rules:

- Detect the input language automatically.

- Translate naturally.

- Translate like a native speaker.

- Keep punctuation.

- Keep emojis.

- Keep names.

- Keep numbers.

- Never explain.

- Never answer questions.

- Never add notes.

- Never add quotation marks.

- Output ONLY the translated text.

Target Language:

${targetLanguage}

Text:

${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    return NextResponse.json({ 
      reply: responseText, 
      translation: responseText,
      text: responseText
    });

  } catch (error) {
    console.error("Lingua AI Server Error:", error);
    return NextResponse.json({ error: "Gagal memproses data di server AI." }, { status: 500 });
  }
}
