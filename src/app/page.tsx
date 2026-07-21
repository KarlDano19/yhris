import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/landing-page/Content";
import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
  description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll. Try it free.',
  keywords: 'yahshua hris, yahshua payroll, employee data, job posting, sync employee data, yahshua payroll features, use cases, use cases docs, HRIS Philippines, payroll management, employee management, DOLE compliance',
  openGraph: {
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, performance, and integrate with your payroll.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS - All-in-One HR Software for Philippine Businesses',
    description: 'YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses. Manage employees, 201 files, DOLE compliance, and more.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://yahshuahris.com/#organization",
      "name": "YAHSHUA HRIS",
      "legalName": "YAHSHUA Outsourcing Worldwide, Inc.",
      "alternateName": "YOWI",
      "url": "https://yahshuahris.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yahshuahris.com/logo.png"
      },
      "description": "Philippine all-in-one HR and payroll platform for small and mid-sized businesses. Covers DOLE compliance automation, employee onboarding, 201 files, attendance, leave, performance evaluation, and real-time payroll integration.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cagayan de Oro City",
        "addressRegion": "Misamis Oriental",
        "addressCountry": "PH"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+63-917-306-2539",
        "email": "clientrelations@abba.works",
        "contactType": "customer service",
        "areaServed": "PH",
        "availableLanguage": "English"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Philippines"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://yahshuahris.com/#website",
      "name": "YAHSHUA HRIS",
      "url": "https://yahshuahris.com",
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://yahshuahris.com/#software",
      "name": "YAHSHUA HRIS",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Human Resource Management",
      "operatingSystem": "Web",
      "url": "https://yahshuahris.com",
      "description": "All-in-one HR management system for Philippine businesses. Flat pricing starting at PHP 4,000/month for up to 100 employees. Includes DOLE compliance automation, 201 document management, attendance, leave, performance evaluation, and real-time payroll sync. SOC2 Type 2 and ISO 27001 certified.",
      "offers": {
        "@type": "Offer",
        "price": "4000",
        "priceCurrency": "PHP",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "4000",
          "priceCurrency": "PHP",
          "unitText": "month"
        },
        "description": "PHP 4,000/month for up to 100 employees. No per-seat fees, no long-term contracts.",
        "url": "https://yahshuahris.com/pricing"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      },
      "featureList": [
        "DOLE compliance automation (no add-on required)",
        "Employee onboarding and 201 document management",
        "Multi-platform job posting and applicant tracking",
        "Attendance and leave management",
        "Overtime, undertime, and rest day tracking",
        "Performance evaluation with custom forms",
        "Real-time two-way sync with YAHSHUA Payroll",
        "Employee self-service portal",
        "Memos and Notice-to-Explain distribution"
      ]
    }
  ]
};

const LandingPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <Content />
      <LpFooter />
      <ScrollToTop />
    </>
  );
};

export default LandingPage;
