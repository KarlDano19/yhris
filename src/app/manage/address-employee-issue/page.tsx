import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/manage/address-employee-issue/Content';

import { SessionData, sessionOptions } from '@/session/lib';

export const metadata = {
  title: 'Manage - Address Employee Issue - Yahshua HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const AddressEmployeeIssuePage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default AddressEmployeeIssuePage;
