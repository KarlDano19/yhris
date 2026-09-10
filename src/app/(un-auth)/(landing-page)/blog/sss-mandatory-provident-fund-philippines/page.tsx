import { Metadata } from 'next';
import SssMandatoryProvidentFundArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/SssMandatoryProvidentFundArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'SSS Mandatory Provident Fund (WISP) Explained',
  description: 'WISP automatically applies once MSC exceeds ₱20,000. How the 15% SSS contribution splits, how it is invested, and how it differs from WISP Plus.',
  keywords: 'SSS Mandatory Provident Fund, SSS WISP, Workers Investment and Savings Program, SSS MPF, WISP vs WISP Plus, SSS provident fund Philippines',
  openGraph: {
    title: 'Inside the SSS Mandatory Provident Fund (WISP)',
    description: 'Above a ₱20,000 Monthly Salary Credit, part of every SSS contribution goes to WISP instead of the regular program. Here is exactly how the split, investment, and payout work.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-09-10T00:00:00.000Z',
    modifiedTime: '2026-09-10T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inside the SSS Mandatory Provident Fund (WISP)',
    description: 'How the SSS WISP contribution split, investment, and payout actually work, and how it differs from WISP Plus.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines#article",
      "headline": "Inside the SSS Mandatory Provident Fund (WISP): What It Is and How It Changes Your Payroll Math",
      "description": "The SSS Mandatory Provident Fund (WISP) automatically applies once Monthly Salary Credit exceeds ₱20,000. How the contribution split, investment allocation, and payout rules work, and how WISP differs from the separate, voluntary WISP Plus program.",
      "image": "https://yahshuahris.com/blog/sss-mandatory-provident-fund.png",
      "datePublished": "2026-09-10T00:00:00.000Z",
      "dateModified": "2026-09-10T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines"
      },
      "keywords": "SSS Mandatory Provident Fund, SSS WISP, Workers Investment and Savings Program, SSS MPF, WISP vs WISP Plus"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the SSS Mandatory Provident Fund?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The SSS Mandatory Provident Fund is the common name for the Workers' Investment and Savings Program (WISP), a mandatory, individually-tracked savings fund under Republic Act 11199 for SSS members whose Monthly Salary Credit exceeds ₱20,000. SSS also markets it under the 'MySSS Pension Booster' brand."
          }
        },
        {
          "@type": "Question",
          "name": "At what salary does WISP apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WISP applies automatically once an employee's Monthly Salary Credit exceeds ₱20,000. Below that threshold, the full 15% SSS contribution goes to the regular program. Above it, contributions on the MSC portion up to the ₱35,000 ceiling go to WISP instead."
          }
        },
        {
          "@type": "Question",
          "name": "Is WISP the same as WISP Plus?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. WISP is mandatory, automatically applies above ₱20,000 MSC, and cannot be withdrawn before a final SSS claim (retirement, disability, or death). WISP Plus is a separate, voluntary program open to any SSS member regardless of salary, funded entirely by the member with no employer share, and allows partial or full withdrawal after a qualifying membership period."
          }
        },
        {
          "@type": "Question",
          "name": "Can an employee withdraw their WISP savings early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. WISP funds are released only when the member files a final claim under the regular SSS program, meaning retirement, total disability, or death. There is no early or partial withdrawal option for mandatory WISP, unlike the voluntary WISP Plus program."
          }
        },
        {
          "@type": "Question",
          "name": "Does WISP change how much an employee pays in SSS contributions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The total SSS deduction stays 15% of MSC either way. WISP changes how that contribution is allocated internally between the regular SSS program and the WISP fund once MSC exceeds ₱20,000, not the total amount deducted from the employee's pay."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines#breadcrumb",
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
          "name": "SSS Mandatory Provident Fund (WISP) Explained",
          "item": "https://yahshuahris.com/blog/sss-mandatory-provident-fund-philippines"
        }
      ]
    }
  ]
};

const SssMandatoryProvidentFundPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'SSS Mandatory Provident Fund', content_category: 'blog' }} />
      <SssMandatoryProvidentFundArticle />
    </>
  );
};

export default SssMandatoryProvidentFundPage;
