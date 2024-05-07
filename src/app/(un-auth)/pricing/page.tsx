import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(un-auth)/plan/Content';

import { SessionData, sessionOptions } from '@/session/lib';

export const metadata = {
  title: 'Pricing - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const PlanPage = async () => {
  const session = await getSession();
  const isLoggedIn = session.isLoggedIn;
  return <Content isLoggedIn={isLoggedIn} />;
};

export default PlanPage;
