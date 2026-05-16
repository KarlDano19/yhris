"use client";

import Link from "next/link";

import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const valueProps = [
  {
    title: "Multi-Channel Job Posting",
    body: "Launch hiring campaigns across LinkedIn, Facebook, and YAHSHUA Jobs in 1 to 3 steps. Centralized application management with no platform switching.",
    metric: "80% faster job posting. 3x wider reach.",
  },
  {
    title: "Ready Talent Pool Access",
    body: "Screen Applicants module maintains detailed applicant history and qualified candidate pools. Fill vacancies immediately with pre-screened talent.",
    metric: "50% faster hiring. 90% vacancy fill rate.",
  },
  {
    title: "Complete Hiring-to-Offboarding Automation",
    body: "Comprehensive suite: Screen, Orient, Manage, Train, Evaluate, and Separate. Fully automated workflow from recruitment to departure.",
    metric: "70% time savings. 95% process efficiency.",
  },
  {
    title: "DOLE Compliance Built In",
    body: "Guided DOLE Module covering company registration to annual reports. Automated compliance for your specific business type.",
    metric: "100% compliance rate. Zero penalties.",
  },
  {
    title: "Secure Employee Records",
    body: "Organized Employee Management module with secure storage, Data Privacy compliance, and instant accessibility of all employment documents.",
    metric: "Zero record loss. 90% faster retrieval.",
  },
  {
    title: "Performance Evaluations Included",
    body: "Built-in evaluation module with standard templates, custom forms, and scheduling. No add-ons, no extra cost.",
    metric: "100% evaluation accuracy. Full flexibility.",
  },
];

const comparisonRows = [
  { feature: "Multi-platform job posting", yahshua: true, competitor: false },
  { feature: "Centralized application management", yahshua: true, competitor: false },
  { feature: "Pre-screened talent pool", yahshua: true, competitor: false },
  { feature: "DOLE compliance automation", yahshua: true, competitor: false },
  { feature: "Philippine labor law compliance", yahshua: true, competitor: true },
  { feature: "Secure document management", yahshua: true, competitor: true },
  { feature: "Complete hiring-to-offboarding", yahshua: true, competitor: false },
  { feature: "Custom performance evaluation forms", yahshua: true, competitor: true },
  { feature: "Employee self-service portal", yahshua: true, competitor: true },
  { feature: "SME-focused design", yahshua: true, competitor: true },
  { feature: "Philippine-specific features", yahshua: true, competitor: false },
  { feature: "Professional image enhancement", yahshua: true, competitor: false },
];

const CompetitorsContent = () => {
  return (
    <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
            <div
              className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--lp-page)))" }}
            />
            <div className="lp-section-container relative z-10 text-center">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">HOW WE COMPARE</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-white mb-5 tracking-tight">
                  YAHSHUA HRIS<br className="hidden md:inline" />
                  <span className="text-primary"> vs the competition.</span>
                </h1>
                <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
                  Built for Philippine businesses with DOLE compliance, multi-channel recruiting, and complete automation from hiring to offboarding.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-ghost gap-2"
                  >
                    Book a Demo <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-2xl mb-14">
                  <span className="lp-section-label mb-5">WHY YAHSHUA HRIS</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                    Every HR workflow, built for the Philippine market.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valueProps.map((vp, i) => (
                  <ScrollFadeIn key={vp.title} delay={i * 60}>
                    <div className="lp-dark-card p-7 h-full flex flex-col">
                      <h3 className="text-base font-bold text-white mb-3">{vp.title}</h3>
                      <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1">{vp.body}</p>
                      <p className="text-xs font-semibold text-primary">{vp.metric}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-5">FEATURE COMPARISON</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Feature by feature.
                  </h2>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="rounded-xl overflow-hidden max-w-3xl mx-auto" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Header row */}
                  <div className="grid grid-cols-3 px-6 py-4" style={{ background: "hsl(var(--lp-surface-2))", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Feature</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary text-center">YAHSHUA HRIS</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30 text-center">Competitors</span>
                  </div>
                  {comparisonRows.map((row, i) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-3 px-6 py-4 items-center"
                      style={{
                        background: i % 2 === 0 ? "hsl(var(--lp-surface))" : "hsl(var(--lp-surface-2))",
                        borderBottom: i < comparisonRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <span className="text-sm text-white/70">{row.feature}</span>
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
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <Check className="w-3 h-3 text-white/40" strokeWidth={2.5} />
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

          {/* Who We Serve */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-xl mb-14">
                  <span className="lp-section-label mb-5">WHO WE SERVE</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
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
                    <div className="lp-dark-card p-6">
                      <div className="w-1 h-8 rounded-full mb-4" style={{ background: "hsl(var(--lp-primary))" }} />
                      <p className="text-sm font-bold text-white mb-2">{item.label}</p>
                      <p className="text-sm text-white/40 leading-relaxed">{item.body}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                  Ready to experience the YAHSHUA difference?
                </h2>
                <p className="text-white/50 text-base mb-8 max-w-sm mx-auto">
                  Join Philippine businesses that have chosen YAHSHUA HRIS for superior HR management and DOLE compliance.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-ghost gap-2"
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
