import { Metadata } from 'next';
import PerformanceManagementContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/performance-management/PerformanceManagementContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'Performance Management Software | YAHSHUA HRIS',
  description: 'Run performance reviews with customizable templates, continuous feedback, and tracked completion for Philippine teams.',
  openGraph: {
    title: 'Performance Management Software | YAHSHUA HRIS',
    description: 'Run performance reviews with customizable templates, continuous feedback, and tracked completion.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Performance Management Software | YAHSHUA HRIS',
    description: 'Customizable evaluation templates, continuous feedback, and completion tracking.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/use-cases/performance-management'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/use-cases/performance-management#webpage",
      "name": "Performance Management Software | YAHSHUA HRIS",
      "description": "Run performance reviews with customizable templates, continuous feedback, and tracked completion for Philippine teams.",
      "url": "https://yahshuahris.com/use-cases/performance-management",
      "isPartOf": {
        "@id": "https://yahshuahris.com/use-cases#webpage"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

export default function PerformanceManagement() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Performance Management', content_category: 'use-cases' }} />
      <PerformanceManagementContent />
    </>
  );
}
