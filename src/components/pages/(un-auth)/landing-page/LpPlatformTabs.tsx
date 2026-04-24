"use client";
import { useState } from "react";
import { UserPlus, FolderOpen, CalendarCheck, Clock, ShieldCheck, BarChart3 } from "lucide-react";
import AnimatedCheckmark from "./AnimatedCheckmark";
import ScrollFadeIn from "./ScrollFadeIn";

const icons = [UserPlus, FolderOpen, CalendarCheck, Clock, ShieldCheck, BarChart3];

const tabs = [
  {
    label: "Recruitment",
    headline: "Recruit and Hire Without Leaving Your HR System",
    body: "Post job openings directly to Facebook, LinkedIn, and YAHSHUA Jobs. Screen applicants, schedule interviews, record notes, send contracts, and onboard, all in one place.",
    features: [
      "Built-in job posting to Facebook, LinkedIn, and YAHSHUA Jobs",
      "Applicant screening and interview scheduling",
      "Contract sending and offer management",
      "New hire onboarding via email, auto-syncs to Payroll",
    ],
    preview: {
      stats: ["12 Active Openings", "48 Applicants", "5 Interviews Today"],
      rows: [
        { name: "Maria Santos", position: "Marketing Associate", status: "Interview", statusColor: "bg-blue-500" },
        { name: "Juan Cruz", position: "Software Engineer", status: "Applied", statusColor: "bg-primary" },
        { name: "Ana Reyes", position: "HR Assistant", status: "Offer", statusColor: "bg-emerald-500" },
      ],
    },
  },
  {
    label: "Employee Management",
    headline: "The Complete Employee Record, From Day One",
    body: "Digital 201 files, personnel movement forms, incident reports, and NTEs, all in one secure, searchable system.",
    features: [
      "Digital 201 file management",
      "Personnel Movement Forms and Incident Reports (NTE)",
      "Document distribution via email and ABBA Kiosk",
      "Full employee lifecycle from onboarding to separation",
    ],
    preview: {
      stats: ["148 Active", "12 On Leave", "3 New Hires"],
      rows: [
        { name: "Carlo Mendoza", position: "Accounting", status: "Active", statusColor: "bg-blue-500" },
        { name: "Sofia Garcia", position: "Operations", status: "Active", statusColor: "bg-blue-500" },
        { name: "Mark Rivera", position: "Engineering", status: "On Leave", statusColor: "bg-primary" },
      ],
    },
  },
  {
    label: "Leave & Attendance",
    headline: "Leave Requests That Flow Directly Into Payroll",
    body: "Employees submit leave, OB, OT, undertime, rest day, and holiday work requests through the ABBA Kiosk. Auto-reflected in payroll.",
    features: [
      "All request types: leave, OB, OT, undertime, rest day, holiday work",
      "Built-in approval workflows",
      "Auto-reflected in payroll computations",
      "ABBA Kiosk: web and mobile access for employees",
    ],
    preview: {
      stats: ["12 Pending", "34 Approved", "2 Declined"],
      rows: [
        { name: "Lia Torres", position: "Vacation Leave · Mar 5–7", status: "Pending", statusColor: "bg-amber-500" },
        { name: "David Lim", position: "Sick Leave · Mar 3", status: "Approved", statusColor: "bg-emerald-500" },
        { name: "Rose Tan", position: "OT Request · Mar 4", status: "Pending", statusColor: "bg-amber-500" },
      ],
    },
  },
  {
    label: "Time Tracking",
    headline: "Accurate Time. Anywhere. Even Offline.",
    body: "The ABBA Timekeeper App supports facial recognition, geo-location tagging, and offline clock-ins. Time data flows automatically into payroll.",
    features: [
      "Facial recognition and geo-location tagging",
      "Offline clock-ins that sync when back online",
      "Automatic payroll-ready time data",
      "Onsite and remote-ready",
    ],
    preview: {
      stats: ["156 Clocked In", "8.2 Avg Hours", "12 OT Hours"],
      rows: [
        { name: "Jay Santos", position: "08:01 – 17:05 · 8h 4m", status: "Complete", statusColor: "bg-emerald-500" },
        { name: "Mia Cruz", position: "08:15 – In Progress", status: "Active", statusColor: "bg-blue-500" },
        { name: "Leo Bautista", position: "07:58 – 17:30 · 9h 32m", status: "OT", statusColor: "bg-primary" },
      ],
    },
  },
  {
    label: "Compliance",
    headline: "DOLE Compliance Built In, Not Bolted On",
    body: "Generate DOLE-required reports without leaving your HRIS. GDPR, SOC2 Type 2, and ISO 27001 certified.",
    features: [
      "Work Accident/Illness Reports and EC Logbooks",
      "OSH Minutes and annual compliance reports",
      "GDPR, SOC2 Type 2, and ISO 27001 compliant",
      "Single Sign-On (SSO) for YAHSHUA Payroll users",
    ],
    preview: {
      stats: ["8 Reports Ready", "2 Due Soon", "All Compliant"],
      rows: [
        { name: "Work Accident Report", position: "DOLE · Generated Mar 1", status: "Compliant", statusColor: "bg-emerald-500" },
        { name: "EC Logbook", position: "DOLE · Due Mar 15", status: "Due Soon", statusColor: "bg-amber-500" },
        { name: "OSH Minutes", position: "DOLE · Generated Feb 28", status: "Compliant", statusColor: "bg-emerald-500" },
      ],
    },
  },
  {
    label: "Performance",
    headline: "Track Growth Without Leaving Your HRIS",
    body: "Built-in evaluation tools with no separate module or upgrade required. Set schedules, use templates, and track scores.",
    features: [
      "Built-in performance evaluation scheduling",
      "Ready-made evaluation templates",
      "Score tracking and performance history",
      "Training & Development module (coming soon)",
    ],
    preview: {
      stats: ["24 Completed", "12 Scheduled", "3 Overdue"],
      rows: [
        { name: "Anna Reyes", position: "Q4 2024 · Score: 4.5/5", status: "Completed", statusColor: "bg-emerald-500" },
        { name: "Ben Aquino", position: "Q1 2025 · Scheduled Mar 15", status: "Scheduled", statusColor: "bg-blue-500" },
        { name: "Cara Lim", position: "Q4 2024 · Overdue", status: "Overdue", statusColor: "bg-red-500" },
      ],
    },
  },
];

