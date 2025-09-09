"use client";

import type { Employee } from "@/types/employee-201-records/employee";
import EmployeeTile from "./EmployeeTile";

type Props = {
  employees: Partial<Employee>[];
  locked?: boolean;
};

export default function EmployeeGrid({ employees, locked = false }: Props) {
  return (
    <div className="relative">
      {/* grid */}
      <div
        className={[
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5",
          locked ? "pointer-events-none select-none" : "",
        ].join(" ")}
        aria-hidden={locked ? true : undefined}
      >
        {employees.map((e) => (
          <EmployeeTile key={e.id} emp={e} />
        ))}
      </div>

      {/* subtle grey transparent overlay that blocks interaction */}
      {locked && employees.length > 0 && (
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
