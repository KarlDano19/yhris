import { Metadata } from 'next';
import SssContributionTable2026Article from "@/components/pages/(un-auth)/(landing-page)/blog/articles/SssContributionTable2026Article";

export const metadata: Metadata = {
  title: 'SSS, PhilHealth, Pag-IBIG Contribution Table 2026: Rates',
  description: '2026 tables: SSS 15% (MSC up to ₱35,000), PhilHealth 5% (₱100,000 ceiling), Pag-IBIG ₱200 each, max ₱400. Employer and employee shares with examples.',
  keywords: 'SSS contribution table 2026, PhilHealth contribution rate 2026, Pag-IBIG contribution 2026, SSS mandatory provident fund, Philippine statutory contributions 2026',
  openGraph: {
    title: '2026 SSS, PhilHealth and Pag-IBIG Contribution Rates: Philippine Employer Guide',
    description: 'SSS is 15% of the monthly salary credit up to ₱35,000, PhilHealth is 5% with a ₱100,000 ceiling, and Pag-IBIG caps at ₱400 a month. Tables with employer and employee shares and computation examples.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-07-14T00:00:00.000Z',
    modifiedTime: '2026-10-09T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 Philippine Statutory Contribution Rates: SSS, PhilHealth, Pag-IBIG',
    description: 'SSS at 15%, ₱35,000 MSC ceiling. PhilHealth at 5%, ₱100,000 ceiling. Pag-IBIG caps at ₱400/month. Updated tables for Philippine employers.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/sss-contribution-table-2026-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/sss-contribution-table-2026-philippines#article",
      "headline": "2026 SSS, PhilHealth and Pag-IBIG Contribution Tables: Rates and Ceilings for Employers",
      "description": "SSS is 15% of the monthly salary credit up to ₱35,000, PhilHealth is 5% with a ₱100,000 ceiling, and Pag-IBIG caps at ₱400 per month. Contribution tables with employer and employee shares, computation examples, and an employer checklist.",
      "image": "https://yahshuahris.com/blog/sss-contribution-2026.png",
      "datePublished": "2026-07-14T00:00:00.000Z",
      "dateModified": "2026-10-09T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/sss-contribution-table-2026-philippines"
      },
      "keywords": "SSS contribution table 2026, PhilHealth contribution 2026, Pag-IBIG contribution 2026, Philippine statutory contributions, mandatory provident fund Philippines"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/sss-contribution-table-2026-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the SSS contribution rate in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The SSS contribution rate in 2026 is 15% of the Monthly Salary Credit (MSC). The employer pays 10% and the employee pays 5%. The employer also pays an Employees' Compensation (EC) premium of ₱10 for MSC at or below ₱14,500, or ₱30 for MSC above ₱14,500. SSS raised it from 14% (employer 9.5%, employee 4.5%) in January 2025, and it is unchanged in 2026."
          }
        },
        {
          "@type": "Question",
          "name": "What is the maximum SSS contribution in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The maximum SSS contribution in 2026 corresponds to the maximum Monthly Salary Credit of ₱35,000. At this level, the employer pays ₱3,530 (including the ₱30 EC premium) and the employee pays ₱1,750, for a combined monthly total of ₱5,280. Employees earning more than ₱35,000 do not pay more than this amount."
          }
        },
        {
          "@type": "Question",
          "name": "What is the SSS Mandatory Provident Fund (MPF) in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The SSS Mandatory Provident Fund (MPF), also known as WISP, applies to SSS members whose MSC exceeds ₱20,000. It is not an additional charge on top of the 15% rate. Instead, the 15% contribution is split: the regular SS fund covers the MSC up to ₱20,000, and the MPF covers the portion above ₱20,000 up to the ₱35,000 ceiling. The MPF earns dividends and is paid out on retirement or total disability."
          }
        },
        {
          "@type": "Question",
          "name": "What is the PhilHealth contribution rate in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The PhilHealth contribution rate in 2026 is 5% of the member's monthly basic salary, shared equally between employer and employee at 2.5% each. The salary floor is ₱10,000 (minimum premium: ₱500/month) and the ceiling is ₱100,000 (maximum premium: ₱5,000/month). This is the final scheduled rate under Republic Act 11223 (Universal Health Care Act)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Pag-IBIG contribution rate in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Pag-IBIG (HDMF) contribution rate in 2026 is 2% of monthly salary for the employer, and 1% (for salaries at or below ₱1,500) or 2% (for salaries above ₱1,500) for the employee. Contributions are capped at a Fund Salary of ₱10,000, meaning the maximum monthly deduction is ₱200 for the employee and ₱200 for the employer, totaling ₱400 per month."
          }
        },
        {
          "@type": "Question",
          "name": "What are the penalties for not remitting SSS, PhilHealth, or Pag-IBIG contributions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For SSS, employers who fail to remit contributions on time pay a penalty of 2% per month on the unpaid amount, from the due date until paid (RA 11199, Section 22(a)). Willful non-remittance can lead to criminal charges against responsible officers, with a fine of ₱5,000 to ₱20,000 and imprisonment of 6 years and 1 day to 12 years under RA 11199 (Social Security Act of 2018). For PhilHealth, late payment carries interest of at least 3% per month, compounded monthly. Pag-IBIG charges 1/10 of 1% per day of delay."
          }
        },
        {
          "@type": "Question",
          "name": "When are statutory contribution remittances due in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SSS contributions are due by the last day of the month following the contribution month for regular employers. PhilHealth premiums are due from the 11th to the 20th of the following month, by the last digit of the employer number. Pag-IBIG remittances follow a schedule based on the first letter of the employer's name, from the 10th to the end of the following month (HDMF Circular No. 275). Deadlines that fall on a weekend or holiday generally move to the next working day, so verify each agency's current calendar."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/sss-contribution-table-2026-philippines#breadcrumb",
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
          "name": "SSS, PhilHealth and Pag-IBIG Contribution Rates 2026",
          "item": "https://yahshuahris.com/blog/sss-contribution-table-2026-philippines"
        }
      ]
    }
  ]
};

const SssContributionTable2026Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SssContributionTable2026Article />
    </>
  );
};

export default SssContributionTable2026Page;
