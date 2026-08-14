import { Metadata } from 'next';
import VsSproutContent from "@/components/pages/(un-auth)/(landing-page)/vs-sprout/VsSproutContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS vs Sprout Solutions — Which is Right for Your Business?',
  description: 'Compare YAHSHUA HRIS and Sprout Solutions side by side. See how features, pricing, DOLE compliance, and payroll integration stack up for Philippine businesses.',
  keywords: 'yahshua hris vs sprout solutions, sprout solutions alternative, hris comparison philippines, hr software philippines',
  openGraph: {
    title: 'YAHSHUA HRIS vs Sprout Solutions',
    description: 'Compare YAHSHUA HRIS and Sprout Solutions on features, pricing, and DOLE compliance. Built for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS vs Sprout Solutions',
    description: 'Side-by-side comparison of YAHSHUA HRIS and Sprout Solutions for Philippine businesses.',
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
      "name": "YAHSHUA HRIS vs Sprout Solutions: Side-by-Side Comparison",
      "description": "Feature and pricing comparison between YAHSHUA HRIS and Sprout HR for Philippine businesses. YAHSHUA includes DOLE compliance automation, multi-platform job posting, and flat pricing at PHP 7,000/month for up to 100 employees.",
      "url": "https://yahshuahris.com/vs-sprout",
      "dateModified": "2026-06-02T00:00:00.000Z",
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
            "text": "YAHSHUA HRIS includes DOLE compliance automation, multi-platform job posting (LinkedIn, Facebook, YAHSHUA Jobs), and a pre-screened talent pool, all built in at no extra cost. Sprout HR does not include DOLE compliance automation or multi-platform job posting in its standard offering. YAHSHUA also uses flat pricing at PHP 7,000/month for up to 100 employees with no per-seat fees, while Sprout HR uses per-seat pricing."
          }
        },
        {
          "@type": "Question",
          "name": "Does YAHSHUA HRIS include DOLE compliance automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. YAHSHUA HRIS includes a guided DOLE Module covering company registration through annual reports: OSH reports, AERW filing, and mandatory DOLE filings, all included in every plan with no add-on required. Sprout HR does not include DOLE compliance automation."
          }
        },
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS pricing compare to Sprout HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS starts at PHP 7,000/month for up to 100 employees with flat pricing (plus a one-time PHP 35,000 setup fee): no per-seat fees, no long-term contracts. Sprout HR uses per-seat pricing, which makes costs harder to predict as headcount grows. For most Philippine SMEs, YAHSHUA HRIS costs up to 60% less than a comparable Sprout HR configuration."
          }
        },
        {
          "@type": "Question",
          "name": "Which HR software is better for Philippine SMEs: YAHSHUA HRIS or Sprout HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is designed specifically for Philippine SMEs. It includes DOLE compliance automation, Philippine-specific features, flat pricing that does not scale with headcount, and a complete hiring-to-offboarding workflow. Sprout HR is a larger enterprise platform with per-seat pricing that becomes more expensive as teams grow. Philippine businesses with 10 to 500 employees that need DOLE compliance out of the box typically find YAHSHUA HRIS a better fit."
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
