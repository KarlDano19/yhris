import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/faqs/Content";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'FAQs: YAHSHUA HRIS Help and Support',
  description: 'Frequently asked questions about YAHSHUA HRIS. Get answers on pricing, features, DOLE compliance, payroll integration, onboarding, and technical support.',
  keywords: 'yahshua hris faq, hris support philippines, hr software questions, dole compliance faq',
  openGraph: {
    title: 'FAQs: YAHSHUA HRIS Help and Support',
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/faqs#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS simplifies human resource processes by offering a centralized platform for all essential HR functions. Through the dashboard, you can post jobs, screen applicants, manage employees, oversee training, handle payroll, and ensure compliance with labor laws."
          }
        },
        {
          "@type": "Question",
          "name": "Is YAHSHUA HRIS secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. YAHSHUA HRIS integrates preventive cybersecurity measures and stays updated on the latest threats. The company has a Data Protection Officer (DPO) and adheres to the Data Privacy Act (Republic Act 10173)."
          }
        },
        {
          "@type": "Question",
          "name": "What are the features of YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS includes job posting, applicant screening, employee onboarding, employee management, training, payroll automation, employee separation, DOLE compliance, and an employee kit with essential resources and documents."
          }
        },
        {
          "@type": "Question",
          "name": "What are the benefits of using YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS automates tedious HR tasks, reduces human error in payroll and compliance, helps ensure adherence to DOLE regulations, centralizes HR management in one platform, and scales from small teams to large enterprises."
          }
        }
      ]
    }
  ]
};

const FaqPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'FAQs', content_category: 'support' }} />
      <Content />
    </>
  );
};

export default FaqPage;
