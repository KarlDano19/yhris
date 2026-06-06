import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(un-auth)/(landing-page)/pricing/LpPricingContent';
import PixelEvents from '@/components/PixelEvents';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'YAHSHUA HRIS Pricing - Affordable HR & Payroll Plans for Philippine Businesses',
  description: 'Simple, transparent pricing for YAHSHUA HRIS. Get payroll automation, employee management, DOLE compliance, and more. Plans designed for small and growing businesses in the Philippines.',
  openGraph: {
    title: 'YAHSHUA HRIS Pricing - Affordable HR & Payroll Plans',
    description: 'Simple, transparent pricing for YAHSHUA HRIS. Payroll automation, employee management, and DOLE compliance. Plans for every business size.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Pricing - Affordable HR & Payroll Plans',
    description: 'Transparent pricing for payroll automation, employee management, and DOLE compliance in the Philippines.',
  },
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
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Pricing', content_category: 'pricing' }} />
      <Content isLoggedIn={isLoggedIn} />
    </>
  );
};

export default PlanPage;
