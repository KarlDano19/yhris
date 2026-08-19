import { Metadata } from 'next';
import GreatdayAlternativeContent from "@/components/pages/(un-auth)/(landing-page)/greatday-hr-alternative/GreatdayAlternativeContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'GreatDay HR Alternative — YAHSHUA HRIS for Philippine SMEs',
  description: 'Looking for a GreatDay HR alternative? YAHSHUA HRIS bundles recruitment, performance management, and DOLE compliance at one flat rate, with no license minimum.',
  keywords: 'greatday hr alternative, switch from greatday hr, hris alternative philippines, greatday hr competitor',
  openGraph: {
    title: 'GreatDay HR Alternative — YAHSHUA HRIS',
    description: 'No add-on fees, no license minimum, guided DOLE compliance included. See why Philippine SMEs choose YAHSHUA HRIS over GreatDay HR.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreatDay HR Alternative — YAHSHUA HRIS',
    description: 'A GreatDay HR alternative built for Philippine SMEs: one flat rate, nothing unbundled.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/greatday-hr-alternative'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/greatday-hr-alternative#webpage",
      "name": "GreatDay HR Alternative: YAHSHUA HRIS for Philippine SMEs",
      "description": "YAHSHUA HRIS as a GreatDay HR alternative for Philippine SMEs: flat pricing at PHP 7,000/month for up to 100 employees with no license minimum, and recruitment, performance management, and DOLE compliance included at no extra cost.",
      "url": "https://yahshuahris.com/greatday-hr-alternative",
      "dateModified": "2026-08-14T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/greatday-hr-alternative#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a good alternative to GreatDay HR for Philippine SMEs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is a GreatDay HR alternative built for Philippine SMEs. It uses flat pricing at PHP 7,000/month for up to 100 employees with no license minimum, and includes recruitment, performance management, and a guided DOLE compliance module in every plan at no extra cost."
          }
        },
        {
          "@type": "Question",
          "name": "How do I switch from GreatDay HR to YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS charges a one-time PHP 35,000 setup fee that covers data migration, implementation, and dedicated onboarding training, bringing employee records and attendance history over during setup. There is no long-term contract after that."
          }
        },
        {
          "@type": "Question",
          "name": "Why do businesses look for a GreatDay HR alternative?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common reasons include GreatDay HR selling recruitment and performance management as paid add-ons rather than including them in its base package, a 50-employee-license minimum purchase on its Basic Starter Package, and the lack of a published guided DOLE reporting module for company registration, OSH reports, and AERW filing."
          }
        }
      ]
    }
  ]
};

export default function GreatdayAlternative() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'GreatDay HR Alternative', content_category: 'alternative' }} />
      <GreatdayAlternativeContent />
    </>
  );
}
