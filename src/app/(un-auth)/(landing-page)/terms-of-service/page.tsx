import Content from '@/components/pages/(un-auth)/(landing-page)/terms-of-service/Content';

export const metadata = {
  title: 'Terms of Service - Yahshua HRIS',
  description: 'HRIS',
  alternates: {
    canonical: 'https://yahshuahris.com/terms-of-service'
  }
};

const TermsOfServicePage = async () => {
  return <Content />;
};

export default TermsOfServicePage;