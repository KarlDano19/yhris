import { Metadata } from 'next';
import LpBlogContent from "@/components/pages/(un-auth)/(landing-page)/blog/LpBlogContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'HR Insights for Philippine Business Leaders | YAHSHUA HRIS',
  description: 'Practical guides on DOLE compliance, payroll, recruitment, and HR management for Philippine businesses. Written by the YAHSHUA HRIS team.',
  keywords: 'hr blog philippines, dole compliance guide, payroll tips, recruitment philippines, hr management',
  openGraph: {
    title: 'HR Insights for Philippine Business Leaders | YAHSHUA HRIS',
    description: 'Practical guides on DOLE compliance, payroll, recruitment, and HR management for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Blog: HR Insights',
    description: 'Practical HR guides for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://yahshuahris.com/blog#webpage",
      "name": "HR Insights for Philippine Business Leaders",
      "description": "Practical guides on DOLE compliance, payroll, recruitment, and HR management for Philippine businesses.",
      "url": "https://yahshuahris.com/blog",
      "isPartOf": {
        "@id": "https://yahshuahris.com/#website"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const BlogPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Blog', content_category: 'blog' }} />
      <LpBlogContent />
    </>
  );
};

export default BlogPage;
