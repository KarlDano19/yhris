import { MetadataRoute } from 'next'

const BASE_URL = 'https://yahshuahris.com'

// Dates reflect actual content state, not build time.
// Update these when content changes significantly.
const DATES = {
  redesign:    '2026-06-02', // Light theme redesign shipped
  doleArticle: '2026-06-02', // Last reviewed June 2026
  pricing:     '2026-06-02', // Prices verified June 2026
  legal:       '2026-03-01', // Terms and privacy last updated
  stable:      '2026-01-01', // Stable pages with infrequent content changes
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core conversion pages ────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: new Date(DATES.redesign),
      changeFrequency: 'weekly',
      priority: 1.0,
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
      lastModified: new Date(DATES.doleArticle),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/dole-compliance-requirements-philippines`,
      lastModified: new Date(DATES.doleArticle),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/philippine-holiday-pay-computation-guide`,
      lastModified: new Date('2026-06-10'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/thirteenth-month-pay-tracking-philippines`,
      lastModified: new Date('2026-06-10'),
      changeFrequency: 'monthly',
      priority: 0.85,
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
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(DATES.legal),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
