import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from "@/components/pages/(auth)/employer/dole/employee-compensation-logbook/Content";

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: "Employee Compensation Logbook - Yahshua HRIS",
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const EmployeeCompensationLogbook = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default EmployeeCompensationLogbook;
