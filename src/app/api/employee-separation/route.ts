import { separationItems } from '@/helpers/testData';
import { NextResponse } from 'next/server';
 
export async function GET() {
  return NextResponse.json(separationItems);
}
