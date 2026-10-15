import { Metadata } from 'next';
import DoleOshReportsArticle, { doleOshReportsFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/DoleOshReportsArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/dole-osh-reports-deadlines-wair-aedr-amr';

export const metadata: Metadata = {
  title: 'WAIR, AEDR, AMR Deadlines and Penalties: DOLE OSH Reports',
  description: 'WAIR is due every 30th, AEDR on January 30, AMR on March 31 under DO 252-25. Who files, where, the 24-hour accident rule, and the fines for missing them.',
  keywords: 'deadline of submission of WAIR, WAIR deadline, AEDR deadline January 30, Annual Medical Report deadline March 31, DO 252-25, DOLE OSH reports, work accident illness report, when to report fatal accident to DOLE',
  openGraph: {
    title: 'WAIR, AEDR, AMR Deadlines and Penalties: DOLE OSH Reports',
    description: 'When each DOLE safety report is due under DO 252-25, where it is filed, the 24-hour accident reporting rule, and what a missed submission costs.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-15T00:00:00.000Z',
    modifiedTime: '2026-10-15T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAIR, AEDR, AMR Deadlines and Penalties: DOLE OSH Reports',
    description: 'DOLE safety report deadlines, filing channel, the 24-hour rule, and fines under DO 252-25.',
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
      "headline": "DOLE Safety Report Deadlines: WAIR, AEDR, and AMR Under DO 252-25",
      "description": "Under DOLE Department Order No. 252-25, employers submit the Work Accident/Illness Report (WAIR) on the 30th of every month, the Annual Work Accident/Illness Exposure Data Report (AEDR) by January 30, and the Annual Medical Report (AMR) by March 31, even when no incident occurred. Deadlines for 2026 and 2027, the 24-hour accident reporting rule, who files, and administrative fines of 1,000, 2,000, and 3,000 pesos.",
      "image": "https://yahshuahris.com/blog/dole-safety-report-deadlines-2026.png",
      "datePublished": "2026-10-15T00:00:00.000Z",
      "dateModified": "2026-10-15T00:00:00.000Z",
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
      "keywords": "WAIR deadline, AEDR, AMR, DO 252-25, RA 11058, DOLE OSH reports, 24-hour accident report"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": doleOshReportsFaqs.map((f) => ({
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
        { "@type": "ListItem", "position": 3, "name": "DOLE OSH Report Deadlines", "item": URL }
      ]
    }
  ]
};

const DoleOshReportsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'DOLE OSH Report Deadlines', content_category: 'blog' }} />
      <DoleOshReportsArticle />
    </>
  );
};

export default DoleOshReportsPage;
