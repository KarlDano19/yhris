import { Metadata } from 'next';
import HrisPricingPhilippinesArticle, { hrisPricingFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/HrisPricingPhilippinesArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/hris-pricing-philippines-2026';

export const metadata: Metadata = {
  title: 'HRIS Pricing Philippines 2026: What 100 Employees Cost',
  description: 'Published HRIS and payroll prices in the Philippines for 2026, monthly and year-one cost at 50 to 300 employees, hidden fees, and how to choose.',
  keywords: 'HRIS pricing Philippines 2026, how much does HRIS cost Philippines, payroll software cost Philippines, HRIS price per employee, GreatDay HR pricing, Sprout Solutions pricing, HRIS for 100 employees, best HRIS Philippines',
  openGraph: {
    title: 'HRIS Pricing Philippines 2026: What 100 Employees Cost',
    description: 'Published prices for the main Philippine HR and payroll tools, the cost at 50 to 300 employees, the fees outside the subscription, and how to choose.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-15T00:00:00.000Z',
    modifiedTime: '2026-10-15T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HRIS Pricing Philippines 2026: What 100 Employees Cost',
    description: 'What HR and payroll software costs in the Philippines, with published prices and the real cost at 50 to 300 employees.',
  },
  alternates: {
    canonical: URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${URL}#article`,
      "headline": "HRIS Pricing in the Philippines 2026: What a 100-Employee Company Actually Pays",
      "description": "In 2026 a 100-employee Philippine company pays roughly 5,400 to 40,000 pesos a month for HR and payroll software, depending on scope. Published prices from Timekeep, YAHSHUA HRIS, GreatDay HR, WORKSPHR, and PayrollHero, the monthly and year-one cost at 50 to 300 employees, fees outside the subscription, and how to choose. Sprout Solutions publishes no price.",
      "image": "https://yahshuahris.com/blog/hris-pricing-philippines-2026.png",
      "datePublished": "2026-10-15T00:00:00.000Z",
      "dateModified": "2026-10-15T00:00:00.000Z",
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
        "@id": URL
      },
      "keywords": "HRIS pricing Philippines, payroll software cost, HRIS price per employee, HRIS for 100 employees"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": hrisPricingFaqs.map((f) => ({
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
      "@id": `${URL}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "HRIS Pricing Philippines 2026", "item": URL }
      ]
    }
  ]
};

const HrisPricingPhilippinesPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'HRIS Pricing Philippines 2026', content_category: 'blog' }} />
      <HrisPricingPhilippinesArticle />
    </>
  );
};

export default HrisPricingPhilippinesPage;
