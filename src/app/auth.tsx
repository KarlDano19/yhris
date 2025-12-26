import { cookies } from "next/headers";

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';
import Header from '@/app/header';

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

async function Auth({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const type = session.accountType;
  const hasProfile = session.hasProfile;
  const hasActiveSubscription = session.hasActiveSubscription;
  const tokenExpiresAt = session.tokenExpiresAt;

  return (
    <>
      <Header
        type={type}
        hasProfile={hasProfile}
        hasActiveSubscription={hasActiveSubscription}
        tokenExpiresAt={tokenExpiresAt}
      />
      {children}
    </>
  );
}

export default Auth as any;
