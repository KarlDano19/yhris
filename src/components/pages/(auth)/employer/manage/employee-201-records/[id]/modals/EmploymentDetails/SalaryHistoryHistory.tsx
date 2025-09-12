"use client";

import { useEffect, useMemo, useState } from "react";

import Pagination from "@/components/Pagination";
import CustomDatePicker from "@/components/CustomDatePicker";

import Field from "../../common/Field";
import { notify } from "../../utils/notify";

import { useGetSalaryHistory } from "../../hooks/useGetSalaryHistory";
import { useCreateSalaryHistory } from "../../hooks/useCreateSalaryHistory";

import type { SalaryHistoryEntry } from "../../hooks/useGetSalaryHistory";

export default function SalaryHistoryHistory({
  employeeId,
  entries,
  pageType = "employee201",
  onCreate,
  onRefetch,
  defaultPosition,
}: {
  employeeId?: number | string;
  entries?: SalaryHistoryEntry[];
  pageType?: string;
  onCreate?: (entry: SalaryHistoryEntry) => Promise<void> | void;
  onRefetch?: () => void | Promise<void>;
  defaultPosition?: string;
}) {
  const [pageSize, setPageSize] = useState<number>(
    pageType === "employee201" ? 12 : 10
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const enabledFetch = Boolean(employeeId);
  const {
    entries: fetched,
    isLoading,
    error: loadError,
    meta,
    refetch,
  } = useGetSalaryHistory(employeeId!, { pageSize, page: currentPage });

  const remoteItems = enabledFetch ? fetched : [];
  const localItems = !enabledFetch ? entries ?? [] : [];

  const [items, setItems] = useState<SalaryHistoryEntry[]>(
    enabledFetch ? remoteItems : localItems
  );
  useEffect(() => {
    setItems(enabledFetch ? remoteItems : localItems);
  }, [enabledFetch, remoteItems, localItems]);

  const [showForm, setShowForm] = useState(false);
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [effDate, setEffDate] = useState<Date | null>(null);

  const [errors, setErrors] = useState<{
    position?: string;
    salary?: string;
    effDate?: string;
  }>({});
  const { create, isSaving: isCreating } = useCreateSalaryHistory(employeeId);

  useEffect(() => {
    setPosition(defaultPosition || "");
  }, [defaultPosition]);

  const validate = () => {
    const e: typeof errors = {};
    if (!position.trim()) e.position = "Position is required.";
    const num = Number(salary);
    if (!salary.trim() || Number.isNaN(num) || num <= 0)
      e.salary = "Enter a valid amount > 0.";
    if (!effDate || Number.isNaN(effDate.getTime()))
      e.effDate = "Effective date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setSalary("");
    setEffDate(null);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    const amount = Number(salary);
    const y = effDate!.getFullYear();
    const m = String(effDate!.getMonth() + 1).padStart(2, "0");
    const d = String(effDate!.getDate()).padStart(2, "0");
    const entry: SalaryHistoryEntry = {
      position: position.trim(),
      salary: Number.isNaN(amount) ? 0 : Number(amount.toFixed(2)),
      effectiveDate: `${y}-${m}-${d}`,
    };

    try {
      setItems((prev) => {
        const next = [...prev, entry];
        next.sort(
          (a, b) =>
            new Date(a.effectiveDate).getTime() -
            new Date(b.effectiveDate).getTime()
        );
        return next;
      });

      if (employeeId) {
        const res = await create(entry);
        if (!res.ok) throw res.error;
        await refetch();
      } else if (onCreate) {
        await onCreate(entry);
      }

      notify.success?.("Salary updated.");
      setShowForm(false);
      resetForm();
      await onRefetch?.();
    } catch (err: any) {
      notify.error?.(err?.message || "Failed to update salary.");
    }
  };

  const totalRecords = enabledFetch
    ? meta?.total_records ?? items.length
    : items.length;
  const totalPages = enabledFetch
    ? meta?.total_pages ?? Math.max(1, Math.ceil(totalRecords / pageSize))
    : Math.max(1, Math.ceil(totalRecords / pageSize));

  const pageItems = useMemo(() => {
    if (enabledFetch) return items;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [enabledFetch, items, currentPage, pageSize]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end no-print mb-4">
        {!showForm ? (
          <button
            data-testid="add-salary-btn"
            type="button"
            onClick={() => setShowForm(true)}
            disabled={isLoading || !!loadError}
            className={`rounded-md border px-2 py-1 text-xs ${
              isLoading || loadError
                ? "cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100"
                : "border-[#355fd0] text-[#355fd0] hover:bg-[#355fd0]/5"
            }`}
          >
            Add Salary
          </button>
        ) : (
          <div className="w-full rounded-lg border p-3 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Position (read-only) */}
              <div className="flex flex-col">
                <label
                  htmlFor="position-input"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Position <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  id="position-input"
                  data-testid="position-input"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled
                  className={[
                    "w-full rounded-md px-3 py-2 text-sm cursor-not-allowed",
                    "bg-gray-100",
                    errors["position"]
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-gray-300 focus:border-[#355fd0]",
                  ].join(" ")}
                />
                <p
                  className={`mt-1 text-xs ${
                    errors["position"] ? "text-red-600" : "text-transparent"
                  }`}
                >
                  {errors["position"] || "placeholder"}
                </p>
              </div>

              <Field
                dataTestid="salary-input"
                label="Salary"
                type="number"
                step="0.01"
                value={salary}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSalary(e.target.value);
                  if (errors.salary)
                    setErrors({ ...errors, salary: undefined });
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const n = Number(e.target.value);
                  if (!Number.isNaN(n) && n > 0) setSalary(n.toFixed(2));
                }}
                error={errors.salary || null}
                required
              />

              <div className="flex flex-col">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Effective Date <span className="ml-0.5 text-red-600">*</span>
                </label>
                <CustomDatePicker
                  id="salary-effective-date"
                  selected={effDate}
                  pickerOnChange={(d: Date | null) => {
                    setEffDate(d);
                    if (errors.effDate)
                      setErrors({ ...errors, effDate: undefined });
                  }}
                  inputOnChange={(d: Date | null) => {
                    setEffDate(d);
                    if (errors.effDate)
                      setErrors({ ...errors, effDate: undefined });
                  }}
                  placeholder="MM/DD/YYYY"
                  className={[
                    "w-full rounded-md bg-white px-3 py-2 text-sm",
                    errors.effDate
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-gray-300 focus:border-[#355fd0]",
                  ].join(" ")}
                />
                <p
                  className={`mt-1 text-xs ${
                    errors.effDate ? "text-red-600" : "text-transparent"
                  }`}
                >
                  {errors.effDate || "placeholder"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                data-testid="cancel-btn"
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-md border px-3 py-1.5 text-xs text-gray-700"
              >
                Cancel
              </button>
              <button
                data-testid="save-btn"
                type="button"
                onClick={handleSave}
                disabled={isCreating}
                className={`rounded-md px-3 py-1.5 text-xs text-white ${
                  isCreating ? "bg-gray-400 cursor-not-allowed" : "bg-[#355fd0]"
                }`}
              >
                {isCreating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        {enabledFetch && isLoading ? (
          <table className="min-w-full divide-y divide-gray-200 animate-pulse">
            <thead className="bg-gray-50">
              <tr>
                <Th>Position</Th>
                <Th align="right">Salary</Th>
                <Th align="right">Effective Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <Td>
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </Td>
                  <Td align="right">
                    <div className="h-4 w-20 rounded bg-gray-200 ml-auto" />
                  </Td>
                  <Td align="right">
                    <div className="h-4 w-24 rounded bg-gray-200 ml-auto" />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : loadError ? (
          <div className="p-4 text-sm text-red-600">
            {loadError.message || "Failed to load salary history."}
          </div>
        ) : (
          <table
            data-testid="salary-history-table"
            className="min-w-full divide-y divide-gray-200"
          >
            <thead className="bg-gray-50">
              <tr>
                <Th>Position</Th>
                <Th align="right">Salary</Th>
                <Th align="right">Effective Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pageItems.map((e, i) => (
                <tr key={`${e.effectiveDate}-${i}`}>
                  <Td>{e.position}</Td>
                  <Td align="right">{formatMoney(e.salary)}</Td>
                  <Td align="right">
                    {new Date(e.effectiveDate).toLocaleDateString()}
                  </Td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-gray-500"
                    colSpan={3}
                  >
                    No salary records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        pagination={{
          totalPages,
          totalRecords,
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        pageType={pageType}
      />
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-4 py-3 text-sm ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </td>
  );
}
function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
