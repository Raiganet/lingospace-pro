import vocabularyData from '@/data/vocabulary.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    let data = vocabularyData;

    // Filter berdasarkan category
    if (category !== 'all') {
      data = data.filter((item) => item.category === category);
    }

    return Response.json(data);
  } catch (error) {
    console.error('Vocabulary API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}