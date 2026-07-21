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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/philippine-compliance-hris-2026#article",
      "headline": "Philippine Compliance 2026: Why You Need One System, Not Five Checklists",
      "description": "PhilHealth E-Claims 3.0, BIR income sourcing rules, and DOLE AERW filing are all active in 2026. Here is what each compliance obligation means and why disconnected systems make it harder to manage.",
      "image": "https://yahshuahris.com/blog/why-one-system.png",
      "datePublished": "2026-06-22T00:00:00.000Z",
      "dateModified": "2026-06-22T00:00:00.000Z",
      "author": {
        "@type": "Organization",
        "name": "YAHSHUA HRIS Team",
        "url": "https://yahshuahris.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "YAHSHUA HRIS",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yahshuahris.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://yahshuahris.com/blog/philippine-compliance-hris-2026"
      },
      "keywords": "PhilHealth E-Claims compliance Philippines, HRIS payroll Philippines 2026, DOLE AERW filing 2026, BIR RMC 38-2024 payroll, Philippine compliance deadlines"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/philippine-compliance-hris-2026#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yahshuahris.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://yahshuahris.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Philippine Compliance 2026: One System, Not Five Checklists",
          "item": "https://yahshuahris.com/blog/philippine-compliance-hris-2026"
        }
      ]
    }
  ]
};

const PhilippineCompliancePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhilippineComplianceArticle />
    </>
  );
};

export default PhilippineCompliancePage;
