import { Metadata } from 'next';
import Q4ComplianceCountdownArticle, { q4CountdownFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/Q4ComplianceCountdownArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/q4-payroll-compliance-deadlines-philippines-2026';

export const metadata: Metadata = {
  title: 'Q4 2026 Payroll Deadlines in the Philippines: Checklist',
  description: 'Every Philippine payroll deadline from October to December 24, 2026: holidays, wage increases, SSS, PhilHealth, Pag-IBIG, BIR, annualization, 13th month.',
  keywords: 'Q4 payroll compliance deadlines Philippines, payroll deadlines 2026, holidays November December 2026 Philippines, holiday pay 2026, 13th month pay deadline 2026, year-end annualization, BIR 2316 deadline, SSS contribution deadline',
  openGraph: {
    title: 'Q4 2026 Payroll Deadlines in the Philippines: Checklist',
    description: 'Holidays, wage increases, monthly remittances, year-end tax, and 13th month pay from October to December 2026, plus what is due in January.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-01T00:00:00.000Z',
    modifiedTime: '2026-10-01T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Q4 2026 Payroll Deadlines in the Philippines: Checklist',
    description: 'Every Philippine payroll deadline from October to December 24, 2026, in one calendar.',
  },
  alternates: {
    canonical: URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${URL}#article`,
      "headline": "Your Q4 Compliance Countdown: Every Payroll Deadline Between Now and December 24",
      "description": "Philippine payroll deadlines from October to December 2026: eight national holidays and special days, NCR's November 16 to 18 special days, minimum wage increases in Central Visayas, Bicol, and BARMM, monthly SSS, PhilHealth, Pag-IBIG, and BIR payments, year-end annualization, the December 24 13th month pay deadline, and January 2027 filings.",
      "datePublished": "2026-10-01T00:00:00.000Z",
      "dateModified": "2026-10-01T00:00:00.000Z",
      "author": {
        "@type": "Organization",
        "name": "YAHSHUA HRIS Team",
        "url": "https://yahshuahris.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "YAHSHUA HRIS",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yahshuahris.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": URL
      },
      "keywords": "Q4 payroll deadlines Philippines 2026, holiday pay 2026, 13th month pay deadline, year-end annualization, BIR 2316, SSS PhilHealth Pag-IBIG remittance deadlines"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": q4CountdownFaqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${URL}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Q4 2026 Payroll Deadlines", "item": URL }
      ]
    }
  ]
};

const Q4ComplianceCountdownPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Q4 2026 Payroll Deadlines', content_category: 'blog' }} />
      <Q4ComplianceCountdownArticle />
    </>
  );
};

export default Q4ComplianceCountdownPage;
