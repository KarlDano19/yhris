import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from "@/components/pages/(auth)/employer/screen-applicants/Content"
import SmartPagePermissionGuard from "@/components/SmartPermissions/SmartPagePermissionGuard"

import { SessionData, sessionOptions } from '@/lib/session';

export const metadata = {
  title: "Screen Applicants - Yahshua HRIS",
}

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

const ScreenApplicantsPage = async () => {
  const session = await getSession();
  const hasActiveSubscription = session.hasActiveSubscription;
  return (
    <SmartPagePermissionGuard permission="view_screen_applicant_page">
      <Content hasActiveSubscription={hasActiveSubscription} />
    </SmartPagePermissionGuard>
  )
}

export default ScreenApplicantsPage;
