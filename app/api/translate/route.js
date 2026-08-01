// app/api/translate/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, source, target } = body;

    // URL Web App Google Apps Script Anda
    const GAS_URL = "https://script.google.com/macros/s/AKfycbw3wHhpZp9nTUoV7SMHdg_ql5aqLfppRcgKK2HJtryKjTM9ubDEtw8Ky5c3yHshS1pkmw/exec";

    // Server-side fetch TIDAK TERKENA BLOKIR CORS
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ text, source, target }),
      redirect: 'follow'
    });

    const data = await response.json();
    
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
