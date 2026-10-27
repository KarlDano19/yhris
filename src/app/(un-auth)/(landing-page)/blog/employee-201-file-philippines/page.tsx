import { Metadata } from 'next';
import Employee201FileArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/Employee201FileArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Employee 201 File Philippines: What to Keep and How Long',
  description: 'What belongs in an employee 201 file, how long DOLE and tax rules say to keep the records, and where the Data Privacy Act limits you. Includes an HR checklist.',
  keywords: 'employee 201 file Philippines, 201 file requirements, employee records retention Philippines, how long to keep employee records, DOLE record keeping, Data Privacy Act employee records',
  openGraph: {
    title: 'Employee 201 File: What to Keep, and for How Long',
    description: 'DOLE requires employment records to be kept at least three years from the last entry. What goes in a 201 file, the retention rules, and the privacy limits.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-27T00:00:00.000Z',
    modifiedTime: '2026-10-27T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee 201 File Philippines: What to Keep and How Long',
    description: 'What belongs in a 201 file and how long Philippine rules say to keep employee records.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/employee-201-file-philippines',
  },
};

// Keep these in sync with the visible FAQ in Employee201FileArticle.tsx
const faqs = [
  {
    q: "What is a 201 file?",
    a: "A 201 file is the folder of records an employer keeps for each employee, from the application and contract to evaluations and separation papers. It is standard HR practice rather than a form prescribed by law, but the records inside it, such as payrolls and time records, are covered by DOLE record-keeping rules.",
  },
  {
    q: "What documents go in an employee 201 file?",
    a: "Typically the application and resume, signed contract and job description, government ID numbers and registration forms, payroll, time, and leave records, performance evaluations and disciplinary records, and separation documents such as clearance, quitclaim, and final pay computation. Keep sensitive items like medical results in a restricted section.",
  },
  {
    q: "How long must employers keep employee records in the Philippines?",
    a: "DOLE rules require employment records to be preserved for at least three years from the date of the last entry. Books of accounts and other accounting records must be kept five years under the Tax Code as amended by the Ease of Paying Taxes Act. Because employees have three years to file money claims, many employers keep records that defend such claims at least that long.",
  },
  {
    q: "Should an employer keep a 201 file after the employee resigns?",
    a: "Yes, for the required period. Add the clearance, quitclaim, and final pay record, then keep the required records at least three years from the last entry. After the retention period ends and no claim or legal obligation needs them, delete the records or remove anything that identifies the person.",
  },
  {
    q: "Does the Data Privacy Act apply to 201 files?",
    a: "Yes. Employers are personal information controllers for employee data. Processing must follow transparency, legitimate purpose, and proportionality, personal data should not be kept longer than necessary, and employers must apply reasonable security measures such as limiting who can open a file.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/employee-201-file-philippines#article",
      "headline": "What Belongs in an Employee 201 File, and How Long You Are Required to Keep It",
      "description": "A 201 file is an employee's record folder. DOLE rules require employment records such as payrolls and time records to be kept at least three years from the last entry, and tax law requires books of accounts to be kept five years. What to put in a 201 file, the retention rules, and the Data Privacy Act limits.",
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
        "@id": "https://yahshuahris.com/blog/employee-201-file-philippines"
      },
      "keywords": "employee 201 file Philippines, employee records retention, DOLE record keeping, Data Privacy Act"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/employee-201-file-philippines#faq",
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
      "@id": "https://yahshuahris.com/blog/employee-201-file-philippines#breadcrumb",
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
          "name": "Employee 201 File",
          "item": "https://yahshuahris.com/blog/employee-201-file-philippines"
        }
      ]
    }
  ]
};

const Employee201FilePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Employee 201 File', content_category: 'blog' }} />
      <Employee201FileArticle />
    </>
  );
};

export default Employee201FilePage;
