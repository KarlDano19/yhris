import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import Content from '@/components/pages/(un-auth)/(landing-page)/pricing/LpPricingContent';
import PixelEvents from '@/components/PixelEvents';

import { SessionData, sessionOptions } from '@/lib/session';
import { YAHSHUA_PRICING, PRICING_LABELS } from '@/lib/yahshuaPricing';

export const metadata = {
  title: 'YAHSHUA HRIS Pricing — HR & Payroll Plans for Philippines',
  description: 'Simple, transparent pricing for YAHSHUA HRIS. Get payroll automation, employee management, DOLE compliance, and more. Plans designed for small and growing businesses in the Philippines.',
  openGraph: {
    title: 'YAHSHUA HRIS Pricing - Affordable HR & Payroll Plans',
    description: 'Simple, transparent pricing for YAHSHUA HRIS. Payroll automation, employee management, and DOLE compliance. Plans for every business size.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Pricing - Affordable HR & Payroll Plans',
    description: 'Transparent pricing for payroll automation, employee management, and DOLE compliance in the Philippines.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/pricing'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://yahshuahris.com/#software",
      "name": "YAHSHUA HRIS",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Human Resource Management",
      "operatingSystem": "Web",
      "url": "https://yahshuahris.com",
      "description": `All-in-one HR management system for Philippine businesses. Flat pricing starting at ${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees. Includes DOLE compliance automation, 201 document management, attendance, leave, performance evaluation, and real-time payroll sync.`,
      "offers": {
        "@type": "Offer",
        "price": String(YAHSHUA_PRICING.basePrice),
        "priceCurrency": YAHSHUA_PRICING.currency,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": String(YAHSHUA_PRICING.basePrice),
          "priceCurrency": YAHSHUA_PRICING.currency,
          "unitText": "month"
        },
        "description": `${PRICING_LABELS.base}/month for up to ${YAHSHUA_PRICING.employeeCap} employees, plus a one-time ${PRICING_LABELS.setup} setup fee. No per-seat fees, no long-term contracts.`,
        "url": "https://yahshuahris.com/pricing"
      },
      "publisher": {
        "@id": "https://yahshuahris.com/#organization"
      }
    }
  ]
};

async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions);
  return session;
}

const PlanPage = async () => {
  const session = await getSession();
  const isLoggedIn = session.isLoggedIn;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PixelEvents viewContent={{ content_name: 'Pricing', content_category: 'pricing' }} />
      <Content isLoggedIn={isLoggedIn} />
    </>
  );
};

export default PlanPage;
