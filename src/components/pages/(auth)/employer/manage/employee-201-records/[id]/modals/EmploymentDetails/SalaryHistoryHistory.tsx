"use client";

import { useEffect, useMemo, useState } from "react";

import Pagination from "@/components/Pagination";
import CustomDatePicker from "@/components/CustomDatePicker";
import useGetPositionItems from "@/components/hooks/useGetPositionItems";

import Field from "../../common/Field";
import AddableSelect from "../../common/AddableSelect";

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
}: {
  employeeId?: number | string; // if provided, we fetch with server-side pagination
  entries?: SalaryHistoryEntry[]; // optional fallback (no server pagination)
  pageType?: string;
  onCreate?: (entry: SalaryHistoryEntry) => Promise<void> | void;
  onRefetch?: () => void | Promise<void>;
}) {
  // -------------------- pagination state (server-driven) --------------------
  const [pageSize, setPageSize] = useState<number>(
    pageType === "employee201" ? 12 : 10
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  // -------------------- fetch when employeeId is present --------------------
  const enabledFetch = Boolean(employeeId);
  const {
    entries: fetched,
    isLoading,
    error: loadError,
    meta, // { total_pages, total_records, ... } when backend returns ObjectManager meta
    refetch,
  } = useGetSalaryHistory(employeeId!, { pageSize, page: currentPage });

  // Choose source list:
  // - If fetching from API (employeeId present): use 'fetched' which already corresponds to currentPage/pageSize
  // - Else: fall back to 'entries' prop and do client-side pagination
  const remoteItems = enabledFetch ? fetched : [];
  const localItems = !enabledFetch ? entries ?? [] : [];

  // Keep local list for optimistic add (always used for rendering)
  const [items, setItems] = useState<SalaryHistoryEntry[]>(
    enabledFetch ? remoteItems : localItems
  );
  useEffect(() => {
    setItems(enabledFetch ? remoteItems : localItems);
  }, [enabledFetch, remoteItems, localItems]);

  /* ------------ inline update form state ------------ */
  const [showForm, setShowForm] = useState(false);
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [effDate, setEffDate] = useState<Date | null>(null);

  const [errors, setErrors] = useState<{
    position?: string;
    salary?: string;
    effDate?: string;
  }>({});
  const { data: positionItems } = useGetPositionItems();
  const {
    create,
    isSaving: isCreating,
    error: createError,
  } = useCreateSalaryHistory(employeeId);

  // User-added options (not from API)
  const [extraPositions, setExtraPositions] = useState<string[]>([]);

  const positionOptions = useMemo(() => {
    const names = Array.isArray(positionItems)
      ? (positionItems as any[])
          .map((x) => (typeof x === "string" ? x : x?.name))
          .filter(Boolean)
      : [];
    const uniq = Array.from(new Set(names as string[])).sort((a, b) =>
      a.localeCompare(b)
    );
    return [...uniq, ...extraPositions.filter((x) => !uniq.includes(x))];
  }, [positionItems, extraPositions]);

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
    setPosition("");
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
      // optimistic UI
      setItems((prev) => {
        const next = [...prev, entry];
        next.sort(
          (a, b) =>
            new Date(a.effectiveDate).getTime() -
            new Date(b.effectiveDate).getTime()
        );
        return next;
      });

      // persist to API
      if (employeeId) {
        const res = await create(entry);
        if (!res.ok) throw res.error;
        // pull canonical list (correct order/ids) from server
        await refetch();
      } else if (onCreate) {
        // fallback if parent handles persistence
        await onCreate(entry);
      }

      notify.success?.("Salary updated.");
      setShowForm(false);
      resetForm();
      await onRefetch?.();
    } catch (err: any) {
      notify.error?.(err?.message || "Failed to update salary.");
      // optional: you could refetch() here to ensure consistency
    }
  };

  // -------------------- pagination (client-side fallback) --------------------
  const totalRecords = enabledFetch
    ? meta?.total_records ?? items.length
    : items.length;
  const totalPages = enabledFetch
    ? meta?.total_pages ?? Math.max(1, Math.ceil(totalRecords / pageSize))
    : Math.max(1, Math.ceil(totalRecords / pageSize));

  const pageItems = useMemo(() => {
    if (enabledFetch) return items; // already server-paged
    // client-side slice
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [enabledFetch, items, currentPage, pageSize]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1); // resetting to first page triggers hook re-fetch
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1); // triggers hook re-fetch
  };

  return (
    <div className="w-full">
      {/* Inline update form toggle */}
      <div className="flex justify-end no-print mb-4">
        {!showForm ? (
          <button
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
              <AddableSelect
                label="Position"
                options={positionOptions}
                value={position}
                onAddOption={(newOpt) => {
                  setExtraPositions((opts) =>
                    opts.includes(newOpt) ? opts : [...opts, newOpt]
                  );
                  setPosition(newOpt);
                }}
                onChange={(val) => setPosition(val)}
                error={errors["position"] || null}
              />
              <Field
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
          // skeleton table during load
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
          <table className="min-w-full divide-y divide-gray-200">
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

      {/* Pagination footer */}
      <Pagination
        pagination={{
          totalPages,
          totalRecords,
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange} // triggers new fetch by updating state
        pageType={pageType}
      />
    </div>
  );
}

/* ---------- table helpers ---------- */
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
