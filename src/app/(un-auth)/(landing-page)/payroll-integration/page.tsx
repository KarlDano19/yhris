import { Metadata } from 'next';
import LpPayrollIntegrationContent from "@/components/pages/(un-auth)/(landing-page)/payroll-integration/LpPayrollIntegrationContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Payroll Integration: YAHSHUA HRIS and YAHSHUA One Payroll',
  description: 'YAHSHUA HRIS connects to YAHSHUA One Payroll through single sign-on, and employee data syncs into HRIS. No exports, no re-typing.',
  keywords: 'hris payroll integration philippines, hr payroll sync, yahshua one payroll, payroll automation',
  openGraph: {
    title: 'Payroll Integration: YAHSHUA HRIS and YAHSHUA One Payroll',
    description: 'Single sign-on between YAHSHUA HRIS and YAHSHUA One Payroll, with employee data synced into HRIS.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Payroll Integration',
    description: 'Single sign-on and employee sync between HRIS and Payroll. No exports, no re-typing.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/payroll-integration',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/payroll-integration#webpage",
      "name": "Payroll Integration: YAHSHUA HRIS and YAHSHUA One Payroll",
      "description": "YAHSHUA HRIS connects to YAHSHUA One Payroll through single sign-on, and employee data syncs into HRIS. No exports, no re-typing.",
      "url": "https://yahshuahris.com/payroll-integration",
      "about": {
        "@id": "https://yahshuahris.com/#software"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const PayrollIntegrationPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Payroll Integration', content_category: 'integration' }} />
      <LpPayrollIntegrationContent />
    </>
  );
};

export default PayrollIntegrationPage;
