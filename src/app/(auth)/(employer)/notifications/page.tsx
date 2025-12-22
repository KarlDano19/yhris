import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';

import Content from "@/components/pages/(auth)/employer/notifications/Content";

export const metadata = {
  title: "Notifications - Yahshua HRIS",
};

async function getSession() {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    return session;
  }

const Notifications = async () => {
    const session = await getSession()
    return <Content />;
};

export default Notifications;
