import { Metadata } from 'next';
import CompetitorsContent from "@/components/pages/(un-auth)/(landing-page)/competitors/CompetitorsContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'How YAHSHUA HRIS Compares to Other HR Software in the Philippines',
  description: 'See how YAHSHUA HRIS compares to other HR and payroll software options in the Philippines. Transparent feature and pricing comparisons for growing businesses.',
  keywords: 'hris comparison philippines, hr software comparison, yahshua hris competitors, best hris philippines',
  openGraph: {
    title: 'How YAHSHUA HRIS Compares to Other HR Software',
    description: 'Transparent feature and pricing comparisons between YAHSHUA HRIS and other HR software options in the Philippines.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How YAHSHUA HRIS Compares',
    description: 'HR software comparisons for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/how-we-compare'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/how-we-compare#webpage",
      "name": "How YAHSHUA HRIS Compares to Other HR Software in the Philippines",
      "description": "Feature comparison between YAHSHUA HRIS and other HR software options for Philippine businesses. YAHSHUA is the only Philippine HRIS with DOLE compliance automation built in, flat pricing, and complete hiring-to-offboarding workflow.",
      "url": "https://yahshuahris.com/how-we-compare",
      "dateModified": "2026-06-02T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/how-we-compare#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes YAHSHUA HRIS different from other HR software in the Philippines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is the only HRIS in the Philippines with DOLE compliance automation built in, covering company registration, OSH reports, annual medical reports, and mandatory DOLE filings, with no add-on required. It also includes multi-platform job posting to LinkedIn, Facebook, and YAHSHUA Jobs; a pre-screened talent pool; and flat pricing at PHP 7,000/month for up to 100 employees with no per-seat fees. Most Philippine HR software requires separate modules for compliance and charges per employee."
          }
        },
        {
          "@type": "Question",
          "name": "Does YAHSHUA HRIS charge per employee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. YAHSHUA HRIS uses flat monthly pricing starting at PHP 7,000/month for up to 100 employees, plus a one-time PHP 35,000 setup fee. There are no per-seat fees and no hidden charges. Most competing HR platforms in the Philippines charge per employee per month, which makes costs difficult to predict as headcount grows."
          }
        },
        {
          "@type": "Question",
          "name": "What HR software in the Philippines includes DOLE compliance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is the only HR platform in the Philippines that includes full DOLE compliance automation as a built-in feature, not an add-on. This covers DOLE company registration, Occupational Safety and Health (OSH) reporting, annual medical reports, and AERW filing. Other Philippine HR software typically requires separate compliance modules or manual management of DOLE filings."
          }
        },
        {
          "@type": "Question",
          "name": "Can YAHSHUA HRIS handle hiring and recruitment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. YAHSHUA HRIS includes multi-platform job posting across LinkedIn, Facebook, and YAHSHUA Jobs from a single dashboard. It has a centralized applicant tracking system, a pre-screened talent pool for faster hiring, and a complete hiring-to-offboarding workflow covering onboarding, training, performance, and separation. Most competing Philippine HR platforms do not include multi-platform job posting or a ready talent pool."
          }
        }
      ]
    }
  ]
};

export default function HowWeCompare() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'How We Compare', content_category: 'comparison' }} />
      <CompetitorsContent />
    </>
  );
}
