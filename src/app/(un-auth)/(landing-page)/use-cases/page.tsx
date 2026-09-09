import { Metadata } from 'next';
import UseCasesContent from "@/components/pages/(un-auth)/(landing-page)/use-cases/UseCasesContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS Use Cases for Philippine Businesses',
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/use-cases#webpage",
      "name": "YAHSHUA HRIS Use Cases for Philippine Businesses",
      "description": "Explore how Philippine businesses use YAHSHUA HRIS for employee onboarding, performance management, and document management.",
      "url": "https://yahshuahris.com/use-cases",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "ItemList",
      "@id": "https://yahshuahris.com/use-cases#list",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Employee Onboarding",
          "url": "https://yahshuahris.com/use-cases/employee-onboarding"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Performance Management",
          "url": "https://yahshuahris.com/use-cases/performance-management"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Employee Documentation",
          "url": "https://yahshuahris.com/use-cases/employee-documentation"
        }
      ]
    }
  ]
};

export default function UseCases() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Use Cases', content_category: 'use-cases' }} />
      <UseCasesContent />
    </>
  );
}
