import { Metadata } from 'next';
import ThirteenthMonthPayArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/ThirteenthMonthPayArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'How to Track 13th Month Pay in the Philippines | YAHSHUA HRIS',
  description: 'Philippine employers must pay 13th month pay by December 24. Learn the correct computation formula, who qualifies, common mistakes, and how to track it automatically every payroll run.',
  keywords: '13th month pay Philippines, how to compute 13th month pay, 13th month pay tracking, PD 851 Philippines, 13th month pay MSME',
  openGraph: {
    title: 'Start Tracking 13th Month Pay Now — Or Pay For It in November',
    description: 'The correct computation formula, who qualifies, and how Philippine MSMEs can track 13th month liability automatically instead of scrambling in November.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Track 13th Month Pay in the Philippines',
    description: 'Computation formula, eligibility, common mistakes, and how to track it automatically every payroll run.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/thirteenth-month-pay-tracking-philippines',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Start Tracking 13th Month Pay Now — Or Pay For It in November',
  description: 'Philippine employers must pay 13th month pay by December 24. Learn the correct computation formula, who qualifies, common mistakes, and how to track it automatically every payroll run.',
  author: {
    '@type': 'Organization',
    name: 'YAHSHUA HRIS Team',
    url: 'https://yahshuahris.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'YAHSHUA HRIS',
    url: 'https://yahshuahris.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://yahshuahris.com/logo.png',
    },
  },
  datePublished: '2026-06-10',
  dateModified: '2026-06-10',
  url: 'https://yahshuahris.com/blog/thirteenth-month-pay-tracking-philippines',
  mainEntityOfPage: 'https://yahshuahris.com/blog/thirteenth-month-pay-tracking-philippines',
  keywords: '13th month pay Philippines, PD 851, payroll compliance, MSME Philippines',
  articleSection: 'Payroll Compliance',
  inLanguage: 'en-PH',
};

const ThirteenthMonthPayPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: '13th Month Pay Tracking Guide', content_category: 'blog' }} />
      <ThirteenthMonthPayArticle />
    </>
  );
};

export default ThirteenthMonthPayPage;
