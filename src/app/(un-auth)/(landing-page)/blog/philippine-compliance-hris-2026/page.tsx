import { Metadata } from 'next';
import PhilippineComplianceArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PhilippineComplianceArticle";

export const metadata: Metadata = {
  title: 'Philippine Compliance 2026: Why You Need One System, Not Five Checklists | YAHSHUA HRIS',
  description: 'PhilHealth E-Claims 3.0 deadline is June 30, BIR cross-border income sourcing rules are active, and DOLE AERW filing is open. Here is what every Philippine employer needs to know — and why disconnected systems make it worse.',
  keywords: 'PhilHealth E-Claims compliance Philippines, HRIS payroll Philippines 2026, DOLE AERW filing 2026, BIR RMC 38-2024 payroll, Philippine compliance deadlines',
  openGraph: {
    title: 'Philippine Compliance 2026: Why You Need One System, Not Five Checklists',
    description: 'PhilHealth E-Claims 3.0, BIR income sourcing rules, and DOLE AERW — multiple compliance obligations are live right now. Here is what each one means and how to face all of them without drowning.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philippine Compliance 2026: One System, Not Five Checklists',
    description: 'PhilHealth E-Claims 3.0 deadline is June 30. BIR cross-border rules are active. DOLE AERW is open. Here is what every Philippine employer needs to act on now.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/philippine-compliance-hris-2026',
  },
};

const PhilippineCompliancePage = () => {
  return <PhilippineComplianceArticle />;
};

export default PhilippineCompliancePage;
