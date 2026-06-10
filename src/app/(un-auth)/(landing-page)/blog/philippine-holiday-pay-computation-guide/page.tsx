import { Metadata } from 'next';
import HolidayPayComputationArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/HolidayPayComputationArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Philippine Holiday Pay Computation: Complete Employer Guide | YAHSHUA HRIS',
  description: 'Correct holiday pay rates for regular and special non-working holidays in the Philippines. Includes computation table, common employer mistakes, and DOLE compliance requirements.',
  keywords: 'holiday pay computation Philippines, regular holiday pay Philippines, special non-working holiday pay, DOLE holiday pay rules, how to compute holiday pay Philippines',
  openGraph: {
    title: 'Philippine Holiday Pay Computation: A Complete Employer Guide',
    description: 'Pay rates for regular and special holidays, rest day premiums, common computation mistakes, and what DOLE expects from employers on every payroll cycle.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philippine Holiday Pay Computation: Complete Employer Guide',
    description: 'Correct pay rates for all holiday scenarios, common mistakes, and DOLE compliance requirements.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Philippine Holiday Pay Computation: A Complete Employer Guide',
  description: 'Correct holiday pay rates for regular and special non-working holidays in the Philippines. Includes computation table, common employer mistakes, and DOLE compliance requirements.',
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
  url: 'https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide',
  mainEntityOfPage: 'https://yahshuahris.com/blog/philippine-holiday-pay-computation-guide',
  keywords: 'holiday pay Philippines, regular holiday, special non-working holiday, DOLE compliance, payroll Philippines',
  articleSection: 'DOLE Compliance',
  inLanguage: 'en-PH',
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
