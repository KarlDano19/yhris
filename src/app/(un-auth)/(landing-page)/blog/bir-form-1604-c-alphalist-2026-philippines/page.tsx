import { Metadata } from 'next';
import Bir1604CAlphalistArticle from "@/components/pages/(un-auth)/(landing-page)/blog/articles/Bir1604CAlphalistArticle";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { bir1604cFaqs } from '@/lib/blogFaqs';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

export const metadata: Metadata = {
  title: 'BIR Form 1604-C and Alphalist: January 2027 Filing Guide',
  description: 'BIR Form 1604-C and the alphalist of employees are due January 31, 2027, a Sunday. What goes in, how to submit, the ₱1,000 penalty, and a checklist.',
  keywords: 'BIR 1604-C alphalist, BIR Form 1604-C 2026, alphalist of employees, 1604-C deadline January 31 2027, BIR alphalist submission, Section 250 penalty, BIR Form 2316',
  openGraph: {
    images: blogCoverImages('bir-form-1604-c-alphalist-2026-philippines'),
    title: 'BIR Form 1604-C and the Alphalist: Your January 2027 Filing Checklist',
    description: 'The 1604-C and alphalist for 2026 are due January 31, 2027, a Sunday. What goes in the alphalist, how to submit it, the penalty, and a year-end checklist.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['bir-form-1604-c-alphalist-2026-philippines'].published),
    modifiedTime: blogIso(BLOG_DATES['bir-form-1604-c-alphalist-2026-philippines'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('bir-form-1604-c-alphalist-2026-philippines'),
    card: 'summary_large_image',
    title: 'BIR Form 1604-C and Alphalist: January 2027 Filing Guide',
    description: 'BIR 1604-C and alphalist due January 31, 2027 (a Sunday). Contents, submission methods, penalty and checklist.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines#article",
      "headline": "BIR Form 1604-C and the Alphalist: Your January 2027 Filing Checklist",
      "description": "BIR Form 1604-C and the alphalist of employees for compensation paid in 2026 are due on or before January 31, 2027, a Sunday. What the alphalist contains, how to submit it, the Section 250 penalty, and a year-end checklist for employers.",
      "image": blogCoverUrl('bir-form-1604-c-alphalist-2026-philippines'),
      "datePublished": blogIso(BLOG_DATES['bir-form-1604-c-alphalist-2026-philippines'].published),
      "dateModified": blogIso(BLOG_DATES['bir-form-1604-c-alphalist-2026-philippines'].modified),
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
        "@id": "https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines"
      },
      "keywords": "BIR 1604-C alphalist, BIR Form 1604-C 2026, alphalist of employees, 1604-C deadline January 31 2027, BIR alphalist submission, Section 250 penalty, BIR Form 2316"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines#faq",
      "mainEntity": bir1604cFaqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "BIR Form 1604-C and Alphalist", "item": "https://yahshuahris.com/blog/bir-form-1604-c-alphalist-2026-philippines" }
      ]
    }
  ]
};

const Bir1604CAlphalistPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'BIR Form 1604-C and Alphalist', content_category: 'blog' }} />
      <Bir1604CAlphalistArticle />
    </>
  );
};

export default Bir1604CAlphalistPage;
