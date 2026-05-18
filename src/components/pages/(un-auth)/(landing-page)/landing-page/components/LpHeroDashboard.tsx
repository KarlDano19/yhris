"use client";
import { useEffect, useState } from "react";

import { ArrowLeft, Bell, ChevronDown, Filter, MessageSquare, Plus } from "lucide-react";

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
import InfoIcon from "@/svg/InfoIcon";
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

// ── Product top-bar — matches MainHeader.tsx layout ──────────────────────────
const ProductTopBar = () => (
  <div
    className="flex items-center justify-between px-4 py-2 shrink-0"
    style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
  >
    {/* Left: logo + info button */}
    <div className="flex items-center gap-1.5">
      <div>
        <svg width="122" height="18" viewBox="0 0 203 29" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      {/* Info / onboarding checklist button */}
      <InfoIcon fill={NAVY} />
    </div>

    {/* Right: chat + bell + profile */}
    <div className="flex items-center gap-1">
      {/* Chat */}
      <div className="relative p-1">
        <MessageSquare className="w-4 h-4" style={{ color: "#1e40af" }} />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full text-[7px] font-bold flex items-center justify-center text-white" style={{ background: "#EF4444" }}>2</span>
      </div>
      {/* Notifications */}
      <div className="relative p-1">
        <Bell className="w-4 h-4" style={{ color: "#1e40af" }} />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full text-[7px] font-bold flex items-center justify-center text-white" style={{ background: "#EF4444" }}>7</span>
      </div>
      {/* Profile */}
      <div className="flex items-center gap-1 ml-1">
        <img src="/assets/no-photo.png" alt="profile" className="w-5 h-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: "#CBD5E1", display: "none" }} />
        <div>
          <p className="text-[9px] font-bold leading-none" style={{ color: NAVY }}>YAHSHUA HRIS</p>
          <p className="text-[8px] leading-none mt-0.5" style={{ color: "#94A3B8" }}>05/16/2026, 07:21 AM</p>
        </div>
        <ChevronDown className="w-3 h-3" style={{ color: "#94A3B8" }} />
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
            yahshuahris.com
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
