import { Metadata } from 'next';
import MinimumWageByRegionArticle, { minimumWageByRegionFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/MinimumWageByRegionArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/minimum-wage-philippines-2026-by-region';

export const metadata: Metadata = {
  title: 'Minimum Wage Philippines 2026 by Region: All Current Rates',
  description: 'Daily minimum wage in every Philippine region as of Sept 2026, from ₱401 (BARMM) to ₱755 (NCR). Wage orders, effective dates, tiers, and upcoming changes.',
  keywords: 'minimum wage Philippines 2026, minimum wage by region Philippines, regional minimum wage 2026, minimum wage Cebu 2026, minimum wage Davao 2026, minimum wage Cagayan de Oro 2026, minimum wage CALABARZON 2026, new rate for minimum wage 2026',
  openGraph: {
    title: 'Minimum Wage Philippines 2026 by Region: All Current Rates',
    description: 'Every region\'s current daily minimum wage, the wage order behind it, when it took effect, and the changes already scheduled. Built for multi-branch employers.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-09-25T00:00:00.000Z',
    modifiedTime: '2026-09-25T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minimum Wage Philippines 2026 by Region: All Current Rates',
    description: 'Daily minimum wage in every Philippine region as of September 2026, from ₱401 in BARMM to ₱755 in NCR.',
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
      "headline": "Minimum Wage in the Philippines 2026 by Region: A Multi-Branch Employer's Guide",
      "description": "The current daily minimum wage in every Philippine region as of September 26, 2026, ranging from ₱401 in BARMM provinces to ₱755 in Metro Manila, with the wage order, effective date, area and size tiers, and scheduled changes for each region.",
      "image": "https://yahshuahris.com/blog/minimum-wage-by-region-2026.png",
      "datePublished": "2026-09-25T00:00:00.000Z",
      "dateModified": "2026-09-25T00:00:00.000Z",
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
      "keywords": "minimum wage Philippines 2026, minimum wage by region, regional wage orders 2026, RTWPB wage order, NWPC minimum wage rates"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": minimumWageByRegionFaqs.map((f) => ({
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
        { "@type": "ListItem", "position": 3, "name": "Minimum Wage Philippines 2026 by Region", "item": URL }
      ]
    }
  ]
};

const MinimumWageByRegionPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Minimum Wage by Region 2026', content_category: 'blog' }} />
      <MinimumWageByRegionArticle />
    </>
  );
};

export default MinimumWageByRegionPage;
