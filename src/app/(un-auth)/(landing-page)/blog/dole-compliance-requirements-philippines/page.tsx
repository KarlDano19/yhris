import { Metadata } from 'next';
import DoleComplianceArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/DoleComplianceArticle";

export const metadata: Metadata = {
  title: 'DOLE Compliance Requirements for Philippine Employers | YAHSHUA HRIS',
  description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
  keywords: 'DOLE compliance requirements Philippines, WAIR report, EC logbook, OSH annual report, Philippine labor compliance',
  openGraph: {
    title: 'DOLE Compliance Requirements Every Philippine Employer Must Know',
    description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-06-02T00:00:00.000Z',
    modifiedTime: '2026-06-02T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOLE Compliance Requirements Every Philippine Employer Must Know',
    description: 'Mandatory DOLE reports explained: WAIR, EC Logbook, OSH annual report, and more.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/dole-compliance-requirements-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines#article",
      "headline": "DOLE Compliance Requirements Every Philippine Employer Must Know",
      "description": "A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.",
      "image": "https://yahshuahris.com/blog/dole-compliance-2026.png",
      "datePublished": "2026-06-02T00:00:00.000Z",
      "dateModified": "2026-06-02T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines"
      },
      "keywords": "DOLE compliance requirements Philippines, WAIR report, EC logbook, OSH annual report, Philippine labor compliance"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yahshuahris.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://yahshuahris.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "DOLE Compliance Requirements for Philippine Employers",
          "item": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines"
        }
      ]
    }
  ]
};

const DoleCompliancePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DoleComplianceArticle />
    </>
  );
};

export default DoleCompliancePage;
