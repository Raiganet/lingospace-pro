import { NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghubungi AI' }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.text;

    // Mengambil API Key dari pengaturan hosting Anda
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key Gemini belum diatur di server.' }, 
        { status: 500 }
      );
    }

    // Prompt sistem: Menginstruksikan AI agar bertindak sebagai guru bahasa
    const systemPrompt = "Kamu adalah asisten AI ramah di aplikasi LingoSpace Pro. Tugasmu adalah membantu pengguna belajar bahasa Inggris dan bahasa Arab. Jawablah pesan ini dengan santai, informatif, dan mudah dipahami: \n\n";

    // Memanggil API Gemini (Menggunakan fetch standar agar tidak perlu instal library tambahan)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt + userMessage }]
          }
        ]
      })
    });

    const data = await response.json();

    // Mengekstrak balasan dari struktur data Gemini
    if (data.candidates && data.candidates.length > 0) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ reply: aiReply });
    } else {
      throw new Error("Format respons tidak sesuai");
    }

  } catch (error) {
    console.error('Terjadi kesalahan pada rute API Chat:', error);
    return NextResponse.json(
      { error: 'Maaf, server AI sedang sibuk atau mengalami gangguan.' }, 
      { status: 500 }
    );
  }
}
