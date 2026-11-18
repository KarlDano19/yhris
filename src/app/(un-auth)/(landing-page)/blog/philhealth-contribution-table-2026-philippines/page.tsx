import { Metadata } from 'next';
import PhilhealthContributionTable2026Article from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PhilhealthContributionTable2026Article";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { philhealthFaqs } from '@/lib/blogFaqs';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'PhilHealth Contribution Table 2026: 5% Rate, ₱100,000 Cap',
  description: 'PhilHealth 2026 premium is 5% of basic salary, split 2.5% each, with a ₱10,000 floor and ₱100,000 ceiling. Table by salary, formula and remittance dates.',
  keywords: 'PhilHealth contribution table 2026, PhilHealth contribution 2026, PhilHealth premium rate 2026, PhilHealth ceiling 100000, PhilHealth employer share, PhilHealth remittance deadline, RA 11223',
  openGraph: {
    images: OG_IMAGES,
    title: 'PhilHealth Contribution Table 2026: Rate, Floor, Ceiling and Employer Share',
    description: '5% of monthly basic salary, shared equally, on a ₱10,000 floor and ₱100,000 ceiling. Contribution table by salary, how to compute it, and when employers pay.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['philhealth-contribution-table-2026-philippines'].published),
    modifiedTime: blogIso(BLOG_DATES['philhealth-contribution-table-2026-philippines'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: TWITTER_IMAGES,
    card: 'summary_large_image',
    title: 'PhilHealth Contribution Table 2026: 5% Rate, ₱100,000 Cap',
    description: 'PhilHealth 2026: 5% premium, ₱500 minimum, ₱5,000 maximum, split equally between employer and employee.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines#article",
      "headline": "PhilHealth Contribution Table 2026: Rate, Floor, Ceiling and Employer Share",
      "description": "PhilHealth contribution table 2026: the premium is 5% of the monthly basic salary, shared equally between employer and employee, with a ₱10,000 floor and a ₱100,000 ceiling. Table by salary, the computation, what counts as basic salary, and employer remittance dates.",
      "image": "https://yahshuahris.com/preview-image.png",
      "datePublished": blogIso(BLOG_DATES['philhealth-contribution-table-2026-philippines'].published),
      "dateModified": blogIso(BLOG_DATES['philhealth-contribution-table-2026-philippines'].modified),
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
        "@id": "https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines"
      },
      "keywords": "PhilHealth contribution table 2026, PhilHealth contribution 2026, PhilHealth premium rate 2026, PhilHealth ceiling 100000, PhilHealth employer share, PhilHealth remittance deadline, RA 11223"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines#faq",
      "mainEntity": philhealthFaqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "PhilHealth Contribution Table 2026", "item": "https://yahshuahris.com/blog/philhealth-contribution-table-2026-philippines" }
      ]
    }
  ]
};

const PhilhealthContributionTable2026Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'PhilHealth Contribution Table 2026', content_category: 'blog' }} />
      <PhilhealthContributionTable2026Article />
    </>
  );
};

export default PhilhealthContributionTable2026Page;
