import { Metadata } from 'next';
import YahshuaPayrollContent from "@/components/pages/(un-auth)/(landing-page)/yahshua-payroll/Content";

export const metadata: Metadata = {
  title: 'YAHSHUA Payroll Integration — Sync HR Data with Your Payroll System',
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

const YahshuaPayrollPage = () => {
  return <YahshuaPayrollContent />;
};

export default YahshuaPayrollPage;
