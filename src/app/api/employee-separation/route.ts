import { separationItems } from '@/helpers/testData';
import { NextResponse } from 'next/server';
 
export async function GET() {
  return NextResponse.json(separationItems);
}

export async function POST(request: Request) {
    const res = await request.json();
    return NextResponse.json(res);
}