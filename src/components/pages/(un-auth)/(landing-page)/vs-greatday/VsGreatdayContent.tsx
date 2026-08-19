"use client";

import Link from "next/link";

import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const valueProps = [
  {
    title: "Multi-Channel Job Posting Included",
    body: "Launch hiring campaigns across LinkedIn, Facebook, and YAHSHUA Jobs from one dashboard. GreatDay HR's recruitment tools are a paid add-on, not part of its base package.",
    metric: "80% faster job posting. No add-on fees.",
  },
  {
    title: "Performance Management Included",
    body: "Built-in evaluation module with templates, custom forms, and scheduling. GreatDay HR lists performance management as an optional add-on on top of its base plan.",
    metric: "100% evaluation accuracy. No extra cost.",
  },
  {
    title: "Guided DOLE Compliance Module",
    body: "GreatDay HR automates BIR 2316, Alphalist, and payroll-side compliance well, but stops there. YAHSHUA's DOLE Module goes further, guiding you through company registration, OSH reports, and AERW filing, all in every plan.",
    metric: "100% compliance rate. Zero penalties.",
  },
  {
    title: "Flat Pricing With a Real Cap",
    body: "PHP 7,000/month flat for up to 100 employees, with a simple PHP 60/employee fee above that. GreatDay HR charges PHP 77 per employee per month starting from employee one, with no ceiling.",
    metric: "Predictable cost as you scale past 50 or 100 staff.",
  },
  {
    title: "No Minimum Headcount to Start",
    body: "Start free with the Freemium plan and upgrade when you're ready. GreatDay HR's Basic Starter Package requires a minimum purchase of 50 employee licenses.",
    metric: "No license minimum. No forced upfront spend.",
  },
  {
    title: "Complete Hiring-to-Offboarding",
    body: "Screen, Orient, Manage, Train, Evaluate, and Separate all run on one flat-rate plan. GreatDay HR unbundles recruitment and performance into paid add-ons, so a full hiring-to-offboarding workflow costs more the more of it you use.",
    metric: "70% time savings. 95% process efficiency.",
  },
];

const comparisonRows = [
  { feature: "Multi-platform job posting included", yahshua: true, competitor: false },
  { feature: "Performance evaluation module included", yahshua: true, competitor: false },
  { feature: "Guided DOLE reporting (OSH, AERW, registration)", yahshua: true, competitor: false },
  { feature: "Flat pricing with an employee-count cap", yahshua: true, competitor: false },
  { feature: "No minimum license purchase", yahshua: true, competitor: false },
  { feature: "BIR, SSS, PhilHealth, Pag-IBIG payroll compliance", yahshua: true, competitor: true },
  { feature: "Employee self-service portal", yahshua: true, competitor: true },
  { feature: "Philippine-localized platform", yahshua: true, competitor: true },
  { feature: "Mobile GPS and selfie attendance", yahshua: false, competitor: true },
  { feature: "Facial recognition biometric attendance", yahshua: false, competitor: true },
];

const VsGreatdayContent = () => {
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
              <span className="lp-section-label justify-center mb-3">YAHSHUA HRIS VS GREATDAY HR</span>
              <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: August 2026</p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                Why Philippine businesses<br className="hidden md:inline" />
                <span className="text-primary"> choose YAHSHUA over GreatDay HR.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                Recruitment, performance management, and DOLE compliance built in at no extra cost, plus flat pricing that doesn't grow per head from day one.
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
                  YAHSHUA HRIS vs GreatDay HR.
                </h2>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <div className="rounded-xl overflow-hidden max-w-3xl mx-auto" style={{ border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                {/* Header row */}
                <div className="grid grid-cols-3 px-6 py-4" style={{ background: "rgba(255,193,7,0.08)", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Feature</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary text-center">YAHSHUA HRIS</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">GreatDay HR</span>
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
              GreatDay HR offers strong mobile GPS attendance and biometric facial recognition, useful for field and frontline teams. Pricing and feature details sourced from GreatDay HR's public Philippines pricing page as of August 2026.
            </p>
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
                      "You want recruitment and performance management included, not sold as add-ons",
                      "Your team is under 50 people and a license minimum doesn't make sense yet",
                      "You want DOLE reporting guided beyond just payroll-side BIR compliance",
                      "Flat pricing matters more than a per-employee rate that climbs from day one",
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
                  <h3 className="text-base font-bold text-gray-900 mb-4">GreatDay HR fits best when:</h3>
                  <ul className="space-y-3">
                    {[
                      "Your workforce is field-based and needs GPS or selfie attendance verification",
                      "Facial recognition biometric attendance is a requirement, not a nice-to-have",
                      "You're already past the 50-license minimum and using the add-ons you're paying for",
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
                  Switching off GreatDay HR, step by step.
                </h2>
              </div>
            </ScrollFadeIn>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Attendance and payroll history transfer", body: "Employee records and attendance history migrate during setup, covered by the one-time PHP 35,000 fee." },
                { step: "02", title: "Hands-on onboarding", body: "Your team gets dedicated training during setup, not a self-serve help center." },
                { step: "03", title: "Flat rate, no lock-in", body: "One monthly rate regardless of add-ons used, cancel anytime, no long-term contract." },
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
              <Link href="/greatday-hr-alternative" className="text-sm text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1">
                Weighing your options? See why teams look for a GreatDay HR alternative <ArrowRight className="w-3 h-3" />
              </Link>
            </ScrollFadeIn>
          </div>
        </section>

      </main>
    </div>
  );
};

export default VsGreatdayContent;
