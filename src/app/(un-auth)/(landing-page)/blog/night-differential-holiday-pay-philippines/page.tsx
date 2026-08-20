import { Metadata } from 'next';
import NightDifferentialHolidayStackingArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/NightDifferentialHolidayStackingArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Night Differential and Holiday Pay Stacking Philippines | YAHSHUA HRIS',
  description: 'How night differential stacks with regular holiday, special non-working day, rest day, and overtime pay in the Philippines. Full rate tables and a worked example.',
  keywords: 'night differential holiday pay Philippines, night shift holiday pay computation, double holiday pay Philippines, night differential rest day overlap, Article 86 Labor Code night differential',
  openGraph: {
    title: 'Night Differential and Holiday Pay: How the Rates Actually Stack',
    description: 'The exact stacking math for night differential, holiday pay, rest day premiums, and overtime under the Philippine Labor Code, including double holiday scenarios.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-08-20T00:00:00.000Z',
    modifiedTime: '2026-08-20T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Night Differential and Holiday Pay: How the Rates Actually Stack',
    description: 'Full stacking tables for night differential, holiday, rest day, and overtime pay under Philippine labor law.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/night-differential-holiday-pay-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/night-differential-holiday-pay-philippines#article",
      "headline": "Night Differential and Holiday Pay: How the Rates Actually Stack",
      "description": "How night differential stacks with regular holiday, special non-working day, rest day, and overtime pay in the Philippines. Full rate tables and a worked example.",
      "image": "https://yahshuahris.com/blog/night-differential-holiday-stacking.png",
      "datePublished": "2026-08-20T00:00:00.000Z",
      "dateModified": "2026-08-20T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/night-differential-holiday-pay-philippines"
      },
      "keywords": "night differential Philippines, holiday pay stacking, double holiday pay, Article 86 Labor Code, payroll Philippines"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/night-differential-holiday-pay-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is night differential added to holiday pay or computed separately?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Night differential is added on top of the applicable holiday rate, not computed separately on the base wage. If an hour falls under a 200% regular holiday rate, the 10% night differential applies to that 200% rate, producing an effective 220%, not 210%."
          }
        },
        {
          "@type": "Question",
          "name": "What is the effective rate for working a night shift on a regular holiday that is also a rest day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "286% of the basic hourly rate: the 260% regular holiday-plus-rest-day rate, with a 10% night differential applied on top of that stacked figure."
          }
        },
        {
          "@type": "Question",
          "name": "What happens when two regular holidays fall on the same date?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This is a double regular holiday. An employee who works receives 300% of their daily rate for the first eight hours, rising to 390% if it also falls on their rest day, and higher still with night shift or overtime premiums layered on top."
          }
        },
        {
          "@type": "Question",
          "name": "Is the night differential rate the same for government employees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Private-sector employees receive a minimum 10% night differential for hours worked between 10:00 PM and 6:00 AM under Article 86 of the Labor Code. Government and public sector employees follow separate civil service rules, typically a 20% differential for hours between 6:00 PM and 6:00 AM."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/night-differential-holiday-pay-philippines#breadcrumb",
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
          "name": "Night Differential and Holiday Pay Stacking",
          "item": "https://yahshuahris.com/blog/night-differential-holiday-pay-philippines"
        }
      ]
    }
  ]
};

const NightDifferentialHolidayStackingPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Night Differential Holiday Stacking', content_category: 'blog' }} />
      <NightDifferentialHolidayStackingArticle />
    </>
  );
};

export default NightDifferentialHolidayStackingPage;
