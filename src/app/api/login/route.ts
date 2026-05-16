import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData, ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    const credentials = await request.json();
    
    // SECURITY FIX: Removed OTP bypass mechanism
    // The following code was a security vulnerability as it allowed
    // clients to automatically bypass OTP verification by storing
    // persistent cookies and session data
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials), // Only send actual credentials
    };
    
    // Use the new OTP-enabled login endpoint
    const res = await fetch(`${process.env.NEXT_API_URL}/api/auth/login/`, config);
    const data = await res.json();
    
    if (!res.ok) {
      throw data;
    }
    
    // Check if OTP is required
    if (data.otp_required) {
      // Return OTP required response
      return NextResponse.json({
        otp_required: true,
        session_id: data.session_id,
        expires_at: data.expires_at,
        remaining_attempts: data.remaining_attempts,
        time_remaining_seconds: data.time_remaining_seconds,
        email_sent: data.email_sent,
        message: data.message,
        is_valid: false
      }, { status: 200 });
    } else if (data.is_valid) {
      // Direct login successful and email verified
      // Access token expiration matches backend exactly (no buffer needed since we properly update cookie on refresh)
      const expiresAt = Date.now() + (ACCESS_TOKEN_LIFETIME_SECONDS * 1000);
      
      session['isLoggedIn'] = true;
      session['email'] = credentials.email;
      session['token'] = data.token;
      session['refreshToken'] = data.refresh_token || '';
      session['tokenExpiresAt'] = expiresAt;
      session['accountType'] = data.account_type;
      session['isAdmin'] = data.is_admin === true;
      session['hasPendingTransaction'] = data.has_pending_transaction;
      session['hasActiveSubscription'] = data.has_active_subscription;
      session['hasProfile'] = data.has_profile;
      session['hasCompletedOnboarding'] = data.has_onboarded ?? false;
      session['loginType'] = data.login_type || 'password';

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
    } else {
      // Email not verified - don't create session
      return NextResponse.json({
        is_valid: false,
        message: data.message,
        account_type: data.account_type,
      }, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
