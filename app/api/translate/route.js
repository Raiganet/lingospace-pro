// app/api/translate/route.js
import { NextResponse } from 'next/server';

const jsonError = (message, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body tidak valid', 400);
  }

  const { text, source, target } = body || {};

  // Periksa text dan target saja. Source boleh kosong.
  if (!text || !target) {
    return jsonError('Parameter "text" dan "target" wajib diisi', 400);
  }

  // ✅ Pastikan URL ini adalah URL hasil "New Deployment" terbaru dari Apps Script
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3wHhpZp9nTUoV7SMHdg_ql5aqLfppRcgKK2HJtryKjTM9ubDEtw8Ky5c3yHshS1pkmw/exec';

  let res;
  try {
    res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ 
        text: text, 
        source: source || '', // Jika kosong, Google akan auto-detect
        target: target 
      }),
      redirect: 'follow',
    });
  } catch (e) {
    return jsonError('Gagal menghubungi mesin terjemahan: ' + e.message, 502);
  }

  const raw = await res.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return jsonError('Mesin terjemahan membalas format tak terduga. Coba lagi sebentar lagi.', 502);
  }

  return NextResponse.json(data);
}
