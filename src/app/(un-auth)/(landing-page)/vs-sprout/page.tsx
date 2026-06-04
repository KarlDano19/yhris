import { Metadata } from 'next';
import VsSproutContent from "@/components/pages/(un-auth)/(landing-page)/vs-sprout/VsSproutContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS vs Sprout Solutions — Which is Right for Your Business?',
  description: 'Compare YAHSHUA HRIS and Sprout Solutions side by side. See how features, pricing, DOLE compliance, and payroll integration stack up for Philippine businesses.',
  keywords: 'yahshua hris vs sprout solutions, sprout solutions alternative, hris comparison philippines, hr software philippines',
  openGraph: {
    title: 'YAHSHUA HRIS vs Sprout Solutions',
    description: 'Compare YAHSHUA HRIS and Sprout Solutions on features, pricing, and DOLE compliance. Built for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS vs Sprout Solutions',
    description: 'Side-by-side comparison of YAHSHUA HRIS and Sprout Solutions for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/vs-sprout'
  }
};

export default function VsSprout() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'YAHSHUA vs Sprout', content_category: 'comparison' }} />
      <VsSproutContent />
    </>
  );
}
