/**
 * Single source of truth for competitor facts used across the vs-* and
 * *-alternative comparison pages. Feature comparison rows and pricing
 * models live here once; each page still writes its own prose (value
 * props, fit-check bullets, migration copy) so pages stay genuinely
 * distinct rather than templated. See the competitor-alternatives skill's
 * "Content Architecture" guidance for why: one source of truth per
 * competitor for facts, not for paragraphs.
 */

export type ComparisonRow = {
  feature: string;
  yahshua: boolean;
  competitor: boolean;
};

export type CompetitorProfile = {
  slug: string;
  name: string;
  lastReviewed: string;
  pricingModel: string;
  comparisonRows: ComparisonRow[];
  /** Genuine competitor strengths — used in "who should stay" sections. Keep honest. */
  strengths: string[];
};

export const COMPETITORS = {
  sprout: {
    slug: "sprout",
    name: "Sprout HR",
    lastReviewed: "June 2026",
    pricingModel: "Per-seat pricing, roughly PHP 200 to 300 per employee per month at mid-tier",
    comparisonRows: [
      { feature: "Multi-platform job posting", yahshua: true, competitor: false },
      { feature: "Pre-screened talent pool", yahshua: true, competitor: false },
      { feature: "DOLE compliance automation", yahshua: true, competitor: false },
      { feature: "Philippine labor law compliance", yahshua: true, competitor: true },
      { feature: "Complete hiring-to-offboarding", yahshua: true, competitor: false },
      { feature: "Custom performance evaluation forms", yahshua: true, competitor: true },
      { feature: "Employee self-service portal", yahshua: true, competitor: true },
      { feature: "Payroll integration", yahshua: true, competitor: true },
      { feature: "Flat pricing for up to 100 employees", yahshua: true, competitor: false },
      { feature: "SME-focused pricing", yahshua: true, competitor: false },
      { feature: "Philippine-specific features", yahshua: true, competitor: false },
      { feature: "No per-seat pricing", yahshua: true, competitor: false },
    ],
    strengths: [
      "Native earned wage access through ReadyCash and ReadyWage",
      "Deep enterprise module suite for large Philippine companies already invested in it",
    ],
  },
  greatday: {
    slug: "greatday",
    name: "GreatDay HR",
    lastReviewed: "August 2026",
    pricingModel: "Per-employee pricing from PHP 77/employee/month, 50-employee license minimum",
    comparisonRows: [
      { feature: "Multi-platform job posting included", yahshua: true, competitor: false },
      { feature: "Performance evaluation module included", yahshua: true, competitor: false },
      { feature: "Guided DOLE reporting (OSH, AERW, registration)", yahshua: true, competitor: false },
      { feature: "Flat pricing with an employee-count cap", yahshua: true, competitor: false },
      { feature: "No minimum license purchase", yahshua: true, competitor: false },
      { feature: "BIR, SSS, PhilHealth, Pag-IBIG payroll compliance", yahshua: true, competitor: true },
      { feature: "Employee self-service portal", yahshua: true, competitor: true },
      { feature: "Philippine-localized platform", yahshua: true, competitor: true },
      { feature: "Mobile GPS and selfie attendance", yahshua: false, competitor: true },
      { feature: "Facial recognition biometric attendance", yahshua: false, competitor: true },
    ],
    strengths: [
      "Mobile GPS and selfie-verified attendance built for field teams",
      "Facial recognition biometric attendance, available as a paid add-on",
    ],
  },
  juanhr: {
    slug: "juanhr",
    name: "JuanHR",
    lastReviewed: "August 2026",
    pricingModel: "Custom, quote-based pricing, not published",
    comparisonRows: [
      { feature: "Multi-platform job posting and ATS", yahshua: true, competitor: false },
      { feature: "Performance evaluation module", yahshua: true, competitor: false },
      { feature: "Published, flat monthly pricing", yahshua: true, competitor: false },
      { feature: "Guided DOLE reporting (OSH, AERW, registration)", yahshua: true, competitor: false },
      { feature: "BIR, SSS, PhilHealth, Pag-IBIG payroll compliance", yahshua: true, competitor: true },
      { feature: "Philippine-built and supported", yahshua: true, competitor: true },
      { feature: "Biometric device integration (fingerprint, facial, palm)", yahshua: false, competitor: true },
      { feature: "Geo-fenced field work attendance tracking", yahshua: false, competitor: true },
      { feature: "Government agency HRMIS edition", yahshua: false, competitor: true },
    ],
    strengths: [
      "Biometric device integration across fingerprint, facial, and palm scanners",
      "Geo-fenced field work and site location attendance tracking",
      "A dedicated HRMIS edition built for government agencies",
    ],
  },
} as const satisfies Record<string, CompetitorProfile>;

export type CompetitorSlug = keyof typeof COMPETITORS;
