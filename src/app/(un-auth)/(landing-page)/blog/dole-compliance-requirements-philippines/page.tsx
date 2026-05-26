import { Metadata } from 'next';
import DoleComplianceArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/DoleComplianceArticle";

export const metadata: Metadata = {
  title: 'DOLE Compliance Requirements Every Philippine Employer Must Know | YAHSHUA HRIS',
  description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
  keywords: 'DOLE compliance requirements Philippines, WAIR report, EC logbook, OSH annual report, Philippine labor compliance',
  openGraph: {
    title: 'DOLE Compliance Requirements Every Philippine Employer Must Know',
    description: 'A practical breakdown of mandatory DOLE reports, from WAIR submissions to OSH annual reports, and how to stay compliant without drowning in paperwork.',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOLE Compliance Requirements Every Philippine Employer Must Know',
    description: 'Mandatory DOLE reports explained: WAIR, EC Logbook, OSH annual report, and more.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/dole-compliance-requirements-philippines',
  },
};

const DoleCompliancePage = () => {
  return <DoleComplianceArticle />;
};

export default DoleCompliancePage;
