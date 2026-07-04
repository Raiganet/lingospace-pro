import categoriesData from '@/data/categories.json';

export async function GET() {
  try {
    return Response.json(categoriesData);
  } catch (error) {
    console.error('Categories API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}