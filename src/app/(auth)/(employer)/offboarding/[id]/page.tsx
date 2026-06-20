import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import CaseDetailContent from '@/components/pages/(auth)/employer/offboarding/[id]/Content';
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Offboarding Case - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const OffboardingCaseDetailPage = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return (
    <SmartPagePermissionGuard permission="view_offboarding_page">
      <CaseDetailContent id={params.id} hasActiveSubscription={hasActiveSubscription} />
    </SmartPagePermissionGuard>
  );
};

export default OffboardingCaseDetailPage;
