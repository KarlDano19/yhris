"use client";
import { useEffect, useState } from "react";

import { ArrowLeft, Bell, ChevronDown, Filter, MessageSquare, Plus } from "lucide-react";
import MainLogoWhite from "@/svg/MainLogoWhite";
import InfoIcon from "@/svg/InfoIcon";

import AddPostLogo from "@/svg/AddPostLogo";
import TalentSearchIcon from "@/svg/TalentSearchIcon";
import ScreenApplicantsLogo from "@/svg/ScreenApplicantsLogo";
import OrientLogo from "@/svg/OrientLogo";
import ManageLogo from "@/svg/ManageLogo";
import EvaluationLogo from "@/svg/EvaluationLogo";
import EmployeeSeparationLogo from "@/svg/EmployeeSeparationLogo";
import DoleLogo from "@/svg/DoleLogo";
import AnalyticsLogo from "@/svg/AnalyticsLogo";
import SettingsLogo from "@/svg/SettingsLogo";
import AuditLogsIcon from "@/svg/AuidtLogsIcon";
import EmployeeCompensitionLogbookLogo from "@/svg/EmployeeCompensitionLogbookLogo";
import EstablishmentRegistrationLogo from "@/svg/EstablishmentRegistrationLogo";
import WorkAccidentIllnessReportLogo from "@/svg/WorkAccidentIllnessReportLogo";
import WemLogo from "@/svg/WemLogo";
import SafetyAndHealthLogo from "@/svg/SafetyAndHealthLogo";
import AnnualWAIR from "@/svg/AnnualWAIR";
import HealthAndSafetyReportLogo from "@/svg/HealthAndSafetyReportLogo";
import ShcMeetingOfMinutesLogo from "@/svg/ShcMeetingOfMinutesLogo";
import AnnualMedicalReportLogo from "@/svg/AnnualMedicalReportLogo";
import OSHProgramLogo from "@/svg/OSHProgramLogo";
import EditIcon from "@/svg/EditIcon";
import DeleteIcon from "@/svg/DeleteIcon";
import UploadIcon from "@/svg/UploadIcon";
import ArchiveIcon from "@/svg/ArchiveIcon";
import PlusIconGreen from "@/svg/PlusIconGreen";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BLUE   = "#355FD0";
const YELLOW = "#FFC008";
const NAVY   = "#2C3F58";
const BORDER = "#DDE3F0";
const BG     = "#F4F6FB";

