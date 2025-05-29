import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import Content from '@/components/pages/(auth)/directives/Content';
import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: 'Memo/Policy | YAHSHUA HRIS',
  description: 'View and confirm memo or policy',
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const DirectivePage = async () => {
  const session = await getSession();
  return <Content userEmail={session.email} />;
};

export default DirectivePage; 