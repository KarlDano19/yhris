import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, SessionData } from '@/lib/session';

/**
 * POST /api/refresh-onboarding-session
 * Server-side only: reads the user's token from iron-session, fetches actual
 * onboarding status from the Django backend, and updates the session.
 * No body required — prevents client-side spoofing of onboarding flags.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);

    if (!session.isLoggedIn || !session.token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${process.env.NEXT_API_URL}/api/user-accounts/details/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${session.token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch user details' }, { status: 500 });
    }

    const data = await res.json();
    const hasOnboarded = data.has_onboarded ?? false;

    session.hasCompletedOnboarding = hasOnboarded;
    session.hasOnboarded = hasOnboarded;
    await session.save();

    return NextResponse.json({ message: 'Session refreshed' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
