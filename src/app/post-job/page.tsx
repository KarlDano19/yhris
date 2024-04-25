import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from "@/components/pages/post-job/Content";

import { SessionData, sessionOptions } from '@/session/lib';

export const metadata = {
  title: "Job Posting - Yahshua HRIS",
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const PostJob = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default PostJob;
