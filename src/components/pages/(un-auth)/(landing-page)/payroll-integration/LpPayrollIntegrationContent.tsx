"use client";

import Link from "next/link";
import Image from "next/image";

import {
  RefreshCw, ArrowRight, ArrowUpRight, Check,
  Zap, Shield, Clock, Users, FileText, Bell,
} from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

import MainLogo from "@/svg/MainLogo";

const steps = [
  {
    step: "01",
    title: "Employees are set up in YAHSHUA One Payroll",
    body: "Your employee records live in YAHSHUA One Payroll, the same place your payroll runs.",
  },
  {
    step: "02",
    title: "Sign in to HRIS through Payroll",
    body: "Log in to YAHSHUA HRIS through YAHSHUA One Payroll's single sign-on. The two systems connect and employee data syncs into HRIS. No CSV, no re-typing.",
  },
  {
    step: "03",
    title: "Run your HR work in HRIS",
    body: "Post jobs, onboard hires, keep 201 files, send memos and notices to explain, and generate DOLE reports from the same employee records.",
  },
  {
    step: "04",
    title: "Payroll stays in Payroll",
    body: "Payroll runs in YAHSHUA One Payroll as it does today. Ask us in a demo how attendance, leave, and overtime fit your own setup.",
  },
];

const syncedData = [
  { icon: Users, label: "Employee profiles", body: "Employee data from YAHSHUA One Payroll syncs into HRIS, with no manual transfers." },
  { icon: Zap, label: "Single sign-on", body: "One login connects YAHSHUA One Payroll and YAHSHUA HRIS." },
  { icon: FileText, label: "Document generator", body: "Generate NTEs, certificates of employment, and employment agreements from employee records." },
  { icon: Bell, label: "Memos and NTEs", body: "Distribute disciplinary documents directly from HRIS via email." },
  { icon: Shield, label: "Personnel movement forms", body: "Record promotions, transfers, and regularization with approver notes." },
  { icon: Clock, label: "DOLE reports", body: "Generate reports ready for submission in a few clicks." },
];

const problems = [
  { before: "Export employee data to a spreadsheet to move it between systems", after: "Employee data syncs from YAHSHUA One Payroll into HRIS" },
  { before: "Re-enter employee details in two separate systems", after: "One profile, shared across HRIS and Payroll" },
  { before: "Dig through files and spreadsheets for DOLE reports", after: "DOLE reports generated from the same employee records" },
  { before: "Log in separately to each system", after: "Sign in once through YAHSHUA One Payroll" },
];

const LpPayrollIntegrationContent = () => {
  return (
    <div style={{ background: "#ffffff" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-28 pb-20 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
            <div className="lp-section-container relative z-10">
              <ScrollFadeIn>
                <span className="lp-section-label mb-3">PAYROLL INTEGRATION</span>
                <p className="text-[11px] text-gray-400 mb-6">Last reviewed: November 2026</p>
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] text-gray-900 mb-6 tracking-tight">
                    Your HRIS and Payroll,<br />
                    <span className="text-primary">on one sign-in.</span>
                  </h1>
                  <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
                    YAHSHUA HRIS connects to YAHSHUA One Payroll through single sign-on, and your employee data syncs into HRIS. No exports, no re-typing.
                  </p>
                  <div className="flex flex-wrap gap-3">
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
                </div>
              </ScrollFadeIn>

              {/* Sync visual */}
              <ScrollFadeIn delay={120}>
                <div className="mt-16 pt-10" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 group">
                    <div className="w-full lg:w-[400px] h-[260px] rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                      <Image
                        src="/hris-dashboard.png"
                        alt="YAHSHUA HRIS Dashboard"
                        width={400}
                        height={260}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.2)" }}>
                        <RefreshCw className="w-6 h-6 text-primary animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1.5s_linear_infinite]" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Single Sign-On
                      </span>
                    </div>
                    <div className="w-full lg:w-[400px] h-[260px] rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                      <Image
                        src="/payroll-register.png"
                        alt="YAHSHUA One Payroll Register"
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
          <section className="py-24" style={{ background: "#FFFBF0", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-2xl mb-14">
                  <span className="lp-section-label mb-5">THE PROBLEM IT SOLVES</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Disconnected HR and payroll<br />costs you every cutoff.
                  </h2>
                </div>
              </ScrollFadeIn>

              <div className="grid md:grid-cols-2 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}>
                {/* Column headers */}
                <div className="px-6 py-4 bg-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Without integration</p>
                </div>
                <div className="px-6 py-4" style={{ background: "rgba(255,193,7,0.06)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">With YAHSHUA integration</p>
                </div>

                {problems.map((p, i) => (
                  <>
                    <ScrollFadeIn key={`before-${i}`} delay={i * 60}>
                      <div className="px-6 py-5 flex items-start gap-3 bg-white">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(239,68,68,0.1)" }}>
                          <div className="w-1.5 h-0.5 bg-red-400 rounded-full" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{p.before}</p>
                      </div>
                    </ScrollFadeIn>
                    <ScrollFadeIn key={`after-${i}`} delay={i * 60 + 30}>
                      <div className="px-6 py-5 flex items-start gap-3" style={{ background: "rgba(255,193,7,0.05)" }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,193,7,0.12)" }}>
                          <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                        </div>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">{p.after}</p>
                      </div>
                    </ScrollFadeIn>
                  </>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-24" style={{ background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
                  <div className="lg:sticky lg:top-36 self-start">
                    <span className="lp-section-label mb-5">HOW IT WORKS</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
                      Sign in through Payroll. Your employee records follow.
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                      Log in to YAHSHUA HRIS through YAHSHUA One Payroll's single sign-on and your employee data syncs into HRIS, with no manual transfers.
                    </p>
                  </div>

                  <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                    {steps.map((s) => (
                      <ScrollFadeIn key={s.step}>
                        <div className="py-7 first:pt-0 last:pb-0 flex gap-6">
                          <span className="text-xs font-mono text-gray-300 shrink-0 mt-1 select-none">{s.step}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 mb-1.5">{s.title}</p>
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
          <section className="py-24" style={{ background: "#FFFBF0", borderBottom: "1px solid rgba(255,193,7,0.15)" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-xl mb-14">
                  <span className="lp-section-label mb-5">WHAT YOU GET</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    One sign-in. One set of employee records.
                  </h2>
                </div>
              </ScrollFadeIn>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}>
                {syncedData.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <ScrollFadeIn key={item.label} delay={i * 60}>
                      <div className="p-7 bg-white">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
                          <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1.5">{item.label}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Logo lockup */}
          <section className="py-20" style={{ background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <div className="h-6 w-auto"><MainLogo /></div>
                      <span className="text-[11px] font-semibold text-gray-400">YAHSHUA HRIS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <RefreshCw className="w-6 h-6 text-primary animate-[spin_4s_linear_infinite]" />
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Single Sign-On</span>
                    </div>
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <span className="text-base font-bold text-gray-900">YAHSHUA</span>
                      <span className="text-sm font-semibold text-primary">One Payroll</span>
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <p className="text-gray-900 font-semibold mb-2">Two products. One sign-in.</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Built by the same team to work together. Employee data syncs from YAHSHUA One Payroll into HRIS, with no third-party connectors.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-24" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
                      Ready to cut the manual work?
                    </h2>
                    <p className="text-gray-500 text-base max-w-sm">
                      Start your 30-day free trial or book a demo.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
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
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default LpPayrollIntegrationContent;
