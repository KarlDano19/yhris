import { Metadata } from 'next';
import { YAHSHUA_PRICING, PRICING_LABELS } from "@/lib/yahshuaPricing";
import SproutAlternativeContent from "@/components/pages/(un-auth)/(landing-page)/sprout-alternative/SproutAlternativeContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Sprout HR Alternative — YAHSHUA HRIS for Philippine SMEs',
  description: 'Looking for a Sprout HR alternative? YAHSHUA HRIS offers flat pricing, built-in recruitment, and guided DOLE compliance for Philippine SMEs, with no per-seat fees.',
  keywords: 'sprout hr alternative, sprout solutions alternative, switch from sprout, hris alternative philippines',
  openGraph: {
    title: 'Sprout HR Alternative — YAHSHUA HRIS',
    description: 'Flat pricing, built-in recruitment, and guided DOLE compliance. See why Philippine SMEs choose YAHSHUA HRIS as their Sprout HR alternative.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprout HR Alternative — YAHSHUA HRIS',
    description: 'A Sprout HR alternative built for Philippine SMEs: flat pricing, built-in hiring, guided DOLE compliance.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/sprout-alternative'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/sprout-alternative#webpage",
      "name": "Sprout HR Alternative: YAHSHUA HRIS for Philippine SMEs",
      "description": `YAHSHUA HRIS as a Sprout HR alternative for Philippine SMEs: flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees, built-in multi-platform job posting, and a guided DOLE compliance module.`,
      "url": "https://yahshuahris.com/sprout-alternative",
      "dateModified": "2026-08-14T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/sprout-alternative#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a good alternative to Sprout HR for Philippine SMEs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `YAHSHUA HRIS is a Sprout HR alternative built specifically for Philippine SMEs. It uses flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees instead of per-seat billing, and includes multi-platform job posting, a pre-screened talent pool, and a guided DOLE compliance module in every plan.`
          }
        },
        {
          "@type": "Question",
          "name": "How do I switch from Sprout HR to YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `YAHSHUA HRIS charges a one-time ${PRICING_LABELS.setup} setup fee that covers full data migration, implementation, and dedicated onboarding training. Employee records, 201 files, and payroll history are migrated as part of onboarding, and there is no long-term contract after setup.`
          }
        },
        {
          "@type": "Question",
          "name": "Why do businesses look for a Sprout HR alternative?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common reasons include Sprout HR's per-seat pricing, which becomes harder to predict as headcount grows, the lack of built-in multi-platform job posting in its standard offering, and the absence of automated DOLE compliance reporting such as OSH reports and AERW filing."
          }
        }
      ]
    }
  ]
};

export default function SproutAlternative() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Sprout Alternative', content_category: 'alternative' }} />
      <SproutAlternativeContent />
    </>
  );
}
