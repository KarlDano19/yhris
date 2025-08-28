// components/EmploymentDetailsForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
  onErrorsChange?: (hasErrors: boolean) => void;
};

const STATUS_OPTIONS = ["Active", "Probationary", "Contract", "On Leave", "Terminated"] as const;

export default function EmploymentDetailsForm({
  emp,
  onViewSalaryHistory,
  onViewEmploymentHistory,
  onPatchChange,
  onErrorsChange,
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
  const [hireDate, setHireDate] = useState<Date | undefined>(getHireDateFromEmp(emp));
  const [systemId, setSystemId] = useState<string>(emp?.id ?? (emp as any)?.employeeId ?? "");
  const [employmentStatus, setEmploymentStatus] = useState<string>(emp?.employmentStatus ?? (emp as any)?.status ?? "");
  const [location, setLocation] = useState<string>(emp?.location ?? (emp as any)?.workLocation ?? "");

  const [salaryText, setSalaryText] = useState<string>(() => {
    const raw = (emp as any)?.salary ?? emp?.basePay;
    if (!raw || Number(raw) === 0) return "0.00";
    const num = Number(raw);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  });

  // NEW: position / department (with addable options)
  const [position, setPosition] = useState<string>(emp?.position ?? emp?.jobTitle ?? "");
  const [department, setDepartment] = useState<string>(emp?.department ?? (emp as any)?.displayDept ?? "");

  const [positionOptions, setPositionOptions] = useState<string[]>(
    ((emp as any)?.positionsList as string[]) ?? ["Accounting Officer", "HR Associate", "Software Engineer", "Manager"]
  );
  const [departmentOptions, setDepartmentOptions] = useState<string[]>(
    ((emp as any)?.departmentList as string[]) ?? ["HR", "Accounting", "Engineering", "Operations", "Finance"]
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
      description: "Managed receivables to ensure timely collections, reconciled accounts, and maintained AR reports.",
    },
  ]);

  const employeeName =
    emp?.name ?? ([emp?.firstName, emp?.lastName].filter(Boolean).join(" ").trim() || "—");

  /* ---------------- validations ---------------- */
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const isEmpty = (v: string | undefined | null) => !v || String(v).trim().length === 0;

  const validate = {
    systemId: (v: string) => (isEmpty(v) ? "System ID is required." : null),
    hireDate: (d?: Date) => {
      if (!d || isNaN(d.getTime())) return "Date Hired is required.";
      const today = new Date();
      const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const tOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (dOnly > tOnly) return "Date Hired cannot be in the future.";
      return null;
    },
    employmentStatus: (v: string) =>
      isEmpty(v)
        ? "Employment Status is required."
        : (STATUS_OPTIONS as unknown as string[]).includes(v)
        ? null
        : "Invalid employment status.",
    location: (v: string) => (isEmpty(v) ? "Location is required." : null),
    salary: (v: string) => {
      if (!v || v.trim() === "" || Number(v) === 0) return "Salary is required.";
      const num = Number(v);
      if (isNaN(num) || num <= 0) return "Salary must be greater than 0.";
      return null;
    },
    position: (v: string) => (isEmpty(v) ? "Position is required." : null),          // NEW
    department: (v: string) => (isEmpty(v) ? "Department is required." : null),      // NEW
  };

  const buildInitialErrors = (): Record<string, string | null> => ({
    systemId: validate.systemId(systemId),
    hireDate: validate.hireDate(hireDate),
    employmentStatus: validate.employmentStatus(employmentStatus),
    location: validate.location(location || "MAIN"),
    salary: validate.salary(salaryText),
    position: validate.position(position),       // NEW
    department: validate.department(department), // NEW
  });

  // Show errors immediately on initial render
  useEffect(() => {
    setErrors(buildInitialErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setErr = (key: string, msg: string | null) =>
    setErrors((e) => ({ ...e, [key]: msg }));

  const hasErrors = useMemo(
    () => Object.values(errors).some((m) => !!m && m.trim().length > 0),
    [errors]
  );

  useEffect(() => {
    onErrorsChange?.(hasErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasErrors]);

  return (
    <Section title="">
      {/* Row 1: System ID | Date Hired | Employment Status | Location */}
      <Grid className="mb-2">
        <Field
          label="System ID"
          defaultValue={s(systemId)}
          onChange={(e) => {
            const v = e.target.value;
            setSystemId(v);
            emit({ systemId: v });
            setErr("systemId", validate.systemId(v));
          }}
          error={errors["systemId"] || null}
          required
        />

        {/* Date Hired with CustomDatePicker */}
        <div className="flex flex-col">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date Hired <span className="ml-0.5 text-red-600">*</span>
          </label>
          <CustomDatePicker
            id="date-hired"
            selected={hireDate ?? null}
            pickerOnChange={(d: Date | null) => {
              const v = d ?? undefined;
              setHireDate(v);
              emit({ hireDate: v });
              setErr("hireDate", validate.hireDate(v));
            }}
            inputOnChange={(d: Date | null) => {
              const v = d ?? undefined;
              setHireDate(v);
              emit({ hireDate: v });
              setErr("hireDate", validate.hireDate(v));
            }}
            placeholder="MM/DD/YYYY"
            className={[
              "w-full rounded-md bg-white px-3 py-2 text-sm",
              errors["hireDate"] ? "border border-red-500 focus:border-red-500" : "border border-gray-300 focus:border-[#355fd0]",
            ].join(" ")}
          />
          <p className={`mt-1 text-xs ${errors["hireDate"] ? "text-red-600" : "text-transparent"}`}>
            {errors["hireDate"] || "placeholder"}
          </p>
        </div>

        <LabeledSelect
          label="Employment Status"
          options={STATUS_OPTIONS as unknown as string[]}
          value={s(employmentStatus)}
          onChange={(val) => {
            setEmploymentStatus(val);
            emit({ employmentStatus: val });
            setErr("employmentStatus", validate.employmentStatus(val));
          }}
          error={errors["employmentStatus"] || null}
        />

        <LabeledSelect
          label="Location"
          options={locations}
          value={s(location || "MAIN")}
          onChange={(val) => {
            setLocation(val);
            emit({ location: val });
            setErr("location", validate.location(val));
          }}
          error={errors["location"] || null}
        />
      </Grid>
          
      {/* Row 2: Salary | Position | Department | spacer */}
      <Grid className="mb-8">
        <Field
          label="Salary"
          type="number"
          step="0.01"
          value={salaryText}
          onChange={(e) => {
            const v = e.target.value; // allow empty while typing
            setSalaryText(v);
            emit({ salary: v });
            setErr("salary", validate.salary(v));
          }}
          onBlur={(e) => {
            const num = parseFloat(e.target.value || "0");
            const formatted = num.toFixed(2);
            setSalaryText(formatted);
            emit({ salary: formatted });
            setErr("salary", validate.salary(formatted));
          }}
          error={errors["salary"] || null}
          required
        />

        {/* NEW: Position (addable select) */}
        <AddableSelect
          label="Position"
          options={positionOptions}
          value={position}
          onAddOption={(newOpt) => {
            setPositionOptions((opts) => (opts.includes(newOpt) ? opts : [...opts, newOpt]));
            setPosition(newOpt);
            emit({ position: newOpt });
            setErr("position", validate.position(newOpt));
          }}
          onChange={(val) => {
            setPosition(val);
            emit({ position: val });
            setErr("position", validate.position(val));
          }}
          error={errors["position"] || null}
        />

        {/* NEW: Department (addable select) */}
        <AddableSelect
          label="Department"
          options={departmentOptions}
          value={department}
          onAddOption={(newOpt) => {
            setDepartmentOptions((opts) => (opts.includes(newOpt) ? opts : [...opts, newOpt]));
            setDepartment(newOpt);
            emit({ department: newOpt });
            setErr("department", validate.department(newOpt));
          }}
          onChange={(val) => {
            setDepartment(val);
            emit({ department: val });
            setErr("department", validate.department(val));
          }}
          error={errors["department"] || null}
        />

        <div />
      </Grid>

      {/* Row 3: history buttons */}
      <Grid className="gap-x-10 gap-y-10">
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

/* ---------- Basic select with error support ---------- */
function LabeledSelect({
  label,
  options,
  value,
  defaultValue,
  className = "",
  error,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  className?: string;
  error?: string | null;
  onChange?: (value: string) => void;
}) {
  const val = value ?? defaultValue ?? "";
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-0.5 text-red-600">*</span>
      </label>
      <div className="relative">
        <select
          value={val}
          onChange={(e) => onChange?.(e.target.value)}
          className={[
            "appearance-none w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100",
            error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#355fd0]",
          ].join(" ")}
        >
          <option value="" disabled hidden>
            Select…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <SelectChevronDown />
        </div>
      </div>

      <p className={`mt-1 text-xs ${error ? "text-red-600" : "text-transparent"}`}>{error || "placeholder"}</p>
    </div>
  );
}

/* ---------- AddableSelect: select with “Add new …” inline ---------- */
function AddableSelect({
  label,
  options,
  value,
  error,
  onChange,
  onAddOption,
}: {
  label: string;
  options: string[];
  value?: string;
  error?: string | null;
  onChange?: (value: string) => void;
  onAddOption?: (newOption: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    const v = draft.trim();
    if (!v) return;
    onAddOption?.(v);
    setDraft("");
    setAdding(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-0.5 text-red-600">*</span>
      </label>

      {/* Select */}
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={[
            "appearance-none w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100",
            error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#355fd0]",
          ].join(" ")}
        >
          <option value="" disabled hidden>
            Select…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <SelectChevronDown />
        </div>
      </div>

      {/* Helper line with "Add new" trigger or inline editor */}
      {!adding ? (
        <div className="mt-1 text-xs">
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-[#355fd0] hover:underline"
          >
            + Add new {label.toLowerCase()}
          </button>
          <span className={`ml-2 ${error ? "text-red-600" : "text-transparent"}`}>{error || "placeholder"}</span>
        </div>
      ) : (
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`New ${label.toLowerCase()}…`}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#355fd0]"
          />
          <button type="button" onClick={handleAdd} className="rounded-md bg-[#355fd0] px-3 py-1.5 text-xs text-white">
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setDraft("");
            }}
            className="rounded-md border px-3 py-1.5 text-xs text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
