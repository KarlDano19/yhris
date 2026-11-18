import { Metadata } from 'next';
import OvertimePayComputationArticle, { overtimeFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/OvertimePayComputationArticle";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

const URL = 'https://yahshuahris.com/blog/overtime-pay-computation-philippines';

export const metadata: Metadata = {
  title: 'Overtime Pay Rate Philippines 2026: Formula + ₱755 Examples',
  description: 'Overtime pay rates of 125%, 169%, 260%, and 338%, the formula for daily-paid and monthly-paid employees, and peso examples at the ₱755 NCR minimum.',
  keywords: 'overtime pay computation Philippines, how to compute overtime pay, overtime rate Philippines 2026, 755 overtime pay, rest day overtime 169%, holiday overtime 260%, Labor Code Article 87, DOLE overtime rules',
  openGraph: {
    images: blogCoverImages('overtime-pay-computation-philippines'),
    title: 'Overtime Pay Rate Philippines 2026: Formula + ₱755 Examples',
    description: 'Every overtime rate from ordinary days to double holidays, the formula for daily-paid and monthly-paid employees, and peso amounts at the new NCR minimum wage.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['overtime-pay-computation-philippines'].published),
    modifiedTime: blogIso(BLOG_DATES['overtime-pay-computation-philippines'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('overtime-pay-computation-philippines'),
    card: 'summary_large_image',
    title: 'Overtime Pay Rate Philippines 2026: Formula + ₱755 Examples',
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
      "image": blogCoverUrl('overtime-pay-computation-philippines'),
      "datePublished": blogIso(BLOG_DATES['overtime-pay-computation-philippines'].published),
      "dateModified": blogIso(BLOG_DATES['overtime-pay-computation-philippines'].modified),
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
