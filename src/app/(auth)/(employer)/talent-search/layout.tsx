import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function TalentSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_talent_search_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
