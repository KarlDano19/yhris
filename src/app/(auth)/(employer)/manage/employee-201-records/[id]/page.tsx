
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/manage/employee-201-records/[id]/Content';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Employee 201 Records - Employee Detail',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

interface PageProps {
  params: { id: string };
}

const EmployeeDetail = async ({ params }: PageProps) => {
  const session = await getSession();
  const loginType = session.loginType;
  const hasActiveSubscription = session.hasActiveSubscription;

  return (
    <Content
      params={params}
      loginType={loginType}
      hasActiveSubscription={hasActiveSubscription}
    />
  );
};

export default EmployeeDetail;