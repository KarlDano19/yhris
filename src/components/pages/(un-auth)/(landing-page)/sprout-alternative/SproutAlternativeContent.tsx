"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight, TrendingUp, PuzzleIcon, ShieldAlert } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { PRICING_LABELS, YAHSHUA_PRICING } from "@/lib/yahshuaPricing";

const painPoints = [
  {
    icon: TrendingUp,
    title: "Per-seat pricing climbs with headcount",
    body: "Sprout HR bills per employee per month. Every new hire adds to the invoice, so costs get harder to forecast the more your team grows.",
  },
  {
    icon: PuzzleIcon,
    title: "Recruitment isn't part of the core platform",
    body: "Sprout's standard offering doesn't include multi-platform job posting or a pre-screened talent pool, so hiring often means a separate tool on top.",
  },
  {
    icon: ShieldAlert,
    title: "DOLE compliance isn't automated",
    body: "Company registration, OSH reports, and AERW filing aren't built into Sprout's standard package the way they are in a dedicated DOLE module.",
  },
];

const switchFor = [
  "You want flat pricing that doesn't grow per employee up to 100 staff",
  "You need job posting, screening, and hiring in the same platform as HR",
  "You want guided DOLE reporting without a separate compliance vendor",
  "You're an SME, not an enterprise already deep in a per-seat contract",
];

const stayFor = [
  "You rely on Sprout's ReadyCash/ReadyWage earned wage access product",
  "You're a large enterprise already integrated across Sprout's full module suite",
  "Your team size makes per-seat pricing genuinely cost-effective for you",
];

const SproutAlternativeContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
      <main className="min-h-screen pt-16">

        {/* Hero */}
        <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
          <div className="lp-section-container relative z-10 text-center">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-3">SPROUT HR ALTERNATIVE</span>
              <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: August 2026</p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                Looking for a<br className="hidden md:inline" />
                <span className="text-primary"> Sprout HR alternative?</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                Flat pricing instead of per-seat billing, hiring tools built into the platform, and guided DOLE compliance from day one.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/vs-sprout" className="lp-btn-ghost-dark gap-2">
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
                  Why Philippine SMEs look for a Sprout HR alternative.
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
                  YAHSHUA HRIS: built for Philippine SMEs, not enterprise procurement.
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  Flat pricing at {PRICING_LABELS.base}/month for up to {YAHSHUA_PRICING.employeeCap} employees, with a simple {PRICING_LABELS.excess}/employee fee above that. Multi-platform job posting, a pre-screened talent pool, and a guided DOLE Module covering company registration through OSH reports and AERW filing all ship in the same plan, no add-ons required.
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
                  <h3 className="text-base font-bold text-gray-900 mb-4">Stick with Sprout if:</h3>
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
                Moving off Sprout doesn't mean starting from zero.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                The one-time {PRICING_LABELS.setup} setup fee covers full data migration, implementation, and dedicated onboarding training, so your employee records, 201 files, and payroll history come with you. No long-term contract locks you in after that.
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

export default SproutAlternativeContent;
