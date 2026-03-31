import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function DoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_dole_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
