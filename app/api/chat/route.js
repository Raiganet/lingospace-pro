import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { guardApiRequest } from '@/lib/serverGuards';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const TASK_PROMPTS = {
  explain: `Kamu adalah tutor bahasa yang ringkas dan akurat. Jelaskan grammar/kosakata dari teks pengguna dalam Bahasa Indonesia. Gunakan struktur: Penjelasan singkat, Kenapa, Contoh benar. Jangan terlalu panjang.`,
  correct: `Kamu adalah tutor bahasa. Koreksi kalimat pengguna. Jawab dengan struktur: Versi benar, Apa yang diperbaiki, Alasan singkat. Pertahankan maksud asli pengguna.`,
  example: `Kamu adalah tutor bahasa. Buat 3 contoh kalimat alami dari kata/frasa pengguna. Sertakan arti Bahasa Indonesia. Jika input Arab, pertahankan tulisan Arab yang benar; jika memungkinkan gunakan harakat secukupnya.`,
  conversation: `Kamu adalah partner latihan percakapan bahasa. Balas secara natural dalam bahasa yang paling sesuai dengan input pengguna, maksimal 4 kalimat, lalu berikan satu pertanyaan lanjutan sederhana. Jika ada kesalahan besar, koreksi dengan lembut setelah balasan.`,
};

export async function POST(request) {
  const guard = guardApiRequest(request, {
    namespace: 'ai-chat',
    limit: Number(process.env.AI_RATE_LIMIT_MAX) || 20,
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60000,
    maxBytes: 12000,
  });
  if (guard) return guard;

  try {
    const body = await request.json();
    const text = String(body?.text || body?.message || '').trim();
    const task = String(body?.task || 'explain');

    if (!text) return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    if (text.length > 3000) return NextResponse.json({ error: 'Pesan terlalu panjang. Maksimal 3000 karakter.' }, { status: 400 });
    if (!TASK_PROMPTS[task]) return NextResponse.json({ error: 'Mode AI tidak dikenali' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY belum dikonfigurasi' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        temperature: task === 'conversation' ? 0.65 : 0.25,
        maxOutputTokens: 700,
      },
    });

    const prompt = `${TASK_PROMPTS[task]}\n\nTeks pengguna:\n${text}`;
    const result = await model.generateContent(prompt);
    const reply = (await result.response.text()).trim();

    return NextResponse.json({ reply, task });
  } catch (error) {
    console.error('LingoSpace AI error:', error);
    return NextResponse.json({ error: 'LingoSpace AI gagal memproses permintaan.' }, { status: 500 });
  }
}
