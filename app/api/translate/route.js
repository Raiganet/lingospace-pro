import { NextResponse } from 'next/server';
import { guardApiRequest } from '@/lib/serverGuards';

export const dynamic = 'force-dynamic';

const jsonError = (message, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

const ALLOWED_LANGUAGES = new Set(['id', 'en', 'ar']);

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

  const GAS_URL = process.env.TRANSLATE_GAS_URL || 'https://script.google.com/macros/s/AKfycbw3wHhpZp9nTUoV7SMHdg_ql5aqLfppRcgKK2HJtryKjTM9ubDEtw8Ky5c3yHshS1pkmw/exec';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ text, source, target }),
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!res.ok) return jsonError(`Mesin terjemahan merespons HTTP ${res.status}.`, 502);
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); }
    catch {
      const snippet = raw.substring(0, 80).replace(/<[^>]*>?/gm, '').trim();
      console.error('Translator returned non-JSON:', snippet);
      return jsonError('Respons mesin terjemahan tidak valid.', 502);
    }
    return NextResponse.json(data);
  } catch (error) {
    const timeout = error?.name === 'AbortError';
    return jsonError(timeout ? 'Mesin terjemahan timeout. Coba lagi.' : 'Gagal menghubungi mesin terjemahan.', 502);
  }
}
