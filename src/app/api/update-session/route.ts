import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep } from '@/session/lib';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<any>(cookies() as any, sessionOptions);
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      if (["hasProfile", "hasPendingTransaction", "hasActiveSubscription"].includes(key)) {
        session[key.toString()] = value;
      }
    }
    await session.save();
    await sleep(250);
    return NextResponse.json({ message: 'Session updated' }, { status: 200 });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json(err, { status: 500 });
  }
}
