import { Metadata } from 'next';
import NewHireOnboardingChecklistArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/NewHireOnboardingChecklistArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'New Hire Onboarding Checklist Philippines: Documents and IDs',
  description: 'New hire onboarding checklist for Philippine employers: SSS and PhilHealth in 30 days, TIN in 10 days, Pag-IBIG, documents to collect, and privacy limits.',
  keywords: 'new hire onboarding checklist Philippines, employee onboarding requirements Philippines, new employee SSS PhilHealth Pag-IBIG TIN, documents required for new hires, employer onboarding checklist',
  openGraph: {
    title: 'New Hire Onboarding Checklist: Government IDs and Documents',
    description: 'SSS and PhilHealth within 30 days, a TIN within 10 days, Pag-IBIG enrollment, and what to collect. The checklist with required steps marked.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-11-04T00:00:00.000Z',
    modifiedTime: '2026-11-04T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Hire Onboarding Checklist Philippines: Documents and IDs',
    description: 'The onboarding checklist for Philippine employers, with each government deadline marked.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines',
  },
};

// Keep these in sync with the visible FAQ in NewHireOnboardingChecklistArticle.tsx
const faqs = [
  {
    q: "What documents does an employer need from a new hire in the Philippines?",
    a: "At minimum, a valid government ID, the employee's TIN, SSS, PhilHealth, and Pag-IBIG numbers, and a signed employment contract. Mid-year hires should also give a certified copy of BIR Form 2316 from the previous employer. Other documents, such as an NBI clearance, diploma, or medical results, depend on the role and your policy, and should be limited to what you actually need.",
  },
  {
    q: "How soon must an employer report a new employee to SSS?",
    a: "Within 30 days from the hiring date. SSS directs employers to require new employees to register and present their SS numbers, then report them for coverage using the Employment Report (SS Form R-1A) through My.SSS.",
  },
  {
    q: "When must a new employee register for a TIN?",
    a: "An employee with no TIN registers with the BIR using Form 1902 within 10 days from the date of employment, and employers typically file it for the new hire. An employee who already has a TIN should not apply for a new one. Give the employer the existing number.",
  },
  {
    q: "How soon must an employer report a new hire to PhilHealth?",
    a: "Within 30 days from the employee's assumption of work, using the PhilHealth Report of Employee-Members (Form ER2).",
  },
  {
    q: "What should an employer collect from an employee hired in the middle of the year?",
    a: "A copy of the employee's BIR Form 2316 from the previous employer, duly certified by that employer. Under Revenue Regulations No. 11-2018, the employee furnishes it to the new employer when there are successive employments in the same taxable year.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines#article",
      "headline": "New Hire Onboarding Checklist for Philippine Employers: Government IDs and Documents",
      "description": "Onboarding a new hire means four government registrations: SSS and PhilHealth, each reported within 30 days of hiring, Pag-IBIG membership, and a BIR TIN within 10 days of employment if the employee has none. The checklist, the documents to collect, and the Data Privacy Act limits.",
      "image": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines.png",
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
        "@id": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines"
      },
      "keywords": "new hire onboarding checklist Philippines, SSS R-1A, PhilHealth ER2, BIR Form 1902, Pag-IBIG, employee documents"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines#faq",
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
      "@id": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines#breadcrumb",
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
          "name": "New Hire Onboarding Checklist",
          "item": "https://yahshuahris.com/blog/new-hire-onboarding-checklist-philippines"
        }
      ]
    }
  ]
};

const NewHireOnboardingChecklistPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'New Hire Onboarding Checklist', content_category: 'blog' }} />
      <NewHireOnboardingChecklistArticle />
    </>
  );
};

export default NewHireOnboardingChecklistPage;
