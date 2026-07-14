import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Trik Rahasia 1: Gunakan Edge Runtime agar respons super cepat & tanpa Cold Start
export const runtime = 'edge';

export async function POST(req) {
  try {
    const body = await req.json();
    const userText = body.text || body.message || body.input;

    if (!userText) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Trik Rahasia 2: Gunakan model 'flash' yang dirancang khusus untuk kecepatan
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        temperature: 0.3, // Menurunkan kreativitas agar AI lebih fokus, stabil, dan cepat
        maxOutputTokens: 500, // Batasi panjang output agar tidak nge-lag
      }
    });

    // Trik Rahasia 3: Prompt yang padat dan jelas
    const prompt = `Terjemahkan teks berikut. 
    Aturan: Jika bahasa Indonesia -> Inggris. Jika Inggris -> Indonesia. 
    Output HANYA teks terjemahan tanpa tanda kutip, tanpa penjelasan, dan tanpa basa-basi.
    Teks: ${userText}`;

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
