"use client";
import { useEffect, useState } from "react";

import {
  AlertTriangle, ArrowLeft, BarChart3, Bell, BookOpen,
  Building2, ChevronDown, ClipboardCheck, ClipboardList,
  FileText, Filter, HandshakeIcon, HeartPulse, Network,
  Plus, Search, Settings, ShieldCheck, Thermometer,
  UserPlus, Users,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BLUE   = "#355FD0";
const YELLOW = "#FFC008";
const NAVY   = "#2C3F58";
const BORDER = "#DDE3F0";
const BG     = "#F4F6FB";

// ── Product top-bar ───────────────────────────────────────────────────────────
const ProductTopBar = () => (
  <div
    className="flex items-center justify-between px-4 py-2.5 shrink-0"
    style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}
  >
    {/* Logo — inline so we can use dark text on light background */}
    <div style={{ transform: "scale(0.65)", transformOrigin: "left center" }}>
      <svg width="203" height="29" viewBox="0 0 203 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.5 22V16.66L42.2 8H45.7L49.06 13.62L52.2 8H55.4L50.5 16.66V22H47.5ZM54.4164 22L59.6164 8H62.5964L67.8164 22H64.6564L63.5764 19.14H58.3964L57.3364 22H54.4164ZM59.3164 16.66H62.6764L60.9964 11.8L59.3164 16.66ZM70.0255 22V8H73.0055V13.56H79.0055V8H81.9855V22H79.0055V16.04H73.0055V22H70.0255ZM90.6008 22.24C89.3608 22.24 88.3274 22.0667 87.5008 21.72C86.6741 21.3733 86.0408 20.8933 85.6008 20.28C85.1741 19.6533 84.9408 18.9267 84.9008 18.1H87.9008C88.0074 18.62 88.2474 19.02 88.6208 19.3C89.0074 19.58 89.6674 19.72 90.6008 19.72C91.5608 19.72 92.2474 19.5933 92.6608 19.34C93.0874 19.0733 93.3008 18.7 93.3008 18.22C93.3008 17.82 93.1741 17.4933 92.9208 17.24C92.6808 16.9867 92.3074 16.7733 91.8008 16.6C91.2941 16.4133 90.6341 16.24 89.8208 16.08C88.8741 15.8933 88.0608 15.6333 87.3808 15.3C86.7008 14.9667 86.1808 14.5133 85.8208 13.94C85.4741 13.3667 85.3008 12.64 85.3008 11.76C85.3008 10.9467 85.5141 10.2467 85.9408 9.66C86.3674 9.06 86.9808 8.59333 87.7808 8.26C88.5808 7.92667 89.5208 7.76 90.6008 7.76C91.7741 7.76 92.7341 7.92667 93.4808 8.26C94.2408 8.58 94.8141 9.03333 95.2008 9.62C95.6008 10.2067 95.8341 10.9 95.9008 11.7H92.9208C92.8141 11.22 92.5941 10.8667 92.2608 10.64C91.9274 10.4 91.3741 10.28 90.6008 10.28C89.8141 10.28 89.2341 10.4067 88.8608 10.66C88.4874 10.9133 88.3008 11.2533 88.3008 11.68C88.3008 12.2 88.5541 12.6067 89.0608 12.9C89.5808 13.1933 90.3941 13.4467 91.5008 13.66C92.2608 13.8067 92.9341 13.9867 93.5208 14.2C94.1208 14.4133 94.6274 14.6933 95.0408 15.04C95.4541 15.3733 95.7674 15.78 95.9808 16.26C96.1941 16.74 96.3008 17.32 96.3008 18C96.3008 18.8533 96.0741 19.6 95.6208 20.24C95.1808 20.88 94.5341 21.3733 93.6808 21.72C92.8408 22.0667 91.8141 22.24 90.6008 22.24ZM99.2044 22V8H102.184V13.56H108.184V8H111.164V22H108.184V16.04H102.184V22H99.2044ZM120.48 22.24C119.28 22.24 118.24 22.0267 117.36 21.6C116.48 21.1733 115.8 20.5267 115.32 19.66C114.84 18.7933 114.6 17.7067 114.6 16.4V8H117.58V16.12C117.58 17.32 117.813 18.22 118.28 18.82C118.746 19.42 119.48 19.72 120.48 19.72C121.48 19.72 122.213 19.42 122.68 18.82C123.146 18.22 123.38 17.3267 123.38 16.14V8H126.36V16.4C126.36 17.7067 126.12 18.7933 125.64 19.66C125.173 20.5267 124.5 21.1733 123.62 21.6C122.74 22.0267 121.693 22.24 120.48 22.24ZM127.881 22L133.081 8H136.061L141.281 22H138.121L137.041 19.14H131.861L130.801 22H127.881ZM132.781 16.66H136.141L134.461 11.8L132.781 16.66Z" fill={NAVY} />
        <path d="M148.89 22V8H151.87V13.56H157.87V8H160.85V22H157.87V16.04H151.87V22H148.89ZM164.486 22V8H170.146C171.319 8 172.292 8.18667 173.066 8.56C173.852 8.93333 174.446 9.46 174.846 10.14C175.246 10.8067 175.446 11.5933 175.446 12.5C175.446 13.46 175.199 14.3 174.706 15.02C174.212 15.7267 173.459 16.24 172.446 16.56L175.846 22H172.386L169.446 16.88H167.466V22H164.486ZM167.466 14.52H169.566C170.672 14.52 171.432 14.3533 171.846 14.02C172.259 13.6733 172.466 13.1667 172.466 12.5C172.466 11.8333 172.259 11.3333 171.846 11C171.432 10.6533 170.672 10.48 169.566 10.48H167.466V14.52ZM178.894 22V8H181.874V22H178.894ZM190.676 22.24C189.436 22.24 188.402 22.0667 187.576 21.72C186.749 21.3733 186.116 20.8933 185.676 20.28C185.249 19.6533 185.016 18.9267 184.976 18.1H187.976C188.082 18.62 188.322 19.02 188.696 19.3C189.082 19.58 189.742 19.72 190.676 19.72C191.636 19.72 192.322 19.5933 192.736 19.34C193.162 19.0733 193.376 18.7 193.376 18.22C193.376 17.82 193.249 17.4933 192.996 17.24C192.756 16.9867 192.382 16.7733 191.876 16.6C191.369 16.4133 190.709 16.24 189.896 16.08C188.949 15.8933 188.136 15.6333 187.456 15.3C186.776 14.9667 186.256 14.5133 185.896 13.94C185.549 13.3667 185.376 12.64 185.376 11.76C185.376 10.9467 185.589 10.2467 186.016 9.66C186.442 9.06 187.056 8.59333 187.856 8.26C188.656 7.92667 189.596 7.76 190.676 7.76C191.849 7.76 192.809 7.92667 193.556 8.26C194.316 8.58 194.889 9.03333 195.276 9.62C195.676 10.2067 195.909 10.9 195.976 11.7H192.996C192.889 11.22 192.669 10.8667 192.336 10.64C192.002 10.4 191.449 10.28 190.676 10.28C189.889 10.28 189.309 10.4067 188.936 10.66C188.562 10.9133 188.376 11.2533 188.376 11.68C188.376 12.2 188.629 12.6067 189.136 12.9C189.656 13.1933 190.469 13.4467 191.576 13.66C192.336 13.8067 193.009 13.9867 193.596 14.2C194.196 14.4133 194.702 14.6933 195.116 15.04C195.529 15.3733 195.842 15.78 196.056 16.26C196.269 16.74 196.376 17.32 196.376 18C196.376 18.8533 196.149 19.6 195.696 20.24C195.256 20.88 194.609 21.3733 193.756 21.72C192.916 22.0667 191.889 22.24 190.676 22.24Z" fill="#FFC107" />
        <path d="M22.1526 28.1045C22.9811 26.9105 22.9811 24.9747 22.1526 23.7807C21.3242 22.5868 19.981 22.5868 19.1526 23.7807C18.3241 24.9747 18.3241 26.9105 19.1526 28.1045C19.981 29.2985 21.3242 29.2985 22.1526 28.1045Z" fill="#FFC107" />
        <path d="M10.9008 15.7125C12.1434 13.9215 12.1434 11.0178 10.9008 9.22679C9.65809 7.43587 7.64338 7.43587 6.40074 9.22679C5.15809 11.0178 5.15809 13.9215 6.40074 15.7125C7.64338 17.5034 9.65809 17.5034 10.9008 15.7125Z" fill="#FFC107" />
        <path d="M16.5267 22.2908C17.5622 20.7983 17.5622 18.3786 16.5267 16.8861C15.4911 15.3936 13.8122 15.3936 12.7766 16.8861C11.7411 18.3786 11.7411 20.7983 12.7766 22.2908C13.8122 23.7833 15.4911 23.7833 16.5267 22.2908Z" fill="#FFC107" />
        <path d="M4.52668 22.2908C5.56222 20.7983 5.56222 18.3786 4.52668 16.8861C3.49114 15.3936 1.8122 15.3936 0.776657 16.8861C-0.258885 18.3786 -0.258886 20.7983 0.776657 22.2908C1.8122 23.7833 3.49114 23.7833 4.52668 22.2908Z" fill="#FFC107" />
        <path d="M10.1526 28.1045C10.981 26.9105 10.981 24.9747 10.1526 23.7807C9.32416 22.5868 7.98098 22.5868 7.15257 23.7807C6.32414 24.9747 6.32414 26.9105 7.15257 28.1045C7.98098 29.2985 9.32416 29.2985 10.1526 28.1045Z" fill="#FFC107" />
        <path d="M28.5267 22.2908C29.5622 20.7983 29.5622 18.3786 28.5267 16.8861C27.4911 15.3936 25.8122 15.3936 24.7766 16.8861C23.7411 18.3786 23.7411 20.7983 24.7766 22.2908C25.8122 23.7833 27.4911 23.7833 28.5267 22.2908Z" fill="#FFC107" />
        <path d="M16.9008 7.82868C18.1434 6.03768 18.1434 3.13393 16.9008 1.343C15.6582 -0.447998 13.6434 -0.447998 12.4008 1.343C11.1581 3.13393 11.1581 6.03768 12.4008 7.82868C13.6434 9.61961 15.6582 9.61961 16.9008 7.82868Z" fill="#FFC107" />
        <path d="M22.9007 15.7125C24.1434 13.9215 24.1434 11.0178 22.9007 9.22679C21.6581 7.43587 19.6434 7.43587 18.4007 9.22679C17.1581 11.0178 17.1581 13.9215 18.4007 15.7125C19.6434 17.5034 21.6581 17.5034 22.9007 15.7125Z" fill="#FFC107" />
      </svg>
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <Bell className="w-4 h-4" style={{ color: "#94A3B8" }} />
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
          style={{ background: BLUE }}
        >3</span>
      </div>
      <div className="w-px h-4 mx-1" style={{ background: BORDER }} />
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: YELLOW }}>
          C
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold leading-none" style={{ color: NAVY }}>Case and Sherman</p>
          <p className="text-[9px]" style={{ color: "#94A3B8" }}>Apr 19, 2026</p>
        </div>
        <ChevronDown className="w-3 h-3" style={{ color: "#94A3B8" }} />
      </div>
    </div>
  </div>
);

