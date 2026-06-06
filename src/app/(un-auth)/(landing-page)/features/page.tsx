import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/features/LpFeaturesContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Features - Payroll, 201 Files, DOLE Compliance & More',
  description: 'See everything YAHSHUA HRIS can do: automated payroll, 201 file management, DOLE compliance reports, performance evaluations, job posting, and payroll integration. Built for Philippine businesses.',
  keywords: 'yahshua hris features, employee management, job posting, DOLE compliance, performance evaluation, payroll integration, HR automation',
  openGraph: {
    title: 'YAHSHUA HRIS Features - Payroll, 201 Files, DOLE Compliance & More',
    description: 'See everything YAHSHUA HRIS can do: automated payroll, 201 file management, DOLE compliance reports, performance evaluations, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Features - Payroll, 201 Files, DOLE Compliance & More',
    description: 'Automated payroll, 201 file management, DOLE compliance reports, and more. Built for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/features'
  }
};

const FeaturesPage = () => {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Features', content_category: 'features' }} />
      <Content />
    </>
  );
};

export default FeaturesPage;