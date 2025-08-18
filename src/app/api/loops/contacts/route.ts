/**
 * API Route: /api/loops/contacts/create
 * Proxies contact creation requests to Loops.so API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LOOPS_API_KEY; // Note: No NEXT_PUBLIC_ prefix for server-side
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Loops API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Loops API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create contact in Loops', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error proxying to Loops:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
