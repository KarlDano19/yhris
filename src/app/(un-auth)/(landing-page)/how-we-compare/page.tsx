import { Metadata } from 'next';
import CompetitorsContent from "@/components/pages/(un-auth)/(landing-page)/competitors/CompetitorsContent";

export const metadata: Metadata = {
  title: 'How YAHSHUA HRIS Compares to Other HR Software in the Philippines',
  description: 'See how YAHSHUA HRIS compares to other HR and payroll software options in the Philippines. Transparent feature and pricing comparisons for growing businesses.',
  keywords: 'hris comparison philippines, hr software comparison, yahshua hris competitors, best hris philippines',
  openGraph: {
    title: 'How YAHSHUA HRIS Compares to Other HR Software',
    description: 'Transparent feature and pricing comparisons between YAHSHUA HRIS and other HR software options in the Philippines.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How YAHSHUA HRIS Compares',
    description: 'HR software comparisons for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/how-we-compare'
  }
};

export default function HowWeCompare() {
  return <CompetitorsContent />;
}
