import { Metadata } from 'next';
import FinalPayComputationArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/FinalPayComputationArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Final Pay Computation for Resigned Employees (DOLE)',
  description: 'DOLE requires final pay within 30 days of resignation. What counts as final pay, what does not, a worked example, and the clearance and COE rules that apply.',
  keywords: 'final pay computation Philippines, DOLE final pay 30 days, final pay resigned employee, DOLE Labor Advisory 06-20, back pay computation Philippines, certificate of employment 3 days',
  openGraph: {
    title: 'Final Pay Computation for Resigned Employees: What DOLE Actually Requires',
    description: 'Final pay is due within 30 days of separation under DOLE Labor Advisory No. 06-20, a different clock than the employee\'s 30-day resignation notice. What must be included, a worked example, and the clearance rules.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-09-16T00:00:00.000Z',
    modifiedTime: '2026-09-16T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Final Pay Computation for Resigned Employees (DOLE)',
    description: 'What DOLE Labor Advisory No. 06-20 actually requires for final pay: the 30-day deadline, what counts, and a worked example.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/final-pay-computation-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/final-pay-computation-philippines#article",
      "headline": "Final Pay Computation for Resigned Employees: What DOLE's Labor Advisory Actually Requires",
      "description": "DOLE Labor Advisory No. 06, Series of 2020 requires final pay within 30 days of separation. What counts as final pay for a resigned employee, what does not (separation pay), a worked computation example, and the clearance and Certificate of Employment rules.",
      "datePublished": "2026-09-16T00:00:00.000Z",
      "dateModified": "2026-09-16T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/final-pay-computation-philippines"
      },
      "keywords": "final pay computation Philippines, DOLE final pay 30 days, DOLE Labor Advisory 06-20, back pay computation Philippines"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/final-pay-computation-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How many days does an employer have to release final pay after resignation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "30 calendar days from the date of separation, under DOLE Labor Advisory No. 06, Series of 2020, unless a more favorable company policy, individual agreement, or CBA provides a shorter period."
          }
        },
        {
          "@type": "Question",
          "name": "Is separation pay included in final pay for a resigned employee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generally, no. Separation pay under the Labor Code applies to authorized-cause terminations such as retrenchment, redundancy, closure, or disease, not to an employee who resigns voluntarily, unless a company policy, employment contract, or CBA specifically extends it to resignations."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if an employer misses the 30-day deadline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The employee can file a complaint with the DOLE Regional, Provincial, or Field Office with jurisdiction over the workplace. Case law generally treats a late release beyond 30 days, without a documented, reasonable justification, as grounds for a money claim."
          }
        },
        {
          "@type": "Question",
          "name": "Can an employer withhold final pay until company property is returned?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The Supreme Court in Milan v. NLRC upheld an employer's right to require clearance, including the return of company property, before releasing final pay. The clearance process still needs to be reasonable and documented, not used to delay payment indefinitely."
          }
        },
        {
          "@type": "Question",
          "name": "How is pro-rated 13th month pay calculated for a resigned employee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Total basic salary actually earned from January 1 (or the employee's start date, if later) through the last day worked, divided by 12. It is based only on basic salary and excludes allowances or overtime unless company policy includes them."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/final-pay-computation-philippines#breadcrumb",
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
          "name": "Final Pay Computation for Resigned Employees",
          "item": "https://yahshuahris.com/blog/final-pay-computation-philippines"
        }
      ]
    }
  ]
};

const FinalPayComputationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Final Pay Computation', content_category: 'blog' }} />
      <FinalPayComputationArticle />
    </>
  );
};

export default FinalPayComputationPage;
