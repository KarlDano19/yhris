import Content from '@/components/pages/(un-auth)/(landing-page)/terms-of-service/Content';

export const metadata = {
  title: 'Terms of Service - Yahshua HRIS',
  description: 'Review the YAHSHUA HRIS Terms of Service. Understand your rights and obligations when using our HR and payroll platform.',
  alternates: {
    canonical: 'https://yahshuahris.com/terms-of-service'
  }
};

const TermsOfServicePage = async () => {
  return <Content />;
};

export default TermsOfServicePage;