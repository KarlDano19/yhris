import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import PrivacyPolicyContent from "@/components/pages/(un-auth)/privacy-policy/PrivacyPolicyContent";

export default function PrivacyPolicy() {
  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">
          <PrivacyPolicyContent />
        </main>
        <LpFooter />
      </div>
    </>
  );
}
