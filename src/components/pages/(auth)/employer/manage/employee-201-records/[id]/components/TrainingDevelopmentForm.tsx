"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { TrashIcon } from "@heroicons/react/24/solid";

import CustomDatePicker from "@/components/CustomDatePicker";
import Pagination from "@/components/Pagination";

import ConfirmModal from "../modals/ConfirmModal";
import Section from "../common/Section";
import Field from "../common/Field";

import { useGetTrainingRecordsList } from "../hooks/useGetTrainingRecordsList";
import { TrainingRecord } from "../types/trainingRecords";


/* ------------------------------- Types ------------------------------- */
type FileAction = "keep" | "replace" | "clear";
export type TrainingChangeSet = {
  creates: Array<{
    training_title: string;
    date_completed: string | null;
    training_provider: string | null;
    proof_of_completion?: File | null;
  }>;
  updates: Array<{
    id: number | string;
    training_title: string;
    date_completed: string | null;
    training_provider: string | null;
    proof_of_completion?: File | null;
    clear_file?: boolean;
  }>;
  deletes: Array<number | string>;
  hasErrors: boolean;
};
type Row = {
  id: string;
  serverId?: number | string;
  title: string;
  dateCompleted: string;
  provider: string;
  file?: File | null;
  existingFileUrl?: string | null;
  isNew?: boolean;
  isDirty?: boolean;
  fileAction?: FileAction;
};
type RowErrors = {
  title?: string | null;
  dateCompleted?: string | null;
  provider?: string | null;
};
type ErrorsBag = Record<string, RowErrors>;

/* ------------------------------- Utils ------------------------------- */
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
const isEmpty = (v: string | null | undefined) => !v || v.trim().length === 0;
function toISODateInput(value?: string | Date | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d?.getTime?.())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function toDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}
function validateRow(row: Row): RowErrors {
  const errs: RowErrors = {};
  errs.title = isEmpty(row.title) ? "Training Title is required." : null;
  if (isEmpty(row.dateCompleted)) {
    errs.dateCompleted = "Date Completed is required.";
  } else {
    const d = toDate(row.dateCompleted);
    if (!d) errs.dateCompleted = "Invalid date.";
    else {
      const today = new Date();
      const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const tOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      errs.dateCompleted =
        dOnly > tOnly ? "Date Completed cannot be in the future." : null;
    }
  }
  errs.provider = isEmpty(row.provider)
    ? "Training Provider is required."
    : null;
  return errs;
}

