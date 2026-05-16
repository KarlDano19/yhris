"use client";

import Link from "next/link";

import { UserPlus, BarChart3, ArrowRight } from "lucide-react";

import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

const useCases = [
  {
    id: "employee-onboarding",
    label: "Employee Onboarding",
    icon: UserPlus,
    description: "Streamline your new hire process with automated workflows and digital documentation.",
    benefits: [
      "Faster applicant filtering and assessment",
      "Streamlined interview scheduling",
      "Centralized requirements setup",
      "Digital contract sending and signing",
      "Team introductions via email",
      "System enrollment with onboarding email",
    ],
    href: "/use-cases/employee-onboarding",
  },
  {
    id: "performance-management",
    label: "Performance Management",
    icon: BarChart3,
    description: "Enhance employee performance with comprehensive evaluation and feedback systems.",
    benefits: [
      "Customizable evaluation templates",
      "Centralized performance history",
      "Scheduled reviews with deadline tracking",
      "Evaluation assignment and monitoring",
      "Performance tracking",
      "Completion monitoring",
    ],
    href: "/use-cases/performance-management",
  },
];

const UseCasesContent = () => {
  return (
    <>
      <Navigation />
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
                <span className="lp-section-label justify-center mb-5">USE CASES</span>
                <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                  See YAHSHUA HRIS in action.<br className="hidden md:inline" />
                  <span className="text-primary"> Real workflows. Real results.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  Explore how YAHSHUA HRIS handles your most critical HR scenarios, from onboarding to performance management.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Use Case Cards */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {useCases.map((uc, i) => {
                  const Icon = uc.icon;
                  return (
                    <ScrollFadeIn key={uc.id} delay={i * 80}>
                      <div className="lp-dark-card h-full flex flex-col overflow-hidden">
                        <div className="p-8 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-6">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}
                            >
                              <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{uc.label}</h2>
                          </div>

                          <p className="text-sm text-gray-500 leading-relaxed mb-6">{uc.description}</p>

                          <ul className="space-y-3 mb-8 flex-1">
                            {uc.benefits.map((b) => (
                              <li key={b} className="flex items-start gap-3 text-sm">
                                <span
                                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}
                                >
                                  <svg className="w-2 h-2 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 6l3 3 5-5" />
                                  </svg>
                                </span>
                                <span className="text-gray-600">{b}</span>
                              </li>
                            ))}
                          </ul>

                          <Link href={uc.href} className="lp-btn-primary gap-2 w-full justify-center">
                            Explore {uc.label} <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Ready to transform your HR processes?
                </h2>
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                  Start free or book a demo. No credit card required.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/pricing" className="lp-btn-ghost gap-2">
                    View Pricing
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
        <LpFooter />
      </div>
      <ScrollToTop />
    </>
  );
};

export default UseCasesContent;
