import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/manage-subscriptions/Content';

import { SessionData, sessionOptions } from '@/session/lib';

export const metadata = {
  title: 'Manage Subscriptions - Yahshua HRIS',
  description: 'HRIS',
}

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const ManageSubscriptionsPage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default ManageSubscriptionsPage;
