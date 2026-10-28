import { Metadata } from 'next';
import DeMinimisBenefitsArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/DeMinimisBenefitsArticle";
import PixelEvents from '@/components/PixelEvents';

export const metadata: Metadata = {
  title: 'De Minimis Benefits 2026: New BIR Ceilings (RR 29-2025)',
  description: 'BIR Revenue Regulations No. 29-2025 raised de minimis benefit ceilings effective Jan 6, 2026. Full old-vs-new table, what did not change, and the excess-over-ceiling rule.',
  keywords: 'de minimis benefits 2026 Philippines, RR No. 29-2025, BIR de minimis ceiling, rice subsidy 2026, clothing allowance tax exempt Philippines, de minimis benefits list',
  openGraph: {
    title: 'BIR\'s New Tax-Free Benefit Limits (RR No. 29-2025)',
    description: 'Effective January 6, 2026, the BIR raised tax-exempt ceilings on 10 categories of de minimis benefits. What changed, what did not, and how the excess-over-ceiling rule works with the ₱90,000 cap.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-09-16T00:00:00.000Z',
    modifiedTime: '2026-09-16T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'De Minimis Benefits 2026: New BIR Ceilings (RR 29-2025)',
    description: 'Full breakdown of the BIR\'s updated de minimis benefit ceilings effective January 6, 2026.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines#article",
      "headline": "BIR's New Tax-Free Benefit Limits (RR No. 29-2025): What Changed in De Minimis Benefits",
      "description": "BIR Revenue Regulations No. 29-2025, effective January 6, 2026, raised the tax-exempt ceilings on 10 categories of de minimis benefits. What changed, what stayed the same, and how the excess-over-ceiling rule interacts with the ₱90,000 annual cap on 13th month pay and other benefits.",
      "datePublished": "2026-09-16T00:00:00.000Z",
      "dateModified": "2026-09-16T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines"
      },
      "keywords": "de minimis benefits 2026 Philippines, RR No. 29-2025, BIR de minimis ceiling, rice subsidy 2026"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When did the new de minimis benefit ceilings take effect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "January 6, 2026, 15 days after Revenue Regulations No. 29-2025 was published, per the BIR's issuance dated December 22, 2025."
          }
        },
        {
          "@type": "Question",
          "name": "Is the rice subsidy now ₱2,500 per month?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. RR No. 29-2025 raised the tax-exempt rice subsidy ceiling from ₱2,000 to ₱2,500 per month."
          }
        },
        {
          "@type": "Question",
          "name": "Are de minimis benefits part of the ₱90,000 tax-exempt cap?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, not while they stay within their own ceilings. They only interact with the ₱90,000 cap on 13th month pay and other benefits when a specific de minimis benefit exceeds its individual ceiling; only that excess portion is added to the ₱90,000 bucket."
          }
        },
        {
          "@type": "Question",
          "name": "Can an employer add new benefits to the de minimis list?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The BIR's de minimis list is exclusive. A benefit not specifically enumerated under RR No. 2-98, as amended (including RR No. 29-2025), is taxable compensation for rank-and-file employees or a fringe benefit subject to fringe benefit tax for managerial and supervisory employees, regardless of how small its value."
          }
        },
        {
          "@type": "Question",
          "name": "Do de minimis benefits affect SSS, PhilHealth, or Pag-IBIG contributions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. De minimis benefits are excluded from the computation of SSS, PhilHealth, and Pag-IBIG contributions, and from the basic salary used to compute 13th month pay."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines#breadcrumb",
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
          "name": "De Minimis Benefits 2026 (RR No. 29-2025)",
          "item": "https://yahshuahris.com/blog/de-minimis-benefits-2026-philippines"
        }
      ]
    }
  ]
};

const DeMinimisBenefitsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'De Minimis Benefits 2026', content_category: 'blog' }} />
      <DeMinimisBenefitsArticle />
    </>
  );
};

export default DeMinimisBenefitsPage;
