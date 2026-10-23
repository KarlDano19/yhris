import { Metadata } from 'next';
import ProbationaryToRegularArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/ProbationaryToRegularArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Probationary Employee Regularization Philippines: 180 Days',
  description: 'Probation lasts up to six months, safest counted as 180 days. How to count it, what to tell new hires, what they are owed, and when they become regular.',
  keywords: 'probationary employee regularization Philippines, probationary employment 6 months, 180 days probationary, Article 296 Labor Code, regularization standards, probationary to regular',
  openGraph: {
    title: 'Probationary to Regular: The 6-Month Rule Employers Get Wrong',
    description: 'Keep a probationary employee past day 180 and they are regular by law. How to count the days, what to tell new hires, and what they are owed from day one.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-23T00:00:00.000Z',
    modifiedTime: '2026-10-23T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Probationary Employee Regularization Philippines: 180 Days',
    description: 'How to count the six-month probationary period, what you must tell new hires, and when they become regular.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/probationary-to-regular-employee-philippines',
  },
};

const faqs = [
  {
    q: "How long can probationary employment last in the Philippines?",
    a: "Up to six months from the day the employee started working, which is safest to count as 180 calendar days. The only general exception is an apprenticeship agreement that sets a longer period.",
  },
  {
    q: "What happens if a probationary employee keeps working after six months?",
    a: "They become a regular employee by operation of law under Article 296 of the Labor Code. No evaluation, signature, or regularization letter is required for this to happen.",
  },
  {
    q: "Can an employer extend the probationary period?",
    a: "Generally no. Courts have accepted longer periods only in narrow cases, such as apprenticeship, special laws for teaching personnel, or a documented extension the employee agreed to. The employer must prove the exception applies, so an extension should be written, signed, for a fixed period, and made before day 180.",
  },
  {
    q: "Are probationary employees entitled to 13th month pay and government benefits?",
    a: "Yes. They are owed at least the minimum wage, are covered by SSS, PhilHealth, and Pag-IBIG from the start, and receive pro-rated 13th month pay once they have worked at least one month. Service incentive leave applies only after one year of service.",
  },
  {
    q: "What if the employer never told the employee the regularization standards?",
    a: "Under the Implementing Rules of the Labor Code, an employee who was not informed of the standards for regularization at the time of engagement is deemed a regular employee. Employers meet the requirement when they make reasonable efforts to tell the employee what is expected during the trial period, so put the standards in writing on or before day one.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines#article",
      "headline": "Probationary to Regular: Getting the 6-Month Regularization Timeline Right in Payroll",
      "description": "Probationary employment in the Philippines cannot exceed six months from the day the employee started working, safest counted as 180 calendar days. How to count the days, what employers must tell new hires, what probationary employees are owed, and when they become regular.",
      "image": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines.png",
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
        "@id": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines"
      },
      "keywords": "probationary employee regularization Philippines, probationary employment, Article 296 Labor Code, 180 days"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines#faq",
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
      "@id": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines#breadcrumb",
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
          "name": "Probationary to Regular Employee",
          "item": "https://yahshuahris.com/blog/probationary-to-regular-employee-philippines"
        }
      ]
    }
  ]
};

const ProbationaryToRegularPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Probationary to Regular Employee', content_category: 'blog' }} />
      <ProbationaryToRegularArticle />
    </>
  );
};

export default ProbationaryToRegularPage;
