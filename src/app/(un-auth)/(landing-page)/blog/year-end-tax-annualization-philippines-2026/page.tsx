import { Metadata } from 'next';
import YearEndAnnualizationArticle, { annualizationFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/YearEndAnnualizationArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/year-end-tax-annualization-philippines-2026';

export const metadata: Metadata = {
  title: 'Year-End Tax Annualization 2026: How to Compute It (PH)',
  description: 'How Philippine employers annualize withholding tax in December 2026: steps, tax table, worked examples, special cases, and BIR 2316 and 1604-C deadlines.',
  keywords: 'year-end tax annualization Philippines 2026, annualization withholding tax, how to compute annualized tax, BIR 2316 deadline 2027, 1604-C alphalist deadline, substituted filing, tax refund January 25, income tax table 2026 Philippines',
  openGraph: {
    title: 'Year-End Tax Annualization 2026: How to Compute It (PH)',
    description: 'A step-by-step guide to recomputing employees\' 2026 income tax in the December payroll, with worked examples and the January and February 2027 BIR filings.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-01T00:00:00.000Z',
    modifiedTime: '2026-10-01T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Year-End Tax Annualization 2026: How to Compute It (PH)',
    description: 'Steps, tax table, worked examples, and BIR 2316 and 1604-C deadlines for Philippine employers.',
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
      "headline": "Year-End Tax Annualization 2026: How to Compute It, Plus BIR Form 2316 and 1604-C Deadlines",
      "description": "Year-end tax annualization is the employer's recomputation of each employee's income tax for the full year in the last December payroll. Steps, the 2026 tax table, what is not taxable, worked examples, special cases (previous employers, resignations, minimum wage earners), and the 2316, 1604-C, and substituted filing deadlines.",
      "image": "https://yahshuahris.com/blog/year-end-tax-annualization-2026.png",
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
      "keywords": "year-end tax annualization 2026, withholding tax on compensation, BIR Form 2316, BIR Form 1604-C, substituted filing, RR 11-2018"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": annualizationFaqs.map((f) => ({
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
        { "@type": "ListItem", "position": 3, "name": "Year-End Tax Annualization 2026", "item": URL }
      ]
    }
  ]
};

const YearEndAnnualizationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Year-End Tax Annualization 2026', content_category: 'blog' }} />
      <YearEndAnnualizationArticle />
    </>
  );
};

export default YearEndAnnualizationPage;
