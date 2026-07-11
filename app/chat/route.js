import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.text || body.message;
    const targetLang = body.targetLang || 'en'; // 'en', 'id', 'ar'
    
    console.log('📥 Request:', { userMessage, targetLang });
    
    if (!userMessage) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key tidak dikonfigurasi' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Build prompt berdasarkan target bahasa
    let prompt = '';
    
    if (targetLang === 'ar') {
      prompt = `Terjemahkan teks berikut ke bahasa Arab DENGAN HARAKAT (tanda baca) lengkap.
HANYA berikan hasil terjemahan dalam bahasa Arab dengan harakat. 
JANGAN tambahkan penjelasan, intro, atau teks lainnya.

Teks: "${userMessage}"

Terjemahan Arab dengan harakat:`;
    } else if (targetLang === 'id') {
      prompt = `Terjemahkan teks berikut ke bahasa Indonesia.
HANYA berikan hasil terjemahan. JANGAN tambahkan penjelasan atau intro.

Teks: "${userMessage}"

Terjemahan:`;
    } else {
      // English (default)
      prompt = `Translate the following text to English.
ONLY provide the translation. DO NOT add any explanation or introductory text.

Text: "${userMessage}"

Translation:`;
    }

    console.log('🎯 Target language:', targetLang);
    console.log('📝 Prompt:', prompt);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.3,
          maxOutputTokens: 1024 
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', errorData);
      return NextResponse.json(
        { error: 'Gagal menghubungi AI', details: errorData }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Response:', data);

    if (data.candidates && data.candidates.length > 0) {
      let aiReply = data.candidates[0].content.parts[0].text;
      
      // Bersihkan dari tanda ** dan formatting
      aiReply = aiReply.replace(/\*\*/g, '').trim();
      
      // Hapus baris pertama jika ada intro
      const lines = aiReply.split('\n');
      if (lines[0].toLowerCase().includes('halo') || 
          lines[0].toLowerCase().includes('terjemahan') ||
          lines[0].toLowerCase().includes('berikut')) {
        aiReply = lines.slice(1).join('\n').trim();
      }
      
      console.log('🎉 Final reply:', aiReply);
      
      return NextResponse.json({ 
        translation: aiReply,
        targetLang: targetLang
      });
    } else {
      throw new Error('Format respons tidak sesuai');
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghubungi AI', details: error.message }, 
      { status: 500 }
    );
  }
}
