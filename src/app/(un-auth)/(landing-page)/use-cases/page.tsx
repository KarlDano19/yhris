import { Metadata } from 'next';
import UseCasesContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/UseCasesContent";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Use Cases — How Philippine Businesses Use Our Platform',
  description: 'Explore how Philippine businesses use YAHSHUA HRIS for employee onboarding, performance management, DOLE compliance, document management, and more.',
  keywords: 'hris use cases philippines, employee onboarding software, performance management philippines, hr document management',
  openGraph: {
    title: 'YAHSHUA HRIS Use Cases',
    description: 'See how Philippine businesses use YAHSHUA HRIS for onboarding, performance, compliance, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Use Cases',
    description: 'How Philippine businesses use YAHSHUA HRIS for HR management.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/use-cases'
  }
};

export default function UseCases() {
  return <UseCasesContent />;
}
