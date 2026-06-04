import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/landing-page/Content";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
  description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll. Try it free.',
  keywords: 'yahshua hris, yahshua payroll, employee data, job posting, sync employee data, yahshua payroll features, use cases, use cases docs, HRIS Philippines, payroll management, employee management, DOLE compliance',
  openGraph: {
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, and more.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com'
  }
};

const LandingPage = () => {
  return <Content />;
};

export default LandingPage;
