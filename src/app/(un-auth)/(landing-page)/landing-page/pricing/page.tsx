import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import PricingContent from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/PricingContent";

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Pricing - Yahshua HRIS',
  description: 'YAHSHUA HRIS pricing plans.',
  robots: { index: false, follow: false },
};

async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions);
  return session;
}

const PricingPage = async () => {
  const session = await getSession();
  const isLoggedIn = session.isLoggedIn;
  return <PricingContent isLoggedIn={isLoggedIn} />;
};

export default PricingPage;
