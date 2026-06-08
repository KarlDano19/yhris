import { Metadata } from 'next';
import LpPayrollIntegrationContent from "@/components/pages/(un-auth)/(landing-page)/payroll-integration/LpPayrollIntegrationContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Payroll Integration — YAHSHUA HRIS and YAHSHUA Payroll',
  description: 'YAHSHUA HRIS and YAHSHUA Payroll share the same data in real time. No exports, no duplicate entry, no payroll errors from stale records.',
  keywords: 'hris payroll integration philippines, hr payroll sync, yahshua payroll, payroll automation',
  openGraph: {
    title: 'Payroll Integration — YAHSHUA HRIS and YAHSHUA Payroll',
    description: 'Real-time sync between YAHSHUA HRIS and YAHSHUA Payroll. One source of truth for all your HR and payroll data.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Payroll Integration',
    description: 'Real-time HR and payroll sync. No exports, no duplicate entry.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/payroll-integration',
  },
};

const PayrollIntegrationPage = () => {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Payroll Integration', content_category: 'integration' }} />
      <LpPayrollIntegrationContent />
    </>
  );
};

export default PayrollIntegrationPage;
