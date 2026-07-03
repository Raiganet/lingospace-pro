import { NextResponse } from 'next/server';
import { getSheetsClient, SPREADSHEET_ID } from '@/lib/googleSheets';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'all';

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Roadmap!A:G',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    rows.shift(); // Hapus header

    let roadmap = rows.map((row) => ({
      id: row[0] || '',
      language: row[1] || '',
      level: row[2] || '1',
      title: row[3] || '',
      description: row[4] || '',
      requiredWords: row[5] || '100',
      category: row[6] || '',
    }));

    if (language !== 'all') {
      roadmap = roadmap.filter((item) => item.language === language);
    }

    roadmap.sort((a, b) => parseInt(a.level) - parseInt(b.level));

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Roadmap API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}