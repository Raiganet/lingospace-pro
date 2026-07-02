import { NextResponse } from 'next/server';
import { getSheetsClient, SPREADSHEET_ID } from '@/lib/googleSheets';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Data!A:G',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    rows.shift(); // Hapus header

    let vocabList = rows.map((row) => ({
      id: row[0] || '',
      en: row[1] || '',
      ar: row[2] || '',
      id_lang: row[3] || '',
      ex_en: row[4] || '',
      ex_ar: row[5] || '',
      category: row[6] || 'Umum',
    }));

    // Filter category
    if (category && category !== 'all') {
      vocabList = vocabList.filter((item) => item.category === category);
    }

    // Filter search
    if (search) {
      const searchLower = search.toLowerCase();
      vocabList = vocabList.filter(
        (item) =>
          item.en.toLowerCase().includes(searchLower) ||
          item.ar.includes(search) ||
          item.id_lang.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(vocabList);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}