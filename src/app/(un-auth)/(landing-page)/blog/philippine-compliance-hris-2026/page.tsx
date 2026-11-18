import { Metadata } from 'next';
import PhilippineComplianceArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PhilippineComplianceArticle";
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { philippineComplianceFaqs } from '@/lib/blogFaqs';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

export const metadata: Metadata = {
  title: 'Philippine HR Compliance 2026 | YAHSHUA HRIS',
  description: 'PhilHealth E-Claims 3.0, BIR cross-border sourcing rules, and DOLE AERW filing are all active in 2026. What every Philippine employer needs to know.',
  keywords: 'PhilHealth E-Claims compliance Philippines, HRIS payroll Philippines 2026, DOLE AERW filing 2026, BIR RMC 38-2024 payroll, Philippine compliance deadlines',
  openGraph: {
    images: blogCoverImages('philippine-compliance-hris-2026'),
    title: 'Philippine Compliance 2026: Why You Need One System, Not Five Checklists',
    description: 'PhilHealth E-Claims 3.0, BIR income sourcing rules, and DOLE AERW: multiple compliance obligations are live right now. Here is what each one means and how to face all of them without drowning.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['philippine-compliance-hris-2026'].published),
    modifiedTime: blogIso(BLOG_DATES['philippine-compliance-hris-2026'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('philippine-compliance-hris-2026'),
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
      "image": blogCoverUrl('philippine-compliance-hris-2026'),
      "datePublished": blogIso(BLOG_DATES['philippine-compliance-hris-2026'].published),
      "dateModified": blogIso(BLOG_DATES['philippine-compliance-hris-2026'].modified),
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
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/philippine-compliance-hris-2026#faq",
      "mainEntity": philippineComplianceFaqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
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
