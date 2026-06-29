import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = await cloudinary.v2.search
      .expression("resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(10)
      .execute() as { resources: any[] };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
