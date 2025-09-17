"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Section from "../common/Section";
import Grid from "../common/Grid";
import Field from "../common/Field";
import AddableSelect from "../common/AddableSelect";

import { s } from "../utils/_shared";

import SalaryHistoryModal from "../modals/EmploymentDetails/SalaryHistoryModal";
import EmploymentHistoryModal from "../modals/EmploymentDetails/EmploymentHistoryModal";

import CustomDatePicker from "@/components/CustomDatePicker";

import type { Employee } from "@/types/employee-201-records/employee";

type Props = {
  emp?: Partial<Employee>;
  onPatchChange?: (patch: Record<string, any>) => void;
  onErrorsChange?: (hasErrors: boolean) => void;
  refetch?: () => void | Promise<void>;
  editing?: boolean;                
};

const uniq = (xs: (string | undefined | null)[]) =>
  Array.from(new Set(xs.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );

export default function EmploymentDetailsForm({
  emp,
  onPatchChange,
  onErrorsChange,
  refetch,
  editing = false,                 
}: Props) {
  const emit = (patch: Record<string, any>) => onPatchChange?.(patch);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);

  // --- helpers ---
  const setSalaryModalParam = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) params.set("viewSalaryHistory", "true");
    else params.delete("viewSalaryHistory");
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const toDate = (val?: string | Date | null): Date | undefined => {
    if (!val) return undefined;
    if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  };
  const fmtYmd = (d?: Date | null) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // --- initial values (API fields) ---
  const [system_id] = useState<string>(s(emp?.system_id ?? "")); // read-only
  const [date_hired, setDateHired] = useState<Date | undefined>(
    toDate(emp?.date_hired ?? null)
  );
  const [employment_status, setEmploymentStatus] = useState<string>(
    s(emp?.employment_status ?? "")
  );
  const [location, setLocation] = useState<string>(s(emp?.location ?? ""));
  const [position, setPosition] = useState<string>(s(emp?.position ?? ""));
  const [department, setDepartment] = useState<string>(
    s(emp?.department ?? "")
  );

  // -------- options: from employee lists + user-added extras --------
  const [extraPositions, setExtraPositions] = useState<string[]>([]);
  const [extraDepartments, setExtraDepartments] = useState<string[]>([]);
  const [extraLocations, setExtraLocations] = useState<string[]>([]);
  const [extraEmploymentStatuses, setExtraEmploymentStatuses] = useState<
    string[]
  >([]);

  const positionOptions = useMemo(
    () =>
      uniq([
        ...((emp?.positions_list as string[] | undefined) ?? []),
        ...extraPositions,
      ]),
    [emp?.positions_list, extraPositions]
  );
  const departmentOptions = useMemo(
    () =>
      uniq([
        ...((emp?.departments_list as string[] | undefined) ?? []),
        ...extraDepartments,
      ]),
    [emp?.departments_list, extraDepartments]
  );
  const locations = useMemo(
    () =>
      uniq([
        ...((emp?.locations_list as string[] | undefined) ?? []),
        ...extraLocations,
      ]),
    [emp?.locations_list, extraLocations]
  );
  const employmentStatusOptions = useMemo(
    () =>
      uniq([
        ...((emp?.employment_status_list as string[] | undefined) ?? []),
        ...extraEmploymentStatuses,
      ]),
    [emp?.employment_status_list, extraEmploymentStatuses]
  );

  useEffect(() => {
    const shouldOpen = searchParams.get("viewSalaryHistory") === "true";
    setShowSalaryModal(shouldOpen);
  }, [searchParams]);

  useEffect(() => {
    const v = employment_status;
    if (v && !employmentStatusOptions.includes(v)) {
      setExtraEmploymentStatuses((opts) => (opts.includes(v) ? opts : [...opts, v]));
    }
  }, [employmentStatusOptions, employment_status]);

  useEffect(() => {
    const v = s(emp?.employment_status ?? "");
    setEmploymentStatus(v);

    const base = (emp?.employment_status_list as string[] | undefined) ?? [];
    if (v && !base.includes(v)) {
      setExtraEmploymentStatuses((opts) => (opts.includes(v) ? opts : [...opts, v]));
    }

    setErr("employment_status", validate.employment_status(v));
  }, [emp?.employment_status]);

  useEffect(() => {
    setLocation(s(emp?.location ?? ""));
  }, [emp?.location]);

  useEffect(() => {
    setPosition(s(emp?.position ?? ""));
  }, [emp?.position]);

  useEffect(() => {
    setDepartment(s(emp?.department ?? ""));
  }, [emp?.department]);

  useEffect(() => {
    setDateHired(toDate(emp?.date_hired ?? null));
  }, [emp?.date_hired]);

  const employeeName =
    [emp?.firstname, emp?.lastname].filter(Boolean).join(" ").trim() || "—";

  const mergeUniq = (base: (string | undefined | null)[], extras: string[]) =>
    Array.from(
      new Set([...(base.filter(Boolean) as string[]), ...extras])
    ).sort((a, b) => a.localeCompare(b));

  /* ---------------- validations (API keys) ---------------- */
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const isEmpty = (v: string | undefined | null) =>
    !v || String(v).trim().length === 0;

  const validate = {
    date_hired: (d?: Date) => {
      if (!d || isNaN(d.getTime())) return "Date Hired is required.";
      const today = new Date();
      const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const tOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      if (dOnly > tOnly) return "Date Hired cannot be in the future.";
      return null;
    },
    employment_status: (v: string) =>
      isEmpty(v) ? "Employment Status is required." : null,
    location: (v: string) => (isEmpty(v) ? "Location is required." : null),
    position: (v: string) => (isEmpty(v) ? "Position is required." : null),
    department: (v: string) => (isEmpty(v) ? "Department is required." : null),
  };

  const buildInitialErrors = (): Record<string, string | null> => ({
    date_hired: validate.date_hired(date_hired),
    employment_status: validate.employment_status(employment_status),
    location: validate.location(location || ""),
    position: validate.position(position),
    department: validate.department(department),
  });

  useEffect(() => {
    setErrors(buildInitialErrors());
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

  // gate error display when not editing
  const showErr = (k: string) => (editing ? errors[k] || null : null);

  return (
    <Section title="">
      {/* Row 1: System ID | Date Hired | Employment Status | Location */}
      <Grid className="mb-2">
        {/* System ID: read-only, not required */}
        <Field
          dataTestid="systemid-field"
          label="System ID"
          defaultValue={s(system_id)}
          onChange={() => {}}
          error={null}
          readOnly
          disabled
        />

        {/* Date Hired (API: date_hired YYYY-MM-DD) */}
        <div className="flex flex-col">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date Hired <span className="ml-0.5 text-red-600">*</span>
          </label>
          <CustomDatePicker
            id="date-hired"
            selected={date_hired ?? null}
            pickerOnChange={
              editing
                ? (d: Date | null) => {
                    const v = d ?? undefined;
                    setDateHired(v);
                    emit({ date_hired: fmtYmd(v || undefined) });
                    setErr("date_hired", validate.date_hired(v));
                  }
                : undefined
            }
            inputOnChange={
              editing
                ? (d: Date | null) => {
                    const v = d ?? undefined;
                    setDateHired(v);
                    emit({ date_hired: fmtYmd(v || undefined) });
                    setErr("date_hired", validate.date_hired(v));
                  }
                : undefined
            }
            placeholder="MM/DD/YYYY"
            disabled={!editing}  // forward if supported by the component
            className={[
              "w-full rounded-md px-3 py-2 text-sm",
              !editing
                ? "bg-gray-100 border border-gray-200 cursor-not-allowed"
                : showErr("date_hired")
                ? "border border-red-500 focus:border-red-500"
                : "bg-white border border-gray-300 focus:border-[#355fd0]",
            ].join(" ")}
          />
          <p
            className={`mt-1 text-xs ${
              showErr("date_hired") ? "text-red-600" : "text-transparent"
            }`}
          >
            {showErr("date_hired") || "placeholder"}
          </p>
        </div>

        {/* Employment Status — addable */}
        <AddableSelect
          dataTestid="employment-status-select"
          label="Employment Status"
          options={employmentStatusOptions}
          value={employment_status}
          onAddOption={
            editing
              ? (newOpt) => {
                  setExtraEmploymentStatuses((opts) => {
                    const next = opts.includes(newOpt) ? opts : [...opts, newOpt];
                    const merged = mergeUniq(
                      (emp?.employment_status_list as string[] | undefined) ?? [],
                      next
                    );
                    emit({ employment_status_list: merged });
                    return next;
                  });
                  setEmploymentStatus(newOpt);
                  emit({ employment_status: newOpt });
                  setErr("employment_status", validate.employment_status(newOpt));
                }
              : undefined
          }
          onChange={
            editing
              ? (val) => {
                  setEmploymentStatus(val);
                  emit({ employment_status: val });
                  setErr("employment_status", validate.employment_status(val));
                }
              : undefined
          }
          error={showErr("employment_status")}
          disabled={!editing}     // 👈 ensure AddableSelect supports this
          showErrors={editing}    // 👈 gate inline error display
        />

        {/* Location */}
        <AddableSelect
          dataTestid="location-select"
          label="Location"
          options={locations}
          value={location}
          onAddOption={
            editing
              ? (newOpt) => {
                  setExtraLocations((opts) => {
                    const next = opts.includes(newOpt) ? opts : [...opts, newOpt];
                    const merged = mergeUniq(
                      (emp?.locations_list as string[] | undefined) ?? [],
                      next
                    );
                    emit({ locations_list: merged });
                    return next;
                  });
                  setLocation(newOpt);
                  emit({ location: newOpt });
                  setErr("location", validate.location(newOpt));
                }
              : undefined
          }
          onChange={
            editing
              ? (val) => {
                  setLocation(val);
                  emit({ location: val });
                  setErr("location", validate.location(val));
                }
              : undefined
          }
          error={showErr("location")}
          disabled={!editing}
          showErrors={editing}
        />
      </Grid>

      {/* Row 2: Position | Department */}
      <Grid className="mb-8">
        <AddableSelect
          dataTestid="position-select"
          label="Position"
          options={positionOptions}
          value={position}
          onAddOption={
            editing
              ? (newOpt) => {
                  setExtraPositions((opts) => {
                    const next = opts.includes(newOpt) ? opts : [...opts, newOpt];
                    const merged = mergeUniq(
                      (emp?.positions_list as string[] | undefined) ?? [],
                      next
                    );
                    emit({ positions_list: merged });
                    return next;
                  });
                  setPosition(newOpt);
                  emit({ position: newOpt });
                  setErr("position", validate.position(newOpt));
                }
              : undefined
          }
          onChange={
            editing
              ? (val) => {
                  setPosition(val);
                  emit({ position: val });
                  setErr("position", validate.position(val));
                }
              : undefined
          }
          error={showErr("position")}
          disabled={!editing}
          showErrors={editing}
        />

        <AddableSelect
          dataTestid="department-select"
          label="Department"
          options={departmentOptions}
          value={department}
          onAddOption={
            editing
              ? (newOpt) => {
                  setExtraDepartments((opts) => {
                    const next = opts.includes(newOpt) ? opts : [...opts, newOpt];
                    const merged = mergeUniq(
                      (emp?.departments_list as string[] | undefined) ?? [],
                      next
                    );
                    emit({ departments_list: merged });
                    return next;
                  });
                  setDepartment(newOpt);
                  emit({ department: newOpt });
                  setErr("department", validate.department(newOpt));
                }
              : undefined
          }
          onChange={
            editing
              ? (val) => {
                  setDepartment(val);
                  emit({ department: val });
                  setErr("department", validate.department(val));
                }
              : undefined
          }
          error={showErr("department")}
          disabled={!editing}
          showErrors={editing}
        />

        <div className="mt-6">
          <button
            data-testid="view-salary-history-btn"
            type="button"
            onClick={() => {
              setShowSalaryModal(true);
              setSalaryModalParam(true);
            }}
            className="w-full rounded-md border border-[#355fd0] text-[#355fd0] px-4 py-2 text-sm hover:bg-[#355fd0]/5"
          >
            View Salary History
          </button>
          <p className="mt-1 text-xs text-gray-500">+ Add salary here</p>
        </div>

        <div className="mt-6">
          <button
            data-testid="view-employment-history-btn"
            type="button"
            onClick={() => {
              setShowEmploymentModal(true);
            }}
            className="w-full rounded-md border border-[#355fd0] text-[#355fd0] px-4 py-2 text-sm hover:bg-[#355fd0]/5"
          >
            View Employment History
          </button>
        </div>
      </Grid>

      {showSalaryModal && (
        <SalaryHistoryModal
          isOpen
          onClose={() => { setShowSalaryModal(false); setSalaryModalParam(false); }}
          employeeName={employeeName}
          employeeId={emp?.id as string | number}
          onRefetch={refetch}
          defaultPosition={s(emp?.position ?? "")}
        />
      )}

      {showEmploymentModal && (
        <EmploymentHistoryModal
          isOpen
          onClose={() => setShowEmploymentModal(false)}
          employeeName={employeeName}
          employeeId={emp?.id as string | number}
        />
      )}
    </Section>
  );
}
