import { Metadata } from 'next';
import YahshuaPayrollContent from "@/components/pages/(un-auth)/(landing-page)/yahshua-payroll/Content";
import PixelEvents from '@/components/PixelEvents';
import { YAHSHUA_PRICING, PRICING_LABELS } from '@/lib/yahshuaPricing';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'YAHSHUA One Payroll: Included With YAHSHUA HRIS',
  description: 'YAHSHUA One Payroll computes BIR, SSS, PhilHealth, and Pag-IBIG contributions and connects to YAHSHUA HRIS through single sign-on. Included in every HRIS plan.',
  keywords: 'yahshua one payroll, yahshua payroll, payroll philippines, hris payroll single sign-on, payroll automation philippines',
  openGraph: {
    images: OG_IMAGES,
    title: 'YAHSHUA One Payroll: Included With YAHSHUA HRIS',
    description: 'YAHSHUA One Payroll computes BIR, SSS, PhilHealth, and Pag-IBIG contributions for Philippine businesses and is included in every YAHSHUA HRIS plan.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    images: TWITTER_IMAGES,
    card: 'summary_large_image',
    title: 'YAHSHUA One Payroll',
    description: 'Philippine payroll, included with YAHSHUA HRIS.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/yahshua-payroll'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://yahshuahris.com/#software",
      "name": "YAHSHUA HRIS",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Human Resource Management",
      "operatingSystem": "Web",
      "url": "https://yahshuahris.com",
      "description": "All-in-one HR management system for Philippine businesses with single sign-on and employee data sync with YAHSHUA One Payroll. Eliminates re-typing of employee records, automates payroll computation, and keeps DOLE compliance current.",
      "offers": {
        "@type": "Offer",
        "price": String(YAHSHUA_PRICING.basePrice),
        "priceCurrency": YAHSHUA_PRICING.currency,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": String(YAHSHUA_PRICING.basePrice),
          "priceCurrency": YAHSHUA_PRICING.currency,
          "unitText": "month"
        },
        "description": `${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees, plus ${PRICING_LABELS.excess} per additional employee per month. No setup fee. VAT excluded. YAHSHUA One Payroll included. No long-term contracts.`,
        "url": "https://yahshuahris.com/pricing"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const YahshuaPayrollPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'YAHSHUA Payroll', content_category: 'payroll' }} />
      <YahshuaPayrollContent />
    </>
  );
};

export default YahshuaPayrollPage;
