import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function PostJobLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_post_job_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
