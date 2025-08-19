import { cookies } from "next/headers";

import { getIronSession } from "iron-session";

import Content from "@/components/pages/(auth)/employer/screen-applicants/[id]/Content"

import { SessionData, sessionOptions } from "@/lib/session";

export const metadata = {
  title: "Screen Applicants - Yahshua HRIS",
}

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

export default async function page() {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />
}
