import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';

import Content from "@/components/pages/(auth)/employer/settings/Content";

export const metadata = {
  title: "Settings - Yahshua HRIS",
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const Settings = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default Settings;
