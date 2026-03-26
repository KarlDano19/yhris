import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_manage_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
