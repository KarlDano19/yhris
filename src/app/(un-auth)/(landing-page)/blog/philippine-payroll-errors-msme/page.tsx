import { Metadata } from 'next';
import PayrollErrorsArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PayrollErrorsArticle";

export const metadata: Metadata = {
  title: 'What Philippine Payroll Errors Actually Cost MSMEs | YAHSHUA HRIS',
  description: 'Philippine MSMEs running payroll on outdated SSS, PhilHealth, and BIR rates face surcharges of 25%, 12% annual interest, and up to ₱50,000 in compromise penalties. Here is what the cost actually looks like — and how to catch errors before the government does.',
  keywords: 'payroll errors Philippines 2026, SSS contribution rate 2026, PhilHealth premium 2026, BIR withholding tax penalties Philippines, MSME payroll compliance Philippines',
  openGraph: {
    title: 'What Philippine Payroll Errors Actually Cost MSMEs',
    description: 'SSS is now at 15%, PhilHealth at 5%, and BIR penalties run 25% surcharge plus 12% annual interest. If your payroll system was not updated, errors have been accumulating since January.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Philippine Payroll Errors Actually Cost MSMEs',
    description: 'SSS at 15%, PhilHealth at 5%, BIR penalties at 25% surcharge and 12% interest. Here is what running payroll on outdated rates actually costs.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philippine-payroll-errors-msme',
  },
};

const PayrollErrorsPage = () => {
  return <PayrollErrorsArticle />;
};

export default PayrollErrorsPage;
