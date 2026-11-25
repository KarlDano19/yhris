import { MetadataRoute } from 'next'

import { BLOG_DATES, LATEST_BLOG_MODIFIED } from '@/lib/blogDates';

const BASE_URL = 'https://yahshuahris.com'

// Dates reflect actual content state, not build time.
// Update these when content changes significantly.
const DATES = {
  homepage:    '2026-07-21', // Updated when homepage content or schema changes
  redesign:    '2026-06-02', // Light theme redesign shipped
  pricing:     '2026-11-11', // Prices verified November 2026
  legal:       '2026-03-01', // Terms and privacy last updated
  stable:      '2026-01-01', // Stable pages with infrequent content changes
  calculator:  '2026-06-20', // HR cost calculator launched
  competitors: '2026-09-24', // Competitor claims re-verified; JuanHR pages retired
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core conversion pages ────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: new Date(DATES.homepage),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(DATES.pricing),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // ── Product pages ─────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/yahshua-payroll`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/payroll-integration`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ── Comparison / competitor pages (highest AEO citation value) ────────
    {
      url: `${BASE_URL}/vs-sprout`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/vs-greatday`,
      lastModified: new Date(DATES.competitors),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sprout-alternative`,
      lastModified: new Date(DATES.competitors),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/greatday-hr-alternative`,
      lastModified: new Date(DATES.competitors),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/how-we-compare`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ── Use case pages ────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/use-cases`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/use-cases/employee-onboarding`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/use-cases/performance-management`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/use-cases/employee-documentation`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Blog ──────────────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(LATEST_BLOG_MODIFIED),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/philhealth-contribution-table-2026-philippines`,
      lastModified: new Date(BLOG_DATES['philhealth-contribution-table-2026-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/bir-form-1604-c-alphalist-2026-philippines`,
      lastModified: new Date(BLOG_DATES['bir-form-1604-c-alphalist-2026-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/pagibig-contribution-table-2026-philippines`,
      lastModified: new Date(BLOG_DATES['pagibig-contribution-table-2026-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/bir-form-2316-philippines-2026`,
      lastModified: new Date(BLOG_DATES['bir-form-2316-philippines-2026'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/dole-compliance-requirements-philippines`,
      lastModified: new Date(BLOG_DATES['dole-compliance-requirements-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/philippine-holiday-pay-computation-guide`,
      lastModified: new Date(BLOG_DATES['philippine-holiday-pay-computation-guide'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/13th-month-pay-computation-philippines-2026`,
      lastModified: new Date(BLOG_DATES['13th-month-pay-computation-philippines-2026'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/payroll-automation-philippines`,
      lastModified: new Date(BLOG_DATES['payroll-automation-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/philippine-compliance-hris-2026`,
      lastModified: new Date(BLOG_DATES['philippine-compliance-hris-2026'].modified),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/philippine-payroll-errors-msme`,
      lastModified: new Date(BLOG_DATES['philippine-payroll-errors-msme'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/sss-contribution-table-2026-philippines`,
      lastModified: new Date(BLOG_DATES['sss-contribution-table-2026-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/payroll-registration-checklist-philippines`,
      lastModified: new Date(BLOG_DATES['payroll-registration-checklist-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/ai-guidance-vs-automation-hr-software`,
      lastModified: new Date(BLOG_DATES['ai-guidance-vs-automation-hr-software'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/ncr-minimum-wage-2026`,
      lastModified: new Date(BLOG_DATES['ncr-minimum-wage-2026'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/night-differential-holiday-pay-philippines`,
      lastModified: new Date(BLOG_DATES['night-differential-holiday-pay-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/ai-workforce-management-philippines`,
      lastModified: new Date(BLOG_DATES['ai-workforce-management-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/sss-mandatory-provident-fund-philippines`,
      lastModified: new Date(BLOG_DATES['sss-mandatory-provident-fund-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/final-pay-computation-philippines`,
      lastModified: new Date(BLOG_DATES['final-pay-computation-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/de-minimis-benefits-2026-philippines`,
      lastModified: new Date(BLOG_DATES['de-minimis-benefits-2026-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/year-end-tax-annualization-philippines-2026`,
      lastModified: new Date(BLOG_DATES['year-end-tax-annualization-philippines-2026'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/sss-philhealth-pagibig-late-remittance-penalties`,
      lastModified: new Date(BLOG_DATES['sss-philhealth-pagibig-late-remittance-penalties'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/overtime-pay-computation-philippines`,
      lastModified: new Date(BLOG_DATES['overtime-pay-computation-philippines'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/dole-osh-reports-deadlines-wair-aedr-amr`,
      lastModified: new Date(BLOG_DATES['dole-osh-reports-deadlines-wair-aedr-amr'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/new-hire-onboarding-checklist-philippines`,
      lastModified: new Date(BLOG_DATES['new-hire-onboarding-checklist-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/employee-offboarding-checklist-philippines`,
      lastModified: new Date(BLOG_DATES['employee-offboarding-checklist-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/employee-201-file-philippines`,
      lastModified: new Date(BLOG_DATES['employee-201-file-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/employee-vs-independent-contractor-philippines`,
      lastModified: new Date(BLOG_DATES['employee-vs-independent-contractor-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/probationary-to-regular-employee-philippines`,
      lastModified: new Date(BLOG_DATES['probationary-to-regular-employee-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/retirement-pay-law-ra-7641-philippines`,
      lastModified: new Date(BLOG_DATES['retirement-pay-law-ra-7641-philippines'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/hris-pricing-philippines-2026`,
      lastModified: new Date(BLOG_DATES['hris-pricing-philippines-2026'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/q4-payroll-compliance-deadlines-philippines-2026`,
      lastModified: new Date(BLOG_DATES['q4-payroll-compliance-deadlines-philippines-2026'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/minimum-wage-philippines-2026-by-region`,
      lastModified: new Date(BLOG_DATES['minimum-wage-philippines-2026-by-region'].modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ── Tools ─────────────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/hr-cost-calculator`,
      lastModified: new Date(DATES.calculator),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Support / docs ────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/faqs`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // ── Jobs board (public) ───────────────────────────────────────────────
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(DATES.stable),
      changeFrequency: 'daily',
      priority: 0.6,
    },

    // ── Legal ─────────────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/privacy-notice`,
      lastModified: new Date(DATES.legal),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(DATES.legal),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(DATES.legal),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
