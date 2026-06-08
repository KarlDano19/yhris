"use client";

import Link from "next/link";

import {
  Cloud,
  Users,
  ShieldCheck,
  CreditCard,
  FileText,
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
    description: "Hosted on Amazon Web Services for maximum reliability and security. Access your payroll data anywhere, anytime.",
    highlights: ["AWS Hosting", "24/7 Availability", "Automatic Backups"],
  },
  {
    icon: Users,
    title: "Scalable for Any Business",
    description: "Supports businesses from 5 to 10,000 employees with unlimited users regardless of your pricing plan.",
    highlights: ["5 to 10,000 Employees", "Unlimited Users", "No User Limits"],
  },
  {
    icon: ShieldCheck,
    title: "100% Labor Law Compliant",
    description: "Fully compliant with DOLE and Philippine labor laws. Stay updated with regulatory changes automatically.",
    highlights: ["DOLE Compliant", "Auto Updates", "Legal Protection"],
  },
  {
    icon: CreditCard,
    title: "Direct Bank and GCash Disbursement",
    description: "Disburse employee payroll directly to their bank accounts or via GCash for convenient and fast payments.",
    highlights: ["Bank Integration", "GCash Support", "Instant Payments"],
  },
  {
    icon: FileText,
    title: "Audit Trail and Logging",
    description: "Complete audit log and trailing to track all payroll activities for transparency and compliance.",
    highlights: ["Activity Tracking", "Full Transparency", "Compliance Ready"],
  },
  {
    icon: Settings,
    title: "Fully Customizable",
    description: "Customize the system to meet your specific business requirements with flexible configuration options.",
    highlights: ["Custom Workflows", "Flexible Setup", "Business Specific"],
  },
];

const integrationApps = [
  {
    title: "ABBA Timekeeper App",
    description: "Facial recognition time tracking with offline capability and geo-location tracking.",
    tags: ["Facial Recognition", "Offline Capability", "Geo-location"],
  },
  {
    title: "ABBA Kiosk App",
    description: "Employee self-service portal for requests and profile management on Android, iOS, and Huawei.",
    tags: ["Self-Service Portal", "Multi-Platform", "Request Management"],
  },
  {
    title: "ABBA Approval App",
    description: "Manage and approve employee requests anytime, anywhere with mobile convenience.",
    tags: ["Mobile Approvals", "Request Management", "24/7 Access"],
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
                <span className="lp-section-label justify-center mb-3">YAHSHUA PAYROLL</span>
                <p className="text-[11px] text-gray-400 text-center mb-5">Last reviewed: June 2026</p>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">
                  YAHSHUA Payroll Online.<br className="hidden md:inline" />
                  <span className="text-primary"> Cloud-based. Fully compliant.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                  Next generation payroll business solution designed for Philippine businesses of all sizes. No installs, no maintenance, always up to date.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href="https://showcase.yahshuapayroll.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-primary lp-btn-glow gap-2"
                  >
                    View Live Demo <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <Link href="/register" className="lp-btn-ghost-dark gap-2">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
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
                  <span className="lp-section-label justify-center mb-5">INTEGRATED APPS</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Complete ecosystem of mobile apps.
                  </h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Live Sync</span>
                    </div>
                    <div className="rounded-xl px-6 py-4 flex flex-col items-center gap-1.5 min-w-[160px]" style={{ background: "#ffffff", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <span className="text-base font-bold text-gray-900">YAHSHUA</span>
                      <span className="text-sm font-semibold text-primary">Payroll</span>
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <span className="lp-section-label mb-4">HRIS INTEGRATION</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Perfect integration with YAHSHUA HRIS.</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      Employee data flows automatically from HRIS to Payroll, eliminating duplicate entry and ensuring data consistency across your organization.
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
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                  Start free or explore the live demo. No credit card required.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register" className="lp-btn-primary lp-btn-glow gap-2">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://showcase.yahshuapayroll.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-ghost-dark gap-2"
                  >
                    View Live Demo <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default YahshuaPayrollContent;
