"use client";

import Link from "next/link";

import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { PRICING_LABELS, YAHSHUA_PRICING } from "@/lib/yahshuaPricing";
import { COMPETITORS } from "@/lib/competitorData";

const competitor = COMPETITORS.sprout;

const valueProps = [
  {
    title: "Multi-Channel Job Posting",
    body: "Post to LinkedIn, Facebook, and YAHSHUA Jobs from one dashboard, something Sprout HR's standard offering doesn't include. No separate job boards, no manual reposting.",
    metric: "80% faster job posting. 3x wider reach.",
  },
  {
    title: "Ready Talent Pool Access",
    body: "Screen Applicants module maintains detailed applicant history and qualified candidate pools. Fill vacancies immediately with pre-screened talent.",
    metric: "50% faster hiring. 90% vacancy fill rate.",
  },
  {
    title: "Complete Hiring-to-Offboarding",
    body: "One connected workflow: Screen, Orient, Manage, Train, Evaluate, Separate, instead of pairing Sprout's HR modules with a separate recruitment tool to cover the full employee lifecycle.",
    metric: "70% time savings. 95% process efficiency.",
  },
  {
    title: "DOLE Compliance Built In",
    body: "Guided DOLE Module covering company registration to annual reports. Automated compliance for your specific business type, with no add-ons required.",
    metric: "100% compliance rate. Zero penalties.",
  },
  {
    title: "Pricing Built for Philippine SMEs",
    body: `Flat monthly pricing starting at ${PRICING_LABELS.base} for up to ${YAHSHUA_PRICING.employeeCap} employees, with a simple ${PRICING_LABELS.excess}/employee fee above that. No per-seat fees, no surprise charges, no long-term contracts.`,
    metric: "Up to 60% lower cost than Sprout HR.",
  },
  {
    title: "Performance Evaluations Included",
    body: "Custom evaluation forms, scheduled review cycles, and full history tracking ship with every plan at no extra module fee.",
    metric: "100% evaluation accuracy. Full flexibility.",
  },
];

const comparisonRows = competitor.comparisonRows;

const VsSproutContent = () => {
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
                <span className="lp-section-label justify-center mb-3">YAHSHUA HRIS VS SPROUT HR</span>
                <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: June 2026</p>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                  Why Philippine businesses<br className="hidden md:inline" />
                  <span className="text-primary"> choose YAHSHUA over Sprout.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                  DOLE compliance built in, flat SME-friendly pricing, and full automation from hiring to offboarding. No add-ons, no surprises.
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
                    YAHSHUA HRIS vs Sprout HR.
                  </h2>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="rounded-xl overflow-hidden max-w-3xl mx-auto" style={{ border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  {/* Header row */}
                  <div className="grid grid-cols-3 px-6 py-4" style={{ background: "rgba(255,193,7,0.08)", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Feature</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary text-center">YAHSHUA HRIS</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">Sprout HR</span>
                  </div>
                  {comparisonRows.map((row, i) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-3 px-6 py-4 items-center"
                      style={{
                        background: i % 2 === 0 ? "#ffffff" : "rgba(255,250,235,0.6)",
                        borderBottom: i < comparisonRows.length - 1 ? "1px solid rgba(255,193,7,0.1)" : "none",
                      }}
                    >
                      <span className="text-sm text-gray-700">{row.feature}</span>
                      <div className="flex justify-center">
                        {row.yahshua ? (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" }}>
                            <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.08)" }}>
                            <X className="w-3 h-3 text-red-400" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center">
                        {row.competitor ? (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)" }}>
                            <Check className="w-3 h-3 text-gray-400" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.08)" }}>
                            <X className="w-3 h-3 text-red-400" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Who It's For */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-5">FIT CHECK</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Who each platform actually fits.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ScrollFadeIn>
                  <div className="lp-light-card p-7 h-full">
                    <h3 className="text-base font-bold text-gray-900 mb-4">YAHSHUA HRIS fits best when:</h3>
                    <ul className="space-y-3">
                      {[
                        "Your team is an SME, not an enterprise with a dedicated Sprout admin",
                        "You want recruitment and HR under one roof instead of a second hiring tool",
                        "Predictable, flat costs matter more than a per-seat model that scales with headcount",
                        "DOLE reporting needs to be guided, not something your HR team figures out alone",
                      ].map((s) => (
                        <li key={s} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
                            <svg className="w-2 h-2 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollFadeIn>
                <ScrollFadeIn delay={60}>
                  <div className="lp-light-card p-7 h-full">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Sprout HR fits best when:</h3>
                    <ul className="space-y-3">
                      {[
                        "You're already running on Sprout's broader module suite",
                        "Earned wage access through ReadyCash or ReadyWage is a must-have for your workforce",
                        "Your headcount and plan tier make per-seat pricing the cheaper option in practice",
                      ].map((s) => (
                        <li key={s} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-gray-100 border border-gray-200" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollFadeIn>
              </div>
            </div>
          </section>

          {/* Migration */}
          <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-5">SWITCHING</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Switching off Sprout, step by step.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { step: "01", title: "Data comes with you", body: `Employee records, 201 files, and payroll history are migrated during setup, covered by the one-time ${PRICING_LABELS.setup} fee.` },
                  { step: "02", title: "Guided onboarding", body: "Your team is trained hands-on as part of setup, not left to a help center article." },
                  { step: "03", title: "No lock-in after that", body: "Flat monthly billing, cancel anytime, no long-term contract." },
                ].map((m, i) => (
                  <ScrollFadeIn key={m.step} delay={i * 60}>
                    <div className="lp-light-card p-6 h-full">
                      <span className="text-xs font-semibold text-primary tracking-widest">{m.step}</span>
                      <h3 className="text-base font-bold text-gray-900 mt-2 mb-2">{m.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{m.body}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Make the switch to YAHSHUA HRIS.
                </h2>
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                  Start free or book a demo. No credit card required. No long-term contracts.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mb-6">
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
                <Link href="/sprout-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1">
                  Weighing your options? See why teams look for a Sprout HR alternative <ArrowRight className="w-3 h-3" />
                </Link>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default VsSproutContent;
