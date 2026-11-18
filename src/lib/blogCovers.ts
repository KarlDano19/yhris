// Cover image for each blog post. Used for the Open Graph and Twitter share image and for the Article schema image,
// so the share card, the schema and the post agree. Files live in public/blog and are 1200x628.
// (The blog index list in LpBlogContent.tsx has its own copy of these paths; keep them in step.)

export const BLOG_COVERS = {
  'dole-compliance-requirements-philippines': { path: '/blog/dole-compliance-2026.png', width: 1200, height: 628 },
  'philippine-holiday-pay-computation-guide': { path: '/blog/philippine-holiday-pay.png', width: 1200, height: 628 },
  '13th-month-pay-computation-philippines-2026': { path: '/blog/start-tracking-13th-month.png', width: 1200, height: 628 },
  'payroll-automation-philippines': { path: '/blog/payroll-message.png', width: 1200, height: 628 },
  'philippine-compliance-hris-2026': { path: '/blog/why-one-system.png', width: 1200, height: 628 },
  'philippine-payroll-errors-msme': { path: '/blog/payroll-errors-msme.png', width: 1200, height: 628 },
  'sss-contribution-table-2026-philippines': { path: '/blog/sss-contribution-2026.png', width: 1200, height: 628 },
  'payroll-registration-checklist-philippines': { path: '/blog/payroll-registration-checklist.png', width: 1200, height: 628 },
  'ai-guidance-vs-automation-hr-software': { path: '/blog/ai-guidance-vs-automation.png', width: 1200, height: 628 },
  'ncr-minimum-wage-2026': { path: '/blog/ncr-minimum-wage-2026.png', width: 1200, height: 628 },
  'night-differential-holiday-pay-philippines': { path: '/blog/night-differential-holiday-stacking.png', width: 1200, height: 628 },
  'ai-workforce-management-philippines': { path: '/blog/ai-workforce-management.png', width: 1200, height: 628 },
  'sss-mandatory-provident-fund-philippines': { path: '/blog/sss-mandatory-provident-fund.png', width: 1200, height: 628 },
  'final-pay-computation-philippines': { path: '/blog/final-pay-computation.png', width: 1200, height: 628 },
  'de-minimis-benefits-2026-philippines': { path: '/blog/de-minimis-benefits-2026.png', width: 1200, height: 628 },
  'year-end-tax-annualization-philippines-2026': { path: '/blog/year-end-tax-annualization-2026.png', width: 1200, height: 628 },
  'sss-philhealth-pagibig-late-remittance-penalties': { path: '/blog/late-remittance-penalties-2026.png', width: 1200, height: 628 },
  'overtime-pay-computation-philippines': { path: '/blog/overtime-pay-computation-2026.png', width: 1200, height: 628 },
  'dole-osh-reports-deadlines-wair-aedr-amr': { path: '/blog/dole-safety-report-deadlines-2026.png', width: 1200, height: 628 },
  'new-hire-onboarding-checklist-philippines': { path: '/blog/new-hire-onboarding-checklist-philippines.png', width: 1200, height: 628 },
  'employee-offboarding-checklist-philippines': { path: '/blog/employee-offboarding-checklist-philippines.png', width: 1200, height: 628 },
  'employee-201-file-philippines': { path: '/blog/employee-201-file-philippines.png', width: 1200, height: 628 },
  'employee-vs-independent-contractor-philippines': { path: '/blog/employee-vs-independent-contractor-philippines.png', width: 1200, height: 628 },
  'probationary-to-regular-employee-philippines': { path: '/blog/probationary-to-regular-employee-philippines.png', width: 1200, height: 628 },
  'retirement-pay-law-ra-7641-philippines': { path: '/blog/retirement-pay-law-ra-7641-philippines.png', width: 1200, height: 628 },
  'hris-pricing-philippines-2026': { path: '/blog/hris-pricing-philippines-2026.png', width: 1200, height: 628 },
  'q4-payroll-compliance-deadlines-philippines-2026': { path: '/blog/q4-payroll-compliance-countdown-2026.png', width: 1200, height: 628 },
  'minimum-wage-philippines-2026-by-region': { path: '/blog/minimum-wage-by-region-2026.png', width: 1200, height: 628 },
  'philhealth-contribution-table-2026-philippines': { path: '/blog/philhealth-contribution-table-2026-philippines.png', width: 1200, height: 628 },
  'bir-form-1604-c-alphalist-2026-philippines': { path: '/blog/bir-form-1604-c-alphalist-2026-philippines.png', width: 1200, height: 628 },
} as const;

export type BlogCoverSlug = keyof typeof BLOG_COVERS;

export const blogCoverImages = (slug: BlogCoverSlug) => [
  { url: BLOG_COVERS[slug].path, width: BLOG_COVERS[slug].width, height: BLOG_COVERS[slug].height },
];

export const blogCoverTwitterImages = (slug: BlogCoverSlug) => [{ url: BLOG_COVERS[slug].path }];

export const blogCoverUrl = (slug: BlogCoverSlug) => `https://yahshuahris.com${BLOG_COVERS[slug].path}`;
