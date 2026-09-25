import { Metadata } from 'next';
import NcrMinimumWage2026Article from "@/components/pages/(un-auth)/(landing-page)/blog/articles/NcrMinimumWage2026Article";

export const metadata: Metadata = {
  title: 'Metro Manila Minimum Wage 2026: ₱755/Day From Sept 26',
  description: '₱755/day from Sept 26, 2026 under Wage Order NCR-28 (₱718 small retail, agriculture), same in Manila, Quezon City, Makati. Why NCR-27 never took effect.',
  keywords: 'Manila minimum wage 2026, Quezon City minimum wage 2026, Makati minimum wage 2026, NCR minimum wage 2026, Wage Order NCR-28, Wage Order NCR-27, Metro Manila minimum wage, minimum wage Philippines 2026',
  openGraph: {
    title: 'Metro Manila Minimum Wage 2026: ₱755/Day From Sept 26',
    description: 'Wage Order No. NCR-28 raises the NCR minimum wage to ₱755/day (non-agriculture) and ₱718/day (lower category) from September 26, 2026, in a single tranche. NCR-27 never took effect due to court injunctions.',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2026-07-21T00:00:00.000Z',
    modifiedTime: '2026-09-25T00:00:00.000Z',
    authors: ['YAHSHUA HRIS Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metro Manila Minimum Wage 2026: ₱755/Day From Sept 26',
    description: 'NCR minimum wage is ₱755/day (non-agriculture) from September 26, 2026 under Wage Order NCR-28. What happened to NCR-27, and the employer payroll checklist.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog/ncr-minimum-wage-2026',
  },
};

// Keep these in sync with the visible FAQ in NcrMinimumWage2026Article.tsx
const faqs = [
  {
    q: "What is the NCR minimum wage in 2026?",
    a: "From September 26, 2026, the NCR minimum wage is ₱755 per day for non-agriculture workers and ₱718 per day for agriculture, service and retail establishments with 15 or fewer workers, and manufacturing establishments with fewer than 10 regular workers, under Wage Order No. NCR-28. Before September 26, the NCR-26 rates of ₱695 and ₱658 applied.",
  },
  {
    q: "Is the minimum wage the same in Manila, Quezon City, and Makati?",
    a: "Yes. One wage order, Wage Order No. NCR-28, sets the minimum wage for all 17 local government units in Metro Manila: Caloocan, Las Piñas, Makati, Malabon, Mandaluyong, Manila, Marikina, Muntinlupa, Navotas, Parañaque, Pasay, Pasig, Quezon City, San Juan, Taguig, Valenzuela, and the municipality of Pateros. Non-agriculture workers earn ₱755 per day from September 26, 2026 in every one of them. The rate follows where the employee works, not where they live: a worker who lives in Bulacan but reports to an office in Makati is covered by the NCR rate.",
  },
  {
    q: "What happened to Wage Order NCR-27 and the ₱85 increase?",
    a: "NCR-27, issued June 23, 2026, granted ₱85 in two tranches but never took effect. The Pasig Regional Trial Court issued a status quo ante order on July 24, 2026, followed by a temporary restraining order and a writ of preliminary injunction, in cases filed by employers. Labor groups have asked the Supreme Court to set those orders aside. The wage board then issued NCR-28, a separate single ₱60 increase effective September 26, 2026, without prejudice to the pending case.",
  },
  {
    q: "Will the NCR minimum wage go up by ₱25 in January 2027?",
    a: "Not under NCR-28, which is a single tranche. The ₱25 January 2027 increase was part of NCR-27, and whether it is ever implemented depends on the outcome of the court cases. As of September 25, 2026, no further NCR increase is scheduled.",
  },
  {
    q: "Do employers owe back pay for July 25 to September 25, 2026?",
    a: "As of September 25, 2026, no DOLE directive requires retroactive payment for that period, because NCR-27 was restrained before it took effect. That could change depending on how the courts rule on NCR-27, so keep accurate payroll records for the period.",
  },
  {
    q: "Does the NCR minimum wage increase apply to all workers?",
    a: "Wage Order No. NCR-28 applies to private-sector workers in the National Capital Region. Kasambahay (household helpers) are covered by a separate instrument: Wage Order No. NCR-DW-06, which set the monthly minimum wage for domestic workers in NCR at ₱7,800, effective February 7, 2026. Government employees are not covered by regional wage orders.",
  },
  {
    q: "Does a minimum wage increase affect overtime and holiday pay?",
    a: "Yes. Overtime pay, holiday pay, and night differential are computed from the daily rate, so their peso amounts rise for workers at or near the minimum. Ordinary-day overtime is 125% of the hourly rate, a worked regular holiday is 200% of the daily rate, and work on a rest day is 130%. Recompute these using the updated daily rate from September 26, 2026.",
  },
  {
    q: "What happens if an employer does not comply with the NCR minimum wage order?",
    a: "Non-compliance with a wage order is a violation of the Wage Rationalization Act (RA 6727). DOLE labor inspectors can issue compliance orders requiring employers to pay the wage differential from the effective date. Continued non-compliance can result in penalties under RA 8188, which amended RA 6727: fines of ₱25,000 to ₱100,000, imprisonment of two to four years, or both, plus double indemnity on the unpaid wage increase. Responsible officers of the employing company can be held personally liable.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://yahshuahris.com/blog/ncr-minimum-wage-2026#article",
      "headline": "NCR Minimum Wage 2026: ₱755/Day Under Wage Order NCR-28, Effective September 26",
      "description": "Wage Order No. NCR-28 raises the Metro Manila minimum wage to ₱755 per day for non-agriculture workers and ₱718 for the lower category from September 26, 2026, in a single tranche. The earlier ₱85 order, NCR-27, never took effect because of court injunctions. Rate table, timeline, who is covered, and the employer payroll checklist.",
      "image": "https://yahshuahris.com/blog/ncr-minimum-wage-2026.png",
      "datePublished": "2026-07-21T00:00:00.000Z",
      "dateModified": "2026-09-25T00:00:00.000Z",
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
        "@id": "https://yahshuahris.com/blog/ncr-minimum-wage-2026"
      },
      "keywords": "NCR minimum wage 2026, Wage Order NCR-28, Wage Order NCR-27, Metro Manila minimum wage September 2026, minimum wage Philippines 2026, RTWPB-NCR wage order"
    },
    {
      "@type": "FAQPage",
      "@id": "https://yahshuahris.com/blog/ncr-minimum-wage-2026#faq",
      "mainEntity": faqs.map((f) => ({
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
      "@id": "https://yahshuahris.com/blog/ncr-minimum-wage-2026#breadcrumb",
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
          "name": "NCR Minimum Wage 2026: Wage Order NCR-28",
          "item": "https://yahshuahris.com/blog/ncr-minimum-wage-2026"
        }
      ]
    }
  ]
};

const NcrMinimumWage2026Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NcrMinimumWage2026Article />
    </>
  );
};

export default NcrMinimumWage2026Page;
