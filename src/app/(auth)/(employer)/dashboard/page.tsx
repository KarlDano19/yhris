import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Home from '@/components/pages/(auth)/employer/Home';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Dashboard - Yahshua HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const HomePage = async () => {
  const session = await getSession();
  const loginType = session.loginType;
  return <Home loginType={loginType} />;
};

export default HomePage;
