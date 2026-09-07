import { Metadata } from 'next';
import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import PrivacyPolicyContent from "@/components/pages/(un-auth)/privacy-policy/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: 'Privacy Policy | YAHSHUA HRIS',
  description: 'How YAHSHUA HRIS collects, uses, and protects personal information across our web and mobile HR platform.',
  openGraph: {
    title: 'Privacy Policy | YAHSHUA HRIS',
    description: 'How YAHSHUA HRIS collects, uses, and protects personal information.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | YAHSHUA HRIS',
    description: 'How YAHSHUA HRIS collects, uses, and protects personal information.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/privacy-policy'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/privacy-policy#webpage",
      "name": "Privacy Policy | YAHSHUA HRIS",
      "description": "How YAHSHUA HRIS collects, uses, and protects personal information across our web and mobile HR platform.",
      "url": "https://yahshuahris.com/privacy-policy",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

export default function PrivacyPolicy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
