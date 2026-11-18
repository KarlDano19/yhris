import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/landing-page/Content";
import PixelEvents from '@/components/PixelEvents';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
  description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll. Try it free.',
  keywords: 'yahshua hris, yahshua payroll, employee data, job posting, sync employee data, yahshua payroll features, use cases, use cases docs, HRIS Philippines, payroll management, employee management, DOLE compliance',
  openGraph: {
    images: OG_IMAGES,
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    images: TWITTER_IMAGES,
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, and more.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com'
  }
};

const LandingPage = () => {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'Homepage', content_category: 'homepage' }} />
      <Content />
    </>
  );
};

export default LandingPage;
