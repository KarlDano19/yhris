import { cookies } from 'next/headers'

import { getIronSession } from 'iron-session'

import Content from '@/components/pages/(auth)/employer/settings/general-settings/third-party-platform/Content'

import { SessionData, sessionOptions } from '@/lib/session'

async function getSession() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions)
    return session
}

export const metadata = {
    title: 'Third Party Platform - Yahshua HRIS',
}

const ThirdPartyPlatformPage = async () => {
    const session = await getSession()
    const hasActiveSubscription = session.hasActiveSubscription
    return (
        <Content hasActiveSubscription={hasActiveSubscription}/>
    )
}

export default ThirdPartyPlatformPage