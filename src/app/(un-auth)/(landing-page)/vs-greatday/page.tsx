import { Metadata } from 'next';
import VsGreatdayContent from "@/components/pages/(un-auth)/(landing-page)/vs-greatday/VsGreatdayContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS vs GreatDay HR — Which is Right for Your Business?',
  description: 'Compare YAHSHUA HRIS and GreatDay HR side by side. See how recruitment, performance management, DOLE compliance, and pricing stack up for Philippine SMEs.',
  keywords: 'yahshua hris vs greatday hr, greatday hr alternative, hris comparison philippines, hr software philippines',
  openGraph: {
    title: 'YAHSHUA HRIS vs GreatDay HR',
    description: 'Compare YAHSHUA HRIS and GreatDay HR on features, pricing, and DOLE compliance. Built for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS vs GreatDay HR',
    description: 'Side-by-side comparison of YAHSHUA HRIS and GreatDay HR for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/vs-greatday'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/vs-greatday#webpage",
      "name": "YAHSHUA HRIS vs GreatDay HR: Side-by-Side Comparison",
      "description": "Feature and pricing comparison between YAHSHUA HRIS and GreatDay HR for Philippine businesses. YAHSHUA includes multi-platform job posting, performance management, and DOLE compliance automation in every plan, with flat pricing at PHP 7,000/month for up to 100 employees.",
      "url": "https://yahshuahris.com/vs-greatday",
      "dateModified": "2026-08-14T00:00:00.000Z",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      },
      "about": [
        {
          "@type": "SoftwareApplication",
          "name": "YAHSHUA HRIS",
          "url": "https://yahshuahris.com"
        },
        {
          "@type": "SoftwareApplication",
          "name": "GreatDay HR"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/vs-greatday#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the main difference between YAHSHUA HRIS and GreatDay HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS includes multi-platform job posting (LinkedIn, Facebook, YAHSHUA Jobs), performance management, and DOLE compliance automation in every plan at no extra cost. GreatDay HR lists recruitment and performance management as paid add-ons on top of its base package. YAHSHUA also uses flat pricing at PHP 7,000/month for up to 100 employees (plus a PHP 35,000 one-time setup fee), while GreatDay HR charges PHP 77 per employee per month starting from its first employee, with a minimum purchase of 50 licenses."
          }
        },
        {
          "@type": "Question",
          "name": "Does GreatDay HR include DOLE compliance automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GreatDay HR automates BIR, SSS, PhilHealth, and Pag-IBIG payroll compliance, including Alphalist and BIR 2316 generation. It does not publish a dedicated guided DOLE reporting module covering company registration, OSH reports, or AERW filing the way YAHSHUA HRIS does. YAHSHUA's DOLE Module includes these reports in every plan with no add-on required."
          }
        },
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS pricing compare to GreatDay HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS starts at PHP 7,000/month flat for up to 100 employees, plus a one-time PHP 35,000 setup fee, with no minimum employee count required to start. GreatDay HR's Basic Starter Package costs PHP 77 per employee per month and requires a minimum purchase of 50 licenses, meaning costs rise with every employee added from day one with no flat cap."
          }
        },
        {
          "@type": "Question",
          "name": "Which HR software is better for Philippine SMEs: YAHSHUA HRIS or GreatDay HR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GreatDay HR is a strong option for field-based or frontline teams that prioritize mobile GPS attendance and facial recognition biometrics. YAHSHUA HRIS is a better fit for Philippine SMEs that want recruitment, performance management, and guided DOLE compliance included in one flat monthly rate without add-on fees or a minimum headcount to start."
          }
        }
      ]
    }
  ]
};

export default function VsGreatday() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'YAHSHUA vs GreatDay', content_category: 'comparison' }} />
      <VsGreatdayContent />
    </>
  );
}