// ── Module tile ───────────────────────────────────────────────────────────────
const ModuleTile = ({
  icon: Icon, label, delay = 0, accent = false,
}: {
  icon: React.ElementType; label: string; delay?: number; accent?: boolean;
}) => (
  <div
    className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 cursor-default transition-all duration-200"
    style={{
      background: accent ? `${BLUE}08` : "#fff",
      border: `1px solid ${accent ? `${BLUE}30` : BORDER}`,
      animation: `heroStagger 0.35s ease-out ${delay}ms both`,
    }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ background: accent ? `${BLUE}12` : BG }}
    >
      <Icon className="w-4 h-4" style={{ color: BLUE }} strokeWidth={1.6} />
    </div>
    <p className="text-[9px] font-semibold text-center leading-tight" style={{ color: NAVY }}>{label}</p>
  </div>
);

// ── Screen 1: Dashboard home ──────────────────────────────────────────────────
const DashboardScreen = () => (
  <div className="h-full flex flex-col">
    <div className="px-4 pt-3 pb-2">
      <p className="text-sm font-bold" style={{ color: NAVY }}>Dashboard</p>
    </div>
    <div className="flex-1 px-3 pb-3 grid grid-cols-4 gap-2 content-start">
      {[
        { icon: Plus,          label: "Post a Job",        delay: 0,   accent: true  },
        { icon: Search,        label: "Talent Search",     delay: 50,  accent: false },
        { icon: Users,         label: "Screen Applicants", delay: 100, accent: false },
        { icon: HandshakeIcon, label: "Onboarding",        delay: 150, accent: false },
        { icon: Users,         label: "Manage",            delay: 200, accent: false },
        { icon: BookOpen,      label: "Train",             delay: 250, accent: false },
        { icon: FileText,      label: "Payroll",           delay: 300, accent: false },
        { icon: ShieldCheck,   label: "DOLE",              delay: 350, accent: false },
        { icon: BarChart3,     label: "Analytics",         delay: 400, accent: false },
        { icon: Settings,      label: "Settings",          delay: 450, accent: false },
        { icon: UserPlus,      label: "Employee Kit",      delay: 500, accent: false },
        { icon: FileText,      label: "Audit Logs",        delay: 550, accent: false },
      ].map((m) => (
        <ModuleTile key={m.label} {...m} />
      ))}
    </div>
  </div>
);

