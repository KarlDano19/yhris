"use client";

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
import PlacholderPicture from "@/svg/PlaceholderPicture"; // ⬅️ add this
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
}: {
  employee: {
    name: string;
    role: string;
    complete: boolean;
    progress: number;
    avatar: string; // "male" | "female" | URL
    email: string;
  };
  activeTab: TabKey;
  setActiveTab: (k: TabKey) => void;
}) {
  const isSvgAvatar = employee.avatar === "male" || employee.avatar === "female";

  return (
    <div className="rounded-[40px] px-2 py-4 bg-[#355fd0]/5 sm:rounded-[110px] sm:px-8 sm:py-8 shadow-sm">
      <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-center">
        <div className="flex w-full items-center justify-center gap-4 text-center md:w-auto md:justify-start md:pr-5 md:text-left">
          {/* Avatar */}
          <div className="relative h-[80px] w-[80px] flex-shrink-0 md:h-[100px] md:w-[100px]">
            <div
              className={`absolute inset-0 scale-110 rounded-full border-4 border-yellow-400 ${
                employee.complete ? "border-solid" : "border-dashed"
              }`}
            />
            {isSvgAvatar ? (
              <div className="absolute inset-0 grid place-items-center rounded-full bg-white">
                <PlacholderPicture
                  gender={employee.avatar as "male" | "female"}
                  className="h-14 w-14 md:h-16 md:w-16"
                  title={employee.name}
                />
              </div>
            ) : (
              <Image
                src={employee.avatar}
                alt={employee.name}
                width={100}
                height={100}
                className="relative rounded-full object-cover"
              />
            )}
          </div>

          {/* Name + role + progress */}
          <div>
            <div className="font-semibold text-indigo-dye">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.role}</div>

            <div className="mt-2 flex items-center justify-center gap-3 md:justify-start">
              <div
                className={`h-2 w-40 overflow-hidden rounded-full md:w-48 ${
                  employee.complete ? "bg-green-100" : "bg-rose-100"
                }`}
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

        {/* Tabs */}
        <nav
          className="no-scrollbar flex flex-wrap items-center justify-center gap-2 sm:gap-6 md:flex-nowrap md:justify-start md:overflow-x-auto"
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
  );
}
