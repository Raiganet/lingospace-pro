export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Ambil input dari frontend
    const body = await req.json();
    const text = body.text || '';
    const target = body.target || 'ar'; // Default ke Arab jika tidak ada

    if (!text) {
      return NextResponse.json({ error: 'Teks kosong' }, { status: 400 });
    }

    // 2. Buat URL dengan variabel yang unik (tidak duplikat)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    
    // 3. Panggil API Google
    const response = await fetch(url);
    const data = await response.json();

    // 4. Kirim hasil
    return NextResponse.json({ result: data[0][0][0] });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Gagal menghubungi server' }, { status: 500 });
  }
}
