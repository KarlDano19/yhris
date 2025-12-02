import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/manage/employee-201-records/Content';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Manage - Employee 201 Records',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const Employee201RecordsPage = async () => {
    const session = await getSession();
    const loginType = session.loginType;
    const hasActiveSubscription = session.hasActiveSubscription;
    return <Content loginType={loginType} hasActiveSubscription={hasActiveSubscription} />;
};

export default Employee201RecordsPage;
