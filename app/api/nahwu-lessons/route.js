import nahwuLessonsData from '@/data/nahwu-lessons.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') || 'all';

    let data = nahwuLessonsData;

    // Filter berdasarkan level
    if (level !== 'all') {
      data = data.filter((item) => item.level === level);
    }

    // Sort berdasarkan order
    data.sort((a, b) => parseInt(a.order) - parseInt(b.order));

    return Response.json(data);
  } catch (error) {
    console.error('Nahwu Lessons API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}