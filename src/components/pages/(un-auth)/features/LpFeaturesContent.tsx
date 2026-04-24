"use client";
import { useState } from "react";
import Link from "next/link";
import {
  UserPlus, FolderOpen,
  ShieldCheck, ArrowRight, ArrowUpRight,
} from "lucide-react";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/landing-page/ScrollFadeIn";

const categories = [
  {
    id: "recruitment",
    label: "Recruitment",
    icon: UserPlus,
    number: "01",
    video: "/RECRUITMENT.mp4",
    headline: "Post, Screen, and Hire Without Leaving Your HRIS",
    description:
      "From job posting to signed contract, every step of your hiring process lives in one place. No switching tabs, no manual handoffs.",
    features: [
      { title: "Multi-platform job posting", body: "Publish to Facebook, LinkedIn, and YAHSHUA Jobs in one click." },
      { title: "Applicant screening", body: "Filter candidates, schedule interviews, and keep notes in the same system." },
      { title: "Digital onboarding", body: "Send contracts, introduce the team, and enroll new hires via email automatically." },
      { title: "Job posting history", body: "Track every role ever opened with status, dates, and outcomes." },
    ],
  },
  {
    id: "employee-management",
    label: "Employee Management",
    icon: FolderOpen,
    number: "02",
    video: "/CENTRALIZED 201.mp4",
    headline: "Every Employee Record, Secure and Searchable",
    description:
      "Digital 201 files, movement forms, incident reports, and separation documents. Organized, accessible, and audit-ready whenever you need them.",
    features: [
      { title: "Digital 201 files", body: "Complete employee records from hire date, accessible anytime." },
      { title: "Personnel movement", body: "Document regularization, promotions, and job changes with approval signatures." },
      { title: "Incident reports and NTEs", body: "Process disciplinary documents with a full audit trail." },
      { title: "Employee separation", body: "Manage clearance forms and quitclaims through a complete offboarding workflow." },
    ],
  },
  {
    id: "compliance",
    label: "DOLE Compliance",
    icon: ShieldCheck,
    number: "03",
    video: "/DOLE COMPLIANCE.mp4",
    headline: "Every DOLE Report You Need, Generated in Minutes",
    description:
      "Stop building reports manually. YAHSHUA HRIS generates all required DOLE documentation directly from your existing HR data.",
    features: [
      { title: "Work Accident and Illness Reports", body: "DOLE-format reports generated directly from incident records." },
      { title: "EC Logbooks", body: "Employee Compensation logbooks kept current and ready to submit." },
      { title: "OSH documentation", body: "Full suite of Occupational Safety and Health minutes and annual reports." },
      { title: "International certifications", body: "GDPR, SOC2 Type 2, and ISO 27001 certified security." },
    ],
  },
];

const LpFeaturesContent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const cat = categories[activeIndex];
  const Icon = cat.icon;

  const switchTab = (i: number) => {
    if (i === activeIndex) return;
    setActiveIndex(i);
    setFadeKey((k) => k + 1);
  };

  return (
    <>
      <Navigation />
      <div style={{ background: 'hsl(var(--lp-page))' }}>
        <main className="min-h-screen pt-16">

          {/* ── Hero ── */}
          <section className="relative pt-28 pb-20 lp-dot-grid lp-hero-glow overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--lp-page)))' }}
            />
            <div className="lp-section-container relative z-10 text-center">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">FEATURES</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-white mb-5 tracking-tight">
                  Every HR workflow your team needs.<br className="hidden md:inline" />
                  <span className="text-primary"> All in one system.</span>
                </h1>
                <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
                  From the first job posting to an employee's last day, with built-in DOLE compliance and payroll sync.
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

          {/* ── Tab switcher ── */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">

              {/* Tab strip */}
              <ScrollFadeIn>
                <div className="flex flex-wrap gap-2 mb-14 justify-center">
                  {categories.map((c, i) => {
                    const TabIcon = c.icon;
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => switchTab(i)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                        style={isActive ? {
                          background: 'rgba(255,193,7,0.12)',
                          border: '1px solid rgba(255,193,7,0.25)',
                          color: 'hsl(var(--lp-primary))',
                        } : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        <TabIcon className="w-4 h-4" strokeWidth={1.5} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </ScrollFadeIn>

              {/* Active panel */}
              <div key={fadeKey} className="flex flex-col gap-8 animate-[fadeSlideIn_0.25s_ease-out]">

                {/* Copy — above video */}
                <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-xs font-mono text-white/20 select-none">{cat.number}</span>
                      <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.12)' }} />
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{cat.label}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-white leading-tight mb-4 tracking-tight">
                      {cat.headline}
                    </h2>
                    <p className="text-white/50 leading-relaxed">{cat.description}</p>
                  </div>

                  <ul className="space-y-4">
                    {cat.features.map((f) => (
                      <li key={f.title} className="flex items-start gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.2)' }}
                        >
                          <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white/85 mb-0.5">{f.title}</p>
                          <p className="text-sm text-white/40 leading-relaxed">{f.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video — below copy */}
                <video
                  key={cat.video}
                  src={cat.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-2xl"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                />

              </div>
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <section className="py-20 md:py-28">
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div
                  className="relative rounded-2xl text-center px-8 py-16 md:py-20 overflow-hidden"
                  style={{ background: 'hsl(var(--lp-surface))', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,193,7,0.07), transparent 70%)' }} />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px pointer-events-none"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(255,193,7,0.4), transparent)' }} />

                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3 tracking-tight">
                      Ready to see it in action?
                    </h2>
                    <p className="text-white/45 text-base max-w-sm mx-auto mb-10">
                      Book a free demo or start with the free plan. No credit card required.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
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

export default LpFeaturesContent;