// ── Avatar chip ───────────────────────────────────────────────────────────────
const Avatar = ({ initials, color }: { initials: string; color: string }) => (
  <div
    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
    style={{ background: color }}
  >
    {initials}
  </div>
);

// ── Kanban applicant card ─────────────────────────────────────────────────────
const ApplicantCard = ({
  name, date, initials, color, isNew = false, delay = 0,
}: {
  name: string; date: string; initials: string; color: string;
  isNew?: boolean; delay?: number;
}) => (
  <div
    className="rounded-lg p-2.5 flex items-start gap-2 relative"
    style={{
      background: "#fff",
      border: `1px solid ${isNew ? "#22C55E40" : BORDER}`,
      borderLeft: `3px solid ${isNew ? "#22C55E" : BORDER}`,
      animation: `heroStagger 0.35s ease-out ${delay}ms both`,
    }}
  >
    {isNew && (
      <span
        className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
        style={{ background: "#22C55E" }}
      >NEW</span>
    )}
    <Avatar initials={initials} color={color} />
    <div className="min-w-0">
      <p className="text-[10px] font-semibold truncate" style={{ color: NAVY }}>{name}</p>
      <p className="text-[9px]" style={{ color: "#94A3B8" }}>{date}</p>
    </div>
  </div>
);

