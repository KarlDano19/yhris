import { Metadata } from 'next';
import PayrollErrorsArticle, { payrollErrorsFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PayrollErrorsArticle";
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'What Payroll Errors Actually Cost Philippine MSMEs',
  description: "Philippine MSMEs on outdated SSS, PhilHealth, and BIR rates face 25% surcharges, 12% annual interest, and up to ₱50,000 in penalties. Here's the real cost.",
  keywords: 'payroll errors Philippines 2026, SSS contribution rate 2026, PhilHealth premium 2026, BIR withholding tax penalties Philippines, MSME payroll compliance Philippines',
  openGraph: {
    images: OG_IMAGES,
    title: 'What Philippine Payroll Errors Actually Cost MSMEs',
    description: 'SSS is now at 15%, PhilHealth at 5%, and BIR penalties run 25% surcharge plus 12% annual interest. If your payroll system was not updated, errors have been accumulating since January.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['philippine-payroll-errors-msme'].published),
    modifiedTime: blogIso(BLOG_DATES['philippine-payroll-errors-msme'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: TWITTER_IMAGES,
    card: 'summary_large_image',
    title: 'What Philippine Payroll Errors Actually Cost MSMEs',
    description: 'SSS at 15%, PhilHealth at 5%, BIR penalties at 25% surcharge and 12% interest. Here is what running payroll on outdated rates actually costs.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philippine-payroll-errors-msme',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/philippine-payroll-errors-msme#article",
      "headline": "What Philippine Payroll Errors Actually Cost MSMEs",
      "description": "Philippine MSMEs running payroll on outdated SSS, PhilHealth, and BIR rates face surcharges of 25%, 12% annual interest, and up to 50,000 pesos in compromise penalties. Here is what the cost actually looks like.",
      "image": "https://yahshuahris.com/blog/payroll-errors-msme.png",
      "datePublished": blogIso(BLOG_DATES['philippine-payroll-errors-msme'].published),
      "dateModified": blogIso(BLOG_DATES['philippine-payroll-errors-msme'].modified),
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
        "@id": "https://yahshuahris.com/blog/philippine-payroll-errors-msme"
      },
      "keywords": "payroll errors Philippines 2026, SSS contribution rate 2026, PhilHealth premium 2026, BIR withholding tax penalties Philippines, MSME payroll compliance Philippines"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/philippine-payroll-errors-msme#faq",
      "mainEntity": payrollErrorsFaqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/philippine-payroll-errors-msme#breadcrumb",
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
          "name": "What Philippine Payroll Errors Actually Cost MSMEs",
          "item": "https://yahshuahris.com/blog/philippine-payroll-errors-msme"
        }
      ]
    }
  ]
};

const PayrollErrorsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PayrollErrorsArticle />
    </>
  );
};

export default PayrollErrorsPage;
