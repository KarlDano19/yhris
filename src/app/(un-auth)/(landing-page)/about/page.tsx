import { Metadata } from 'next';
import AboutContent from "@/components/pages/(un-auth)/(landing-page)/about/AboutContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'About YAHSHUA HRIS: Built by The ABBA Initiative',
  description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses, part of The ABBA Initiative, the company that also builds YAHSHUA One.',
  keywords: 'about yahshua hris, the abba initiative, yahshua one, yahshua hris company',
  openGraph: {
    title: 'About YAHSHUA HRIS',
    description: 'Built by a team that has done this for 17 years. YAHSHUA HRIS is part of The ABBA Initiative.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About YAHSHUA HRIS',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses, part of The ABBA Initiative.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/about'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://yahshuahris.com/about#webpage",
      "name": "About YAHSHUA HRIS",
      "description": "YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses, part of The ABBA Initiative, the company that also builds YAHSHUA One.",
      "url": "https://yahshuahris.com/about",
      "dateModified": "2026-08-20T00:00:00.000Z",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://yahshuahris.com/#website"
      },
      "about": {
        "@id": "https://yahshuahris.com/#software"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/about#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yahshuahris.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": "https://yahshuahris.com/about"
        }
      ]
    }
  ]
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'About', content_category: 'company' }} />
      <AboutContent />
    </>
  );
}
