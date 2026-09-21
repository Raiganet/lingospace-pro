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
    
    // Build prompt yang SANGAT STRICT - hanya terjemahan
    let prompt = '';
    
    if (targetLang === 'ar') {
      prompt = `You are a translation machine. Translate ONLY. No intro, no explanation, no notes.

Input: "${userMessage}"
Language: Arabic with harakat

Output (Arabic text ONLY):`;
    } else if (targetLang === 'id') {
      prompt = `You are a translation machine. Translate ONLY. No intro, no explanation, no notes.

Input: "${userMessage}"
Language: Indonesian

Output (Indonesian text ONLY):`;
    } else {
      // English
      prompt = `You are a translation machine. Translate ONLY. No intro, no explanation, no notes.

Input: "${userMessage}"
Language: English

Output (English text ONLY):`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.1, // Sangat rendah untuk hasil konsisten
          maxOutputTokens: 512,
          topP: 0.8,
          topK: 1
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { error: 'Gagal menghubungi AI', details: errorData }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      let aiReply = data.candidates[0].content.parts[0].text;
      
      // Bersihkan dari tanda ** dan formatting
      aiReply = aiReply.replace(/\*\*/g, '').trim();
      
      // Hapus semua baris yang mengandung kata-kata intro
      const lines = aiReply.split('\n');
      const introWords = [
        'halo', 'hai', 'hello', 'hi',
        'saya', 'i am', 'i\'m',
        'berikut', 'following', 'here',
        'terjemahan', 'translation', 'translate',
        'catatan', 'note', 'notes',
        'penjelasan', 'explanation',
        'artinya', 'means', 'meaning',
        'adalah', 'is', 'are',
        'untuk', 'for', 'to',
        'dalam', 'in', 'into',
        'bahasa', 'language',
        'konteks', 'context',
        'jika', 'if',
        'gunakan', 'use', 'using',
        'atau', 'or',
        'saat', 'when',
        'sudah', 'already',
        'belum', 'not yet',
        'terjadi', 'happened',
        'sekarang', 'now',
        'nanti', 'later'
      ];
      
      // Filter baris yang bukan intro
      const filteredLines = lines.filter(line => {
        const lowerLine = line.toLowerCase().trim();
        // Hapus baris yang terlalu pendek (kurang dari 3 karakter)
        if (lowerLine.length < 3) return false;
        // Hapus baris yang mengandung kata intro
        return !introWords.some(word => lowerLine.includes(word));
      });
      
      // Ambil hasil terjemahan (biasanya baris pertama yang valid)
      aiReply = filteredLines[0] || aiReply;
      
      // Hapus karakter aneh di awal/akhir
      aiReply = aiReply.replace(/^["'`:]+|["'`:]+$/g, '').trim();
      
      return NextResponse.json({ translation: aiReply });
    } else {
      throw new Error('Format respons tidak sesuai');
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghubungi AI', details: error.message }, 
      { status: 500 }
    );
  }
}
