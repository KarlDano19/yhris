// components/EmploymentDetailsForm.tsx (updated)
import { useMemo, useState } from "react";
import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";
import { s } from "../utils/_shared";

import SalaryHistoryModal, { type SalaryHistoryEntry } from "../modals/EmploymentDetails/SalaryHistoryModal";
import EmploymentHistoryModal, { type EmploymentHistoryItem } from "../modals/EmploymentDetails/EmploymentHistoryModal";

import CustomDatePicker from "@/components/CustomDatePicker";
import SelectChevronDown from "@/svg/SelectChevronDown";

type Props = {
  emp?: Partial<Employee>;
  onViewSalaryHistory?: () => void;
  onViewEmploymentHistory?: () => void;
  /** Bubble user-edits upward (no initial mount emissions) */
  onPatchChange?: (patch: Record<string, any>) => void;
};

const STATUS_OPTIONS = ["Active", "Probationary", "Contract", "On Leave", "Terminated"] as const;

export default function EmploymentDetailsForm({
  emp,
  onViewSalaryHistory,
  onViewEmploymentHistory,
  onPatchChange,
}: Props) {
  const emit = (patch: Record<string, any>) => onPatchChange?.(patch);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);

  // ---- date helpers ----
  const toDate = (val?: string | Date | null): Date | undefined => {
    if (!val) return undefined;
    if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
    const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(val);
    if (mdy) {
      const [, mm, dd, yyyy] = mdy;
      const d = new Date(+yyyy, +mm - 1, +dd);
      return isNaN(d.getTime()) ? undefined : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const getHireDateFromEmp = (e?: Partial<Employee>): Date | undefined =>
    toDate(s((e as any)?.hireDate)) ||
    toDate(s((e as any)?.dateHired)) ||
    toDate(s((e as any)?.hiredDate)) ||
    undefined;

  // ---- initial values (no emits here) ----
  const initialHireDate = useMemo(() => getHireDateFromEmp(emp), [emp]);
  const [hireDate, setHireDate] = useState<Date | undefined>(initialHireDate);

  const [systemId, setSystemId] = useState<string>(emp?.id ?? (emp as any)?.employeeId ?? "");
  const [employmentStatus, setEmploymentStatus] = useState<string>(
    emp?.employmentStatus ?? (emp as any)?.status ?? ""
  );
  const [location, setLocation] = useState<string>(emp?.location ?? (emp as any)?.workLocation ?? "");

  const formatMoney = (value: string | number): string => {
    if (value === "" || value === null || value === undefined) return "";
    const num = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [salaryText, setSalaryText] = useState<string>(() =>
    formatMoney((emp as any)?.salary ?? emp?.basePay ?? "")
  );

  const locations = (emp?.locationsList as unknown as string[]) ?? ["MAIN", "Annex", "Remote"];

  // Example data — replace with your backend values
  const salaryEntries: SalaryHistoryEntry[] = [
    { position: emp?.position ?? emp?.jobTitle ?? "Accounting Officer", salary: 35000, effectiveDate: "2025-08-08" },
    { position: emp?.position ?? emp?.jobTitle ?? "Accounting Officer", salary: 42500, effectiveDate: "2025-08-13" },
  ];

  const [employmentItems, setEmploymentItems] = useState<EmploymentHistoryItem[]>([
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
    emp?.name ?? ([emp?.firstName, emp?.lastName].filter(Boolean).join(" ").trim() || "—");

  return (
    <Section title="">
      {/* Row 1: System ID | Date Hired | Employment Status | Location */}
      <Grid>
        <Field
          label="System ID"
          defaultValue={s(systemId)}
          onChange={(e) => {
            const v = e.target.value;
            setSystemId(v);
            emit({ systemId: v }); // emit only on user change
          }}
        />

        {/* Date Hired with CustomDatePicker */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-700">Date Hired</label>
          <CustomDatePicker
            id="date-hired"
            selected={hireDate ?? null}
            pickerOnChange={(d: Date | null) => {
              const v = d ?? undefined;
              setHireDate(v);
              emit({ hireDate: v }); // emit on user change
            }}
            inputOnChange={(d: Date | null) => {
              const v = d ?? undefined;
              setHireDate(v);
              emit({ hireDate: v });
            }}
            placeholder="MM/DD/YYYY"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <LabeledSelect
          label="Employment Status"
          options={STATUS_OPTIONS as unknown as string[]}
          defaultValue={s(employmentStatus)}
          onChange={(val) => {
            setEmploymentStatus(val);
            emit({ employmentStatus: val });
          }}
        />

        <LabeledSelect
          label="Location"
          options={locations}
          defaultValue={s(location || "MAIN")}
          onChange={(val) => {
            setLocation(val);
            emit({ location: val });
          }}
        />
      </Grid>

      {/* Row 2: Salary | Salary History | Employment History | spacer */}
      <Grid>
        <Field
          label="Salary"
          defaultValue={s(salaryText)}
          onChange={(e) => {
            const v = e.target.value;
            setSalaryText(v);
            emit({ salary: v });
          }}
        />

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

/* ---------- local select to match Field look ---------- */
function LabeledSelect({
  label,
  options,
  defaultValue,
  className = "",
  onChange,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-2">
        <select
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          className="appearance-none w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#355fd0] sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <SelectChevronDown />
        </div>
      </div>
    </div>
  );
}
