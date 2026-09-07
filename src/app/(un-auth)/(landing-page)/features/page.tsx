import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/features/LpFeaturesContent";
import PixelEvents from '@/components/PixelEvents';
import { YAHSHUA_PRICING, PRICING_LABELS } from '@/lib/yahshuaPricing';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Features: Payroll, 201 Files & DOLE Compliance',
  description: 'See everything YAHSHUA HRIS can do: automated payroll, 201 file management, DOLE compliance, performance evaluations, and payroll integration.',
  keywords: 'yahshua hris features, employee management, job posting, DOLE compliance, performance evaluation, payroll integration, HR automation',
  openGraph: {
    title: 'YAHSHUA HRIS Features: Payroll, 201 Files & DOLE Compliance',
    description: 'See everything YAHSHUA HRIS can do: automated payroll, 201 file management, DOLE compliance reports, performance evaluations, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Features: Payroll, 201 Files & DOLE Compliance',
    description: 'Automated payroll, 201 file management, DOLE compliance reports, and more. Built for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/features'
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
      "description": `All-in-one HR management system for Philippine businesses. Includes DOLE compliance automation, 201 document management, multi-platform job posting, attendance and leave tracking, performance evaluation, and real-time payroll sync. Flat pricing starting at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees.`,
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
      },
      "featureList": [
        "DOLE compliance automation (no add-on required)",
        "Employee onboarding and 201 document management",
        "Multi-platform job posting and applicant tracking",
        "Attendance and leave management",
        "Overtime, undertime, and rest day tracking",
        "Performance evaluation with custom forms",
        "Real-time two-way sync with YAHSHUA Payroll",
        "Employee self-service portal",
        "Memos and Notice-to-Explain distribution"
      ]
    }
  ]
};

const FeaturesPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Features', content_category: 'features' }} />
      <Content />
    </>
  );
};

export default FeaturesPage;