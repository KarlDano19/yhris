"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight, HelpCircle, UserX, ClipboardX } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { PRICING_LABELS, YAHSHUA_PRICING } from "@/lib/yahshuaPricing";

const painPoints = [
  {
    icon: HelpCircle,
    title: "No published pricing",
    body: "JuanHR uses custom, quote-based pricing. You have to book a call with sales just to find out what your team would pay each month.",
  },
  {
    icon: UserX,
    title: "No recruitment or applicant tracking",
    body: "JuanHR's 24-plus modules cover attendance, payroll, and employee records well, but hiring and applicant tracking aren't part of the platform.",
  },
  {
    icon: ClipboardX,
    title: "No performance evaluation module",
    body: "Performance reviews and evaluation forms aren't in JuanHR's published module list, so most teams end up managing them separately.",
  },
];

const switchFor = [
  "You want to see your exact monthly cost before booking a demo",
  "You need recruitment, applicant tracking, and performance reviews in the same platform",
  "You want a documented DOLE reporting module, not just a compliance badge",
  "You're a private-sector SME, not a government agency",
];

const stayFor = [
  "You need biometric device integration across fingerprint, facial, and palm scanners",
  "Your team relies on geo-fenced field work and site location attendance tracking",
  "You're a government agency and specifically need JuanHR's HRMIS edition",
];

const JuanhrAlternativeContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
      <main className="min-h-screen pt-16">

        {/* Hero */}
        <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
          <div className="lp-section-container relative z-10 text-center">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-3">JUANHR ALTERNATIVE</span>
              <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: August 2026</p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                Looking for a<br className="hidden md:inline" />
                <span className="text-primary"> JuanHR alternative?</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                Published pricing you can see upfront, recruitment and performance reviews built in, and guided DOLE compliance in every plan.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/vs-juanhr" className="lp-btn-ghost-dark gap-2">
                  See the Full Comparison <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Why people look for an alternative */}
        <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
          <div className="lp-section-container">
            <ScrollFadeIn>
              <div className="max-w-2xl mb-14">
                <span className="lp-section-label mb-5">WHY TEAMS SWITCH</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  Why Philippine SMEs look for a JuanHR alternative.
                </h2>
              </div>
            </ScrollFadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((p, i) => {
                const Icon = p.icon;
                return (
                  <ScrollFadeIn key={p.title} delay={i * 60}>
                    <div className="lp-light-card p-7 h-full flex flex-col">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mb-5"
                        style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
                        <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-3">{p.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                    </div>
                  </ScrollFadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
          <div className="lp-section-container">
            <ScrollFadeIn>
              <div className="max-w-2xl mx-auto text-center mb-6">
                <span className="lp-section-label justify-center mb-5">THE ALTERNATIVE</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-5">
                  YAHSHUA HRIS: see the price, get the full lifecycle.
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  {PRICING_LABELS.base}/month for up to {YAHSHUA_PRICING.employeeCap} employees is published on the pricing page, no sales call required to find out. Multi-platform job posting, applicant tracking, and performance evaluation ship alongside a guided DOLE Module in the same plan.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Who should switch / who should stay */}
        <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
          <div className="lp-section-container">
            <ScrollFadeIn>
              <div className="text-center mb-14">
                <span className="lp-section-label justify-center mb-5">IS IT RIGHT FOR YOU</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Who should switch, and who shouldn't.
                </h2>
              </div>
            </ScrollFadeIn>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ScrollFadeIn>
                <div className="lp-light-card p-7 h-full">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Switch to YAHSHUA if:</h3>
                  <ul className="space-y-3">
                    {switchFor.map((s) => (
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
                  <h3 className="text-base font-bold text-gray-900 mb-4">Stick with JuanHR if:</h3>
                  <ul className="space-y-3">
                    {stayFor.map((s) => (
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
          <div className="lp-section-container text-center max-w-2xl mx-auto">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-5">SWITCHING</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-5">
                Get a real number first, then a real migration plan.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Check YAHSHUA's published pricing before you even book a call. When you're ready, a one-time {PRICING_LABELS.setup} setup fee covers full data migration, implementation, and dedicated onboarding training, with no long-term contract after that.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
          <div className="lp-section-container text-center">
            <ScrollFadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                Ready to make the switch?
              </h2>
              <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                Start free or book a demo. No credit card required.
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

export default JuanhrAlternativeContent;
