import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/features/LpFeaturesContent";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Features - Complete Employee Data Management & Job Posting System',
  description: 'Discover all YAHSHUA HRIS features including employee data management, job posting automation, DOLE compliance, performance evaluations, and payroll integration. Built for Philippine businesses.',
  keywords: 'yahshua hris features, employee management, job posting, DOLE compliance, performance evaluation, payroll integration, HR automation',
  openGraph: {
    title: 'YAHSHUA HRIS Features - Complete HR Management System',
    description: 'Explore comprehensive YAHSHUA HRIS features for complete employee lifecycle management, job posting automation, and DOLE compliance.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Features - Complete HR Management',
    description: 'Complete HRIS features for employee management, job posting, and compliance automation.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/features'
  }
};

const FeaturesPage = () => {
  return <Content />;
};

export default FeaturesPage;