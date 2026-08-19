import { Metadata } from 'next';
import JuanhrAlternativeContent from "@/components/pages/(un-auth)/(landing-page)/juanhr-alternative/JuanhrAlternativeContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'JuanHR Alternative — YAHSHUA HRIS for Philippine SMEs',
  description: 'Looking for a JuanHR alternative? YAHSHUA HRIS publishes its pricing upfront and bundles recruitment, performance management, and DOLE compliance in every plan.',
  keywords: 'juanhr alternative, switch from juanhr, hris alternative philippines, juanhr competitor',
  openGraph: {
    title: 'JuanHR Alternative — YAHSHUA HRIS',
    description: 'Published pricing, built-in recruitment, and guided DOLE compliance. See why Philippine SMEs choose YAHSHUA HRIS over JuanHR.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JuanHR Alternative — YAHSHUA HRIS',
    description: 'A JuanHR alternative built for Philippine SMEs: see the price, get the full lifecycle.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/juanhr-alternative'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/juanhr-alternative#webpage",
      "name": "JuanHR Alternative: YAHSHUA HRIS for Philippine SMEs",
      "description": "YAHSHUA HRIS as a JuanHR alternative for Philippine SMEs: published flat pricing at PHP 7,000/month for up to 100 employees, with recruitment, applicant tracking, performance management, and DOLE compliance included.",
      "url": "https://yahshuahris.com/juanhr-alternative",
      "dateModified": "2026-08-14T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/juanhr-alternative#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a good alternative to JuanHR for Philippine SMEs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS is a JuanHR alternative for Philippine SMEs that publishes its pricing upfront at PHP 7,000/month for up to 100 employees. It includes recruitment, applicant tracking, and performance evaluation, none of which are part of JuanHR's published module list."
          }
        },
        {
          "@type": "Question",
          "name": "How do I switch from JuanHR to YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS charges a one-time PHP 35,000 setup fee covering full data migration, implementation, and dedicated onboarding training. There is no long-term contract after setup, and pricing is published on the site so you know the cost before booking a demo."
          }
        },
        {
          "@type": "Question",
          "name": "Why do businesses look for a JuanHR alternative?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common reasons include JuanHR's custom, quote-based pricing that isn't published, the absence of recruitment or applicant tracking in its module list, and the lack of a performance evaluation module."
          }
        }
      ]
    }
  ]
};

export default function JuanhrAlternative() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'JuanHR Alternative', content_category: 'alternative' }} />
      <JuanhrAlternativeContent />
    </>
  );
}
