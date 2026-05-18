import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/landing-page/Content";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS - Complete Employee Data Management & Job Posting System | YAHSHUA HRIS Features, Use Cases & Sync Employee Data',
  description: 'YAHSHUA HRIS offers comprehensive employee data management, job posting automation, and complete HR solutions. Discover YAHSHUA HRIS features, use cases, and seamlessly sync employee data with our DOLE-compliant HRIS platform for Philippine businesses.',
  keywords: 'yahshua hris, yahshua payroll, employee data, job posting, sync employee data, yahshua payroll features, use cases, use cases docs, HRIS Philippines, payroll management, employee management, DOLE compliance',
  openGraph: {
    title: 'YAHSHUA HRIS - Complete HR & Employee Data Management System',
    description: 'Transform your HR operations with YAHSHUA HRIS. Manage employee data, job posting, and achieve DOLE compliance with our comprehensive HRIS solution.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS - Complete HRIS Management',
    description: 'Complete HRIS solution for employee data management, and job posting automation.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/landing-page'
  }
};

const LandingPage = () => {
  return <Content />;
};

export default LandingPage;
