import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // Log untuk debugging
    console.log('📥 Request received');
    
    // Parse body
    const body = await req.json();
    const userMessage = body.text || body.message;
    
    if (!userMessage) {
      console.error('❌ No message provided');
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' }, 
        { status: 400 }
      );
    }

    // Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not set');
      return NextResponse.json(
        { error: 'API key tidak dikonfigurasi di server' }, 
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build prompt
    const prompt = `Kamu adalah asisten AI ramah di aplikasi LingoSpace Pro yang membantu pengguna belajar bahasa. Jawab pertanyaan ini dengan singkat dan jelas: "${userMessage}"`;

    console.log('🤖 Calling Gemini API...');
    
    // Call API
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    console.log('✅ Response received:', response.substring(0, 100));

    return NextResponse.json({
      translation: response,
      explanation: '',
      ipa: ''
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Error details:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Server error', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
