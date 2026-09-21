import vocabularyData from '@/data/vocabulary.json';

export async function GET() {
  try {
    const counts = vocabularyData.reduce((acc, item) => {
      const category = item.category?.trim() || 'Umum';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));

    return Response.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
