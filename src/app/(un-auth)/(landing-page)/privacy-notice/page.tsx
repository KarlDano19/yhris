import Content from '@/components/pages/(un-auth)/(landing-page)/privacy-notice/Content';

export const metadata = {
  title: 'Privacy Notice - Yahshua HRIS',
  description: 'Read the YAHSHUA HRIS Privacy Notice. Learn how we collect, use, and protect your personal data in compliance with Philippine data privacy laws.',
  alternates: {
    canonical: 'https://yahshuahris.com/privacy-notice'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://yahshuahris.com/privacy-notice#webpage",
      "name": "Privacy Notice - YAHSHUA HRIS",
      "description": "Read the YAHSHUA HRIS Privacy Notice. Learn how we collect, use, and protect your personal data in compliance with Philippine data privacy laws.",
      "url": "https://yahshuahris.com/privacy-notice",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

const PrivacyNoticePage = async () => {
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

export default PrivacyNoticePage;
