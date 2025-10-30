import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(auth)/employer/manage/evaluation-history/Content';

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Manage - Evaluation History - Yahshua HRIS',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const EvaluationHistoryPage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default EvaluationHistoryPage;
