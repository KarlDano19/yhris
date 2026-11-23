"use client";

import Link from "next/link";

import {
  Cloud,
  Users,
  ShieldCheck,
  Settings,
  Smartphone,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

import MainLogo from "@/svg/MainLogo";

const payrollFeatures = [
  {
    icon: Cloud,
    title: "Cloud-Based on AWS",
    description: "Hosted on Amazon Web Services. Open it in a browser and access your payroll data anywhere, with nothing to install.",
    highlights: ["AWS Hosting", "Web-Based Access", "No Installation"],
  },
  {
    icon: Users,
    title: "Pricing That Grows With Your Team",
    description: "A flat monthly rate covers up to 100 employees, with a per-employee fee above that. Payroll is included in the YAHSHUA HRIS and Payroll plan.",
    highlights: ["Flat Rate to 100 Employees", "PHP 60 per Added Employee", "Payroll Included"],
  },
  {
    icon: ShieldCheck,
    title: "Philippine Payroll Computation",
    description: "Computes BIR withholding tax, SSS, PhilHealth, and Pag-IBIG contributions, plus overtime, night differential, holiday, and rest-day pay. DOLE reports are part of YAHSHUA HRIS.",
    highlights: ["BIR Withholding Tax", "SSS, PhilHealth, Pag-IBIG", "Overtime and Night Differential"],
  },
  {
    icon: Settings,
    title: "Custom Pay Items and Loans",
    description: "Create your own pay items, taxable or non-taxable, as earnings or deductions, and track employee loans with a running balance.",
    highlights: ["Custom Pay Items", "Taxable and Non-Taxable", "Loan Running Balance"],
  },
];

const integrationApps = [
  {
    title: "ABBA Timekeeper App",
    description: "Mobile clock-in for employees, included with the YAHSHUA One Payroll subscription. Clock-ins appear in the admin's time logs.",
    tags: ["Mobile Clock-In", "Time Logs", "Included with Payroll"],
  },
  {
    title: "Employee Kiosk",
    description: "Employees use their YAHSHUA One account as their kiosk once the employer adds them to the company, with access to timekeeping, leaves, and cash advance requests that HR or the admin approves.",
    tags: ["Self-Service", "Timekeeping and Leaves", "Cash Advance Requests"],
  },
];

const YahshuaPayrollContent = () => {
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
                <span className="lp-section-label justify-center mb-3">YAHSHUA ONE PAYROLL</span>
                <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: November 2026</p>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                  YAHSHUA One Payroll.<br className="hidden md:inline" />
                  <span className="text-primary"> Cloud-based. Built for Philippine payroll.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                  Payroll for Philippine businesses, included with YAHSHUA HRIS. Open it in a browser, with nothing to install.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-primary lp-btn-glow gap-2"
                  >
                    Book a Free Demo <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <Link href="/register" className="lp-btn-ghost-dark gap-2">
                    Start the HRIS Free Trial <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="max-w-xl mb-14">
                  <span className="lp-section-label mb-5">FEATURES</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                    Powerful payroll features for Philippine businesses.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payrollFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollFadeIn key={feature.title} delay={i * 60}>
                      <div className="lp-light-card p-7 h-full flex flex-col">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0"
                          style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}
                        >
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{feature.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((h) => (
                            <span
                              key={h}
                              className="text-xs px-2.5 py-1 rounded-full text-gray-600"
                              style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </ScrollFadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Mobile Apps */}
          <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-5">FOR YOUR EMPLOYEES</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Clock-in and self-service for your team.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {integrationApps.map((app, i) => (
                  <ScrollFadeIn key={app.title} delay={i * 80}>
                    <div className="lp-light-card p-7 h-full flex flex-col">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0"
                        style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}
                      >
                        <Smartphone className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-3">{app.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{app.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {app.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full text-primary"
                            style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.2)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* HRIS Integration */}
          <section className="py-20 md:py-28" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: "#ffffff", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <div className="h-6 w-auto"><MainLogo /></div>
                      <span className="text-[11px] font-semibold text-gray-400">YAHSHUA HRIS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <RefreshCw className="w-6 h-6 text-primary animate-[spin_4s_linear_infinite]" />
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Single Sign-On</span>
                    </div>
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: "#ffffff", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <span className="text-base font-bold text-gray-900">YAHSHUA One</span>
                      <span className="text-sm font-semibold text-primary">Payroll</span>
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <span className="lp-section-label mb-4">HRIS INTEGRATION</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Connects to YAHSHUA HRIS.</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      Sign in to YAHSHUA HRIS through single sign-on with YAHSHUA One Payroll, and employee data from Payroll syncs into HRIS, so you do not re-enter employee records.
                    </p>
                    <Link href="/payroll-integration" className="lp-btn-primary gap-2">
                      Learn About Integration <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Ready to modernize your payroll?
                </h2>
                <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
                  Book a free demo and we will walk you through YAHSHUA One Payroll with YAHSHUA HRIS. The 30-day free trial covers the HRIS modules.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-primary lp-btn-glow gap-2"
                  >
                    Book a Free Demo <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <Link href="/register" className="lp-btn-ghost-dark gap-2">
                    Start the HRIS Free Trial <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default YahshuaPayrollContent;
