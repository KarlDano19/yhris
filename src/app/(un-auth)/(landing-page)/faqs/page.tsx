import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/faqs/Content";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'FAQs — YAHSHUA HRIS Help and Support',
  description: 'Frequently asked questions about YAHSHUA HRIS. Get answers on pricing, features, DOLE compliance, payroll integration, onboarding, and technical support.',
  keywords: 'yahshua hris faq, hris support philippines, hr software questions, dole compliance faq',
  openGraph: {
    title: 'FAQs — YAHSHUA HRIS Help and Support',
    description: 'Answers to common questions about YAHSHUA HRIS pricing, features, DOLE compliance, and payroll integration.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS FAQs',
    description: 'Answers to common questions about YAHSHUA HRIS.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/faqs'
  }
};

const FaqPage = () => {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'FAQs', content_category: 'support' }} />
      <Content />
    </>
  );
};

export default FaqPage;
