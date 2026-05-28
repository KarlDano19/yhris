/**
 * POST /api/capture-email
 * Lightweight landing page CTA handler.
 * 1. Creates contact in Loops with source = landing-page-cta
 * 2. Fires ctaEmailCaptured event to trigger Loops sequence
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const apiKey = process.env.LOOPS_BOOKDEMO_API;
    if (!apiKey) {
      console.warn('LOOPS_BOOKDEMO_API not set — skipping Loops');
      return NextResponse.json({ success: true });
    }

    // Create contact (ignore duplicate errors — contact may already exist)
    await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'HRIS Website',
        leadStatus: 'cta_captured',
      }),
    });

    // Fire event to trigger Loops sequence
    await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, eventName: 'ctaEmailCaptured' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('capture-email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
