import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    
    return NextResponse.json({
      email: session.email || '',
      accountType: session.accountType || '',
      isLoggedIn: session.isLoggedIn || false,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}