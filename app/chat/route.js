import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.text || body.message;
    const targetLang = body.targetLang || 'en';
    
    if (!userMessage) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key tidak dikonfigurasi' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    let prompt = '';
    
    if (targetLang === 'ar') {
      prompt = `Terjemahkan teks berikut ke bahasa Arab DENGAN HARAKAT (tanda baca/diacritics) lengkap.
HANYA berikan hasil terjemahan dalam bahasa Arab dengan harakat. JANGAN tambahkan penjelasan.

Teks: "${userMessage}"

Terjemahan Arab dengan harakat:`;
    } else if (targetLang === 'id') {
      prompt = `Terjemahkan teks berikut ke bahasa Indonesia.
HANYA berikan hasil terjemahan. JANGAN tambahkan penjelasan.

Teks: "${userMessage}"

Terjemahan:`;
    } else {
      prompt = `Translate the following text to English.
ONLY provide the translation. DO NOT add any explanation.

Text: "${userMessage}"

Translation:`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: 'Gagal menghubungi AI', details: errorData }, { status: response.status });
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      let aiReply = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').trim();
      return NextResponse.json({ translation: aiReply });
    } else {
      throw new Error('Format respons tidak sesuai');
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Gagal menghubungi AI', details: error.message }, { status: 500 });
  }
}
