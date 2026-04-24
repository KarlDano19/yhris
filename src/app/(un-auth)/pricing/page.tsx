import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(un-auth)/pricing/LpPricingContent';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Pricing - Yahshua HRIS',
  description: 'HRIS',
  alternates: {
    canonical: 'https://yahshuahris.com/pricing'
  }
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
