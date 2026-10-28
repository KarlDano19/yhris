"use client";

import Link from "next/link";

import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { PRICING_LABELS, YAHSHUA_PRICING } from "@/lib/yahshuaPricing";

const valueProps = [
  {
    title: "Multi-Channel Job Posting",
    body: "Post openings to LinkedIn, Facebook, and YAHSHUA Jobs from a single dashboard, then manage every application in one place, included in every plan.",
    metric: "80% faster job posting. 3x wider reach.",
  },
  {
    title: "Ready Talent Pool Access",
    body: "Screen Applicants module maintains detailed applicant history and qualified candidate pools. Fill vacancies immediately with pre-screened talent.",
    metric: "50% faster hiring. 90% vacancy fill rate.",
  },
  {
    title: "Complete Hiring-to-Offboarding Automation",
    body: "Every stage of the employee lifecycle, Screen, Orient, Manage, Train, Evaluate, Separate, lives in one platform and one plan price.",
    metric: "70% time savings. 95% process efficiency.",
  },
  {
    title: "DOLE Compliance Built In",
    body: "From company registration to OSH reports and AERW filing, the DOLE Module walks you through every mandatory filing for your specific business type. No separate compliance vendor needed.",
    metric: "100% compliance rate. Zero penalties.",
  },
  {
    title: "Secure Employee Records",
    body: "Organized Employee Management module with secure storage, Data Privacy compliance, and instant accessibility of all employment documents.",
    metric: "Zero record loss. 90% faster retrieval.",
  },
  {
    title: "Performance Evaluations Included",
    body: "Custom evaluation forms, scheduled review cycles, and full performance history tracking, all included in the standard plan with no upsell required.",
    metric: "100% evaluation accuracy. Full flexibility.",
  },
];

// Competitor cells verified against each vendor's public site, Sept 2026.
// true = included, false = not offered, string = how it is offered.
type Cell = boolean | string;
const comparisonRows: { feature: string; yahshua: Cell; sprout: Cell; greatday: Cell }[] = [
  { feature: "Pricing", yahshua: `${PRICING_LABELS.base}/mo flat, up to ${YAHSHUA_PRICING.employeeCap} employees`, sprout: "Quote-based, not published", greatday: "PHP 77/employee/mo, 50-license bundle" },
  { feature: "Payroll", yahshua: "Included", sprout: "Available (Sprout Payroll)", greatday: "Included in base" },
  { feature: "Multi-platform job posting", yahshua: "Included", sprout: "Separate product (Recruit+)", greatday: "Paid add-on" },
  { feature: "Performance management", yahshua: "Included", sprout: "Available", greatday: "Paid add-on" },
  { feature: "DOLE compliance tools", yahshua: "Guided DOLE module, included", sprout: "Separate product (Sprout Comply)", greatday: "No published DOLE module" },
  { feature: "BIR, SSS, PhilHealth, Pag-IBIG payroll compliance", yahshua: true, sprout: true, greatday: true },
  { feature: "Employee self-service portal", yahshua: true, sprout: true, greatday: true },
  { feature: "Mobile attendance app", yahshua: "Web only, app in development", sprout: "Mobile app", greatday: "GPS and selfie clock-in" },
];

const renderCell = (value: Cell, highlight: boolean) => {
  if (value === true) {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={highlight ? { background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" } : { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)" }}>
        <Check className={`w-3 h-3 ${highlight ? "text-primary" : "text-gray-400"}`} strokeWidth={2.5} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.08)" }}>
        <X className="w-3 h-3 text-red-400" strokeWidth={2} />
      </div>
    );
  }
  return <span className={`text-xs text-center leading-snug ${highlight ? "font-semibold text-gray-900" : "text-gray-500"}`}>{value}</span>;
};

const CompetitorsContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
            <div
              className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }}
            />
            <div className="lp-section-container relative z-10 text-center">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-3">HOW WE COMPARE</span>
                <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: September 2026</p>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                  YAHSHUA HRIS<br className="hidden md:inline" />
                  <span className="text-primary"> vs the competition.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                  Built for Philippine businesses with DOLE compliance, multi-channel recruiting, and complete automation from hiring to offboarding.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-ghost-dark gap-2"
                  >
                    Book a Demo <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-2xl mb-14">
                  <span className="lp-section-label mb-5">WHY YAHSHUA HRIS</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Every HR workflow, built for the Philippine market.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valueProps.map((vp, i) => (
                  <ScrollFadeIn key={vp.title} delay={i * 60}>
                    <div className="lp-light-card p-7 h-full flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-3">{vp.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{vp.body}</p>
                      <p className="text-xs font-semibold text-primary">{vp.metric}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-5">FEATURE COMPARISON</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Feature by feature.
                  </h2>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="rounded-xl overflow-hidden max-w-4xl mx-auto" style={{ border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  {/* Header row */}
                  <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-3 sm:px-6 py-4 items-end" style={{ background: "rgba(255,193,7,0.08)", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">Feature</span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary text-center">YAHSHUA HRIS</span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">Sprout</span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">GreatDay HR</span>
                  </div>
                  {comparisonRows.map((row, i) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-3 sm:px-6 py-4 items-center"
                      style={{
                        background: i % 2 === 0 ? "#ffffff" : "rgba(255,250,235,0.6)",
                        borderBottom: i < comparisonRows.length - 1 ? "1px solid rgba(255,193,7,0.1)" : "none",
                      }}
                    >
                      <span className="text-xs sm:text-sm text-gray-700">{row.feature}</span>
                      <div className="flex justify-center">{renderCell(row.yahshua, true)}</div>
                      <div className="flex justify-center">{renderCell(row.sprout, false)}</div>
                      <div className="flex justify-center">{renderCell(row.greatday, false)}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-6 max-w-lg mx-auto">
                  Competitor details sourced from each vendor&apos;s public website as of September 2026. Pricing and packaging change, so confirm current terms with each vendor.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Detailed Comparisons */}
        <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
          <div className="lp-section-container">
            <ScrollFadeIn>
              <div className="text-center mb-14">
                <span className="lp-section-label justify-center mb-5">DETAILED COMPARISONS</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  See how we stack up, one competitor at a time.
                </h2>
              </div>
            </ScrollFadeIn>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { name: "Sprout Solutions", vsHref: "/vs-sprout", altHref: "/sprout-alternative" },
                { name: "GreatDay HR", vsHref: "/vs-greatday", altHref: "/greatday-hr-alternative" },
              ].map((c, i) => (
                <ScrollFadeIn key={c.name} delay={i * 60}>
                  <div className="lp-light-card p-6 h-full flex flex-col justify-between gap-4">
                    <p className="text-sm font-bold text-gray-900">YAHSHUA vs {c.name}</p>
                    <div className="flex flex-col gap-2">
                      <Link href={c.vsHref} className="text-xs font-semibold text-primary inline-flex items-center gap-1 group">
                        Full Comparison <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      <Link href={c.altHref} className="text-xs font-semibold text-gray-400 hover:text-primary inline-flex items-center gap-1 group transition-colors">
                        Why Switch <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-xl mb-14">
                  <span className="lp-section-label mb-5">WHO WE SERVE</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Built for growing Philippine businesses.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "SMEs", body: "Cost-effective with enterprise-grade features." },
                  { label: "Philippine Companies", body: "Built-in DOLE compliance and local labor law expertise." },
                  { label: "Growing Businesses", body: "Scalable solutions that grow with your team." },
                  { label: "BPO and Call Centers", body: "High-volume recruitment and employee management." },
                ].map((item, i) => (
                  <ScrollFadeIn key={item.label} delay={i * 60}>
                    <div className="lp-light-card p-6">
                      <div className="w-1 h-8 rounded-full mb-4" style={{ background: "hsl(var(--lp-primary))" }} />
                      <p className="text-sm font-bold text-gray-900 mb-2">{item.label}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Ready to experience the YAHSHUA difference?
                </h2>
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                  Join Philippine businesses that have chosen YAHSHUA HRIS for superior HR management and DOLE compliance.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-ghost-dark gap-2"
                  >
                    Schedule a Demo <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default CompetitorsContent;
