import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LOOPS_CALCULATOR_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Loops calculator API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Loops calculator events error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send event', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error proxying to Loops calculator events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
