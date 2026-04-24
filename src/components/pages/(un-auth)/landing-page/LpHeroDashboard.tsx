"use client";
import { useEffect, useState } from "react";
import {
  UserPlus, Search, Users, HandshakeIcon, Settings,
  BarChart3, ShieldCheck, FileText, BookOpen,
  Bell, ChevronDown, ArrowLeft, Plus, Filter,
} from "lucide-react";
import MainLogo from "@/svg/MainLogo";

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
    style={{ background: "rgba(5,9,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
  >
    <div style={{ transform: "scale(0.65)", transformOrigin: "left center" }}>
      <MainLogo />
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <Bell className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
          style={{ background: BLUE }}
        >3</span>
      </div>
      <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: YELLOW }}>
          C
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold leading-none" style={{ color: "rgba(255,255,255,0.85)" }}>Case and Sherman</p>
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>Apr 19, 2026</p>
        </div>
        <ChevronDown className="w-3 h-3" style={{ color: "rgba(255,255,255,0.35)" }} />
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
      <p className="text-xs font-bold" style={{ color: NAVY }}>DOLE Compliance</p>
    </div>
    <div className="flex-1 px-3 pb-3 grid grid-cols-3 gap-2 content-start">
      {[
        { icon: BookOpen,    label: "Employee Compensation Logbook",        delay: 0   },
        { icon: Settings,    label: "Establishment Registration",           delay: 60  },
        { icon: FileText,    label: "Work Accident / Illness Report",       delay: 120 },
        { icon: BarChart3,   label: "Work Environment Measurement",         delay: 180 },
        { icon: ShieldCheck, label: "Safety and Health Policy",             delay: 240 },
        { icon: FileText,    label: "Annual WAIR Exposure Data Report",     delay: 300 },
        { icon: FileText,    label: "Health and Safety Org Report",         delay: 360 },
        { icon: FileText,    label: "SHC Minutes of Meetings",              delay: 420 },
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: BG }}>
            <m.icon className="w-4 h-4" style={{ color: BLUE }} strokeWidth={1.6} />
          </div>
          <p className="text-[8.5px] font-semibold text-center leading-tight" style={{ color: NAVY }}>{m.label}</p>
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
        style={{ background: "#1E2A3A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <div className="flex-1 mx-2">
          <div
            className="mx-auto max-w-[180px] rounded-md px-3 py-0.5 text-center text-[10px]"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
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
                background: i === screenIdx ? YELLOW : "rgba(255,255,255,0.2)",
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
