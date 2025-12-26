import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, SessionData, ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    const payload = await request.json().catch(() => ({}));
    
    const refreshToken = payload.refresh_token || session.refreshToken;
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    };
    
    const res = await fetch(`${process.env.NEXT_API_URL}/api/auth/refresh/`, config);
    const data = await res.json();
    
    if (!res.ok) {
      session.destroy();
      throw data;
    }
    
    // Update session with new tokens
    // Access token expiration matches backend exactly (no buffer needed since we properly update cookie on refresh)
    const expiresAt = Date.now() + (ACCESS_TOKEN_LIFETIME_SECONDS * 1000);
    
    session.token = data.token;
    session.refreshToken = data.refresh_token || refreshToken;
    session.tokenExpiresAt = expiresAt;
    await session.save();
    
    // Update cookie with new token (same as login flow)
    const response = NextResponse.json({
      token: data.token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: expiresAt,
    }, { status: 200 });
    
    response.cookies.set('token', data.token, {
      maxAge: ACCESS_TOKEN_LIFETIME_SECONDS,
      sameSite: 'strict',
      httpOnly: false,
      secure: true,
    });
    
    return response;
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}

