import { Metadata } from 'next';
import LateRemittancePenaltiesArticle, { lateRemittanceFaqs } from "@/components/pages/(un-auth)/(landing-page)/blog/articles/LateRemittancePenaltiesArticle";
import PixelEvents from '@/components/PixelEvents';

const URL = 'https://yahshuahris.com/blog/sss-philhealth-pagibig-late-remittance-penalties';

export const metadata: Metadata = {
  title: 'SSS, PhilHealth, Pag-IBIG Late Remittance Penalties 2026',
  description: 'Late SSS costs 2% a month, PhilHealth at least 3% compounded, Pag-IBIG 0.1% a day. What 1 to 12 months late costs, criminal liability, and 2026 relief.',
  keywords: 'late remittance penalty Philippines, SSS late payment penalty, PhilHealth late payment interest, Pag-IBIG late remittance penalty, non-remittance of contributions, SSS condonation 2026, PhilHealth interest waiver 2026, delayed remittance SSS PhilHealth Pag-IBIG',
  openGraph: {
    title: 'SSS, PhilHealth, Pag-IBIG Late Remittance Penalties 2026',
    description: 'The penalty rate for each agency, a worked example of paying 1 to 12 months late, criminal and benefit liabilities, and the relief programs open in 2026.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-10-08T00:00:00.000Z',
    modifiedTime: '2026-10-08T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSS, PhilHealth, Pag-IBIG Late Remittance Penalties 2026',
    description: 'What late remittances really cost Philippine employers, with a worked example and 2026 relief programs.',
  },
  alternates: {
    canonical: URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${URL}#article`,
      "headline": "SSS, PhilHealth, and Pag-IBIG Late Remittance Penalties: What They Actually Cost You",
      "description": "Late SSS contributions cost 2% per month (RA 11199), late PhilHealth premiums at least 3% per month compounded (RA 11223), and late Pag-IBIG remittances one-tenth of 1% per day (HDMF Circular 275). A worked example of paying 1 to 12 months late, criminal and benefit liabilities, remittance deadlines, and the PhilHealth and SSS relief programs open in 2026.",
      "datePublished": "2026-10-08T00:00:00.000Z",
      "dateModified": "2026-10-08T00:00:00.000Z",
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
        "@id": URL
      },
      "keywords": "late remittance penalty, SSS penalty RA 11199, PhilHealth interest RA 11223, Pag-IBIG penalty RA 9679, CPCoDe MRP, PhilHealth Circular 2026-0001"
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": lateRemittanceFaqs.map((f) => ({
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
      "@id": `${URL}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yahshuahris.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://yahshuahris.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Late Remittance Penalties", "item": URL }
      ]
    }
  ]
};

const LateRemittancePenaltiesPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Late Remittance Penalties', content_category: 'blog' }} />
      <LateRemittancePenaltiesArticle />
    </>
  );
};

export default LateRemittancePenaltiesPage;
