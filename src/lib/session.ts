import { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  token: string;
  email: string;
  accountType: string;
  loginType: string;
  hasProfile: boolean;
  hasPendingTransaction: boolean;
  hasActiveSubscription: boolean;
  otpVerified?: boolean; // Track if user has verified OTP in this session
  otpVerifiedAt?: string; // When OTP was verified
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  token: '',
  email: '',
  accountType: '',
  loginType: '',
  hasProfile: false,
  hasPendingTransaction: false,
  hasActiveSubscription: false,
  otpVerified: false,
  otpVerifiedAt: '',
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

export function isOTPVerificationValid(otpVerifiedAt: string): boolean {
  if (!otpVerifiedAt) return false;
  
  try {
    const verifiedTime = new Date(otpVerifiedAt);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - verifiedTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // OTP verification is valid for 24 hours
    return hoursDiff < 24;
  } catch {
    return false;
  }
}

// Persistent OTP verification cookie functions
export function setOTPVerificationCookie(email: string, verifiedAt: string) {
  if (typeof document !== 'undefined') {
    const cookieValue = JSON.stringify({ email, verifiedAt });
    document.cookie = `otp_verified=${encodeURIComponent(cookieValue)}; path=/; max-age=86400; SameSite=Strict`;
  }
}

export function getOTPVerificationCookie(email: string): { verified: boolean; verifiedAt: string } {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'otp_verified') {
        try {
          const data = JSON.parse(decodeURIComponent(value));
          
          if (data.email === email && isOTPVerificationValid(data.verifiedAt)) {
            return { verified: true, verifiedAt: data.verifiedAt };
          }
        } catch (error) {
          // Invalid cookie, ignore
        }
      }
    }
  }
  return { verified: false, verifiedAt: '' };
}

export function clearOTPVerificationCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'otp_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
