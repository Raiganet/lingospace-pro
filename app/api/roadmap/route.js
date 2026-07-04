import roadmapData from '@/data/roadmap.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'all';

    let roadmap = roadmapData;

    // Filter berdasarkan language jika ada parameter
    if (language !== 'all') {
      roadmap = roadmap.filter((item) => item.language === language);
    }

    // Sort berdasarkan level
    roadmap.sort((a, b) => parseInt(a.level) - parseInt(b.level));

    return Response.json(roadmap);
  } catch (error) {
    console.error('Roadmap API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}