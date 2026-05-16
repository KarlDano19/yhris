"use client";

import Link from "next/link";
import Image from "next/image";

import {
  RefreshCw, ArrowRight, ArrowUpRight, Check,
  Zap, Shield, Clock, Users, FileText, Bell,
} from "lucide-react";

import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

import MainLogo from "@/svg/MainLogo";

const steps = [
  {
    step: "01",
    title: "Employee is onboarded",
    body: "Create the employee profile in YAHSHUA HRIS: employment details, salary, benefits, and documents all in one form.",
  },
  {
    step: "02",
    title: "Data syncs instantly, no action needed",
    body: "The moment a record is created or updated in HRIS, it pushes to YAHSHUA Payroll automatically and in real time. No CSV, no manual re-entry, no delays.",
  },
  {
    step: "03",
    title: "Leave and attendance flow in automatically",
    body: "Approved requests (leave, OT, undertime, rest day work) reflect in payroll the instant they're approved. No one needs to forward anything.",
  },
  {
    step: "04",
    title: "Payroll runs cleanly every cutoff",
    body: "Your payroll processor starts with accurate, real-time data every cutoff. No corrections, no chasing HR for numbers.",
  },
];

const syncedData = [
  { icon: Users, label: "Employee profiles", body: "Name, position, rate, and employment type sync automatically the moment a profile is created or updated." },
  { icon: Clock, label: "Time and attendance", body: "Clock-in records from ABBA Timekeeper flow directly into payroll in real time. No manual imports." },
  { icon: FileText, label: "Leave balances and requests", body: "Approved leave auto-deducts from payroll instantly. No manual tracking, no cutoff exports." },
  { icon: Zap, label: "Overtime and adjustments", body: "OT approvals sync to payroll automatically the moment they're signed off." },
  { icon: Bell, label: "Memos and NTEs", body: "Distribute disciplinary documents directly from HRIS via email." },
  { icon: Shield, label: "Personnel movement forms", body: "Promotions, transfers, and regularization update payroll rates automatically, in real time." },
];

const problems = [
  { before: "Export leave data to a spreadsheet every cutoff", after: "Leave reflects in payroll the moment it's approved" },
  { before: "Re-enter employee details in two separate systems", after: "One profile, shared across HRIS and Payroll" },
  { before: "Chase HR for OT totals before running payroll", after: "OT approvals sync to payroll automatically" },
  { before: "Fix payroll errors caused by stale data", after: "Payroll always starts with current, accurate records" },
];

