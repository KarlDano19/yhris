import { cookies } from "next/headers";

import { getIronSession } from "iron-session";

import Content from "@/components/pages/(auth)/employer/settings/users/user-rights/Content";

import { SessionData, sessionOptions } from "@/lib/session";

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions)
  return session
}

export const metadata = {
  title: "User Rights - Yahshua HRIS",
};

const UserRights = async () => {
  const session = await getSession()
  const hasActiveSubscription = session.hasActiveSubscription
  return <Content hasActiveSubscription={hasActiveSubscription}/>
};

export default UserRights;
