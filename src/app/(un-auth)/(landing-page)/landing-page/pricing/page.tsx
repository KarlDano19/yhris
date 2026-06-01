import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import PricingContent from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/PricingContent";

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Pricing - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const PricingPage = async () => {
  const session = await getSession();
  const isLoggedIn = session.isLoggedIn;
  return <PricingContent isLoggedIn={isLoggedIn} />;
};

export default PricingPage;
