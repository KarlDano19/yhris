import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import EmployeeOnboardingContent from "@/components/pages/(un-auth)/use-cases/employee-onboarding/EmployeeOnboardingContent";

export default function EmployeeOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <EmployeeOnboardingContent />
      </main>
    </div>
  );
}