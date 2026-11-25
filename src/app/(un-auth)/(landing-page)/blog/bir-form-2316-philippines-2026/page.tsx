import { Metadata } from 'next';
import Bir2316Article from "@/components/pages/(un-auth)/(landing-page)/blog/articles/Bir2316Article";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { bir2316Faqs } from '@/lib/blogFaqs';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

export const metadata: Metadata = {
  title: 'BIR Form 2316 2026: Deadlines, Substituted Filing, Penalties',
  description: 'Give BIR Form 2316 to employees by January 31, 2027 (a Sunday) and file the BIR copy by February 28. Substituted filing, Annex F and the ₱1,000 penalty.',
  keywords: 'BIR Form 2316, BIR 2316 deadline 2027, certificate of compensation payment tax withheld, substituted filing, Annex F BIR, BIR 2316 submission, Section 250 penalty, 2316 employer guide Philippines',
  openGraph: {
    images: blogCoverImages('bir-form-2316-philippines-2026'),
    title: 'BIR Form 2316 for 2026: What Employers Must Issue and File by January 31, 2027',
    description: 'BIR Form 2316 goes to employees by January 31, 2027 and to the BIR by February 28. Who qualifies for substituted filing, how to submit, and the penalty.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['bir-form-2316-philippines-2026'].published),
    modifiedTime: blogIso(BLOG_DATES['bir-form-2316-philippines-2026'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('bir-form-2316-philippines-2026'),
    card: 'summary_large_image',
    title: 'BIR Form 2316 2026: Deadlines, Substituted Filing, Penalties',
    description: 'Employee copy by January 31, 2027, BIR copy by February 28. Substituted filing, submission steps and the Section 250 penalty.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/bir-form-2316-philippines-2026',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/bir-form-2316-philippines-2026#article",
      "headline": "BIR Form 2316 for 2026: What Employers Must Issue and File by January 31, 2027",
      "description": "BIR Form 2316 for compensation paid in 2026 goes to employees on or before January 31, 2027, a Sunday, and the BIR copy is due February 28, 2027. Substituted filing conditions, how to submit, the Section 250 penalty, and an employer checklist.",
      "image": blogCoverUrl('bir-form-2316-philippines-2026'),
      "datePublished": blogIso(BLOG_DATES['bir-form-2316-philippines-2026'].published),
      "dateModified": blogIso(BLOG_DATES['bir-form-2316-philippines-2026'].modified),
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
        "@id": "https://yahshuahris.com/blog/bir-form-2316-philippines-2026"
      },
      "keywords": "BIR Form 2316, BIR 2316 deadline 2027, certificate of compensation payment tax withheld, substituted filing, Annex F BIR, BIR 2316 submission, Section 250 penalty"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/bir-form-2316-philippines-2026#faq",
      "mainEntity": bir2316Faqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/bir-form-2316-philippines-2026#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "BIR Form 2316", "item": "https://yahshuahris.com/blog/bir-form-2316-philippines-2026" }
      ]
    }
  ]
};

const Bir2316Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'BIR Form 2316 2026', content_category: 'blog' }} />
      <Bir2316Article />
    </>
  );
};

export default Bir2316Page;
