import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  try {
    const token = session.token;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_API_URL}/api/logout/`, config);
    const data = await res.json();
    if (!res.ok) {
      throw res.json();
    }
    session.destroy();
    await sleep(250);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    session.destroy();
    await sleep(250);
    return NextResponse.json(err, { status: 500 });
  }
}
