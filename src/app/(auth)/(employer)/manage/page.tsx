import React from 'react'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import Content from '@/components/pages/(auth)/employer/manage/Content'

export const metadata = {
    title: 'Manage - Yahshua HRIS',
}

async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions)
    return session
}

const ManagePage = async () => {
    const session = await getSession()
    return <Content loginType={session.loginType} />
}

export default ManagePage
