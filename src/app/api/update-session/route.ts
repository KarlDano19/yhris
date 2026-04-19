import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<any>(cookies() as any, sessionOptions);
    const data = await request.json();
    // hasCompletedOnboarding and hasOnboarded are intentionally excluded here.
    // Those flags must only be updated via /api/refresh-onboarding-session,
    // which derives them from the backend rather than trusting client input.
    const expectedKeys = [
      'hasProfile',
      'hasPendingTransaction',
      'hasActiveSubscription',
      'token',
      'email',
      'accountType',
      'loginType',
      'isLoggedIn',
    ];
    for (const [key, value] of Object.entries(data)) {
      if (expectedKeys.includes(key)) {
        session[key.toString()] = value;
      }
    }
    await session.save();
    await sleep(250);
    return NextResponse.json({ message: 'Session updated' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
