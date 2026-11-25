// Single source of truth for blog post dates. Each post's page.tsx (Article schema and Open Graph)
// and src/app/sitemap.ts read from here, so the three cannot drift apart.
// When a post's content changes, update its `modified` date here and nowhere else.

export const BLOG_DATES = {
  'dole-compliance-requirements-philippines': { published: '2026-06-02', modified: '2026-10-15' },
  'philippine-holiday-pay-computation-guide': { published: '2026-06-10', modified: '2026-08-20' },
  '13th-month-pay-computation-philippines-2026': { published: '2026-09-25', modified: '2026-10-29' },
  'payroll-automation-philippines': { published: '2026-06-22', modified: '2026-06-22' },
  'philippine-compliance-hris-2026': { published: '2026-06-22', modified: '2026-06-22' },
  'philippine-payroll-errors-msme': { published: '2026-06-22', modified: '2026-06-22' },
  'sss-contribution-table-2026-philippines': { published: '2026-07-14', modified: '2026-11-25' },
  'payroll-registration-checklist-philippines': { published: '2026-07-15', modified: '2026-07-15' },
  'ai-guidance-vs-automation-hr-software': { published: '2026-07-16', modified: '2026-07-16' },
  'ncr-minimum-wage-2026': { published: '2026-07-21', modified: '2026-10-27' },
  'night-differential-holiday-pay-philippines': { published: '2026-08-20', modified: '2026-08-20' },
  'ai-workforce-management-philippines': { published: '2026-09-10', modified: '2026-09-10' },
  'sss-mandatory-provident-fund-philippines': { published: '2026-09-10', modified: '2026-09-10' },
  'final-pay-computation-philippines': { published: '2026-09-16', modified: '2026-09-16' },
  'bir-form-2316-philippines-2026': { published: '2026-11-25', modified: '2026-11-25' },
  'de-minimis-benefits-2026-philippines': { published: '2026-09-16', modified: '2026-09-16' },
  'year-end-tax-annualization-philippines-2026': { published: '2026-10-01', modified: '2026-10-01' },
  'sss-philhealth-pagibig-late-remittance-penalties': { published: '2026-10-08', modified: '2026-11-25' },
  'overtime-pay-computation-philippines': { published: '2026-10-08', modified: '2026-11-11' },
  'dole-osh-reports-deadlines-wair-aedr-amr': { published: '2026-10-15', modified: '2026-10-15' },
  'new-hire-onboarding-checklist-philippines': { published: '2026-11-04', modified: '2026-11-04' },
  'employee-offboarding-checklist-philippines': { published: '2026-11-04', modified: '2026-11-04' },
  'employee-201-file-philippines': { published: '2026-10-27', modified: '2026-10-27' },
  'employee-vs-independent-contractor-philippines': { published: '2026-10-27', modified: '2026-10-27' },
  'probationary-to-regular-employee-philippines': { published: '2026-10-23', modified: '2026-10-23' },
  'retirement-pay-law-ra-7641-philippines': { published: '2026-10-23', modified: '2026-10-23' },
  'hris-pricing-philippines-2026': { published: '2026-10-15', modified: '2026-11-25' },
  'q4-payroll-compliance-deadlines-philippines-2026': { published: '2026-10-01', modified: '2026-11-18' },
  'minimum-wage-philippines-2026-by-region': { published: '2026-09-25', modified: '2026-10-27' },
  'philhealth-contribution-table-2026-philippines': { published: '2026-11-18', modified: '2026-11-25' },
  'bir-form-1604-c-alphalist-2026-philippines': { published: '2026-11-18', modified: '2026-11-18' },
  'pagibig-contribution-table-2026-philippines': { published: '2026-11-25', modified: '2026-11-25' },
} as const;

export type BlogSlug = keyof typeof BLOG_DATES;

export const blogIso = (date: string) => `${date}T00:00:00.000Z`;

// Newest `modified` date across all posts; used for the /blog index in the sitemap.
export const LATEST_BLOG_MODIFIED: string = Object.values(BLOG_DATES)
  .map((d) => d.modified)
  .sort()
  .slice(-1)[0];
