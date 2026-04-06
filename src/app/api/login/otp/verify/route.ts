import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData, ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    const payload = await request.json();
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    const res = await fetch(`${process.env.NEXT_API_URL}/api/auth/login/otp/verify/`, config);
    const data = await res.json();
    
    if (!res.ok) {
      throw data;
    }
    
    // OTP verification successful
    // Access token expiration matches backend exactly (no buffer needed since we properly update cookie on refresh)
    const expiresAt = Date.now() + (ACCESS_TOKEN_LIFETIME_SECONDS * 1000);
    
    session['isLoggedIn'] = true;
    session['email'] = payload.email || session.email;
    session['token'] = data.token;
    session['refreshToken'] = data.refresh_token || '';
    session['tokenExpiresAt'] = expiresAt;
    session['accountType'] = data.account_type;
    session['isAdmin'] = data.is_admin === true;
    session['hasPendingTransaction'] = data.has_pending_transaction;
    session['hasActiveSubscription'] = data.has_active_subscription;
    session['hasProfile'] = data.has_profile;
    
    await session.save();
    await sleep(250);
    
    return NextResponse.json({
      token: data.token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
      is_valid: true,
      account_type: data.account_type,
      has_profile: data.has_profile,
      message: data.message,
      has_pending_transaction: data.has_pending_transaction,
      has_active_subscription: data.has_active_subscription,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
} 