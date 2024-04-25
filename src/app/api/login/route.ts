import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData } from '@/session/lib';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    const credentials = await request.json();
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, config);
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    if (data.is_valid) {
      session["isLoggedIn"] = true;
      session["token"] = data.token;
      session["email"] = credentials.email;
      session["accountType"] = data.account_type;
      session["hasPendingTransaction"] = data.has_pending_transaction;
      session["hasActiveSubscription"] = data.has_active_subscription;
      session["hasProfile"] = data.has_profile;
      await session.save();
      await sleep(250);
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({is_valid: false}, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
