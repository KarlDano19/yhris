import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_onboarding_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
