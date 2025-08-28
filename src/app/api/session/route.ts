/**
 * Session API Route
 * GET /api/session - Returns current session data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, defaultSession, sessionOptions, isOTPVerificationValid } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    
    // Return session data (or default if no session)
    const sessionData = session.isLoggedIn ? session : defaultSession;
    
    // Add OTP verification status
    if (sessionData.otpVerified && sessionData.otpVerifiedAt) {
      sessionData.otpVerified = isOTPVerificationValid(sessionData.otpVerifiedAt);
      if (!sessionData.otpVerified) {
        sessionData.otpVerifiedAt = '';
      }
    }
    
    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(defaultSession);
  }
}
