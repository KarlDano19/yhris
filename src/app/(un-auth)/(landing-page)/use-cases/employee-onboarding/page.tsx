import EmployeeOnboardingContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/employee-onboarding/EmployeeOnboardingContent";
import PixelEvents from '@/components/PixelEvents';

export default function EmployeeOnboarding() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Employee Onboarding', content_category: 'use-cases' }} />
      <EmployeeOnboardingContent />
    </>
  );
}
