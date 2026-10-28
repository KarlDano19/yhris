import type { Metadata } from 'next';
import HrCostCalculatorContent from '@/components/pages/(un-auth)/(landing-page)/hr-cost-calculator/HrCostCalculatorContent';

export const metadata: Metadata = {
  title: 'HR & Payroll Cost Calculator | YAHSHUA HRIS',
  description: 'Free calculator for Philippine businesses. Find out how much manual HR and payroll is costing you every year, and how much you could save.',
  openGraph: {
    title: 'HR & Payroll Cost Calculator: YAHSHUA HRIS',
    description: 'Calculate your annual HR and payroll waste in minutes. See your savings estimate and ROI timeline with YAHSHUA.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HR & Payroll Cost Calculator: YAHSHUA HRIS',
    description: 'Find out how much manual HR and payroll is costing your Philippine business every year.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/hr-cost-calculator',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://yahshuahris.com/hr-cost-calculator#webapp",
      "name": "HR & Payroll Cost Calculator",
      "url": "https://yahshuahris.com/hr-cost-calculator",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Free calculator for Philippine businesses to find out how much manual HR and payroll processes are costing them every year.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PHP"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

export default function HrCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HrCostCalculatorContent />
    </>
  );
}
