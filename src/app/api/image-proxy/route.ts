import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const imageResponse = await fetch(url);
  const imageBuffer = await imageResponse.arrayBuffer();

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 