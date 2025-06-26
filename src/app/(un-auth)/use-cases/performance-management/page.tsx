import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import PerformanceManagementContent from "@/components/pages/(un-auth)/use-cases/performance-management/PerformanceManagementContent";

export default function PerformanceManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <PerformanceManagementContent />
      </main>
    </div>
  );
}