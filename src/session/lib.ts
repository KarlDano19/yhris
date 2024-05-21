import { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  token: string;
  email: string;
  accountType: string;
  hasProfile: boolean;
  hasPendingTransaction: boolean;
  hasActiveSubscription: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  token: '',
  email: '',
  accountType: '',
  hasProfile: false,
  hasPendingTransaction: false,
  hasActiveSubscription: false,
};

export const sessionOptions: SessionOptions = {
  password: 'nI6xnF+V1OJj/GqGxaEwf6s1L48EBjclCu+TdQoFS6Y=',
  cookieName: 'iron_session_id',
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: false,
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
