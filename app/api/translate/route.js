import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { guardApiRequest } from '@/lib/serverGuards';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const jsonError = (message, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

const ALLOWED_LANGUAGES = new Set(['id', 'en', 'ar']);
const LANGUAGE_NAMES = { id: 'Indonesian', en: 'English', ar: 'Arabic' };

const translateWithGemini = async ({ text, source, target }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    generationConfig: { temperature: 0.1, maxOutputTokens: 700 },
  });
  const sourceLabel = source ? LANGUAGE_NAMES[source] : 'automatically detected language';
  const targetLabel = LANGUAGE_NAMES[target];
  const prompt = [
    'You are a translation engine.',
    `Translate from ${sourceLabel} to ${targetLabel}.`,
    target === 'ar' ? 'For Arabic, use natural Modern Standard Arabic and add harakat only when helpful.' : '',
    'Return only the translated text. Do not add explanations, labels, markdown, or quotation marks.',
    '<user_text>',
    text,
    '</user_text>',
  ].filter(Boolean).join('\n');

  const result = await model.generateContent(prompt);
  const translation = (await result.response.text()).trim().replace(/^['"`]+|['"`]+$/g, '');
  return { success: true, translation, provider: 'gemini' };
};

const translateWithGas = async ({ endpoint, text, source, target }) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ text, source, target }),
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.text();
    const data = JSON.parse(raw);
    return { ...data, provider: 'gas' };
  } finally {
    clearTimeout(timer);
  }
};

export async function POST(request) {
  const guard = guardApiRequest(request, {
    namespace: 'translate',
    limit: Number(process.env.TRANSLATE_RATE_LIMIT_MAX) || 30,
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60000,
    maxBytes: 12000,
  });
  if (guard) return guard;

  let body;
  try { body = await request.json(); }
  catch { return jsonError('Request body tidak valid', 400); }

  const text = String(body?.text || '').trim();
  const source = String(body?.source || '').trim();
  const target = String(body?.target || '').trim();

  if (!text || !target) return jsonError('Parameter "text" dan "target" wajib diisi', 400);
  if (text.length > 3000) return jsonError('Teks terlalu panjang. Maksimal 3000 karakter.', 400);
  if (!ALLOWED_LANGUAGES.has(target)) return jsonError('Bahasa target tidak didukung.', 400);
  if (source && !ALLOWED_LANGUAGES.has(source)) return jsonError('Bahasa sumber tidak didukung.', 400);
  if (source && source === target) return NextResponse.json({ success: true, translation: text, provider: 'local' });

  const gasEndpoint = String(process.env.TRANSLATE_GAS_URL || '').trim();
  try {
    if (gasEndpoint) {
      try {
        const translated = await translateWithGas({ endpoint: gasEndpoint, text, source, target });
        return NextResponse.json(translated);
      } catch (error) {
        console.warn('GAS translator unavailable, trying Gemini fallback:', error?.message || error);
      }
    }

    const geminiResult = await translateWithGemini({ text, source, target });
    if (geminiResult) return NextResponse.json(geminiResult);
    return jsonError('Mesin terjemahan belum dikonfigurasi. Isi TRANSLATE_GAS_URL atau GEMINI_API_KEY.', 503);
  } catch (error) {
    console.error('Translate API error:', error);
    return jsonError('Gagal memproses terjemahan. Coba lagi.', 502);
  }
}
