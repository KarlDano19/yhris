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

  return (
    <>
      <Header type={type} />
      {children}
    </>
  );
}

export default Auth as any;
