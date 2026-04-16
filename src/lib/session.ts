import { SessionOptions } from 'iron-session';

// Access token lifetime constants (matches backend settings)
export const ACCESS_TOKEN_LIFETIME_SECONDS = 60 * 60 * 3; // 3 hours
// For testing
// export const ACCESS_TOKEN_LIFETIME_SECONDS = 60; // 1 minute
export const TOKEN_EXPIRATION_WARNING_SECONDS = 30; // Show warning 30 seconds before expiration

export interface SessionData {
  isLoggedIn: boolean;
  token: string;
  refreshToken: string;
  email: string;
  accountType: string;
  isAdmin: boolean;
  loginType: string;
  hasProfile: boolean;
  hasCompletedOnboarding: boolean;
  hasOnboarded: boolean;
  hasPendingTransaction: boolean;
  hasActiveSubscription: boolean;
  tokenExpiresAt?: number; // Unix timestamp when token expires
  // SECURITY FIX: Removed otpVerified and otpVerifiedAt
  // These fields allowed frontend-controlled OTP bypass
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  token: '',
  refreshToken: '',
  email: '',
  accountType: '',
  isAdmin: false,
  loginType: '',
  hasProfile: false,
  hasCompletedOnboarding: false,
  hasOnboarded: false,
  hasPendingTransaction: false,
  hasActiveSubscription: false,
};

export const sessionOptions: SessionOptions = {
  password: 'nI6xnF+V1OJj/GqGxaEwf6s1L48EBjclCu+TdQoFS6Y=',
  cookieName: 'iron_session_id',
  cookieOptions: {
    secure: false,
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// SECURITY FIX: Removed OTP verification functions
// These functions enabled dangerous OTP bypass mechanisms:
// - isOTPVerificationValid()
// - setOTPVerificationCookie()
// - getOTPVerificationCookie() 
// - clearOTPVerificationCookie()
//
// OTP verification is now handled ONLY by backend cache,
// preventing client-side manipulation.
