import { Metadata } from 'next';
import DoleComplianceArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/DoleComplianceArticle";
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';
import { doleComplianceFaqs } from '@/lib/blogFaqs';

export const metadata: Metadata = {
  title: 'DOLE Compliance Requirements for Employers | YAHSHUA HRIS',
  description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
  keywords: 'DOLE compliance requirements Philippines, WAIR report, EC logbook, OSH annual report, Philippine labor compliance',
  openGraph: {
    images: OG_IMAGES,
    title: 'DOLE Compliance Requirements Every Philippine Employer Must Know',
    description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['dole-compliance-requirements-philippines'].published),
    modifiedTime: blogIso(BLOG_DATES['dole-compliance-requirements-philippines'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: TWITTER_IMAGES,
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
      "datePublished": blogIso(BLOG_DATES['dole-compliance-requirements-philippines'].published),
      "dateModified": blogIso(BLOG_DATES['dole-compliance-requirements-philippines'].modified),
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
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines#faq",
      "mainEntity": doleComplianceFaqs.map((f) => ({
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
