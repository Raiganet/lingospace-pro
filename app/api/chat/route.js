import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Menggunakan model generasi terbaru yang didukung
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Gagal menghubungi AI' }, { status: 500 });
  }
}
