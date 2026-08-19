import { Metadata } from 'next';
import { YAHSHUA_PRICING, PRICING_LABELS } from "@/lib/yahshuaPricing";
import VsJuanhrContent from "@/components/pages/(un-auth)/(landing-page)/vs-juanhr/VsJuanhrContent";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS vs JuanHR — Which is Right for Your Business?',
  description: 'Compare YAHSHUA HRIS and JuanHR side by side. See how recruitment, performance management, DOLE compliance, and pricing transparency stack up for Philippine SMEs.',
  keywords: 'yahshua hris vs juanhr, juanhr alternative, hris comparison philippines, hr software philippines',
  openGraph: {
    title: 'YAHSHUA HRIS vs JuanHR',
    description: 'Compare YAHSHUA HRIS and JuanHR on features, pricing, and DOLE compliance. Built for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS vs JuanHR',
    description: 'Side-by-side comparison of YAHSHUA HRIS and JuanHR for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/vs-juanhr'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/vs-juanhr#webpage",
      "name": "YAHSHUA HRIS vs JuanHR: Side-by-Side Comparison",
      "description": `Feature and pricing comparison between YAHSHUA HRIS and JuanHR for Philippine businesses. YAHSHUA includes multi-platform job posting, performance management, and DOLE compliance automation in every plan, with published flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees.`,
      "url": "https://yahshuahris.com/vs-juanhr",
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
          "name": "JuanHR"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/vs-juanhr#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the main difference between YAHSHUA HRIS and JuanHR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `YAHSHUA HRIS includes multi-platform job posting, applicant tracking, and performance management in every plan. JuanHR's published module list covers employee records, attendance, and payroll, but does not include recruitment, applicant tracking, or performance evaluation. YAHSHUA also publishes flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees (plus a ${PRICING_LABELS.setup} one-time setup fee), while JuanHR uses custom, quote-based pricing that isn't published.`
          }
        },
        {
          "@type": "Question",
          "name": "Does JuanHR include DOLE compliance automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JuanHR markets itself as BIR and DOLE compliant and automates payroll, SSS, PhilHealth, and Pag-IBIG contributions. It does not publish a dedicated guided DOLE reporting module covering company registration, OSH reports, or AERW filing the way YAHSHUA HRIS does. YAHSHUA's DOLE Module includes these reports in every plan with no add-on required."
          }
        },
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS pricing compare to JuanHR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `YAHSHUA HRIS publishes flat pricing at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees, plus a one-time ${PRICING_LABELS.setup} setup fee, so businesses know their exact cost before booking a demo. JuanHR uses custom, quote-based pricing, which requires contacting sales to get a price for your specific employee count and modules.`
          }
        },
        {
          "@type": "Question",
          "name": "Which HR software is better for Philippine SMEs: YAHSHUA HRIS or JuanHR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JuanHR is a solid option for organizations, including government agencies, that need strong biometric attendance integration and geo-fenced field work tracking. YAHSHUA HRIS is a better fit for Philippine SMEs that want recruitment, performance management, and guided DOLE compliance included in one transparent, published flat monthly rate."
          }
        }
      ]
    }
  ]
};

export default function VsJuanhr() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'YAHSHUA vs JuanHR', content_category: 'comparison' }} />
      <VsJuanhrContent />
    </>
  );
}
