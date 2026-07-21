import { Metadata } from 'next';
import PayrollRegistrationChecklistArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PayrollRegistrationChecklistArticle";

export const metadata: Metadata = {
  title: 'Philippine Business Payroll Setup Checklist: BIR, SSS, PhilHealth, Pag-IBIG Registration | YAHSHUA HRIS',
  description: 'Step-by-step checklist for registering a Philippine business with BIR, SSS, PhilHealth, and Pag-IBIG. Includes required forms, fees, correct registration sequence, and monthly remittance deadlines.',
  keywords: 'payroll registration checklist Philippines, BIR employer registration Philippines, SSS employer registration, PhilHealth employer registration, Pag-IBIG employer registration',
  openGraph: {
    title: 'Philippine Business Payroll Setup Checklist: BIR, SSS, PhilHealth, Pag-IBIG',
    description: 'Step-by-step checklist for registering with all four government agencies before your first payroll. Correct order, required forms, fees, and remittance deadlines.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-07-15T00:00:00.000Z',
    modifiedTime: '2026-07-15T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payroll Registration Checklist: BIR, SSS, PhilHealth, Pag-IBIG (Philippines)',
    description: 'Every form, fee, and deadline for setting up payroll compliance in the Philippines. Step-by-step with the correct registration sequence.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/payroll-registration-checklist-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines#article",
      "headline": "The Philippine Business Payroll Setup Checklist: Registering with BIR, SSS, PhilHealth, and Pag-IBIG",
      "description": "Step-by-step checklist for registering a Philippine business with BIR, SSS, PhilHealth, and Pag-IBIG before processing payroll. Covers required forms, fees, correct registration sequence, and monthly remittance deadlines.",
      "image": "https://yahshuahris.com/blog/payroll-registration-checklist.png",
      "datePublished": "2026-07-15T00:00:00.000Z",
      "dateModified": "2026-07-15T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines"
      },
      "keywords": "payroll registration checklist Philippines, BIR employer registration, SSS employer registration, PhilHealth employer registration, Pag-IBIG employer registration"
    },
    {
      "@type": "HowTo",
      "@id": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines#howto",
      "name": "How to Register a Philippine Business for Payroll Compliance",
      "description": "Step-by-step process for registering with BIR, SSS, PhilHealth, and Pag-IBIG before running payroll in the Philippines.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Register with BIR",
          "text": "File BIR Form 1901 (sole proprietors) or Form 1903 (corporations) at your Revenue District Office. Pay the ₱500 annual registration fee via Form 0605. Receive your Certificate of Registration (Form 2303) and Authority to Print official receipts."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Register with SSS",
          "text": "Create an employer account at sss.gov.ph via My.SSS. Fill out the online Employer Information form. Wait for branch validation. File Form R-1A (Employment Report) for each employee within the first 10 days of the month following their hiring quarter. Secure the stamped copy of R-1A."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Register with PhilHealth",
          "text": "File the PhilHealth Employer Registration Form (ER1) online via EPRS or in person. Report each new employee using the ER2 form within 30 days of their first day of work. File PMRFs for employees without an existing PhilHealth PIN."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Register with Pag-IBIG",
          "text": "Bring the stamped SSS Form R-1A and other required documents to your Pag-IBIG servicing branch. Receive the Certificate of Registration and Employer's Data Form. File your first manual remittance before activating the Electronic Submission of Remittance Schedule (eSRS)."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "In what order should a Philippine employer register with government agencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Register with BIR first to get your TIN and Certificate of Registration, then SSS (online via My.SSS), then PhilHealth, then Pag-IBIG last. Pag-IBIG requires a stamped copy of your SSS Form R-1A as part of its application, so SSS must be completed before filing with Pag-IBIG."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost to register with BIR as a new employer in the Philippines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The initial BIR registration costs ₱500 for the annual registration fee (Form 0605), ₱100 for the documentary stamp tax, and ₱15 for the certification fee. Books of account cost approximately ₱400. Authority to Print official receipts costs between ₱3,000 and ₱5,000. Total out-of-pocket is typically ₱4,000 to ₱6,000. The ₱500 annual fee renews every January 31."
          }
        },
        {
          "@type": "Question",
          "name": "When must a Philippine employer register new employees with SSS, PhilHealth, and Pag-IBIG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For PhilHealth, new employees must be reported within 30 days from their first day of work. For SSS, the Employment Report (Form R-1A) must be filed within the first 10 days of the month following the quarter in which the employee was hired. For Pag-IBIG, the employee's MID number and contribution must be included in the immediately applicable month following the hiring date."
          }
        },
        {
          "@type": "Question",
          "name": "Can SSS, PhilHealth, and Pag-IBIG employer registrations be done online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SSS employer registration is fully online via My.SSS at sss.gov.ph. PhilHealth employer registration can be done online via EPRS or in person. Pag-IBIG initial employer registration must be done in person at your servicing branch. Once your first Pag-IBIG remittance is filed, you can activate online remittance via eSRS."
          }
        },
        {
          "@type": "Question",
          "name": "What is the BIR Annual Registration Fee and when is it due?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The BIR Annual Registration Fee is ₱500, paid every January 31 using BIR Form 0605. Failure to pay by January 31 incurs a ₱1,000 penalty. The Certificate of Registration (Form 2303) must be displayed at the place of business at all times."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines#breadcrumb",
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
          "name": "Philippine Business Payroll Setup Checklist",
          "item": "https://yahshuahris.com/blog/payroll-registration-checklist-philippines"
        }
      ]
    }
  ]
};

const PayrollRegistrationChecklistPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PayrollRegistrationChecklistArticle />
    </>
  );
};

export default PayrollRegistrationChecklistPage;
