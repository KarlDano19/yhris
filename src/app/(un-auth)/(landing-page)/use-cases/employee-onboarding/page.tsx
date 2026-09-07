import { Metadata } from 'next';
import EmployeeOnboardingContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/employee-onboarding/EmployeeOnboardingContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Employee Onboarding Software | YAHSHUA HRIS',
  description: 'Automate new hire onboarding with digital documents, compliance tracking, and streamlined workflows for Philippine businesses.',
  openGraph: {
    title: 'Employee Onboarding Software | YAHSHUA HRIS',
    description: 'Automate new hire onboarding with digital documents, compliance tracking, and streamlined workflows.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee Onboarding Software | YAHSHUA HRIS',
    description: 'Automate new hire onboarding with digital documents and compliance tracking built in.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/use-cases/employee-onboarding'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/use-cases/employee-onboarding#webpage",
      "name": "Employee Onboarding Software | YAHSHUA HRIS",
      "description": "Automate new hire onboarding with digital documents, compliance tracking, and streamlined workflows for Philippine businesses.",
      "url": "https://yahshuahris.com/use-cases/employee-onboarding",
      "isPartOf": {
        "@id": "https://yahshuahris.com/use-cases#webpage"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

export default function EmployeeOnboarding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Employee Onboarding', content_category: 'use-cases' }} />
      <EmployeeOnboardingContent />
    </>
  );
}
