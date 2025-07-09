import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  // Return a NextResponse object with your data
  return NextResponse.json({ message: `Hello, ${name}!` });
}
