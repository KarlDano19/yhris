import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData, isOTPVerificationValid } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    const credentials = await request.json();
    
    // Check persistent OTP verification cookie first
    const cookieStore = cookies();
    const otpVerifiedCookie = cookieStore.get('otp_verified');
    let otpVerified = false;
    let otpVerifiedAt = '';
    
    if (otpVerifiedCookie) {
      try {
        const cookieData = JSON.parse(decodeURIComponent(otpVerifiedCookie.value));
        
        if (cookieData.email === credentials.email && isOTPVerificationValid(cookieData.verifiedAt)) {
          otpVerified = true;
          otpVerifiedAt = cookieData.verifiedAt;
        }
      } catch (error) {
        // Invalid cookie, ignore
      }
    }
    
    // Fallback to session data if no valid cookie
    if (!otpVerified) {
      otpVerified = session.otpVerified || false;
      otpVerifiedAt = session.otpVerifiedAt || '';
      
      // Validate OTP verification status
      const isOTPValid = isOTPVerificationValid(otpVerifiedAt);
      otpVerified = otpVerified && isOTPValid;
      if (!isOTPValid) {
        otpVerifiedAt = '';
      }
    }
    
    // Add OTP verification status to the request
    const requestData = {
      ...credentials,
      otp_verified: otpVerified,
      otp_verified_at: otpVerifiedAt
    };
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestData),
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
    } else {
      // Direct login successful
      session['isLoggedIn'] = true;
      session['email'] = credentials.email;
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
        email: credentials.email, 
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
    }
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
}
