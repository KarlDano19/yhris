"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import LpComplianceTrust from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpComplianceTrust";

const AboutContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
      <main className="min-h-screen pt-16">

        {/* Hero */}
        <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow">
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
          <div className="lp-section-container relative z-10 text-center max-w-2xl mx-auto">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-5">ABOUT</span>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                Built by a team that has<br className="hidden md:inline" />
                <span className="text-primary"> done this for 17 years.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                YAHSHUA HRIS is an all-in-one HR platform for Philippine businesses: employee management, DOLE compliance, recruitment, performance, and real-time payroll integration, built specifically for how Philippine businesses actually operate.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* What we do */}
        <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
          <div className="lp-section-container max-w-3xl mx-auto">
            <ScrollFadeIn>
              <span className="lp-section-label mb-5">WHAT WE DO</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                Everything HR, in one system.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-4">
                From the moment a candidate applies to the day an employee exits, YAHSHUA HRIS keeps every record, request, and document in one place: recruitment and applicant tracking, employee 201 files, attendance and leave, performance evaluation, and guided DOLE compliance reporting.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                It syncs in real time with YAHSHUA Payroll, so HR data and payroll processing never fall out of step with each other.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Trust badges (reused) */}
        <LpComplianceTrust />

        {/* Who We Are / Parent company */}
        <section className="py-20 md:py-28" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.15)" }}>
          <div className="lp-section-container max-w-2xl mx-auto text-center">
            <ScrollFadeIn>
              <span className="lp-section-label justify-center mb-5">WHO WE ARE</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                Part of a bigger back-office effort.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-4">
                YAHSHUA HRIS is part of{" "}
                <a
                  href="https://www.theabbainitiative.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  The ABBA Initiative
                </a>
                , the Philippine company behind the YAHSHUA name. Based in Cagayan de Oro, we have been building payroll, HR, and compliance software for Filipino businesses for over 17 years.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                The ABBA Initiative also builds{" "}
                <a
                  href="https://www.yahshua.one/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  YAHSHUA One
                </a>
                , our newer AI-native platform unifying payroll, HR, accounting, and tax compliance in one workspace. YAHSHUA HRIS and YAHSHUA Payroll remain fully supported for existing customers.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
          <div className="lp-section-container text-center">
            <ScrollFadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                See it for yourself.
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
                  Book a Demo <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutContent;