// ── Kanban column ─────────────────────────────────────────────────────────────
const KanbanCol = ({
  title, count, children, delay = 0,
}: {
  title: string; count: number; children: React.ReactNode; delay?: number;
}) => (
  <div
    className="flex flex-col gap-2 rounded-xl p-2.5 min-w-0"
    style={{
      background: BG,
      border: `1px solid ${BORDER}`,
      animation: `heroStagger 0.35s ease-out ${delay}ms both`,
    }}
  >
    <div className="flex items-center justify-between mb-0.5">
      <p className="text-[9px] font-bold truncate" style={{ color: NAVY }}>{title}</p>
      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${BLUE}15`, color: BLUE }}>
        {count}
      </span>
    </div>
    {children}
  </div>
);

// ── Screen 2: Screen Applicants ───────────────────────────────────────────────
const ApplicantsScreen = () => (
  <div className="h-full flex flex-col">
    {/* Breadcrumb + title */}
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center gap-1 mb-0.5">
        <ArrowLeft className="w-3 h-3" style={{ color: "#94A3B8" }} />
        <span className="text-[9px]" style={{ color: "#94A3B8" }}>Dashboard</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold" style={{ color: NAVY }}>Screen Applicants</p>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold" style={{ background: `${BLUE}12`, color: BLUE }}>
            <Filter className="w-2.5 h-2.5" /> Filter
          </button>
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-white" style={{ background: BLUE }}>
            <Plus className="w-2.5 h-2.5" /> Add Stage
          </button>
        </div>
      </div>
      <p className="text-[9px] mt-0.5" style={{ color: "#94A3B8" }}>HR Manager Position · 4 Applications</p>
    </div>

    {/* Kanban */}
    <div className="flex-1 px-3 pb-3 grid grid-cols-3 gap-2 overflow-hidden">
      <KanbanCol title="Recommended" count={2} delay={50}>
        <ApplicantCard name="Martin Sargent" date="02/06/2026" initials="MS" color="#22C55E" isNew delay={150} />
        <ApplicantCard name="Giacomo Hansen" date="02/03/2026" initials="GH" color="#8B5CF6" delay={220} />
      </KanbanCol>
      <KanbanCol title="Initial Interview" count={1} delay={120}>
        <ApplicantCard name="Jeremy Gates" date="02/03/2026" initials="JG" color="#8B5CF6" isNew delay={200} />
      </KanbanCol>
      <KanbanCol title="Manager Interview" count={0} delay={190}>
        <div className="flex-1 flex items-center justify-center pt-4">
          <Plus className="w-5 h-5" style={{ color: `${BLUE}30` }} />
        </div>
      </KanbanCol>
    </div>
  </div>
);

// ── Screen 3: Manage employees ────────────────────────────────────────────────
const ManageScreen = () => (
  <div className="h-full flex flex-col">
    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          <ArrowLeft className="w-3 h-3" style={{ color: "#94A3B8" }} />
          <span className="text-[9px]" style={{ color: "#94A3B8" }}>Dashboard</span>
        </div>
        <p className="text-xs font-bold" style={{ color: NAVY }}>Manage Employees</p>
      </div>
      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-white" style={{ background: BLUE }}>
        <Plus className="w-2.5 h-2.5" /> Add Employee
      </button>
    </div>

    {/* Table header */}
    <div
      className="mx-3 rounded-t-lg grid grid-cols-4 px-3 py-1.5 text-[9px] font-bold"
      style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
    >
      {["Employee", "Department", "Position", "Status"].map((h) => (
        <span key={h} style={{ color: "#64748B" }}>{h}</span>
      ))}
    </div>

    {/* Table rows */}
    <div className="mx-3 flex-1 rounded-b-lg overflow-hidden" style={{ border: `1px solid ${BORDER}`, borderTop: "none" }}>
      {[
        { name: "Maria Santos",  dept: "HR & Admin",  pos: "HR Officer",     status: "Active",     init: "MS", color: "#22C55E", delay: 80  },
        { name: "John Reyes",    dept: "Finance",     pos: "Accountant",     status: "Active",     init: "JR", color: BLUE,      delay: 140 },
        { name: "Ana Cruz",      dept: "Operations",  pos: "Team Lead",      status: "On Leave",   init: "AC", color: "#F59E0B", delay: 200 },
        { name: "Ben Torres",    dept: "IT",          pos: "Developer",      status: "Active",     init: "BT", color: "#8B5CF6", delay: 260 },
        { name: "Liza Aquino",   dept: "HR & Admin",  pos: "Payroll Clerk",  status: "Active",     init: "LA", color: "#EC4899", delay: 320 },
      ].map((e, i) => (
        <div
          key={e.name}
          className="grid grid-cols-4 items-center px-3 py-2"
          style={{
            background: "#fff",
            borderBottom: i < 4 ? `1px solid ${BORDER}` : "none",
            animation: `heroStagger 0.35s ease-out ${e.delay}ms both`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: e.color }}>{e.init}</div>
            <span className="text-[9px] font-semibold truncate" style={{ color: NAVY }}>{e.name}</span>
          </div>
          <span className="text-[9px]" style={{ color: "#64748B" }}>{e.dept}</span>
          <span className="text-[9px]" style={{ color: "#64748B" }}>{e.pos}</span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit"
            style={e.status === "Active"
              ? { background: "#F0FDF4", color: "#16A34A" }
              : { background: "#FFFBEB", color: "#D97706" }}
          >{e.status}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Screen 4: DOLE compliance ─────────────────────────────────────────────────
const DoleScreen = () => (
  <div className="h-full flex flex-col">
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center gap-1 mb-0.5">
        <ArrowLeft className="w-3 h-3" style={{ color: "#94A3B8" }} />
        <span className="text-[9px]" style={{ color: "#94A3B8" }}>Dashboard</span>
      </div>
      <p className="text-xs font-bold" style={{ color: NAVY }}>DOLE</p>
    </div>
    <div className="flex-1 px-3 pb-3 grid grid-cols-5 gap-2 content-start">
      {[
        { icon: BookOpen,       label: "Employee Compensation Logbook",                       delay: 0   },
        { icon: Building2,      label: "Establishment Registration",                          delay: 50  },
        { icon: AlertTriangle,  label: "Work Accident/Illness Report",                        delay: 100 },
        { icon: Thermometer,    label: "Work Environment Measurement Request",                delay: 150 },
        { icon: ShieldCheck,    label: "Safety and Health Policy",                            delay: 200 },
        { icon: ClipboardList,  label: "Annual Work Accident/Illness Exposure Data Report",   delay: 250 },
        { icon: FileText,       label: "Health and Safety Organization Report",               delay: 300 },
        { icon: ClipboardCheck, label: "SHC Minutes of Meetings",                            delay: 350 },
        { icon: HeartPulse,     label: "Annual Medical Report",                              delay: 400 },
        { icon: Network,        label: "OSH Program",                                        delay: 450 },
      ].map((m) => (
        <div
          key={m.label}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 cursor-default"
          style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            animation: `heroStagger 0.35s ease-out ${m.delay}ms both`,
          }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
            <m.icon className="w-5 h-5" style={{ color: BLUE }} strokeWidth={1.5} />
          </div>
          <p className="text-[7.5px] font-semibold text-center leading-tight" style={{ color: NAVY }}>{m.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Toast messages ────────────────────────────────────────────────────────────
const TOASTS = [
  { msg: "Leave approved",   sub: "Maria Santos · Vacation Leave" },
  { msg: "New applicant",    sub: "Martin Sargent · HR Manager"   },
  { msg: "Payroll synced",   sub: "142 employees processed"       },
  { msg: "DOLE report ready",sub: "Work Accident/Illness Report"  },
];

// ── Main export ───────────────────────────────────────────────────────────────
export default function LpHeroDashboard() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [animKey,   setAnimKey]   = useState(0);
  const [toastIdx,  setToastIdx]  = useState(0);
  const [showToast, setShowToast] = useState(false);

  const SCREENS = [DashboardScreen, ApplicantsScreen, ManageScreen, DoleScreen];

  useEffect(() => {
    const id = setInterval(() => {
      setScreenIdx((i) => (i + 1) % SCREENS.length);
      setAnimKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const show = setTimeout(() => { setShowToast(true); setToastIdx((i) => (i + 1) % TOASTS.length); }, 1800);
    const hide = setTimeout(() => setShowToast(false), 3600);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [screenIdx]);

  const Screen = SCREENS[screenIdx];
  const toast  = TOASTS[toastIdx];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 60px rgba(53,95,208,0.15), 0 0 0 1px rgba(53,95,208,0.1)",
      }}
    >
      {/* ── Browser chrome ──────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "#F1F5F9", borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <div className="flex-1 mx-2">
          <div
            className="mx-auto max-w-[180px] rounded-md px-3 py-0.5 text-center text-[10px]"
            style={{ background: "#fff", color: "#64748B", border: `1px solid ${BORDER}` }}
          >
            app.yahshuahris.com
          </div>
        </div>
        {/* Screen indicator dots */}
        <div className="flex gap-1 shrink-0">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:   i === screenIdx ? "14px" : "6px",
                height:  "6px",
                background: i === screenIdx ? BLUE : "#CBD5E1",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Product UI ──────────────────────────────────────────────── */}
      <div style={{ background: BG }}>
        <ProductTopBar />
        {/* Fixed-height container — never resizes between screens */}
        <div className="relative h-[260px] sm:h-[320px] md:h-[400px]" style={{ overflow: "hidden" }}>
          <div
            key={animKey}
            className="absolute inset-0"
            style={{ animation: "heroScreenIn 0.35s ease-out" }}
          >
            <Screen />
          </div>
        </div>
      </div>

      {/* ── Toast notification ───────────────────────────────────────── */}
      {showToast && (
        <div
          key={toastIdx}
          className="absolute bottom-3.5 right-3 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background:  "#fff",
            border:      `1px solid ${BLUE}25`,
            boxShadow:   `0 8px 24px rgba(53,95,208,0.15)`,
            animation:   "heroToastIn 0.3s ease-out",
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: `${BLUE}12`, color: BLUE }}
          >✓</div>
          <div>
            <p className="text-[11px] font-bold" style={{ color: NAVY }}>{toast.msg}</p>
            <p className="text-[9px]" style={{ color: "#94A3B8" }}>{toast.sub}</p>
          </div>
        </div>
      )}
    </div>
  );
}
