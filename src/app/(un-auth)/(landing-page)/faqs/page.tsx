import { Metadata } from 'next';
import Content from "@/components/pages/(un-auth)/(landing-page)/faqs/Content";
import PixelEvents from '@/components/PixelEvents';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'FAQs: YAHSHUA HRIS Help and Support',
  description: 'Frequently asked questions about YAHSHUA HRIS. Get answers on pricing, features, DOLE compliance, payroll integration, onboarding, and technical support.',
  keywords: 'yahshua hris faq, hris support philippines, hr software questions, dole compliance faq',
  openGraph: {
    images: OG_IMAGES,
    title: 'FAQs: YAHSHUA HRIS Help and Support',
    description: 'Answers to common questions about YAHSHUA HRIS pricing, features, DOLE compliance, and payroll integration.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    images: TWITTER_IMAGES,
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS FAQs',
    description: 'Answers to common questions about YAHSHUA HRIS.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/faqs'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/faqs#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does YAHSHUA HRIS work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAHSHUA HRIS simplifies human resource processes by offering a centralized platform for all essential HR functions. Through the dashboard, you can post jobs, screen applicants, manage employees, run evaluations, handle payroll, and ensure compliance with labor laws."
          }
        },
        {
          "@type": "Question",
          "name": "Is YAHSHUA HRIS secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, YAHSHUA HRIS prioritizes data security. We integrate proper and preventive cybersecurity measures into our systems and stay updated on the latest cyberattacks. Additionally, we have a Data Protection Officer (DPO) in our company and adhere to the Data Privacy Act (Republic Act 10173) to ensure compliance with privacy laws."
          }
        },
        {
          "@type": "Question",
          "name": "What are the features of YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "<ul><li>Post a Job: Create and publish job listings.</li><li>Screen Applicants: Review and shortlist job candidates.</li><li>Orient: Simplify the onboarding process for new employees.</li><li>Manage: Track and manage employee information and performance.</li><li>Train: Set up evaluation templates and schedules, company policies, and benefits.</li><li>Payroll: Compute salaries, deductions, and SSS, PhilHealth, Pag-IBIG, and BIR withholding with YAHSHUA One Payroll, and generate payslips.</li><li>Employee Separation: Efficiently manage employee exits.</li><li>DOLE Compliance: Ensure alignment with the Department of Labor and Employment (DOLE) regulations.</li><li>Employee Kit: Provide employees with essential resources and documents.</li></ul>"
          }
        },
        {
          "@type": "Question",
          "name": "What are the benefits of using YAHSHUA HRIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "<ul><li>Efficiency: Automates tedious HR tasks, freeing up time for more strategic initiatives.</li><li>Accuracy: Reduces human error, particularly in payroll and compliance.</li><li>Compliance: Helps ensure adherence to local labor laws, including DOLE regulations.</li><li>Centralized Management: Provides a one-stop solution for all HR tasks, making it easier to oversee employee lifecycles.</li><li>Scalability: Designed to grow with your organization, handling everything from small teams to large enterprises.</li></ul>"
          }
        },
        {
          "@type": "Question",
          "name": "Does YAHSHUA HRIS have a mobile app?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There is no separate YAHSHUA HRIS mobile app. YAHSHUA HRIS runs in the browser and is fully responsive, so your team can use it on a phone, tablet, or desktop. Mobile clock-in is part of YAHSHUA One Payroll, which comes with every paid plan, through the Timekeeper mobile app. Timekeeping is not part of the HRIS modules, and the free plan (job posting and applicant screening) does not include clock-in."
          }
        },
        {
          "@type": "Question",
          "name": "Is YAHSHUA HRIS a good fit for a company with fewer than 50 employees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It can be, if you want hiring, DOLE reports, performance evaluation, and payroll in one plan. The price is a flat PHP 7,000 a month (VAT excluded) for up to 100 employees, with no setup fee, and implementation, data migration, and onboarding training are free. That flat rate means a very small team can pay more per employee than under per-employee pricing. As of September 2026, GreatDay HR lists PHP 77 per employee with a 50-license minimum, about PHP 3,850 a month, which costs less below roughly 91 employees. You can try YAHSHUA HRIS first: the free plan covers job posting and applicant screening, and the 30-day trial covers all HRIS modules."
          }
        },
        {
          "@type": "Question",
          "name": "Can employees request a cash advance in YAHSHUA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Employees can apply for a cash advance through their YAHSHUA One account, which serves as their kiosk once the employer has added them to the company. The request goes to HR or the admin for approval. HR can set up repayment as a payroll deduction in YAHSHUA One Payroll."
          }
        },
        {
          "@type": "Question",
          "name": "Does YAHSHUA offer earned wage access?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, not currently. YAHSHUA HRIS and YAHSHUA One Payroll do not let employees withdraw pay they have already earned before payday. Employees can estimate what they have earned from their recorded time logs, and their pay appears in their payslip once payroll is generated. If earned wage access is a requirement, Sprout Solutions lists it through its ReadyWage product (as of September 2026). For short-term needs, employees can request a cash advance, which HR or the admin approves."
          }
        }
      ]
    }
  ]
};

const FaqPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'FAQs', content_category: 'support' }} />
      <Content />
    </>
  );
};

export default FaqPage;
