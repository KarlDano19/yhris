import { Metadata } from 'next';
import { YAHSHUA_PRICING, PRICING_LABELS } from "@/lib/yahshuaPricing";
import VsSproutContent from "@/components/pages/(un-auth)/(landing-page)/vs-sprout/VsSproutContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Sprout Solutions vs YAHSHUA HRIS: 2026 PH Comparison',
  description: `Sprout Solutions vs YAHSHUA HRIS on pricing, payroll, DOLE compliance, and hiring. YAHSHUA: ${PRICING_LABELS.base}/mo flat, payroll included. Sprout: quote-based.`,
  keywords: 'sprout solutions vs yahshua hris, compare sprout solutions, sprout solutions alternative philippines, hris comparison philippines, hr software philippines',
  openGraph: {
    title: 'Sprout Solutions vs YAHSHUA HRIS: 2026 PH Comparison',
    description: `Pricing, payroll, DOLE compliance, and hiring compared. YAHSHUA HRIS is ${PRICING_LABELS.base}/mo flat with payroll included; Sprout is quote-based.`,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprout Solutions vs YAHSHUA HRIS: 2026 PH Comparison',
    description: 'Side-by-side comparison of Sprout Solutions and YAHSHUA HRIS for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/vs-sprout'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/vs-sprout#webpage",
      "name": "Sprout Solutions vs YAHSHUA HRIS: 2026 Philippine Comparison",
      "description": `Feature and pricing comparison between YAHSHUA HRIS and Sprout HR for Philippine businesses. YAHSHUA includes DOLE compliance automation, multi-platform job posting, and flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees with YAHSHUA Payroll included.`,
      "url": "https://yahshuahris.com/vs-sprout",
      "dateModified": "2026-09-24T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      },
      "about": [
        {
          "@type": "SoftwareApplication",
          "name": "YAHSHUA HRIS",
          "url": "https://yahshuahris.com"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Sprout HR"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/vs-sprout#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the main difference between YAHSHUA HRIS and Sprout HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Both platforms cover Philippine HR, payroll, and compliance. The main differences are packaging and pricing transparency. YAHSHUA HRIS includes a guided DOLE module, multi-platform job posting (LinkedIn, Facebook, YAHSHUA Jobs), and YAHSHUA Payroll in one published plan price of ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees. Sprout offers compliance (Sprout Comply) and recruitment (Recruit+) as separately named products, and its pricing is quote-based.`
          }
        },
        {
          "@type": "Question",
          "name": "Does YAHSHUA HRIS include DOLE compliance automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. YAHSHUA HRIS includes a guided DOLE Module covering company registration through annual reports: OSH reports, AERW filing, and mandatory DOLE filings, all included in every plan with no add-on required. Sprout offers DOLE compliance tools through Sprout Comply, a separately named product with quote-based pricing."
          }
        },
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS pricing compare to Sprout HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `YAHSHUA HRIS costs a flat ${PRICING_LABELS.base}/month (VAT excluded) for up to ${YAHSHUA_PRICING.employeeCap} employees, plus ${PRICING_LABELS.excess} per additional employee per month, with a one-time ${PRICING_LABELS.setup} setup fee. YAHSHUA Payroll is included and there are no long-term contracts. Sprout HR does not publish standard pricing; companies request a quote based on headcount and modules.`
          }
        },
        {
          "@type": "Question",
          "name": "Which HR software is better for Philippine SMEs: YAHSHUA HRIS or Sprout HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is designed specifically for Philippine SMEs. It includes a guided DOLE module, multi-platform job posting, a complete hiring-to-offboarding workflow, and payroll at one flat rate for up to 100 employees. Sprout HR is a larger platform that scales from SMEs to enterprises, with quote-based pricing. SMEs that want compliance, hiring, and payroll at one published price are a strong fit for YAHSHUA HRIS; companies that need Sprout's broader enterprise suite or earned wage access may prefer Sprout."
          }
        }
      ]
    }
  ]
};

export default function VsSprout() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'YAHSHUA vs Sprout', content_category: 'comparison' }} />
      <VsSproutContent />
    </>
  );
}
