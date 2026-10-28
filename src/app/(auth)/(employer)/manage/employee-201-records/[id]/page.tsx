
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/manage/employee-201-records/[id]/Content';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Employee 201 Records - Employee Detail',
};

async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions);
  return session;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const EmployeeDetail = async ({ params }: PageProps) => {
  const [resolvedParams, session] = await Promise.all([params, getSession()]);
  const loginType = session.loginType;
  const hasActiveSubscription = session.hasActiveSubscription;
  const hasYpIntegration = session.hasYpIntegration;

  return (
    <Content
      params={resolvedParams}
      loginType={loginType}
      hasActiveSubscription={hasActiveSubscription}
      hasYpIntegration={hasYpIntegration}
    />
  );
};

export default EmployeeDetail;