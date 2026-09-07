import { Metadata } from 'next';
import EmployeeDocumentationContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/employee-documentation/EmployeeDocumentationContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Employee Documentation Software | YAHSHUA HRIS',
  description: 'Store and organize 201 files and employee records digitally with secure access and compliance-ready documentation.',
  openGraph: {
    title: 'Employee Documentation Software | YAHSHUA HRIS',
    description: 'Store and organize 201 files and employee records digitally with secure, compliance-ready access.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee Documentation Software | YAHSHUA HRIS',
    description: 'Digital 201 files and employee records with secure, compliance-ready access.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/use-cases/employee-documentation'
  }
};

export default function EmployeeDocumentation() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Employee Documentation', content_category: 'use-cases' }} />
      <EmployeeDocumentationContent />
    </>
  );
}