import { Metadata } from 'next';
import BookDemoContent from '@/components/pages/(un-auth)/book-demo/Content';

export const metadata: Metadata = {
  title: 'Book a Demo | YAHSHUA HRIS',
  description: 'See YAHSHUA HRIS in action. Schedule a personalized demo and discover how our complete HR solution can streamline your operations.',
  keywords: 'yahshua hris demo, hris demo philippines, hr software demo, book a demo',
  openGraph: {
    title: 'Book a Demo | YAHSHUA HRIS',
    description: 'See YAHSHUA HRIS in action. Schedule a personalized demo and discover how our complete HR solution can streamline your operations.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Demo | YAHSHUA HRIS',
    description: 'Schedule a personalized demo of YAHSHUA HRIS.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/book-demo',
  },
};

const BookDemoPage = () => {
  return <BookDemoContent />;
};

export default BookDemoPage;
