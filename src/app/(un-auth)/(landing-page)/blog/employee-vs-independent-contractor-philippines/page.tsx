import { Metadata } from 'next';
import EmployeeVsContractorArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/EmployeeVsContractorArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Employee vs Independent Contractor Philippines: DOLE Rules',
  description: 'The contract label does not decide it. How courts and DOLE tell an employee from an independent contractor, the DO 174-17 rules, and what a wrong call costs.',
  keywords: 'employee vs independent contractor Philippines, employee classification DOLE, four-fold test, labor-only contracting, DO 174-17, independent contractor misclassification, Ditiangkin v Lazada',
  openGraph: {
    title: 'Employee vs. Independent Contractor: The Payroll Risk of Getting It Wrong',
    description: 'Courts look at control, not the contract label. How the four-fold test and DOLE Department Order 174-17 decide classification, and what it costs on payroll.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-27T00:00:00.000Z',
    modifiedTime: '2026-10-27T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee vs Independent Contractor Philippines: DOLE Rules',
    description: 'How Philippine courts and DOLE classify workers, and the payroll risk of misclassification.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines',
  },
};

// Keep these in sync with the visible FAQ in EmployeeVsContractorArticle.tsx
const faqs = [
  {
    q: "How do you tell an employee from an independent contractor in the Philippines?",
    a: "Courts apply the four-fold test: who selected and engaged the worker, who pays the wages, who can dismiss, and who has the right to control how the work is done. Control is the most important factor. They also consider economic dependence, meaning whether the worker relies on the company for continued work in that line of business.",
  },
  {
    q: "Does a signed independent contractor agreement make someone a contractor?",
    a: "No. The label does not decide the relationship. In Ditiangkin v. Lazada E-Services Philippines (G.R. No. 246892, September 21, 2022), riders who signed independent contractor agreements were held to be regular employees, and the Court held that the company bears the burden of proving that a worker is an independent contractor.",
  },
  {
    q: "What is labor-only contracting?",
    a: "It is a prohibited arrangement under DOLE Department Order No. 174-17. It exists when the contractor has no substantial capital or investment in tools, equipment, and premises and its workers do work directly related to the principal's main business, or when the contractor does not exercise the right of control over its workers. The principal is then responsible to the workers as if it employed them directly.",
  },
  {
    q: "How much capital must a legitimate contractor have under DO 174-17?",
    a: "As issued in 2017, DO 174-17 requires at least ₱5,000,000 in paid-up capital for a corporation, partnership, or cooperative, or in net worth for a sole proprietorship. The contractor must also be registered with the DOLE regional office, with a ₱100,000 registration fee and a certificate valid for two years. DOLE can amend these figures, so confirm the current requirements with DOLE and check your contractor's registration yourself.",
  },
  {
    q: "What happens if a contractor is reclassified as an employee?",
    a: "The company becomes liable for what an employee is owed, including minimum wage, 13th month pay, and SSS, PhilHealth, and Pag-IBIG contributions, and ending the relationship becomes a dismissal that needs a valid cause. If the dismissal is illegal, the remedy is reinstatement with full backwages, or separation pay in addition to backwages if reinstatement is no longer feasible.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines#article",
      "headline": "Employee vs. Independent Contractor: How DOLE Classification Rules Affect Your Payroll Risk",
      "description": "In the Philippines, a worker is an employee or an independent contractor based on how the work is actually done, not the contract label. The four-fold test, economic dependence, DOLE Department Order 174-17 on labor-only contracting, and what misclassification costs on payroll.",
      "image": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines.png",
      "datePublished": "2026-10-27T00:00:00.000Z",
      "dateModified": "2026-10-27T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines"
      },
      "keywords": "employee vs independent contractor Philippines, employee classification DOLE, four-fold test, DO 174-17"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines#faq",
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
      "@id": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines#breadcrumb",
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
          "name": "Employee vs. Independent Contractor",
          "item": "https://yahshuahris.com/blog/employee-vs-independent-contractor-philippines"
        }
      ]
    }
  ]
};

const EmployeeVsContractorPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Employee vs Independent Contractor', content_category: 'blog' }} />
      <EmployeeVsContractorArticle />
    </>
  );
};

export default EmployeeVsContractorPage;
