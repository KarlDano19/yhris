import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import UseCasesContent from "@/components/pages/(un-auth)/use-cases/UseCasesContent";

export default function UseCases() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <UseCasesContent />
      </main>
    </div>
  );
}