import Content from '@/components/pages/(un-auth)/(landing-page)/privacy-notice/Content';

export const metadata = {
  title: 'Privacy Notice - Yahshua HRIS',
  description: 'Read the YAHSHUA HRIS Privacy Notice. Learn how we collect, use, and protect your personal data in compliance with Philippine data privacy laws.',
  alternates: {
    canonical: 'https://yahshuahris.com/privacy-notice'
  }
};

const PrivacyNoticePage = async () => {
  return <Content />;
};

export default PrivacyNoticePage;
