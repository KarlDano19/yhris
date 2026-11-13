import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 });
    }

    // confirmed is always true here — this route is only called from the
    // "I have read & understood" button, never on page load
    const ackRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${id}/acknowledge/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, confirmed: true }),
      }
    );

    const responseData = await ackRes.json();
    return NextResponse.json(responseData, { status: ackRes.status });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
