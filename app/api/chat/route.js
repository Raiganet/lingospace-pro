import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // 1. Ambil data dari frontend
    const body = await req.json();
    
    // 2. Deteksi otomatis variabel yang dikirim (bisa 'text', 'message', atau 'input')
    const userText = body.text || body.message || body.input;

    if (!userText) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // 3. Panggil Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // 4. Instruksi AI (Prompt)
    const prompt = `Kamu adalah Lingua AI, asisten penerjemah yang natural. 
    Terjemahkan pesan berikut. Jika pesan dalam bahasa Indonesia, terjemahkan ke bahasa Inggris. Jika dalam bahasa Inggris, terjemahkan ke bahasa Indonesia.
    Pesan pengguna: "${userText}"`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // 5. Kembalikan semua format yang mungkin dibutuhkan Frontend
    return NextResponse.json({ 
      reply: responseText, 
      translation: responseText,
      text: responseText
    });

  } catch (error) {
    // Menangkap error di server Vercel agar tidak merusak aplikasi
    console.error("Lingua AI Server Error:", error);
    return NextResponse.json({ error: "Gagal memproses data di server AI." }, { status: 500 });
  }
}