const LpPlatformTabs = () => {
  const [active, setActive] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const tab = tabs[active];

  const switchTab = (i: number) => {
    setActive(i);
    setFadeKey((k) => k + 1);
  };

  return (
    <section id="features" className="py-28 md:py-36">
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">THE FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-white tracking-tight">
            Every HR workflow your team actually uses,<br className="hidden lg:inline" /> in one place.
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            No add-ons. No integrations to maintain. No per-feature upgrades.
          </p>
        </ScrollFadeIn>

        {/* Tab bar */}
        <ScrollFadeIn delay={100}>
          <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 mb-12">
            <div className="flex gap-1.5 justify-start md:justify-center min-w-max md:min-w-0 md:flex-wrap">
              {tabs.map((t, i) => {
                const Icon = icons[i];
                return (
                  <button
                    key={t.label}
                    onClick={() => switchTab(i)}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap inline-flex items-center gap-2"
                    style={i === active ? {
                      background: 'rgba(255,193,7,0.12)',
                      border: '1px solid rgba(255,193,7,0.25)',
                      color: 'hsl(var(--lp-primary))',
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollFadeIn>

        {/* Tab panel */}
        <ScrollFadeIn key={fadeKey} delay={150}>
          <div className="grid lg:grid-cols-[4fr_6fr] gap-10 lg:gap-16 items-start">

            {/* Left copy */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-white">{tab.headline}</h3>
              <p className="text-white/45 leading-relaxed mb-8 text-sm md:text-base">{tab.body}</p>
              <ul className="space-y-3.5">
                {tab.features.map((f, i) => (
                  <AnimatedCheckmark key={`${fadeKey}-${f}`} delay={i * 80}>
                    {f}
                  </AnimatedCheckmark>
                ))}
              </ul>
            </div>

            {/* Right preview */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'hsl(var(--lp-surface))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
              {/* Stats bar */}
              <div className="flex gap-2 p-4 md:p-5 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                {tab.preview.stats.map((s) => (
                  <span key={s} className="text-[11px] font-semibold text-white/60 rounded-md px-3 py-1.5 whitespace-nowrap"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {s}
                  </span>
                ))}
              </div>
              {/* Rows */}
              <div>
                {tab.preview.rows.map((r, i) => (
                  <div key={r.name} className="flex items-center justify-between px-5 py-4 md:py-5"
                    style={{ borderBottom: i < tab.preview.rows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-semibold text-white truncate">{r.name}</p>
                      <p className="text-xs text-white/40 truncate mt-0.5">{r.position}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full text-white shrink-0 ${r.statusColor}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpPlatformTabs;
