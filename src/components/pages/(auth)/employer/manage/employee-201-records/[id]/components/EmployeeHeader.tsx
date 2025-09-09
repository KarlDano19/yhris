"use client";

import { useState } from "react";

import Image from "next/image";

import {
  IdentificationIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

import Tab from "../common/Tab";
import PlacholderPicture from "@/svg/PlaceholderPicture";

import type { Employee } from "@/types/employee-201-records/employee";

export type TabKey =
  | "personal"
  | "employment"
  | "training"
  | "disciplinary"
  | "performance"
  | "benefits"
  | "documents";

export default function EmployeeHeader({
  employee,
  activeTab,
  setActiveTab,
  empPartial,
  locked
}: {
  employee: {
    name: string;
    role: string;
    complete: boolean;
    progress: number;
    gender?: string | null;
    photo?: string | null;
    email: string;
  };
  activeTab: TabKey;
  setActiveTab: (k: TabKey) => void;
  empPartial?: Partial<Employee>;
  locked?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = !!(employee.photo && employee.photo.trim() !== "");
  const showPhoto = hasPhoto && !imgError;
  const placeholderGender: "male" | "female" =
    (employee.gender || "").toLowerCase() === "female" ? "female" : "male";

  // --- minimal: figure out which sections are incomplete
  const missingSections = new Set<string>(
    (empPartial?.incompleteRecords?.missing ?? [])
      .map((s: any) => s?.name)
      .filter(Boolean)
  );
  const personalIncomplete = missingSections.has("Personal Information");
  const employmentIncomplete = missingSections.has("Employment Details");
  const trainingIncomplete = missingSections.has("Training & Development");
  // ---

  return (
    <div data-testid="employee-profile-header" className="rounded-[40px] px-2 py-4 bg-[#355fd0]/5 sm:rounded-[110px] sm:px-8 sm:py-8 shadow-sm">
      <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-center">
        {/* avatar + header (unchanged) */}
        <div className="flex w-full items-center justify-center gap-4 text-center md:w-auto md:justify-start md:pr-5 md:text-left">
          <div className="relative h-[80px] w-[80px] flex-shrink-0 md:h-[100px] md:w-[100px]">
            <div
              className={`absolute inset-0 scale-110 rounded-full border-4 border-yellow-400 ${
                employee.complete ? "border-solid" : "border-dashed"
              }`}
            />
            {showPhoto ? (
              <Image
                src={employee.photo as string}
                alt={employee.name}
                width={100}
                height={100}
                className="relative rounded-full object-cover"
                onError={() => setImgError(true)}
                priority
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center rounded-full bg-white">
                <PlacholderPicture
                  gender={placeholderGender}
                  className="h-14 w-14 md:h-16 md:w-16"
                  title={employee.name}
                />
              </div>
            )}
          </div>

          <div data-testid="employee-details">
            <div className="font-semibold text-indigo-dye">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.role}</div>
            <div className="mt-2 flex items-center justify-center gap-3 md:justify-start">
              <div
                className={`h-2 w-40 overflow-hidden rounded-full md:w-48 ${
                  employee.complete ? "bg-green-100" : "bg-rose-100"
                }`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={employee.progress}
              >
                <div
                  className={`h-full ${
                    employee.complete ? "bg-green-500" : "bg-rose-400"
                  }`}
                  style={{ width: `${employee.progress}%` }}
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  employee.complete ? "text-green-600" : "text-rose-600"
                }`}
              >
                {employee.progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="hidden h-24 w-[4px] rounded-full bg-gray-500 md:block" />

        {/* Tabs: just add dot=... */}
        <nav
          className="no-scrollbar flex flex-wrap items-center justify-center gap-2 sm:gap-6 md:flex-nowrap md:justify-start md:overflow-x-auto"
          role="tablist"
          aria-label="Employee sections"
        >
          <Tab
            dataTestid="personal-tab-btn"
            active={activeTab === "personal"}
            onClick={() => setActiveTab("personal")}
            dot={personalIncomplete}
            icon={<IdentificationIcon className="h-7 w-7 md:h-9 md:w-9" />}
          >
            Personal Information
          </Tab>

          <Tab
            dataTestid="employment-tab-btn"
            active={activeTab === "employment"}
            onClick={() => setActiveTab("employment")}
            dot={employmentIncomplete}
            icon={<BriefcaseIcon className="h-7 w-7 md:h-9 md:w-9" />}
          >
            Employment Details
          </Tab>

          <Tab
            dataTestid="training-tab-btn"
            active={activeTab === "training"}
            onClick={() => setActiveTab("training")}
            dot={trainingIncomplete}
            icon={<AcademicCapIcon className="h-7 w-7 md:h-9 md:w-9" />}
          >
            Training &amp; Development
          </Tab>

          <Tab
            dataTestid="disciplinary-tab-btn"
            active={activeTab === "disciplinary"}
            onClick={() => setActiveTab("disciplinary")}
            icon={<ExclamationTriangleIcon className="h-7 w-7 md:h-9 md:w-9" />}
            disabled
            tooltip="Coming soon"
          >
            Disciplinary Records
          </Tab>

          <Tab
            dataTestid="performance-tab-btn"
            active={activeTab === "performance"}
            onClick={() => setActiveTab("performance")}
            icon={<ChartBarIcon className="h-7 w-7 md:h-9 md:w-9" />}
            disabled
            tooltip="Coming soon"
          >
            Performance &amp; Evaluation
          </Tab>

          <Tab
            dataTestid="benefits-tab-btn"
            active={activeTab === "benefits"}
            onClick={() => setActiveTab("benefits")}
            icon={<Cog6ToothIcon className="h-7 w-7 md:h-9 md:w-9" />}
            disabled
            tooltip="Coming soon"
          >
            Benefits &amp; Government Compliance
          </Tab>

          <Tab
            dataTestid="documents-tab-btn"
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
            icon={<ArchiveBoxIcon className="h-7 w-7 md:h-9 md:w-9" />}
            disabled
            tooltip="Coming soon"
          >
            Document Repository
          </Tab>
        </nav>
      </div>

      {locked && (
        <div
          data-testid="no-active-sub"
          className="absolute inset-0 z-30 bg-gray-400/35 backdrop-blur-[5px] pointer-events-auto cursor-not-allowed rounded-lg flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="rounded-full bg-gray-900/70 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm">
            No Active Subscription
          </span>
        </div>
      )}
    </div>
  );
}
