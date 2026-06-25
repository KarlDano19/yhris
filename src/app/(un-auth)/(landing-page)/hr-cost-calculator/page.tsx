import type { Metadata } from 'next';
import HrCostCalculatorContent from '@/components/pages/(un-auth)/(landing-page)/hr-cost-calculator/HrCostCalculatorContent';

export const metadata: Metadata = {
  title: 'HR & Payroll Cost Calculator — See What Manual Processes Are Costing You | YAHSHUA HRIS',
  description: 'Free calculator for Philippine businesses. Find out how much manual HR and payroll is costing you every year, and how much you could save by switching to YAHSHUA HRIS.',
  openGraph: {
    title: 'HR & Payroll Cost Calculator — YAHSHUA HRIS',
    description: 'Calculate your annual HR and payroll waste in minutes. See your savings estimate and ROI timeline with YAHSHUA.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HR & Payroll Cost Calculator — YAHSHUA HRIS',
    description: 'Find out how much manual HR and payroll is costing your Philippine business every year.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/hr-cost-calculator',
  },
};

export default function HrCostCalculatorPage() {
  return <HrCostCalculatorContent />;
}
