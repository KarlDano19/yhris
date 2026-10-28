import Content from '@/components/pages/(un-auth)/(landing-page)/terms-of-service/Content';

export const metadata = {
  title: 'Terms of Service - Yahshua HRIS',
  description: 'Review the YAHSHUA HRIS Terms of Service. Understand your rights and obligations when using our HR and payroll platform.',
  alternates: {
    canonical: 'https://yahshuahris.com/terms-of-service'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/terms-of-service#webpage",
      "name": "Terms of Service - YAHSHUA HRIS",
      "description": "Review the YAHSHUA HRIS Terms of Service. Understand your rights and obligations when using our HR and payroll platform.",
      "url": "https://yahshuahris.com/terms-of-service",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const TermsOfServicePage = async () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Content />
    </>
  );
};

export default TermsOfServicePage;