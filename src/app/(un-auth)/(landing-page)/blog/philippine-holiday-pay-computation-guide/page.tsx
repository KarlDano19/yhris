import { Metadata } from 'next';
import HolidayPayComputationArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/HolidayPayComputationArticle";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { holidayPayFaqs } from '@/lib/blogFaqs';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

export const metadata: Metadata = {
  title: 'Philippine Holiday Pay Computation Guide | YAHSHUA HRIS',
  description: 'Correct holiday pay rates for regular and special non-working holidays in the Philippines, with a computation table and common employer mistakes.',
  keywords: 'holiday pay computation Philippines, regular holiday pay Philippines, special non-working holiday pay, DOLE holiday pay rules, how to compute holiday pay Philippines',
  openGraph: {
    images: blogCoverImages('philippine-holiday-pay-computation-guide'),
    title: 'Philippine Holiday Pay Computation: A Complete Employer Guide',
    description: 'Pay rates for regular and special holidays, rest day premiums, common computation mistakes, and what DOLE expects from employers on every payroll cycle.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['philippine-holiday-pay-computation-guide'].published),
    modifiedTime: blogIso(BLOG_DATES['philippine-holiday-pay-computation-guide'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('philippine-holiday-pay-computation-guide'),
    card: 'summary_large_image',
    title: 'Philippine Holiday Pay Computation: Complete Employer Guide',
    description: 'Correct pay rates for all holiday scenarios, common mistakes, and DOLE compliance requirements.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide#article",
      "headline": "Philippine Holiday Pay Computation: A Complete Employer Guide",
      "description": "Correct holiday pay rates for regular and special non-working holidays in the Philippines. Includes computation table, common employer mistakes, and DOLE compliance requirements.",
      "image": blogCoverUrl('philippine-holiday-pay-computation-guide'),
      "datePublished": blogIso(BLOG_DATES['philippine-holiday-pay-computation-guide'].published),
      "dateModified": blogIso(BLOG_DATES['philippine-holiday-pay-computation-guide'].modified),
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
        "@id": "https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide"
      },
      "keywords": "holiday pay Philippines, regular holiday, special non-working holiday, DOLE compliance, payroll Philippines"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide#faq",
      "mainEntity": holidayPayFaqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide#breadcrumb",
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
          "name": "Philippine Holiday Pay Computation Guide",
          "item": "https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide"
        }
      ]
    }
  ]
};

const HolidayPayComputationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Holiday Pay Computation Guide', content_category: 'blog' }} />
      <HolidayPayComputationArticle />
    </>
  );
};

export default HolidayPayComputationPage;