/* -------------------------------- Component -------------------------------- */
export default function TrainingDevelopmentForm({
  employeeId,
  onErrorsChange,
  onDirtyChange,
  registerCollector,
  refreshKey,
}: {
  employeeId: number | string;
  onErrorsChange?: (hasErrors: boolean) => void;
  onDirtyChange?: (dirty: boolean) => void;
  registerCollector?: (fn: () => TrainingChangeSet) => void;
  refreshKey?: number;
}) {
  /* ----------------------------- Pagination state ----------------------------- */

  // GET list from backend (refetches automatically when page changes)
  const {
    data: listData,
    isLoading,
    error,
    refetch,
    setPage, 
    setPageSize, 
  } = useGetTrainingRecordsList(employeeId, {
    current_page: 1,
    page_size: 10, 
  });

  const currentPage = listData?.current_page ?? 1;
  const pageSize = listData?.page_size ?? 10;
  const totalRecords = listData?.total_records ?? 0;
  const totalPages =
    listData?.total_pages ??
    Math.max(1, Math.ceil((totalRecords || 0) / (pageSize || 1)));

  useEffect(() => {
    if (listData?.total_pages && currentPage > listData.total_pages) {
      setPage(listData.total_pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData?.total_pages]);

  // refetch when parent bumps refreshKey (after successful save)
  useEffect(() => {
    if (refreshKey !== undefined) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  /** Local rows and bookkeeping */
  const [rows, setRows] = useState<Row[]>([]);
  const [errorsBag, setErrorsBag] = useState<ErrorsBag>({});
  const [deletedServerIds, setDeletedServerIds] = useState<
    Array<number | string>
  >([]);

  /** Confirm modal */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmRowId, setConfirmRowId] = useState<string | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  // seed from backend
  useEffect(() => {
    if (!listData) return;
    const seeded: Row[] = (listData.records || [])
      .map(
        (r: TrainingRecord) =>
          [
            r.id,
            r.training_title,
            toISODateInput(r.date_completed),
            r.training_provider ?? "",
            r.proof_of_completion ?? null,
          ] as const
      )
      .map(([id, title, dateCompleted, provider, url]) => ({
        id: cryptoRandomId(),
        serverId: id,
        title,
        dateCompleted,
        provider,
        file: null,
        existingFileUrl: url,
        isNew: false,
        isDirty: false,
        fileAction: "keep",
      }));
    setRows(seeded);
    const bag: ErrorsBag = {};
    for (const row of seeded) bag[row.id] = validateRow(row);
    setErrorsBag(bag);
    setDeletedServerIds([]);
    onDirtyChange?.(false);
  }, [listData, onDirtyChange]);
  
  // errors aggregate
  const hasErrors = useMemo(
    () =>
      Object.values(errorsBag).some(
        (e) => !!(e?.title || e?.dateCompleted || e?.provider)
      ),
    [errorsBag]
  );
  useEffect(() => onErrorsChange?.(hasErrors), [hasErrors, onErrorsChange]);

  // dirty aggregate
  const dirty = useMemo(
    () => rows.some((r) => r.isDirty || r.isNew) || deletedServerIds.length > 0,
    [rows, deletedServerIds]
  );
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  /* -------------------------- Row operations -------------------------- */
  const touchValidate = useCallback((next: Row) => {
    setErrorsBag((prev) => ({ ...prev, [next.id]: validateRow(next) }));
  }, []);

  const updateRow = useCallback(
    (id: string, patch: Partial<Row>) => {
      setRows((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, ...patch, isDirty: true } : r
        );
        const changed = next.find((r) => r.id === id)!;
        touchValidate(changed);
        return next;
      });
    },
    [touchValidate]
  );

  const addRow = useCallback(() => {
    const fresh: Row = {
      id: cryptoRandomId(),
      title: "",
      dateCompleted: "",
      provider: "",
      file: null,
      existingFileUrl: null,
      isNew: true,
      isDirty: true,
      fileAction: "keep",
    };
    setRows((prev) => [fresh, ...prev]);
    touchValidate(fresh);
  }, [touchValidate]);

  const queueDelete = useCallback((row: Row) => {
    if (row.serverId != null) {
      setDeletedServerIds((prev) =>
        prev.includes(row.serverId!) ? prev : [...prev, row.serverId!]
      );
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setErrorsBag((prev) => {
      const { [row.id]: _rm, ...rest } = prev;
      return rest;
    });
  }, []);

  /* ------------------------- Confirm delete modal ------------------------ */
  const askDelete = (id: string) => {
    setConfirmRowId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!confirmRowId) return;
    try {
      setConfirmBusy(true);
      const target = rows.find((r) => r.id === confirmRowId);
      if (target) queueDelete(target);
    } finally {
      setConfirmBusy(false);
      setConfirmOpen(false);
      setConfirmRowId(null);
    }
  };
  const handleCancelDelete = () => {
    if (confirmBusy) return;
    setConfirmOpen(false);
    setConfirmRowId(null);
  };

  /* ------------------------------- Collector ------------------------------- */
  const collect = useCallback<() => TrainingChangeSet>(() => {
    const bag: ErrorsBag = {};
    for (const r of rows) bag[r.id] = validateRow(r);
    setErrorsBag(bag);
    const anyErrors = Object.values(bag).some(
      (e) => !!(e.title || e.dateCompleted || e.provider)
    );

    const creates = rows
      .filter((r) => r.isNew)
      .map((r) => ({
        training_title: r.title,
        date_completed: r.dateCompleted || null,
        training_provider: r.provider || "",
        proof_of_completion: r.file || null,
      }));

    const updates = rows
      .filter((r) => !r.isNew && r.isDirty && r.serverId != null)
      .map((r) => {
        const clear = r.fileAction === "clear" && !!r.existingFileUrl;
        return {
          id: r.serverId!,
          training_title: r.title,
          date_completed: r.dateCompleted || null,
          training_provider: r.provider || "",
          ...(r.fileAction === "replace"
            ? { proof_of_completion: r.file ?? null }
            : {}),
          ...(clear ? { clear_file: true } : {}),
        };
      });

    const deletes = [...deletedServerIds];
    return { creates, updates, deletes, hasErrors: anyErrors };
  }, [rows, deletedServerIds]);

  useEffect(() => {
    registerCollector?.(collect);
  }, [collect, registerCollector]);

  /* --------------------------------- UI --------------------------------- */
  return (
    <Section>
      {/* Header (no Save button here) */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">
          Completed Trainings
        </h3>
        <div className="flex items-center gap-2">
          <button
            data-testid="add-training-btn"
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg border border-blue-500 text-blue-600 px-3 py-2 text-sm hover:bg-blue-50"
            disabled={isLoading || confirmBusy}
          >
            Add Training
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-10 w-full rounded-md bg-gray-200" />
            ))}
          </div>
        </div>
      )}
      {error && !isLoading && (
        <div className="rounded-xl border bg-white p-6 text-sm text-red-600 mb-6">
          {error.message}
        </div>
      )}
      {!isLoading && !error && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-sm">
            No trainings yet. Click “Add Training” to get started.
          </p>
        </div>
      )}

      {/* Rows */}
      {!isLoading && rows.map((row) => {
        const rowErr = errorsBag[row.id] ?? {};
        const hasServerFile =
          !!row.existingFileUrl && row.fileAction === "keep";
        return (
          <div key={row.id} className="mb-5">
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Delete */}
              <button
                type="button"
                onClick={() => askDelete(row.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-300 text-red-500 hover:bg-red-50"
                title="Remove Training"
                aria-label="Remove Training"
                disabled={isLoading || confirmBusy}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  dataTestid="title-field"
                  label="Training Title"
                  placeholder="Enter Training Title..."
                  value={row.title}
                  onChange={(e) => updateRow(row.id, { title: e.target.value })}
                  error={rowErr.title ?? null}
                  required
                />

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date Completed<span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <CustomDatePicker
                      id={`training-date-${row.id}`}
                      selected={toDate(row.dateCompleted)}
                      pickerOnChange={(d: Date | null) =>
                        updateRow(row.id, {
                          dateCompleted: d ? toISODateInput(d) : "",
                        })
                      }
                      inputOnChange={(d: Date | null) =>
                        updateRow(row.id, {
                          dateCompleted: d ? toISODateInput(d) : "",
                        })
                      }
                      placeholder="MM/DD/YYYY"
                      className={[
                        "w-full rounded-md bg-white px-3 py-2 text-sm",
                        rowErr.dateCompleted
                          ? "border border-red-500 focus:border-red-500"
                          : "border border-gray-300 focus:border-[#355fd0]",
                      ].join(" ")}
                    />
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      rowErr.dateCompleted ? "text-red-600" : "text-transparent"
                    }`}
                  >
                    {rowErr.dateCompleted || "placeholder"}
                  </p>
                </div>

                <Field
                  dataTestid="provider-field"
                  label="Training Provider"
                  placeholder="Enter Training Provider..."
                  value={row.provider}
                  onChange={(e) =>
                    updateRow(row.id, { provider: e.target.value })
                  }
                  error={rowErr.provider ?? null}
                  required
                />

                {/* Proof of completion */}
                <div data-testid="proof-field">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Proof of Completion (e.g., Certificate)
                  </label>

                  {hasServerFile && (
                    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                      <a
                        href={row.existingFileUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate underline"
                      >
                        View current file
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          data-testid="remove-file-btn"
                          type="button"
                          onClick={() =>
                            updateRow(row.id, {
                              fileAction: "clear",
                              file: null,
                            })
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                        <label data-testid="replace-file-btn" className="text-xs text-blue-600 hover:underline cursor-pointer">
                          Replace
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            className="hidden"
                            onChange={(e) =>
                              updateRow(row.id, {
                                file: e.target.files?.[0] ?? null,
                                fileAction: e.target.files?.[0]
                                  ? "replace"
                                  : "keep",
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {!hasServerFile &&
                    row.fileAction === "clear" &&
                    row.existingFileUrl && (
                      <div className="mb-2 text-xs text-orange-600">
                        File will be removed on Save.
                      </div>
                    )}

                  {!hasServerFile && (
                    <>
                      {row.file ? (
                        <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                          <span className="truncate">{row.file.name}</span>
                          <button
                            data-testid="remove-file-btn"
                            type="button"
                            onClick={() =>
                              updateRow(row.id, {
                                file: null,
                                fileAction: row.existingFileUrl
                                  ? "clear"
                                  : "keep",
                              })
                            }
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) =>
                            updateRow(row.id, {
                              file: e.target.files?.[0] ?? null,
                              fileAction: e.target.files?.[0]
                                ? "replace"
                                : row.existingFileUrl
                                ? "clear"
                                : "keep",
                            })
                          }
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        />
                      )}
                    </>
                  )}

                  <p className="mt-1 text-xs text-transparent">placeholder</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination footer */}
      <Pagination
        pagination={{ totalPages, totalRecords }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageSizeChange={(size: number) => setPageSize(size)} // 👈 calls hook
        onPageChange={({ selected }) => setPage(selected + 1)} // 👈 calls hook
        pageType="standard" // or whatever your component expects
      />

      {/* Confirm modal */}
      {confirmOpen && (
        <ConfirmModal
          title="Delete training?"
          message="This action will be applied when you save."
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          busy={confirmBusy}
          confirmText="Delete"
          busyText="Deleting…"
          cancelText="Cancel"
          intent="danger"
          maxWidth="sm"
        />
      )}
    </Section>
  );
}
