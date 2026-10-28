import { Metadata } from 'next';
import DocsContent from "@/components/pages/(un-auth)/(landing-page)/docs/Content";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Documentation and Setup Guide',
  description: 'Step-by-step guide to setting up YAHSHUA HRIS, from signup to full implementation, for Philippine businesses.',
  openGraph: {
    title: 'YAHSHUA HRIS Documentation and Setup Guide',
    description: 'Step-by-step guide to setting up YAHSHUA HRIS, from signup to full implementation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Documentation and Setup Guide',
    description: 'Complete guide to getting started with YAHSHUA HRIS.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/docs'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/docs#webpage",
      "name": "YAHSHUA HRIS Documentation and Setup Guide",
      "description": "Step-by-step guide to setting up YAHSHUA HRIS, from signup to full implementation, for Philippine businesses.",
      "url": "https://yahshuahris.com/docs",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const DocsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsContent />
    </>
  );
};

export default DocsPage;
