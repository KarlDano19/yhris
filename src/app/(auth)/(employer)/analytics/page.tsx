import React from "react";

import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';

import Content from "@/components/pages/(auth)/employer/analytics/Content";
import SmartPagePermissionGuard from "@/components/SmartPermissions/SmartPagePermissionGuard";

export const metadata = {
  title: "Analytics - Yahshua HRIS",
};

async function getSession() {
    const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
    return session;
  }

const Analytics = async () => {
    const session = await getSession()
    const hasActiveSubscription = session.hasActiveSubscription;
    return (
      <SmartPagePermissionGuard permission="view_analytics_page">
        <Content hasActiveSubscription={hasActiveSubscription} />
      </SmartPagePermissionGuard>
    );
};

export default Analytics;
