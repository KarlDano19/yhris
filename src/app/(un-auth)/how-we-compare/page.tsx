import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import CompetitorsContent from "@/components/pages/(un-auth)/competitors/CompetitorsContent";

export default function HowWeCompare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <CompetitorsContent />
      </main>
    </div>
  );
}