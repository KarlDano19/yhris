import { Metadata } from 'next';
import ThirteenthMonthPayComputationArticle, { thirteenthMonthFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/ThirteenthMonthPayComputationArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/13th-month-pay-computation-philippines-2026';

export const metadata: Metadata = {
  title: '13th Month Pay Computation 2026: Formula and Calculator',
  description: 'How to compute 13th month pay in the Philippines for 2026: total basic salary ÷ 12, what counts, prorating, the ₱90,000 tax cap, and a free calculator.',
  keywords: '13th month pay computation 2026, how to compute 13th month pay, 13th month pay calculator, 13th month pay Philippines, 13th month pay formula, prorated 13th month pay, 13th month pay deadline, PD 851',
  openGraph: {
    title: '13th Month Pay Computation 2026: Formula and Calculator',
    description: 'The 13th month pay formula, what counts as basic salary, worked examples for new hires, resigned and daily-paid employees, the ₱90,000 tax cap, 2026 deadlines, and a free calculator.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-09-25T00:00:00.000Z',
    modifiedTime: '2026-09-25T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '13th Month Pay Computation 2026: Formula and Calculator',
    description: 'How to compute 13th month pay in the Philippines for 2026, with worked examples and a free calculator.',
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
      "headline": "13th Month Pay Computation 2026: The Formula, the Common Mistakes, and a Free Calculator",
      "description": "13th month pay in the Philippines is one-twelfth of the total basic salary earned from January 1 to December 31, due by December 24 under PD 851. The formula, what counts as basic salary, worked examples including mid-year wage increases, the ₱90,000 tax-exempt cap, 2026 deadlines, and a calculator.",
      "image": "https://yahshuahris.com/blog/start-tracking-13th-month.png",
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
      "keywords": "13th month pay computation 2026, 13th month pay calculator, PD 851, prorated 13th month pay, 13th month pay tax exemption"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": thirteenthMonthFaqs.map((f) => ({
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
        { "@type": "ListItem", "position": 3, "name": "13th Month Pay Computation 2026", "item": URL }
      ]
    }
  ]
};

const ThirteenthMonthPayComputationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: '13th Month Pay Computation 2026', content_category: 'blog' }} />
      <ThirteenthMonthPayComputationArticle />
    </>
  );
};

export default ThirteenthMonthPayComputationPage;
