import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import EmployeeDocumentationContent from "@/components/pages/(un-auth)/use-cases/employee-documentation/EmployeeDocumentationContent";

export default function EmployeeDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <EmployeeDocumentationContent />
      </main>
    </div>
  );
}