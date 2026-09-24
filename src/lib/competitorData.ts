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
    lastReviewed: "September 2026",
    pricingModel: "Custom, quote-based pricing, not published (as of Sept 2026). Only outsourced Payroll Starter bundles list prices.",
    comparisonRows: [
      { feature: "Multi-platform job posting", yahshua: true, competitor: true },
      { feature: "DOLE compliance tools", yahshua: true, competitor: true },
      { feature: "Philippine labor law compliance", yahshua: true, competitor: true },
      { feature: "Complete hiring-to-offboarding", yahshua: true, competitor: true },
      { feature: "Custom performance evaluation forms", yahshua: true, competitor: true },
      { feature: "Employee self-service portal", yahshua: true, competitor: true },
      { feature: "Payroll integration", yahshua: true, competitor: true },
      { feature: "Philippine-specific features", yahshua: true, competitor: true },
      { feature: "Publicly listed pricing", yahshua: true, competitor: false },
      { feature: "Flat pricing for up to 100 employees", yahshua: true, competitor: false },
      { feature: "DOLE, hiring, and payroll in one published plan price", yahshua: true, competitor: false },
    ],
    strengths: [
      "Native earned wage access through ReadyCash and ReadyWage",
      "Deep enterprise module suite for large Philippine companies already invested in it",
    ],
  },
  greatday: {
    slug: "greatday",
    name: "GreatDay HR",
    lastReviewed: "September 2026",
    pricingModel: "PHP 77/employee/month; Basic Starter Package sold as a 50-license bundle (about PHP 3,850/month) as of Sept 2026. GreatDay notes prices are changing.",
    comparisonRows: [
      { feature: "Multi-platform job posting included", yahshua: true, competitor: false },
      { feature: "Performance evaluation module included", yahshua: true, competitor: false },
      { feature: "Guided DOLE reporting (OSH, AERW, registration)", yahshua: true, competitor: false },
      { feature: "Flat pricing with an employee-count cap", yahshua: true, competitor: false },
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
} as const satisfies Record<string, CompetitorProfile>;

export type CompetitorSlug = keyof typeof COMPETITORS;
