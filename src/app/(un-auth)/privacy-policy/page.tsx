import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import PrivacyPolicyContent from "@/components/pages/(un-auth)/privacy-policy/PrivacyPolicyContent";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      <main className="pt-24">
        <PrivacyPolicyContent />
      </main>
    </div>
  );
}