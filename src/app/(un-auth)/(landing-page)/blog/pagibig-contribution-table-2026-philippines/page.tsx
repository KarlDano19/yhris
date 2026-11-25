import { Metadata } from 'next';
import PagibigContributionTable2026Article from "@/components/pages/(un-auth)/(landing-page)/blog/articles/PagibigContributionTable2026Article";
import PixelEvents from '@/components/PixelEvents';
import { BLOG_DATES, blogIso } from '@/lib/blogDates';
import { pagibigFaqs } from '@/lib/blogFaqs';
import { blogCoverImages, blogCoverTwitterImages, blogCoverUrl } from '@/lib/blogCovers';

export const metadata: Metadata = {
  title: 'Pag-IBIG Contribution Table 2026: 2% Rate, ₱200 Maximum',
  description: 'Pag-IBIG 2026: employee 2% and employer 2% on a ₱10,000 salary cap, so ₱200 each at most. Table by salary, formula and the new employer remittance schedule.',
  keywords: 'Pag-IBIG contribution table 2026, pagibig contribution table 2026, Pag-IBIG contribution 2026, Pag-IBIG employer share, Pag-IBIG maximum fund salary, Pag-IBIG remittance schedule 2026, HDMF Circular 460, HDMF Circular 499',
  openGraph: {
    images: blogCoverImages('pagibig-contribution-table-2026-philippines'),
    title: 'Pag-IBIG Contribution Table 2026: Rate, ₱10,000 Cap and Employer Share',
    description: '2% from the employee and 2% from the employer on a ₱10,000 cap. Contribution table by salary, how to compute it, and the employer remittance schedule that changed in August 2026.',
    type: 'article',
    locale: 'en_US',
    publishedTime: blogIso(BLOG_DATES['pagibig-contribution-table-2026-philippines'].published),
    modifiedTime: blogIso(BLOG_DATES['pagibig-contribution-table-2026-philippines'].modified),
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    images: blogCoverTwitterImages('pagibig-contribution-table-2026-philippines'),
    card: 'summary_large_image',
    title: 'Pag-IBIG Contribution Table 2026: 2% Rate, ₱200 Maximum',
    description: 'Pag-IBIG 2026: 2% employee, 2% employer, capped at a ₱10,000 salary base, so ₱200 each at most. Plus the new remittance schedule.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines#article",
      "headline": "Pag-IBIG Contribution Table 2026: Rate, ₱10,000 Cap and Employer Share",
      "description": "Pag-IBIG contribution table 2026: the employee pays 2% and the employer pays 2% of monthly compensation, on a salary base capped at ₱10,000, so the maximum is ₱200 each. Table by salary, the computation, and the employer remittance schedule under HDMF Circular No. 499.",
      "image": blogCoverUrl('pagibig-contribution-table-2026-philippines'),
      "datePublished": blogIso(BLOG_DATES['pagibig-contribution-table-2026-philippines'].published),
      "dateModified": blogIso(BLOG_DATES['pagibig-contribution-table-2026-philippines'].modified),
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
        "@id": "https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines"
      },
      "keywords": "Pag-IBIG contribution table 2026, pagibig contribution table 2026, Pag-IBIG contribution 2026, Pag-IBIG employer share, Pag-IBIG remittance schedule 2026"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines#faq",
      "mainEntity": pagibigFaqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Pag-IBIG Contribution Table 2026", "item": "https://yahshuahris.com/blog/pagibig-contribution-table-2026-philippines" }
      ]
    }
  ]
};

const PagibigContributionTable2026Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Pag-IBIG Contribution Table 2026', content_category: 'blog' }} />
      <PagibigContributionTable2026Article />
    </>
  );
};

export default PagibigContributionTable2026Page;
