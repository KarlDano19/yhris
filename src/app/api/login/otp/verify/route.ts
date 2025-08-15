import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData } from '@/lib/session';

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
    session['isLoggedIn'] = true;
    session['email'] = payload.email || session.email;
    session['token'] = data.token;
    session['accountType'] = data.account_type;
    session['hasPendingTransaction'] = data.has_pending_transaction;
    session['hasActiveSubscription'] = data.has_active_subscription;
    session['hasProfile'] = data.has_profile;
    
    // Mark OTP as verified for this session
    session['otpVerified'] = true;
    session['otpVerifiedAt'] = new Date().toISOString();
    
    await session.save();
    await sleep(250);
    
    // Set persistent OTP verification cookie
    const response = NextResponse.json({
      token: data.token,
      is_valid: true,
      account_type: data.account_type,
      has_profile: data.has_profile,
      message: data.message,
      has_pending_transaction: data.has_pending_transaction,
      has_active_subscription: data.has_active_subscription,
    }, { status: 200 });
    
    // Set persistent cookie for OTP verification
    const cookieValue = JSON.stringify({ 
      email: payload.email || session.email, 
      verifiedAt: new Date().toISOString() 
    });
    response.cookies.set('otp_verified', encodeURIComponent(cookieValue), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });
    
    return response;
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
} 