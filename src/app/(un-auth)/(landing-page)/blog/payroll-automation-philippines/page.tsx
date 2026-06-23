import { Metadata } from 'next';
import PayrollMessageArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PayrollMessageArticle";

export const metadata: Metadata = {
  title: 'Your Payroll Is a Message to Your Team | YAHSHUA HRIS',
  description: 'Accurate, on-time payroll is not just compliance — it is one of the most consistent acts of leadership a Philippine business owner performs. Here is what payroll automation actually gives you.',
  keywords: 'payroll automation Philippines, accurate payroll Philippines, HRIS payroll Philippines, Philippine payroll compliance, SSS PhilHealth Pag-IBIG payroll',
  openGraph: {
    title: 'Your Payroll Is a Message to Your Team',
    description: 'Every payday, your employees are reading something. A payroll that is late says: you were not our priority. A payroll that is correct, on time, every cycle — that says something else entirely.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Payroll Is a Message to Your Team',
    description: 'Accurate, on-time payroll is one of the most consistent acts of leadership a Philippine business owner performs.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/payroll-automation-philippines',
  },
};

const PayrollMessagePage = () => {
  return <PayrollMessageArticle />;
};

export default PayrollMessagePage;
