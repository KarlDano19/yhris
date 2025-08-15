"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  IdentificationIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

type TabKey =
  | "personal"
  | "employment"
  | "training"
  | "disciplinary"
  | "performance"
  | "benefits"
  | "documents";

interface ContentProps {
  params: { id: string };
  emp?: {
    name?: string;
    role?: string;
    progress?: number;
    avatar?: string;
  };
  hasActiveSubscription: boolean;
}

const Content = ({ params, emp, hasActiveSubscription }: ContentProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [showConfirm, setShowConfirm] = useState(false);

  // optional: close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirm(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const employee = {
    name: emp?.name ?? "Bianca Reyes",
    role: emp?.role ?? "Accounting Officer (Accounting)",
    complete: emp?.progress === 100,
    progress: emp?.progress ?? 35,
    avatar: emp?.avatar ?? "/assets/placeholder2.png",
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar + Save */}
        <div className="flex items-center justify-between gap-4 py-4">
          <Link
            href="/manage/employee-201-records"
            className="inline-flex items-center gap-3 rounded-md px-2 py-1 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-gray-700">
              Manage | Employee 201 Records
              <span className="text-gray-400"> | </span>
              <span className="font-semibold text-indigo-dye">
                {employee.name}
              </span>
            </h4>
          </Link>

          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-md bg-[#355fd0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90"
          >
            Save
          </button>
        </div>

        {/* Profile strip (responsive) */}
<div className="rounded-[40px] px-2 py-4 bg-[#355fd0]/5 sm:rounded-[110px] sm:px-4 sm:py-8 sm:px-8">
  <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0">
    {/* Avatar + name + progress */}
    <div className="flex w-full md:w-auto justify-center md:justify-start items-center gap-4 md:pr-5 text-center md:text-left">
      <div className="relative h-[80px] w-[80px] md:h-[100px] md:w-[100px] flex-shrink-0">
        <div
          className={`absolute inset-0 rounded-full border-4 border-yellow-400 ${
            employee.complete ? "border-solid" : "border-dashed"
          } scale-110`}
        />
        <Image
          src={employee.avatar}
          alt={employee.name}
          width={100}
          height={100}
          className="relative rounded-full object-cover"
        />
      </div>

      <div>
        <div className="font-semibold text-indigo-dye">{employee.name}</div>
        <div className="text-sm text-gray-500">{employee.role}</div>

        {/* Progress with percentage */}
        <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
          <div className="h-2 w-40 md:w-48 overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full bg-rose-400"
              style={{ width: `${employee.progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-rose-600">
            {employee.progress}%
          </span>
        </div>
      </div>
    </div>

    {/* Divider (desktop only) */}
    <div className="hidden md:block h-24 w-[4px] rounded-full bg-gray-500" />

    {/* Tabs — under profile on mobile */}
    <nav
      className="
        flex flex-wrap justify-center
    md:flex-nowrap md:justify-start md:overflow-x-auto md:no-scrollbar
    items-center gap-2 sm:gap-6
      "
      role="tablist"
      aria-label="Employee sections"
    >
      <Tab
        active={activeTab === "personal"}
        onClick={() => setActiveTab("personal")}
        icon={<IdentificationIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Personal Information
      </Tab>
      <Tab
        active={activeTab === "employment"}
        onClick={() => setActiveTab("employment")}
        icon={<BriefcaseIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Employment Details
      </Tab>
      <Tab
        dot
        active={activeTab === "training"}
        onClick={() => setActiveTab("training")}
        icon={<AcademicCapIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Training &amp; Development
      </Tab>
      <Tab
        dot
        active={activeTab === "disciplinary"}
        onClick={() => setActiveTab("disciplinary")}
        icon={<ExclamationTriangleIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Disciplinary Records
      </Tab>
      <Tab
        active={activeTab === "performance"}
        onClick={() => setActiveTab("performance")}
        icon={<ChartBarIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Performance &amp; Evaluation
      </Tab>
      <Tab
        active={activeTab === "benefits"}
        onClick={() => setActiveTab("benefits")}
        icon={<Cog6ToothIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Benefits &amp; Government Compliance
      </Tab>
      <Tab
        active={activeTab === "documents"}
        onClick={() => setActiveTab("documents")}
        icon={<ArchiveBoxIcon className="h-7 w-7 md:h-9 md:w-9" />}
      >
        Document Repository
      </Tab>
    </nav>
  </div>
</div>


        {/* DYNAMIC FORM */}
        <div className="mt-6 mb-24 space-y-8">
          {renderForm(activeTab)}
        </div>
      </div>
      {showConfirm && (
      <ConfirmModal
        title="Save changes?"
        message="Are you sure you want to save the changes to this employee’s record?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          // TODO: perform your save here (call API, mutate, etc.)
          // after successful save:
          setShowConfirm(false);
        }}
      />
    )}
    </>
  );
};

export default Content;

/* —————————————————— Dynamic forms —————————————————— */

function renderForm(active: TabKey) {
  switch (active) {
    case "personal":
      return <PersonalInfoForm />;
    case "employment":
      return <EmploymentDetailsForm />;
    case "training":
      return <TrainingDevelopmentForm />;
    case "disciplinary":
      return <DisciplinaryRecordsForm />;
    case "performance":
      return <PerformanceEvaluationForm />;
    case "benefits":
      return <BenefitsComplianceForm />;
    case "documents":
      return <DocumentRepositoryForm />;
    default:
      return null;
  }
}

/* —————————————————— Tabs & building blocks —————————————————— */

function Tab({
  children,
  icon,
  active,
  dot,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  dot?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className="relative flex flex-col items-center w-10 h-10 md:w-20 md:h-20 text-center cursor-pointer focus:outline-none shrink-0"
    >
      {/* Icon */}
      <div className={`mb-1 ${active ? "text-[#355fd0]" : "text-gray-500"}`}>
        {icon}
      </div>

      {/* Label (only visible on md and up) */}
      <span
        className={`hidden md:block leading-tight break-words whitespace-normal w-14 md:w-16 text-[10px] ${
          active ? "font-semibold text-[#355fd0]" : "text-gray-500"
        }`}
      >
        {children}
      </span>

      {/* Notification Dot */}
      {dot && (
        <span className="absolute top-1 right-1 inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
      )}
    </button>
  );
}


function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <section>
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-indigo-dye">{title}</h3>
      )}
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

function Field({
  label,
  placeholder,
  defaultValue,
  className = "",
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
      />
    </div>
  );
}

/* —————————————————— Individual forms —————————————————— */

function PersonalInfoForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="First Name" defaultValue="Bianca" />
          <Field label="Middle Name" placeholder="Enter Middle Name..." />
          <Field label="Last Name" defaultValue="Reyes" />
          <Field label="Email Address" defaultValue="biancareyes@abba.works" />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue="Xavier Estates, Cagayan de Oro"
          />
          <Field label="Contact Number" defaultValue="09161452781" />
        </Grid>
      </Section>

      <Section title="Government IDs">
        <Grid>
          <Field label="TIN" defaultValue="12345668901" />
          <Field label="SSS" defaultValue="234567899010" />
          <Field label="PAG-IBIG" defaultValue="9807654321" />
          <Field label="PhilHealth" defaultValue="43215623891" />
        </Grid>
      </Section>

      <Section title="Emergency Contact">
        <Grid>
          <Field label="Name" defaultValue="Lissandra Reyes" />
          <Field label="Relation" defaultValue="Mother" />
          <Field label="Contact Number" defaultValue="09161829021" />
          <Field
            className="sm:col-span-2"
            label="Address"
            defaultValue="Xavier Estates, Cagayan de Oro"
          />
        </Grid>
      </Section>
    </>
  );
}

function EmploymentDetailsForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="Employee ID" defaultValue="EMP-10293" />
          <Field label="Hire Date" defaultValue="2024-01-08" />
          <Field label="Employment Type" defaultValue="Full-time" />
          <Field label="Status" defaultValue="Probationary" />
          <Field label="Department" defaultValue="Accounting" />
          <Field label="Position" defaultValue="Accounting Officer" />
          <Field label="Manager" defaultValue="Maria Santos" />
          <Field label="Work Location" defaultValue="Cagayan de Oro" />
        </Grid>
      </Section>
    </>
  );
}

function TrainingDevelopmentForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="Latest Training" defaultValue="Excel Advanced" />
          <Field label="Training Date" defaultValue="2024-05-02" />
          <Field label="Provider" defaultValue="ABBA Academy" />
          <Field label="Required Hours" defaultValue="24" />
        </Grid>
      </Section>
    </>
  );
}

function DisciplinaryRecordsForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="Case No." defaultValue="DR-2024-003" />
          <Field label="Type" defaultValue="Attendance" />
          <Field label="Status" defaultValue="Open" />
          <Field label="Hearing Date" defaultValue="2025-01-12" />
        </Grid>
      </Section>
    </>
  );
}

function PerformanceEvaluationForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="Cycle" defaultValue="2024 H2" />
          <Field label="Rating" defaultValue="Meets Expectations" />
          <Field label="Evaluator" defaultValue="Maria Santos" />
          <Field label="Next Review" defaultValue="2025-02-01" />
        </Grid>
      </Section>
    </>
  );
}

function BenefitsComplianceForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="HMO Provider" defaultValue="Maxicare" />
          <Field label="Coverage Start" defaultValue="2024-02-01" />
          <Field label="SSS No." defaultValue="234567899010" />
          <Field label="PhilHealth No." defaultValue="43215623891" />
        </Grid>
      </Section>
    </>
  );
}

function DocumentRepositoryForm() {
  return (
    <>
      <Section>
        <Grid>
          <Field label="Job Offer Letter" defaultValue="Uploaded" />
          <Field label="Employment Contract" defaultValue="Uploaded" />
          <Field label="COE (Issued)" defaultValue="Pending" />
          <Field label="Other Document" placeholder="Add note…" />
        </Grid>
      </Section>
    </>
  );
}


function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // prevent background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-[240px] sm:max-w-sm rounded-lg sm:rounded-2xl bg-white shadow-xl p-3 sm:p-8">
        {/* Header + body */}
        <div className="pt-1">
          <h3
            id="confirm-title"
            className="text-base sm:text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-snug">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 sm:mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[#355fd0] px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 font-semibold text-white hover:bg-[#355fd0]/90"
          >
            Confirm Save
          </button>
        </div>
      </div>
    </div>
  );
}
