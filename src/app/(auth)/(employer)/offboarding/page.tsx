import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/offboarding/Content';
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Offboarding - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions);
  return session;
}

const OffboardingPage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return (
    <SmartPagePermissionGuard permission="view_offboarding_page">
      <Content hasActiveSubscription={hasActiveSubscription} />
    </SmartPagePermissionGuard>
  );
};

export default OffboardingPage;
