"use client";

import Link from "next/link";

import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const valueProps = [
  {
    title: "Multi-Channel Job Posting & ATS",
    body: "Launch hiring campaigns across LinkedIn, Facebook, and YAHSHUA Jobs with centralized applicant tracking. JuanHR's module list covers HR and payroll operations but does not include recruitment or applicant tracking.",
    metric: "80% faster job posting. 3x wider reach.",
  },
  {
    title: "Performance Management Included",
    body: "Built-in evaluation module with templates, custom forms, and scheduling. Performance evaluation is not part of JuanHR's published module list.",
    metric: "100% evaluation accuracy. No extra module needed.",
  },
  {
    title: "Transparent, Published Pricing",
    body: "See your exact monthly cost before you book a demo. JuanHR uses custom, quote-based pricing that requires contacting sales to find out what you'll pay.",
    metric: "PHP 7,000/month flat, published upfront.",
  },
  {
    title: "Guided DOLE Compliance Module",
    body: "JuanHR markets itself as DOLE and BIR compliant, but doesn't publish a reporting module for company registration, OSH reports, or AERW filing. YAHSHUA's DOLE Module covers all three, included in every plan.",
    metric: "100% compliance rate. Zero penalties.",
  },
  {
    title: "Complete Hiring-to-Offboarding",
    body: "Screen, Orient, Manage, Train, Evaluate, and Separate all run through YAHSHUA HRIS. JuanHR's 24 modules cover attendance and payroll well, but recruitment and performance evaluation aren't part of the platform.",
    metric: "70% time savings. 95% process efficiency.",
  },
  {
    title: "Flat Pricing for Growing SMEs",
    body: "Flat monthly pricing starting at PHP 7,000 for up to 100 employees, with a simple PHP 60/employee fee above that. No per-seat fees, no surprise charges, no long-term contracts.",
    metric: "Predictable cost as your team grows.",
  },
];

const comparisonRows = [
  { feature: "Multi-platform job posting and ATS", yahshua: true, competitor: false },
  { feature: "Performance evaluation module", yahshua: true, competitor: false },
  { feature: "Published, flat monthly pricing", yahshua: true, competitor: false },
  { feature: "Guided DOLE reporting (OSH, AERW, registration)", yahshua: true, competitor: false },
  { feature: "BIR, SSS, PhilHealth, Pag-IBIG payroll compliance", yahshua: true, competitor: true },
  { feature: "Philippine-built and supported", yahshua: true, competitor: true },
  { feature: "Biometric device integration (fingerprint, facial, palm)", yahshua: false, competitor: true },
  { feature: "Geo-fenced field work attendance tracking", yahshua: false, competitor: true },
  { feature: "Government agency HRMIS edition", yahshua: false, competitor: true },
];

const VsJuanhrContent = () => {
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
              <span className="lp-section-label justify-center mb-3">YAHSHUA HRIS VS JUANHR</span>
              <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: August 2026</p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                Why Philippine businesses<br className="hidden md:inline" />
                <span className="text-primary"> choose YAHSHUA over JuanHR.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                Recruitment, performance management, and DOLE compliance built in, plus pricing you can see upfront instead of a custom quote.
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
                  YAHSHUA HRIS vs JuanHR.
                </h2>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <div className="rounded-xl overflow-hidden max-w-3xl mx-auto" style={{ border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                {/* Header row */}
                <div className="grid grid-cols-3 px-6 py-4" style={{ background: "rgba(255,193,7,0.08)", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Feature</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary text-center">YAHSHUA HRIS</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">JuanHR</span>
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
            <p className="text-xs text-gray-400 text-center mt-6 max-w-lg mx-auto">
              JuanHR offers strong biometric device integration and geo-fenced field attendance, along with a dedicated government agency edition. Feature details sourced from JuanHR's public site as of August 2026.
            </p>
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
              <Link href="/juanhr-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1">
                Weighing your options? See why teams look for a JuanHR alternative <ArrowRight className="w-3 h-3" />
              </Link>
            </ScrollFadeIn>
          </div>
        </section>

      </main>
    </div>
  );
};

export default VsJuanhrContent;
