import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';

import Content from "@/components/pages/(auth)/employer/settings/general-settings/employees/Content";

async function getSession() {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    return session;
  }

export const metadata = {
    title: 'Employees - Yahshua HRIS',
}

const Employees = async () => {
    const session = await getSession();
    const loginType = session.loginType;
    const hasActiveSubscription = session.hasActiveSubscription;
    return <Content loginType={loginType} hasActiveSubscription={hasActiveSubscription} />
}

export default Employees;
