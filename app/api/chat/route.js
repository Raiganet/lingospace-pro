import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // GANTI NAMA MODEL DI SINI: Gunakan 'gemini-pro' agar lebih stabil
    const model = genAI.getGenerativeModel({ model: "Gemini 3.5 Flash" });

    const result = await model.generateContent(message);
    const response = await result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Gagal menghubungi AI' }, { status: 500 });
  }
}
