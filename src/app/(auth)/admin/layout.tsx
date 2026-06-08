import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import { SessionData, sessionOptions } from '@/lib/session';
import AdminShell from '@/components/pages/(auth)/admin/AdminShell';

async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <AdminShell initialTokenExpiresAt={session.tokenExpiresAt}>{children}</AdminShell>;
}
