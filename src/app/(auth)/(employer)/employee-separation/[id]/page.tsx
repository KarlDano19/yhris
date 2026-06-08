import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import CaseDetailContent from '@/components/pages/(auth)/employer/employee-separation/[id]/Content';
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Separation Case - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const SeparationCaseDetailPage = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return (
    <SmartPagePermissionGuard permission="view_employee_separation_page">
      <CaseDetailContent id={params.id} hasActiveSubscription={hasActiveSubscription} />
    </SmartPagePermissionGuard>
  );
};

export default SeparationCaseDetailPage;
