# AEO & GEO Strategy — YAHSHUA HRIS
*Answer Engine Optimization + Generative Engine Optimization*
*Created: 2026-06-02*

Goal: Get cited by ChatGPT, Perplexity, Google AI Overviews, Gemini, and Copilot when Philippine businesses search for HRIS, DOLE compliance, payroll, and HR software.

---

## Priority 1: Quick Wins

- [x] Add explicit AI bot permissions to `public/robots.txt` (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)
- [x] Create `public/llms.txt` — machine-readable context file for AI systems
- [x] Create `public/pricing.md` — flat pricing file AI agents can parse without rendering JS
- [x] Add `"Last Updated"` date visibly on all blog articles and key pages
- [x] Rebuild `sitemap.ts` with all 20 public pages, real dates, correct priorities
- [ ] Submit sitemap to Google Search Console at https://search.google.com/search-console (manual step)

---

## Priority 2: Schema Markup

Add JSON-LD `<script type="application/ld+json">` in `<head>` for each page via Next.js metadata or a shared SchemaScript component.

### Homepage
- [ ] `Organization` schema — name, url, logo, address, contactPoint, foundingDate, sameAs
- [ ] `SoftwareApplication` schema — name, description, offers (PHP 4,000/month), operatingSystem

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "YAHSHUA Outsourcing Worldwide, Inc.",
      "alternateName": "YOWI",
      "url": "https://yahshuahris.com",
      "logo": "https://yahshuahris.com/logo.png",
      "foundingDate": "2007",
      "description": "Philippine HR management system with DOLE compliance, payroll integration, and flat SME-friendly pricing.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit #12 2F E-Max Building, Masterson Avenue, Upper Balulang",
        "addressLocality": "Cagayan de Oro City",
        "addressRegion": "Northern Mindanao",
        "postalCode": "9000",
        "addressCountry": "PH"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+63-917-306-2539",
        "contactType": "sales"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "YAHSHUA HRIS",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "description": "Philippine HRIS with DOLE compliance automation, multi-platform recruiting, attendance, leave, performance management, and real-time payroll sync.",
      "offers": {
        "@type": "Offer",
        "price": "4000",
        "priceCurrency": "PHP",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "4000",
          "priceCurrency": "PHP",
          "unitText": "month"
        }
      },
      "url": "https://yahshuahris.com"
    }
  ]
}
```

### FAQs Page + Inline on /features, /pricing, /vs-sprout
- [ ] `FAQPage` schema on `/faqs`
- [ ] `FAQPage` schema on `/features`
- [ ] `FAQPage` schema on `/pricing`
- [ ] `FAQPage` schema on `/vs-sprout`

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does YAHSHUA HRIS handle DOLE compliance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. YAHSHUA HRIS includes a built-in DOLE compliance module covering company registration, OSH reports, annual medical reports, work accident reports, and all mandatory DOLE filings. It is automatically updated when DOLE requirements change."
      }
    },
    {
      "@type": "Question",
      "name": "How much does YAHSHUA HRIS cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YAHSHUA HRIS starts at PHP 4,000 per month for up to 100 employees. Pricing is flat — no per-seat fees, no long-term contracts, and no surprise charges."
      }
    },
    {
      "@type": "Question",
      "name": "Does YAHSHUA HRIS integrate with payroll?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. YAHSHUA HRIS has real-time two-way sync with YAHSHUA Payroll. Employee profiles, attendance, leave, and OT approvals push to payroll automatically — no CSV exports or manual re-entry required."
      }
    },
    {
      "@type": "Question",
      "name": "Is YAHSHUA HRIS secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YAHSHUA HRIS is SOC2 Type 2 certified and ISO 27001 certified. It is also GDPR compliant and registered with the National Privacy Commission under the Philippine Data Privacy Act of 2012."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between YAHSHUA HRIS and Sprout HR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YAHSHUA HRIS includes DOLE compliance automation, multi-channel job posting, and a pre-screened talent pool — features Sprout HR does not offer. YAHSHUA also uses flat pricing starting at PHP 4,000/month with no per-seat fees, making it significantly more affordable for Philippine SMEs."
      }
    }
  ]
}
```

