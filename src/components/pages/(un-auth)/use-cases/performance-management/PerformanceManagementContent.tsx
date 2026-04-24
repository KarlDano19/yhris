"use client";
import Link from "next/link";
import { BarChart3, Users, ClipboardList, GraduationCap, CalendarDays, ArrowRight } from "lucide-react";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import LpFooter from "@/components/pages/(un-auth)/landing-page/LpFooter";
import ScrollFadeIn from "@/components/pages/(un-auth)/landing-page/ScrollFadeIn";

const features = [
  { icon: CalendarDays, title: "Scheduled Check-Ins", body: "Empower managers to set and track regular performance conversations ahead of time, ensuring consistency and meaningful engagement." },
  { icon: Users, title: "Employee Self-Evaluations", body: "Give employees a space to reflect on their own progress, encouraging ownership and alignment with team goals." },
  { icon: ClipboardList, title: "Centralized Evaluation Records", body: "Keep all evaluations organized and accessible in one place, eliminating the risks of paper trails and scattered files." },
  { icon: GraduationCap, title: "Development-Focused Reviews", body: "Turn performance reviews into opportunities for growth by focusing on clear feedback and future-focused conversations." },
];

const reviewCycle = [
  { step: "01", phase: "Setup Evaluation Template", description: "Customize evaluation forms to align with your company's roles, values, and performance criteria.", duration: "Initial Setup" },
  { step: "02", phase: "Schedule Evaluations", description: "Automate evaluation schedules to ensure consistent and timely performance reviews.", duration: "Recurring" },
  { step: "03", phase: "Conduct Evaluations", description: "Easily complete employee evaluations with structured forms and built-in rating systems.", duration: "As Scheduled" },
  { step: "04", phase: "View Evaluation History", description: "Track employee performance trends through a centralized evaluation record system.", duration: "Ongoing" },
];

const results = [
  "Managers hold timely, meaningful check-ins scheduled in advance",
  "Employees actively self-evaluate and stay engaged",
  "HR gains full visibility over current and past evaluations",
  "Performance discussions shift from chores to growth opportunities",
];

const PerformanceManagementContent = () => {
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
                  Performance Management.<br className="hidden md:inline" />
                  <span className="text-primary"> Elevate every review.</span>
                </h1>
                <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
                  Comprehensive evaluation tools, continuous feedback systems, and data-driven insights to grow your team.
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
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Transforming Performance Reviews from Burden to Breakthrough</h2>
                  <p className="text-primary font-medium text-sm mb-1">How Companies Transform Employee Development</p>
                  <p className="text-white/25 text-xs italic">This is a fictional story for illustration purposes only.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Challenge</p>
                      <p className="text-sm text-white/55 leading-relaxed">Companies relying on paper evaluations face outdated, hard-to-manage processes, often leading to delays, lost records, and low engagement. With limited budgets, they are stuck using inefficient methods or skipping performance reviews altogether.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">The Solution</p>
                      <p className="text-sm text-white/55 leading-relaxed">YAHSHUA HRIS simplifies everything: a single intuitive platform to create, customize, manage, and store evaluations. No paperwork, no hassle.</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Comprehensive performance tools.</h2>
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

          {/* Review Cycle */}
          <section className="py-20 md:py-28" style={{ background: "hsl(var(--lp-surface))" }}>
            <div className="lp-section-container">
              <ScrollFadeIn>
                <div className="text-center mb-14">
                  <span className="lp-section-label justify-center mb-4">PROCESS</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Performance review cycle in 4 steps.</h2>
                </div>
              </ScrollFadeIn>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviewCycle.map((s, i) => (
                  <ScrollFadeIn key={s.step} delay={i * 60}>
                    <div className="lp-dark-card p-6">
                      <span className="text-xs font-mono text-white/20 mb-4 block">{s.step}</span>
                      <h3 className="text-sm font-bold text-white/80 mb-2">{s.phase}</h3>
                      <p className="text-sm text-white/40 leading-relaxed mb-4">{s.description}</p>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(255,193,7,0.1)", color: "rgba(255,193,7,0.7)", border: "1px solid rgba(255,193,7,0.15)" }}>{s.duration}</span>
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
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Ready to transform performance management?</h2>
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

export default PerformanceManagementContent;
