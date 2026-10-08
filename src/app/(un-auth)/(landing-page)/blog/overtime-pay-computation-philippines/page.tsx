import { Metadata } from 'next';
import OvertimePayComputationArticle, { overtimeFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/OvertimePayComputationArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/overtime-pay-computation-philippines';

export const metadata: Metadata = {
  title: 'Overtime Pay Computation Philippines 2026: Rates & Formula',
  description: 'How to compute overtime pay in the Philippines: 125%, 169%, 260%, and 338% rates, the formula, peso amounts at the ₱755 NCR minimum, and who is covered.',
  keywords: 'overtime pay computation Philippines, how to compute overtime pay, overtime rate Philippines 2026, 755 overtime pay, rest day overtime 169%, holiday overtime 260%, Labor Code Article 87, DOLE overtime rules',
  openGraph: {
    title: 'Overtime Pay Computation Philippines 2026: Rates & Formula',
    description: 'Every overtime rate from ordinary days to double holidays, the formula for daily-paid and monthly-paid employees, and peso amounts at the new NCR minimum wage.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-08T00:00:00.000Z',
    modifiedTime: '2026-10-08T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overtime Pay Computation Philippines 2026: Rates & Formula',
    description: 'Overtime rates, the formula, and peso amounts at the ₱755 NCR minimum wage.',
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
      "headline": "Overtime Pay Computation in the Philippines (2026): Rates, Formula, and ₱755 Examples",
      "description": "Overtime pay in the Philippines is the hourly rate (daily rate divided by 8) multiplied by the overtime rate for the day: 125% on ordinary days, 169% on rest days and special days, 260% on regular holidays, and 338% on a regular holiday falling on a rest day. Peso amounts at the ₱755 NCR minimum, worked examples, monthly-paid conversion, coverage under Labor Code Article 82, and tax treatment.",
      "datePublished": "2026-10-08T00:00:00.000Z",
      "dateModified": "2026-10-08T00:00:00.000Z",
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
      "keywords": "overtime pay computation, Labor Code Article 87, overtime rate 125%, rest day overtime 169%, holiday overtime 260%, NCR minimum wage 755"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": overtimeFaqs.map((f) => ({
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
        { "@type": "ListItem", "position": 3, "name": "Overtime Pay Computation", "item": URL }
      ]
    }
  ]
};

const OvertimePayComputationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Overtime Pay Computation', content_category: 'blog' }} />
      <OvertimePayComputationArticle />
    </>
  );
};

export default OvertimePayComputationPage;
