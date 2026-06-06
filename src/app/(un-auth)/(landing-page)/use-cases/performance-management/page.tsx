import PerformanceManagementContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/performance-management/PerformanceManagementContent";
import PixelEvents from '@/components/PixelEvents';

export default function PerformanceManagement() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Performance Management', content_category: 'use-cases' }} />
      <PerformanceManagementContent />
    </>
  );
}
