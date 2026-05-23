import Content from '@/components/pages/(un-auth)/(landing-page)/privacy-notice/Content';

export const metadata = {
  title: 'Privacy Notice - Yahshua HRIS',
  description: 'HRIS',
  alternates: {
    canonical: 'https://yahshuahris.com/privacy-notice'
  }
};

const PrivacyNoticePage = async () => {
  return <Content />;
};

export default PrivacyNoticePage;
