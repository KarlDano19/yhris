import Content from '@/components/pages/(auth)/employer/manage/Content'
import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard'
import React from 'react'

export const metadata = {
    title: 'Manage - Yahshua HRIS',
}

const ManagePage = async () => {
    return (
        <SmartPagePermissionGuard permission="view_manage_page">
            <Content />
        </SmartPagePermissionGuard>
    )
}

export default ManagePage