import SmartPagePermissionGuard from '@/components/SmartPermissions/SmartPagePermissionGuard';

export default function EvaluationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmartPagePermissionGuard permission="view_evaluation_page">
      {children}
    </SmartPagePermissionGuard>
  );
}
