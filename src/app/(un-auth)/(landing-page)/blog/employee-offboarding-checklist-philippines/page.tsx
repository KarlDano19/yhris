import { Metadata } from 'next';
import EmployeeOffboardingChecklistArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/EmployeeOffboardingChecklistArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Employee Offboarding Checklist Philippines: 30-Day Plan',
  description: 'A step-by-step offboarding checklist for Philippine employers: resignation notice, clearance, final pay within 30 days, COE in 3 days, and BIR Form 2316.',
  keywords: 'employee offboarding checklist Philippines, offboarding process Philippines, clearance checklist, final pay 30 days, certificate of employment 3 days, BIR Form 2316 resigned employee',
  openGraph: {
    title: 'Employee Offboarding Checklist: Resignation to Final Pay',
    description: 'Final pay within 30 days, COE within 3 days, 30 days written notice, and Form 2316 on the last payment. The checklist with each legal clock marked.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-11-04T00:00:00.000Z',
    modifiedTime: '2026-11-04T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee Offboarding Checklist Philippines: 30-Day Plan',
    description: 'The offboarding checklist for Philippine employers, with the legal deadlines marked.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/employee-offboarding-checklist-philippines',
  },
};

// Keep these in sync with the visible FAQ in EmployeeOffboardingChecklistArticle.tsx
const faqs = [
  {
    q: "How long does an employer have to release final pay in the Philippines?",
    a: "Within 30 days from the date of separation or termination, under DOLE Labor Advisory No. 06, Series of 2020, unless a more favorable company policy, individual agreement, or CBA applies. The 30 days start at separation, not at the resignation notice.",
  },
  {
    q: "How many days' notice must an employee give before resigning?",
    a: "At least one month (30 days) in advance, in writing, under Article 300 of the Labor Code. The employer may waive or shorten the period, and the employee may leave without notice for the just causes in Article 300(b), such as serious insult or inhuman and unbearable treatment by the employer. An employer who received no notice may hold the employee liable for damages.",
  },
  {
    q: "Can an employer withhold final pay until the employee completes clearance?",
    a: "Employers may require a reasonable clearance process. The Supreme Court recognized this right in Milan v. NLRC (G.R. No. 202961, February 4, 2015). Keep the process documented and finish it well within the 30-day final pay period, because DOLE's advisory sets 30 days from separation.",
  },
  {
    q: "When must an employer issue a Certificate of Employment?",
    a: "Within 3 days from the employee's request, under DOLE Labor Advisory No. 06, Series of 2020. The clock runs from the request, and the employee can ask before leaving.",
  },
  {
    q: "When must a resigning employee receive BIR Form 2316?",
    a: "On the day the last payment of compensation is made, if employment ends before the close of the calendar year, under Revenue Regulations No. 2-98 as amended by RR No. 11-2018. Employees still employed at year-end receive it by January 31 of the following year.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines#article",
      "headline": "Employee Offboarding Checklist for Philippine Employers: From Resignation to Final Pay",
      "description": "An offboarding checklist runs on three legal clocks: 30 days' written notice from a resigning employee, a Certificate of Employment within 3 days of request, and final pay within 30 days of separation. BIR Form 2316 is due on the day of the last payment of compensation.",
      "image": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines.png",
      "datePublished": "2026-11-04T00:00:00.000Z",
      "dateModified": "2026-11-04T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines"
      },
      "keywords": "employee offboarding checklist Philippines, final pay, certificate of employment, BIR Form 2316, clearance"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines#faq",
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
      "@id": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines#breadcrumb",
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
          "name": "Employee Offboarding Checklist",
          "item": "https://yahshuahris.com/blog/employee-offboarding-checklist-philippines"
        }
      ]
    }
  ]
};

const EmployeeOffboardingChecklistPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Employee Offboarding Checklist', content_category: 'blog' }} />
      <EmployeeOffboardingChecklistArticle />
    </>
  );
};

export default EmployeeOffboardingChecklistPage;