### Blog Article (/blog/dole-compliance-requirements-philippines)
- [ ] `Article` schema with headline, datePublished, dateModified, author, publisher

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "DOLE Compliance Requirements in the Philippines: A Complete Guide",
  "datePublished": "2025-01-15",
  "dateModified": "2026-06-01",
  "author": {
    "@type": "Organization",
    "name": "YAHSHUA HRIS Editorial Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "YAHSHUA Outsourcing Worldwide, Inc.",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yahshuahris.com/logo.png"
    }
  },
  "description": "Complete guide to DOLE compliance requirements for Philippine employers, covering mandatory reports, OSH obligations, and how to avoid penalties.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://yahshuahris.com/blog/dole-compliance-requirements-philippines"
  }
}
```

### Comparison Pages (/vs-sprout, /how-we-compare)
- [ ] `ItemList` schema listing compared features as structured data

---

## Priority 3: Content — Build the Citation Surface

### Blog Articles to Write

| Status | Article | Target Query | Priority |
|--------|---------|-------------|----------|
| [ ] | DOLE Reports Every Philippine Employer Must File in 2026 | "DOLE annual reports Philippines" | High |
| [ ] | HRIS vs Spreadsheet: What Philippine SMEs Actually Need | "HRIS for small business Philippines" | High |
| [ ] | GreatDay HR vs YAHSHUA HRIS vs Sprout: Full Comparison | "GreatDay HR alternative Philippines" | High |
| [ ] | How to Compute Philippine OT Pay: Complete Guide 2026 | "how to compute overtime pay Philippines" | High |
| [ ] | What is a 201 File? Philippine HR Requirements Explained | "201 file requirements Philippines" | Medium |
| [ ] | SSS, PhilHealth, Pag-IBIG Contribution Table 2026 | "SSS contribution table 2026" | Medium |
| [ ] | How to Register Your Company with DOLE: Step-by-Step | "DOLE company registration Philippines" | Medium |
| [ ] | Philippine Labor Law: What Every Employer Must Know | "Philippine labor law employers" | Medium |

**Content rules for every article:**
- Direct answer in first paragraph (40-60 words, extractable by AI)
- At least 2 data points or statistics with sources cited
- Named author with title in byline
- "Last updated" date visible at top
- FAQ section at the bottom (minimum 4 Q&As)
- Internal link to a relevant product page

### New Landing Pages to Build

| Status | Page | URL | Why |
|--------|------|-----|-----|
| [ ] | GreatDay HR Comparison | `/vs-greatday` | #2 competitor, no page yet |
| [ ] | DOLE Compliance Software | `/dole-compliance` | Biggest differentiator, deserves own page |
| [ ] | HRIS for BPOs | `/use-cases/bpo` | Listed as served industry, no page |
| [ ] | HRIS for Manufacturing | `/use-cases/manufacturing` | Del Monte is a client — strong credibility |
| [ ] | HR Payroll Software Philippines | `/hr-payroll-software` | Captures unified HR+payroll search intent |
| [ ] | HRIS for Hotels and Hospitality | `/use-cases/hospitality` | Hotel clients in portfolio |

---

## Priority 4: Authority Signals (Ongoing)

Third-party citations matter more than your own site. AI systems trust what others say about you.

| Status | Action | Platform | Impact |
|--------|--------|---------|--------|
| [ ] | Create and verify company profile | G2 | High — cited in "best HRIS" queries |
| [ ] | Create and verify company profile | Capterra | High — cited in "best HRIS" queries |
| [ ] | Get 10+ verified reviews | G2 + Capterra | High — trust signal for AI |
| [ ] | Answer HRIS/HR threads authentically | Reddit (r/phtech, r/Philippines) | Medium |
| [ ] | Create YouTube how-to videos (DOLE compliance, payroll sync) | YouTube | High — Google AI Overviews cites YouTube |
| [ ] | Publish press release for any milestones | Rappler, BusinessWorld, Manila Bulletin | High — news sites get crawled heavily |
| [ ] | Request Wikipedia mention on Philippine business software page | Wikipedia | High — 7.8% of ChatGPT citations come from Wikipedia |
| [ ] | Publish guest articles on HR/payroll publications | External sites | Medium |

---

## Monitoring: Check These Queries Monthly

Run across ChatGPT, Perplexity, and Google AI Overviews. Record who gets cited.

| Query | Google AI Overview | ChatGPT | Perplexity | YAHSHUA Cited? |
|-------|--------------------|---------|------------|----------------|
| "best HRIS for Philippine SMEs" | | | | |
| "DOLE compliance software Philippines" | | | | |
| "Sprout HR alternative Philippines" | | | | |
| "GreatDay HR alternative Philippines" | | | | |
| "HR software with payroll Philippines" | | | | |
| "DOLE annual reports requirements Philippines" | | | | |
| "HRIS pricing Philippines" | | | | |
| "Philippine labor law HR system" | | | | |

**Tools to use:**
- [Otterly AI](https://otterly.ai) — share of AI voice tracking
- [Peec AI](https://peec.ai) — multi-platform monitoring
- Manual monthly check (free)

---

## Implementation Timeline

| Week | Task |
|------|------|
| Week 1 (Done) | robots.txt AI bot permissions, llms.txt, pricing.md |
| Week 2 | Schema on homepage + pricing page + FAQs page |
| Week 3 | Schema on blog article, add "Last Updated" dates to all pages |
| Week 4 | Write first 2 blog articles (DOLE reports + HRIS vs spreadsheet) |
| Month 2 | G2/Capterra profiles, 3 more blog articles, /vs-greatday page |
| Month 2 | /dole-compliance feature page, /use-cases/bpo page |
| Month 3 | YouTube content, Reddit presence, monitor AI citation rate |

---

## Key Insight

The biggest single impact: **llms.txt + schema on FAQs page + 3 comparison articles.**

FAQ schema Q&As get cited independently by AI. Each answer is a citable passage. Five well-structured Q&As on your pricing page is worth more than 10 generic blog posts.

Comparison articles (vs-sprout, vs-greatday, vs-competitors) account for 33% of all AI citations across all content types. You already have the pages. Adding schema and structured Q&As to them is the fastest path to appearing in AI-generated answers.
