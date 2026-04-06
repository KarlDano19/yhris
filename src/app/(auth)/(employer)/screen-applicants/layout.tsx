import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function ScreenApplicantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_screen_applicant_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
