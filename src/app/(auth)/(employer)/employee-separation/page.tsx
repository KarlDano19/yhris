import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/employee-separation/Content';
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Employee Separation - Yahshua HRIS',
  description: 'HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const EmployeeSeparationPage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return (
    <SmartPagePermissionGuard permission="view_employee_separation_page">
      <Content hasActiveSubscription={hasActiveSubscription} />
    </SmartPagePermissionGuard>
  );
};

export default EmployeeSeparationPage;
