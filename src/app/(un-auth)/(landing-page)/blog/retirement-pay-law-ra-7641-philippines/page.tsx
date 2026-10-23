import { Metadata } from 'next';
import RetirementPayArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/RetirementPayArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Retirement Pay Law RA 7641: 22.5 Days Per Year, Formula',
  description: 'RA 7641 retirement pay is 22.5 days of pay per year of service at 60+ with 5 years of service. Formula, peso examples, who is exempt, and what to set aside.',
  keywords: 'retirement pay Philippines, RA 7641, retirement pay computation, retirement pay formula 22.5 days, Article 302 Labor Code, optional retirement age 60, compulsory retirement 65',
  openGraph: {
    title: 'Retirement Pay Law (RA 7641): What Employers Must Set Aside',
    description: 'Retirement pay is 22.5 days per year of service, not 15. Who qualifies, the formula with peso examples, who is exempt, and how to plan for it.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-23T00:00:00.000Z',
    modifiedTime: '2026-10-23T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Pay Law RA 7641: 22.5 Days Per Year, Formula',
    description: 'How retirement pay is computed under RA 7641, who qualifies, and who is exempt.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines',
  },
};

const faqs = [
  {
    q: "How is retirement pay computed in the Philippines?",
    a: "Multiply the employee's latest daily rate by 22.5 days, then by the years of service, counting a fraction of at least six months as one full year. The 22.5 days are 15 days of salary, 5 days of service incentive leave, and 2.5 days for one-twelfth of the 13th month pay.",
  },
  {
    q: "At what age can an employee retire under RA 7641?",
    a: "Retirement is optional at 60 and compulsory at 65, with at least five years of service with the employer. Underground mine workers can retire optionally at 50 and must retire at 60, after at least five years as underground mine workers.",
  },
  {
    q: "Is an employee with less than five years of service entitled to retirement pay?",
    a: "Not under RA 7641, which requires at least five years of service with the employer. A company retirement plan, CBA, or established practice can still grant a benefit, and the employee remains entitled to final pay items such as unpaid salary and pro-rated 13th month pay.",
  },
  {
    q: "Do small businesses have to pay retirement pay?",
    a: "Only some are exempt. Retail, service, and agricultural establishments regularly employing not more than 10 workers are exempt. Other small businesses, such as a small manufacturer, are covered even with fewer than 10 employees.",
  },
  {
    q: "Is retirement pay taxable?",
    a: "It depends. Benefits received under a reasonable private plan are income tax exempt if the employee is at least 50, has served the same employer for at least 10 years, and has not availed of the exemption before. If those conditions are not met, the amount is taxable. Confirm the treatment with the BIR or a tax professional before paying out.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines#article",
      "headline": "Retirement Pay Law (RA 7641): What Every Philippine Employer Must Set Aside",
      "description": "Under RA 7641, retirement pay is at least 22.5 days of pay per year of service for private-sector employees who retire at 60 or older with five years of service. Who qualifies, the formula with peso examples, who is exempt, tax treatment, and how employers should plan for it.",
      "image": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines.png",
      "datePublished": "2026-10-23T00:00:00.000Z",
      "dateModified": "2026-10-23T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines"
      },
      "keywords": "retirement pay Philippines, RA 7641, retirement pay computation, Article 302 Labor Code"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines#faq",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines#breadcrumb",
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
          "name": "Retirement Pay Law (RA 7641)",
          "item": "https://yahshuahris.com/blog/retirement-pay-law-ra-7641-philippines"
        }
      ]
    }
  ]
};

const RetirementPayPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Retirement Pay Law RA 7641', content_category: 'blog' }} />
      <RetirementPayArticle />
    </>
  );
};

export default RetirementPayPage;
