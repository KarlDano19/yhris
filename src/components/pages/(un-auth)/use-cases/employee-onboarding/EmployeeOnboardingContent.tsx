"use client";
import Link from "next/link";
import { UserPlus, FileCheck, Clock, BarChart3, Check, ArrowRight } from "lucide-react";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/landing-page/ScrollFadeIn";

const features = [
  { icon: FileCheck, title: "Digital Document Management", body: "Streamline document collection with digital forms, e-signatures, and automated reminders for missing paperwork." },
  { icon: Clock, title: "Automated Workflows", body: "Set up custom onboarding workflows that automatically trigger tasks, notifications, and approvals at the right time." },
  { icon: Check, title: "Compliance Tracking", body: "Ensure all regulatory requirements are met with built-in compliance templates and audit trails." },
  { icon: BarChart3, title: "Progress Monitoring", body: "Track onboarding progress in real-time with dashboards and reports for HR teams and managers." },
];

const processSteps = [
  { step: "01", title: "Pre-boarding Setup", body: "Send welcome emails, digital forms, and access credentials before the first day." },
  { step: "02", title: "First Day Experience", body: "Guide new hires through orientation, workspace setup, and initial introductions." },
  { step: "03", title: "Training and Integration", body: "Deliver role-specific training modules and facilitate team introductions." },
  { step: "04", title: "30-60-90 Day Check-ins", body: "Automated follow-ups to ensure successful integration and address any concerns." },
];

const results = [
  "New hires complete paperwork before their first day",
  "HR team focuses on relationship building instead of paperwork",
  "Zero compliance issues with automated templates",
  "New employees feel welcomed and prepared from day one",
];

const EmployeeOnboardingContent = () => {
  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid lp-hero-glow">
            <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--lp-page)))" }} />
            <div className="lp-section-container relative z-10 text-center">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">USE CASE</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-white mb-5 tracking-tight">
                  Employee Onboarding.<br className="hidden md:inline" />
                  <span className="text-primary"> Done right from day one.</span>
                </h1>
                <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
                  Transform your new hire experience with automated workflows, digital documents, and compliance tracking built in.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/use-cases" className="lp-btn-ghost gap-2">
                    View All Use Cases
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Business Story */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-12">
                  <span className="lp-section-label justify-center mb-4">CUSTOMER STORY</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">From Paper Chaos to Digital Excellence</h2>
                  <p className="text-primary font-medium text-sm mb-1">How Manila Tech Solutions Transformed Their Onboarding</p>
                  <p className="text-white/25 text-xs italic">This is a fictional story for illustration purposes only.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Challenge</p>
                      <p className="text-sm text-white/55 leading-relaxed">Manila Tech Solutions was struggling with manual onboarding. New hires waited weeks for paperwork, HR spent countless hours chasing documents, and compliance issues were mounting.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Solution</p>
                      <p className="text-sm text-white/55 leading-relaxed">With YAHSHUA HRIS, they digitized their entire onboarding workflow, from offer letters to first-day orientation.</p>
                    </div>
                  </div>
                  <div className="lp-dark-card p-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">The Results</p>
                    <ul className="space-y-3">
                      {results.map((r) => (
                        <li key={r} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" }}>
                            <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                          </span>
                          <span className="text-white/60">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">KEY FEATURES</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Everything your onboarding needs.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <ScrollFadeIn key={f.title} delay={i * 60}>
                      <div className="lp-dark-card p-7 flex gap-5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <Icon className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white/80 mb-2">{f.title}</h3>
                          <p className="text-sm text-white/45 leading-relaxed">{f.body}</p>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">PROCESS</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Onboarding in 4 steps.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((s, i) => (
                  <ScrollFadeIn key={s.step} delay={i * 60}>
                    <div className="lp-dark-card p-6">
                      <span className="text-xs font-mono text-white/20 mb-4 block">{s.step}</span>
                      <h3 className="text-sm font-bold text-white/80 mb-2">{s.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Ready to transform your onboarding?</h2>
                <p className="text-white/50 text-base mb-8 max-w-sm mx-auto">Start free or book a demo. No credit card required.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">Start for Free <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/use-cases" className="lp-btn-ghost gap-2">View All Use Cases</Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
        <LpFooter />
      </div>
    </>
  );
};

export default EmployeeOnboardingContent;