const LpPayrollIntegrationContent = () => {
  return (
    <>
      <Navigation />
      <div style={{ background: 'hsl(var(--lp-page))' }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--lp-page)))' }} />
            <div className="lp-section-container relative z-10">
              <ScrollFadeIn>
                <span className="lp-section-label mb-6">PAYROLL INTEGRATION</span>
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] text-gray-900 mb-6 tracking-tight">
                    Your HRIS and Payroll,<br />
                    <span className="text-primary">finally in sync.</span>
                  </h1>
                  <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
                    YAHSHUA HRIS and YAHSHUA Payroll share the same data, synced automatically and in real time. No exports, no re-entry, no payroll errors from stale records.
                  </p>
                  <div className="flex flex-wrap gap-3">
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
                </div>
              </ScrollFadeIn>

              {/* Sync visual */}
              <ScrollFadeIn delay={120}>
                <div className="mt-16 pt-10" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 group">
                    <div className="w-full lg:w-[400px] h-[260px] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 16px 60px rgba(0,0,0,0.1)' }}>
                      <Image
                        src="/hris-dashboard.png"
                        alt="YAHSHUA HRIS Dashboard"
                        width={400}
                        height={260}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.2)' }}>
                        <RefreshCw className="w-6 h-6 text-primary animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1.5s_linear_infinite]" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Live Sync
                      </span>
                    </div>
                    <div className="w-full lg:w-[400px] h-[260px] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 16px 60px rgba(0,0,0,0.1)' }}>
                      <Image
                        src="/payroll-register.png"
                        alt="YAHSHUA Payroll Register"
                        width={400}
                        height={260}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Before / After */}
          <section className="py-24" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-2xl mb-14">
                  <span className="lp-section-label mb-5">THE PROBLEM IT SOLVES</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Disconnected HR and payroll<br />costs you every cutoff.
                  </h2>
                </div>
              </ScrollFadeIn>

              <div className="grid md:grid-cols-2 gap-px rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.07)' }}>
                {/* Column headers */}
                <div className="px-6 py-4" style={{ background: 'hsl(var(--lp-surface-2))' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Without integration</p>
                </div>
                <div className="px-6 py-4" style={{ background: 'hsl(var(--lp-surface))' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">With YAHSHUA integration</p>
                </div>

                {problems.map((p, i) => (
                  <>
                    <ScrollFadeIn key={`before-${i}`} delay={i * 60}>
                      <div className="px-6 py-5 flex items-start gap-3" style={{ background: 'hsl(var(--lp-surface-2))' }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(239,68,68,0.1)' }}>
                          <div className="w-1.5 h-0.5 bg-red-400 rounded-full" />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{p.before}</p>
                      </div>
                    </ScrollFadeIn>
                    <ScrollFadeIn key={`after-${i}`} delay={i * 60 + 30}>
                      <div className="px-6 py-5 flex items-start gap-3" style={{ background: 'hsl(var(--lp-surface))' }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(255,193,7,0.1)' }}>
                          <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                        </div>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{p.after}</p>
                      </div>
                    </ScrollFadeIn>
                  </>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-24" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
                  <div className="lg:sticky lg:top-36 self-start">
                    <span className="lp-section-label mb-5">HOW IT WORKS</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
                      Set it up once. Everything syncs automatically after that.
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                      Connect YAHSHUA HRIS to YAHSHUA Payroll once during onboarding. From that point on, every change in HRIS pushes to Payroll automatically and in real time. No one on your team needs to do anything.
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {steps.map((s) => (
                      <ScrollFadeIn key={s.step}>
                        <div className="py-7 first:pt-0 last:pb-0 flex gap-6">
                          <span className="text-xs font-mono text-gray-300 shrink-0 mt-1 select-none">{s.step}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1.5">{s.title}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                          </div>
                        </div>
                      </ScrollFadeIn>
                    ))}
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* What syncs */}
          <section className="py-24" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-xl mb-14">
                  <span className="lp-section-label mb-5">WHAT SYNCS</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Everything HR touches, payroll reflects.
                  </h2>
                </div>
              </ScrollFadeIn>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.07)' }}>
                {syncedData.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <ScrollFadeIn key={item.label} delay={i * 60}>
                      <div className="p-7" style={{ background: 'hsl(var(--lp-surface))' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(0,0,0,0.05)' }}>
                          <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1.5">{item.label}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Logo lockup */}
          <section className="py-20" style={{ background: 'hsl(var(--lp-surface))', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: 'hsl(var(--lp-surface-2))', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <div className="h-6 w-auto"><MainLogo /></div>
                      <span className="text-[11px] font-semibold text-gray-400">YAHSHUA HRIS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <RefreshCw className="w-6 h-6 text-primary animate-[spin_4s_linear_infinite]" />
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Live Sync</span>
                    </div>
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: 'hsl(var(--lp-surface-2))', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <span className="text-base font-bold text-gray-900">YAHSHUA</span>
                      <span className="text-sm font-semibold text-primary">Payroll</span>
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <p className="text-gray-900 font-semibold mb-2">Two products. One source of truth.</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Built by the same team to work together from day one. The sync is automatic and in real time. No third-party connectors, no delays, no data mismatches.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-24">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
                      Ready to cut the manual work?
                    </h2>
                    <p className="text-gray-500 text-base max-w-sm">
                      Start free or book a demo. No credit card required.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
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

export default LpPayrollIntegrationContent;
