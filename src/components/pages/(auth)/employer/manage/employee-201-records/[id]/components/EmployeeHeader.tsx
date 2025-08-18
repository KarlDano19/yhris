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
    avatar: string;
    email: string;
  };
  activeTab: TabKey;
  setActiveTab: (k: TabKey) => void;
}) {
  return (
    <div className="rounded-[40px] px-2 py-4 bg-[#355fd0]/5 sm:rounded-[110px] sm:px-8 sm:py-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0">
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

            <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
              <div
                className={`h-2 w-40 md:w-48 overflow-hidden rounded-full ${
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

        <div className="hidden md:block h-24 w-[4px] rounded-full bg-gray-500" />

        <nav
          className="flex flex-wrap justify-center md:flex-nowrap md:justify-start md:overflow-x-auto md:no-scrollbar items-center gap-2 sm:gap-6"
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