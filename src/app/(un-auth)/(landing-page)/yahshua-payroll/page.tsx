import { Metadata } from 'next';
import YahshuaPayrollContent from "@/components/pages/(un-auth)/(landing-page)/yahshua-payroll/Content";
import PixelEvents from '@/components/PixelEvents';
import { YAHSHUA_PRICING, PRICING_LABELS } from '@/lib/yahshuaPricing';

export const metadata: Metadata = {
  title: 'YAHSHUA Payroll Integration: Sync Your HR Data',
  description: 'Connect YAHSHUA HRIS with YAHSHUA Payroll for seamless employee data sync. Eliminate double entry, automate payroll computation, and stay DOLE compliant.',
  keywords: 'yahshua payroll, payroll integration philippines, hris payroll sync, payroll automation philippines',
  openGraph: {
    title: 'YAHSHUA Payroll Integration',
    description: 'Sync YAHSHUA HRIS with YAHSHUA Payroll. Eliminate double entry and automate payroll computation for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA Payroll Integration',
    description: 'Seamless HR and payroll sync for Philippine businesses.',
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
      "description": "All-in-one HR management system for Philippine businesses with real-time, two-way sync to YAHSHUA Payroll. Eliminates double entry, automates payroll computation, and keeps DOLE compliance current.",
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
        "description": `${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees, plus a one-time ${PRICING_LABELS.setup} setup fee. No per-seat fees, no long-term contracts.`,
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
