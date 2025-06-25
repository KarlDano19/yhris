import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import VsSproutContent from "@/components/pages/(un-auth)/vs-sprout/VsSproutContent";

export default function VsSprout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <VsSproutContent />
      </main>
    </div>
  );
}