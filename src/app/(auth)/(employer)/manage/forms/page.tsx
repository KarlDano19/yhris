import { Metadata } from "next"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { sessionOptions, SessionData } from "@/lib/session"

import FormsContent from "@/components/pages/(auth)/employer/manage/forms/Content"

export const metadata: Metadata = {
  title: "Forms - Yahshua HRIS",
}

export default async function FormsPage() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions)
  const hasActiveSubscription = session?.hasActiveSubscription ?? false

  return <FormsContent />
}
