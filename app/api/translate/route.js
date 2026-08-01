// app/api/translate/route.js
import { NextResponse } from 'next/server';

// Helper: selalu kembalikan JSON, tidak pernah HTML
const jsonError = (message, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request) {
  // 1. Baca body dari frontend
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body tidak valid', 400);
  }

  const { text, source, target } = body || {};

  if (!text || !target) {
    return jsonError('Parameter "text" dan "target" wajib diisi', 400);
  }

  // 2. Panggil Google Apps Script (server-to-server, bebas CORS)
  const GAS_URL =
    'https://script.google.com/macros/s/AKfycbw3wHhpZp9nTUoV7SMHdg_ql5aqLfppRcgKK2HJtryKjTM9ubDEtw8Ky5c3yHshS1pkmw/exec';

  let res;
  try {
    res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      // source kosong ('') = Google auto-detect bahasa asal
      body: JSON.stringify({ text, source: source || '', target }),
      redirect: 'follow',
    });
  } catch (e) {
    return jsonError('Gagal menghubungi mesin terjemahan: ' + e.message, 502);
  }

  // 3. Baca sebagai TEKS dulu (aman walau GAS balas HTML/error)
  const raw = await res.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    // GAS membalas bukan JSON (misal halaman login / quota) → jangan crash
    return jsonError(
      'Mesin terjemahan membalas format tak terduga. Coba lagi sebentar lagi.',
      502
    );
  }

  // 4. Teruskan apa adanya ke frontend
  return NextResponse.json(data);
}
