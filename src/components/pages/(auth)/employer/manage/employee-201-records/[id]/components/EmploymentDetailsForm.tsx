import { useMemo, useState } from "react";
import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

// SALARY modal
import SalaryHistoryModal, {
  type SalaryHistoryEntry,
} from "../modals/EmploymentDetails/SalaryHistoryModal";

// EMPLOYMENT modal
import EmploymentHistoryModal, {
  type EmploymentHistoryItem,
} from "../modals/EmploymentDetails/EmploymentHistoryModal";

type Props = {
  emp?: Partial<Employee>;
  onViewSalaryHistory?: () => void;
  onViewEmploymentHistory?: () => void;
};

const STATUS_OPTIONS = [
  "Active",
  "Probationary",
  "Contract",
  "On Leave",
  "Terminated",
] as const;

export default function EmploymentDetailsForm({
  emp,
  onViewSalaryHistory,
  onViewEmploymentHistory,
}: Props) {
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);

  // Map incoming data to what the UI needs (supports legacy aliases)
  const systemId = emp?.id ?? (emp as any)?.employeeId ?? "";
  const hireDate = (emp as any)?.hireDate ?? emp?.dateHired ?? "";
  const employmentStatus = emp?.employmentStatus ?? (emp as any)?.status ?? "";
  const location = emp?.location ?? (emp as any)?.workLocation ?? "";
  const salary = useMemo(
    () => formatMoney((emp as any)?.salary ?? emp?.basePay ?? ""),
    [emp]
  );

  const locations = (emp?.locationsList as unknown as string[]) ?? [
    "MAIN",
    "Annex",
    "Remote",
  ];

  // Example salary entries — replace with your data source
  const salaryEntries: SalaryHistoryEntry[] = [
    {
      position: emp?.position ?? emp?.jobTitle ?? "Accounting Officer",
      salary: 35000,
      effectiveDate: "2025-08-08",
    },
    {
      position: emp?.position ?? emp?.jobTitle ?? "Accounting Officer",
      salary: 42500,
      effectiveDate: "2025-08-13",
    },
  ];

  // Example employment history items — replace with your data source
  const [employmentItems, setEmploymentItems] = useState<
    EmploymentHistoryItem[]
  >([
    {
      position: "Accounting Officer",
      company: "ABC Company Inc.",
      dateFrom: "2025-05-18",
      dateTo: "2025-07-31",
      description:
        "Responsible for maintaining accurate financial records, preparing reports, and ensuring compliance with accounting policies.",
    },
    {
      position: "Accounts Receivable Officer",
      company: "JJK Medical Supplies Inc.",
      dateFrom: "2019-06-07",
      dateTo: "2023-05-10",
      description:
        "Managed receivables to ensure timely collections, reconciled accounts, and maintained AR reports.",
    },
  ]);

  const employeeName =
    emp?.name ??
    ([emp?.firstName, emp?.lastName].filter(Boolean).join(" ").trim() || "—");

  return (
    <Section title="">
      {/* Row 1: System ID | Date Hired | Employment Status | Location */}
      <Grid>
        <Field label="System ID" defaultValue={s(systemId)} />

        {/* Date (own input because Field is text-only) */}
        <LabeledDate label="Date Hired" defaultValue={s(hireDate)} />

        {/* Selects (own component because Field is text-only) */}
        <LabeledSelect
          label="Employment Status"
          options={STATUS_OPTIONS as unknown as string[]}
          defaultValue={s(employmentStatus)}
        />

        <LabeledSelect
          label="Location"
          options={locations}
          defaultValue={s(location || "MAIN")}
        />
      </Grid>

      {/* Row 2: Salary | Salary History | Employment History | spacer */}
      <Grid>
        <Field label="Salary" defaultValue={s(salary)} />

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              onViewSalaryHistory?.();
              setShowSalaryModal(true);
            }}
            className="w-full rounded-md border border-[#355fd0] text-[#355fd0] px-4 py-2 text-sm hover:bg-[#355fd0]/5"
          >
            View Salary History
          </button>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              onViewEmploymentHistory?.();
              setShowEmploymentModal(true);
            }}
            className="w-full rounded-md border border-[#355fd0] text-[#355fd0] px-4 py-2 text-sm hover:bg-[#355fd0]/5"
          >
            View Employment History
          </button>
        </div>

        {/* Empty spacer to keep a clean 4-column grid */}
        <div />
      </Grid>

      {/* Salary History Modal */}
      <SalaryHistoryModal
        isOpen={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        employeeName={employeeName}
        entries={salaryEntries}
        onExportPdf={() => console.log("Export Salary PDF")}
      />

      {/* Employment History Modal */}
      <EmploymentHistoryModal
        isOpen={showEmploymentModal}
        onClose={() => setShowEmploymentModal(false)}
        employeeName={employeeName}
        items={employmentItems}
        onAddItem={(item) => setEmploymentItems((prev) => [item, ...prev])}
      />
    </Section>
  );
}

/* ---------- local helpers to match Field styling ---------- */
function LabeledDate({
  label,
  defaultValue,
  className = "",
}: {
  label: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
      />
    </div>
  );
}

function LabeledSelect({
  label,
  options,
  defaultValue,
  className = "",
}: {
  label: string;
  options: string[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatMoney(value: string | number): string {
  if (value === "" || value === null || value === undefined) return "";
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
