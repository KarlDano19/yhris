import Content from '@/components/pages/(auth)/employer/talent-search/Content'
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard'
import React from 'react'

export const metadata = {
    title: 'Talent Search - Yahshua HRIS',
}

const TalentSearchPage = async () => {
    return (
        <SmartPagePermissionGuard permission="view_talent_search_page">
            <Content />
        </SmartPagePermissionGuard>
    )
}

export default TalentSearchPage