// ── Product top-bar — dark design ────────────────────────────────────────────
const ProductTopBar = () => (
  <div
    className="flex items-center justify-between px-4 py-2.5 shrink-0"
    style={{ background: "rgba(5,9,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
  >
    <div className="flex items-center gap-1.5">
      <div style={{ width: 132, height: 19, position: "relative", overflow: "visible", flexShrink: 0 }}>
        <div style={{ transform: "scale(0.65)", transformOrigin: "left center", position: "absolute", top: 0, left: 0 }}>
          <MainLogoWhite />
        </div>
      </div>
      <InfoIcon fill="rgba(255,255,255,0.45)" />
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <MessageSquare className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
          style={{ background: "#EF4444" }}
        >2</span>
      </div>
      <div className="relative">
        <Bell className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
          style={{ background: "#EF4444" }}
        >7</span>
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

// ── Dashboard module tile — white shadow card matching the real UI ─────────────
const ModuleTile = ({
  icon, label, delay = 0, accent = false,
}: {
  icon: React.ReactNode; label: string; delay?: number; accent?: boolean;
}) => (
  <div
    className="flex flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-3 cursor-default"
    style={{
      background: "#fff",
      boxShadow: accent
        ? `0 0 0 1.5px ${BLUE}50, 0 2px 6px rgba(53,95,208,0.15)`
        : "0 1px 3px rgba(0,0,0,0.1), 0 0 0 1px #E8EDF5",
      animation: `heroStagger 0.35s ease-out ${delay}ms both`,
    }}
  >
    <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
      {icon}
    </div>
    <p className="text-[8px] font-semibold text-center leading-tight px-0.5" style={{ color: NAVY }}>{label}</p>
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
        { icon: <AddPostLogo />,            label: "Post a Job",          delay: 0,   accent: true  },
        { icon: <TalentSearchIcon />,       label: "Talent Search",       delay: 50,  accent: false },
        { icon: <ScreenApplicantsLogo />,   label: "Screen Applicants",   delay: 100, accent: false },
        { icon: <OrientLogo />,             label: "Onboarding",          delay: 150, accent: false },
        { icon: <ManageLogo />,             label: "Manage",              delay: 200, accent: false },
        { icon: <EvaluationLogo />,         label: "Evaluation",          delay: 250, accent: false },
        { icon: <EmployeeSeparationLogo />, label: "Employee Separation", delay: 300, accent: false },
        { icon: <DoleLogo />,               label: "DOLE",                delay: 350, accent: false },
        { icon: <AnalyticsLogo />,          label: "Analytics",           delay: 400, accent: false },
        { icon: <SettingsLogo />,           label: "Settings",            delay: 450, accent: false },
        { icon: <AuditLogsIcon />,          label: "Audit Logs",          delay: 500, accent: false },
      ].map((m) => (
        <ModuleTile key={m.label} icon={m.icon} label={m.label} delay={m.delay} accent={m.accent} />
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
  <div className="h-full flex flex-col" style={{ zoom: 0.55 }}>
    {/* Back button + title */}
    <div className="px-6 pt-4 pb-2">
      <div className="flex items-center gap-1 mb-1">
        <ArrowLeft className="w-4 h-4" style={{ color: "#94A3B8" }} />
        <span className="text-sm" style={{ color: "#94A3B8" }}>Screen Applicants</span>
      </div>
      <h2 className="text-xl font-bold" style={{ color: NAVY }}>Screen Applicants / HR Manager Applications</h2>
    </div>

    {/* Toolbar */}
    <div className="px-6 pb-4 flex items-center justify-between gap-3">
      {/* Left: date pickers + search */}
      <div className="flex items-center gap-2">
        <input readOnly placeholder="mm/dd/yyyy" className="rounded-md py-1.5 pl-3 pr-10 text-sm shadow-sm w-32" style={{ ring: "1px solid #D1D5DB", border: "1px solid #D1D5DB", color: "#111827" }} />
        <span className="text-gray-600">to</span>
        <input readOnly placeholder="mm/dd/yyyy" className="rounded-md py-1.5 pl-3 pr-10 text-sm shadow-sm w-32" style={{ border: "1px solid #D1D5DB", color: "#111827" }} />
        <button className="rounded-lg bg-white border-2 border-gray-300 text-blue-700 py-1.5 px-3 flex items-center justify-center">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
        </button>
      </div>
      {/* Right: Upload + divider + Archive + Filter + Add Stage */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg text-white py-2 px-6 font-bold text-base flex items-center gap-2" style={{ background: BLUE }}>
          <UploadIcon />
          Upload Resumes
        </button>
        <div className="border-l-2 border-gray-300 h-10" />
        <button className="relative rounded-lg border-2 border-gray-300 text-gray-700 py-1.5 px-2 flex items-center justify-center w-12">
          <ArchiveIcon />
        </button>
        <button className="p-2 rounded border-2 border-gray-300 flex items-center justify-center">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
        <button className="rounded-lg border-2 border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 font-bold text-base flex items-center gap-2" style={{ background: "#fff" }}>
          <PlusIconGreen />
          <span className="ml-1">Add Stage</span>
        </button>
      </div>
    </div>

    {/* Kanban */}
    <div className="flex-1 px-6 pb-4 grid grid-cols-3 gap-4 overflow-hidden">
      <KanbanCol title="Recommended" count={2} delay={50}>
        <ApplicantCard name="Martin Sargent" date="02/06/2026" initials="MS" color="#22C55E" isNew delay={150} />
        <ApplicantCard name="Giacomo Hansen" date="02/03/2026" initials="GH" color="#8B5CF6" delay={220} />
      </KanbanCol>
      <KanbanCol title="Initial Interview" count={1} delay={120}>
        <ApplicantCard name="Jeremy Gates" date="02/03/2026" initials="JG" color="#8B5CF6" isNew delay={200} />
      </KanbanCol>
      <KanbanCol title="Final Interview" count={0} delay={190}>
        <div className="flex-1 flex items-center justify-center pt-4">
          <Plus className="w-5 h-5" style={{ color: `${BLUE}30` }} />
        </div>
      </KanbanCol>
    </div>
  </div>
);

// ── Screen 3: Employee List ───────────────────────────────────────────────────
const ManageScreen = () => (
  <div className="h-full flex flex-col" style={{ zoom: 0.55 }}>
    {/* Back button + title */}
    <div className="px-6 pt-4 pb-2">
      <div className="flex items-center gap-1 mb-1">
        <ArrowLeft className="w-4 h-4" style={{ color: "#94A3B8" }} />
        <span className="text-sm" style={{ color: "#94A3B8" }}>Manage</span>
      </div>
      <h2 className="text-xl font-bold" style={{ color: NAVY }}>Employee List</h2>
    </div>

    {/* Toolbar */}
    <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="flex items-center rounded-md overflow-hidden shadow-sm" style={{ border: "1px solid #D1D5DB", background: "#fff" }}>
        <input readOnly placeholder="Search ..." className="text-sm px-3 py-1.5 outline-none bg-transparent w-36" style={{ color: "#9CA3AF" }} />
        <button className="px-2 py-1.5 border-l" style={{ borderColor: "#D1D5DB", background: "#fff" }}>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="#111827"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
        </button>
      </div>
      {/* CREATE + chevron */}
      <div className="flex shadow-sm">
        <button className="px-5 py-2 text-sm font-semibold text-white rounded-l-md" style={{ background: "#22C55E" }}>CREATE</button>
        <button className="px-2.5 py-2 rounded-r-md flex items-center" style={{ background: "#22C55E", borderLeft: "1px solid #16A34A" }}>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="white"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
        </button>
      </div>
      {/* Cog + Filter */}
      <div className="flex shadow-sm">
        <button className="p-2 rounded-l-lg" style={{ background: BLUE }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg>
        </button>
        <button className="p-2 rounded-r-lg" style={{ background: BLUE, borderLeft: "1px solid #2952b8" }}>
          <Filter className="w-5 h-5" color="white" />
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="mx-6 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-300 text-center">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">
              <input type="checkbox" readOnly className="w-5 h-5 rounded border-gray-300" />
            </th>
            {["First Name", "Last Name", "Position", "Department", "Emp. Status", "Actions"].map((h) => (
              <th key={h} className="px-3 py-3.5 text-sm font-semibold text-gray-900">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[
            { first: "Maria",  last: "Santos",  pos: "HR Officer",    dept: "HR & Admin",  status: "Regular",      delay: 80  },
            { first: "John",   last: "Reyes",   pos: "Accountant",    dept: "Finance",     status: "Probationary", delay: 140 },
            { first: "Ana",    last: "Cruz",    pos: "Team Lead",     dept: "Operations",  status: "Regular",      delay: 200 },
            { first: "Ben",    last: "Torres",  pos: "Developer",     dept: "IT",          status: "Regular",      delay: 260 },
            { first: "Liza",   last: "Aquino",  pos: "Payroll Clerk", dept: "HR & Admin",  status: "Contractual",  delay: 320 },
          ].map((e) => (
            <tr key={e.first} style={{ animation: `heroStagger 0.35s ease-out ${e.delay}ms both` }}>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <input type="checkbox" readOnly className="w-5 h-5 rounded border-gray-300" />
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{e.first}</td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{e.last}</td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{e.pos}</td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{e.dept}</td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{e.status}</td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-1.5">
                  <EditIcon />
                  <DeleteIcon />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </div>

    {/* Pagination — matches the sticky Pagination component */}
    <div className="mx-6 mt-3 mb-2 flex items-center justify-between">
      <p className="text-sm text-gray-500">Total Record/s: 142</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500 mx-2">Records per page</p>
        <div className="w-16 mx-2 p-1 pl-2 rounded-md text-gray-500 shadow-sm text-sm" style={{ border: "1px solid #D1D5DB" }}>5</div>
        <div className="grid grid-flow-col auto-cols-max text-sm text-gray-500 items-center gap-0.5">
          <button className="mx-2"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg></button>
          {[1,2,3].map((n) => (
            <div key={n} className={`border rounded py-1 px-2 mx-px ${n === 1 ? 'bg-gray-300' : ''}`}>{n}</div>
          ))}
          <span className="px-1">...</span>
          <div className="border rounded py-1 px-2 mx-px">29</div>
          <button className="mx-2"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg></button>
        </div>
      </div>
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
        { icon: <EmployeeCompensitionLogbookLogo />, label: "Employee Compensation Logbook",                     delay: 0   },
        { icon: <EstablishmentRegistrationLogo />,   label: "Establishment Registration",                        delay: 50  },
        { icon: <WorkAccidentIllnessReportLogo />,   label: "Work Accident/Illness Report",                      delay: 100 },
        { icon: <WemLogo />,                         label: "Work Environment Measurement Request",              delay: 150 },
        { icon: <SafetyAndHealthLogo />,             label: "Safety and Health Policy",                          delay: 200 },
        { icon: <AnnualWAIR />,                      label: "Annual Work Accident/Illness Exposure Data Report", delay: 250 },
        { icon: <HealthAndSafetyReportLogo />,       label: "Health and Safety Organization Report",             delay: 300 },
        { icon: <ShcMeetingOfMinutesLogo />,         label: "SHC Minutes of Meetings",                          delay: 350 },
        { icon: <AnnualMedicalReportLogo />,         label: "Annual Medical Report",                            delay: 400 },
        { icon: <OSHProgramLogo />,                  label: "OSH Program",                                      delay: 450 },
      ].map((m) => (
        <ModuleTile key={m.label} icon={m.icon} label={m.label} delay={m.delay} />
      ))}
    </div>
  </div>
);

// ── Toast messages — index must match SCREENS order ───────────────────────────
// [0] Dashboard · [1] Screen Applicants · [2] Employee List · [3] DOLE
const TOASTS = [
  { msg: "Job posted!",        sub: "HR Manager · 3 slots open"      },
  { msg: "New applicant",     sub: "Martin Sargent · HR Manager"    },
  { msg: "Employee added",    sub: "Ben Torres · IT Department"     },
  { msg: "DOLE report ready", sub: "Work Accident/Illness Report"   },
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
    setShowToast(false);
    const show = setTimeout(() => { setShowToast(true); setToastIdx(screenIdx); }, 1800);
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

      {/* ── Toast notification — matches CustomToast success style ──── */}
      {showToast && (
        <div
          key={toastIdx}
          className="absolute top-3.5 right-3 w-48 rounded-sm overflow-hidden shadow-lg"
          style={{ animation: "heroToastIn 0.3s ease-out", background: "#22C55E" }}
        >
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white leading-snug">{toast.msg}</p>
              <p className="text-[9px] text-white/80 leading-snug truncate">{toast.sub}</p>
            </div>
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-0.5 bg-black/20">
            <div className="h-full bg-green-200" style={{ width: "60%" }} />
          </div>
        </div>
      )}
    </div>
  );
}
