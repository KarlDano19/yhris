import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from "@/components/pages/(auth)/employer/dole/annual-work-accident-illness-exposure-data-report/Content"

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: "Annual Work Accident/Illness Exposure Data Report - Yahshua HRIS",
};

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const AnnualWorkAccidentIllnessExposureDataReport = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return <Content hasActiveSubscription={hasActiveSubscription} />;
};

export default AnnualWorkAccidentIllnessExposureDataReport;