import { NextResponse } from 'next/server';
import { getSheetsClient, SPREADSHEET_ID } from '@/lib/googleSheets';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') || 'all';

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'English_Lessons!A:I',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    rows.shift(); // Hapus header

    let lessons = rows.map((row) => ({
      id: row[0] || '',
      category: row[1] || '',
      title: row[2] || '',
      content_en: row[3] || '',
      content_id: row[4] || '',
      example_en: row[5] || '',
      example_id: row[6] || '',
      level: row[7] || '1',
      order: row[8] || '1',
    }));

    if (level !== 'all') {
      lessons = lessons.filter((item) => item.level === level);
    }

    lessons.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('English Lessons API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}