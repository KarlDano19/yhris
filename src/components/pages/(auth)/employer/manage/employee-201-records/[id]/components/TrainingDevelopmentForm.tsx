"use client";

// 1. React imports
import { useCallback, useEffect, useMemo, useState } from "react";

// 2. Third-party library imports
import { useForm, useFieldArray, Controller } from "react-hook-form";

// 3. Internal component imports
import ConfirmModal from "../modals/ConfirmModal";
import Section from "../common/Section";
import CustomDatePicker from "@/components/CustomDatePicker";
import Pagination from "@/components/Pagination";

// 4. Internal hook imports
import { useGetTrainingRecordsList } from "../hooks/useGetTrainingRecordsList";

// 5. Type imports
import { TrainingRecord } from "../types/trainingRecords";

// 6. Icon imports
import { TrashIcon } from "@heroicons/react/24/solid";

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
  fileError?: string | null; // file validation / required error
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

/* --------- File validation: max 10 MB; allow only images & PDFs ---------- */
const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
// Extensions help the picker; runtime checks use both MIME & extension
const ALLOWED_EXTS = ["pdf", "png", "jpg", "jpeg", "webp"];
const ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

function validateProofFile(file: File | null): string | null {
  if (!file) return null; // presence is checked elsewhere (required rule)
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const typeOk = ALLOWED_MIME.includes(file.type);
  const extOk = ALLOWED_EXTS.includes(ext);
  if (!(typeOk || extOk)) {
    return "Only PDF or image files are allowed (.pdf, .png, .jpg, .jpeg, .webp).";
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File is too large. Maximum size is ${MAX_FILE_MB} MB.`;
  }
  return null;
}

function validateRow(row: Row): RowErrors {
  const errs: RowErrors = {};
  // title
  errs.title = isEmpty(row.title) ? "Training Title is required." : null;
  // date
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
  // provider
  errs.provider = isEmpty(row.provider)
    ? "Training Provider is required."
    : null;

  // file REQUIRED rule
  const hasServer = !!row.existingFileUrl;
  const keepingServer = hasServer && row.fileAction === "keep";
  const needsFile =
    row.isNew || // new rows must upload a file
    !hasServer || // existing row had no server file → must upload
    row.fileAction === "replace" || // replacing requires a file
    row.fileAction === "clear"; // clearing would leave none → must replace

  if (keepingServer) {
    // fine; no further checks
    errs.fileError = null;
  } else if (needsFile) {
    if (!row.file) {
      errs.fileError = "Proof of Completion is required.";
    } else {
      const v = validateProofFile(row.file);
      errs.fileError = v || null;
    }
  } else {
    errs.fileError = null;
  }

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // GET list from backend (refetches automatically when page changes)
  const {
    data: listData,
    isLoading,
    error,
    refetch,
  } = useGetTrainingRecordsList(employeeId, {
    current_page: currentPage,
    page_size: pageSize,
  });

  const totalRecords = listData?.total_records ?? 0;
  const totalPages =
    listData?.total_pages ??
    Math.max(1, Math.ceil((totalRecords || 0) / (pageSize || 1)));

  useEffect(() => {
    if (listData?.total_pages && currentPage > listData.total_pages) {
      setCurrentPage(listData.total_pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData?.total_pages]);

  // refetch when parent bumps refreshKey (after successful save)
  useEffect(() => {
    if (refreshKey !== undefined) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  /* ----------------------------- React Hook Form ----------------------------- */
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<{ rows: Row[] }>({
    mode: "onChange",
    defaultValues: {
      rows: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "rows",
  });

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
        fileAction: "keep" as FileAction,
      }));
    setValue('rows', seeded);
    setDeletedServerIds([]);
    onDirtyChange?.(false);
  }, [listData, setValue, onDirtyChange]);

  // errors aggregate
  const hasErrors = useMemo(() => {
    const rowsValue = watch('rows');
    return rowsValue.some((row: Row) => {
      const errs = validateRow(row);
      return !!(errs.title || errs.dateCompleted || errs.provider || errs.fileError);
    });
  }, [watch]);

  useEffect(() => onErrorsChange?.(hasErrors), [hasErrors, onErrorsChange]);

  // dirty aggregate
  const dirty = useMemo(() => {
    const rowsValue = watch('rows');
    return rowsValue.some((r: Row) => r.isDirty || r.isNew) || deletedServerIds.length > 0;
  }, [watch, deletedServerIds]);

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  /* -------------------------- Row operations -------------------------- */
  const updateRow = useCallback(
    (index: number, patch: Partial<Row>) => {
      const current = fields[index];
      update(index, { ...current, ...patch, isDirty: true });
    },
    [fields, update]
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
    append(fresh);
  }, [append]);

  const queueDelete = useCallback((index: number) => {
    const row = fields[index];
    if (row.serverId != null) {
      setDeletedServerIds((prev) =>
        prev.includes(row.serverId!) ? prev : [...prev, row.serverId!]
      );
    }
    remove(index);
  }, [fields, remove]);

  /* ------------------------- Confirm delete modal ------------------------ */
  const askDelete = (index: number) => {
    setConfirmRowId(String(index));
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (confirmRowId === null) return;
    try {
      setConfirmBusy(true);
      queueDelete(Number(confirmRowId));
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
    // Trigger validation
    trigger();

    const currentRows = watch('rows');
    const anyErrors = currentRows.some((row: Row) => {
      const errs = validateRow(row);
      return !!(errs.title || errs.dateCompleted || errs.provider || errs.fileError);
    });

    const creates = currentRows
      .filter((r: Row) => r.isNew)
      .map((r: Row) => ({
        training_title: r.title,
        date_completed: r.dateCompleted || null,
        training_provider: r.provider || "",
        proof_of_completion: r.file || null,
      }));

    const updates = currentRows
      .filter((r: Row) => !r.isNew && r.isDirty && r.serverId != null)
      .map((r: Row) => {
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
  }, [watch, deletedServerIds, trigger]);

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
      {!isLoading && !error && fields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-sm">
            No trainings yet. Click "Add Training" to get started.
          </p>
        </div>
      )}

      {/* Rows */}
      {!isLoading &&
        fields.map((row, index) => {
          const rowErr = validateRow(row);
          const hasServerFile =
            !!row.existingFileUrl && row.fileAction === "keep";
          return (
            <div key={row.id} className="mb-5">
              <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => askDelete(index)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-300 text-red-500 hover:bg-red-50"
                  title="Remove Training"
                  aria-label="Remove Training"
                  disabled={isLoading || confirmBusy}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>

                {/* Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Training Title Field */}
                  <div data-testid="title-field">
                    <label htmlFor={`title-${row.id}`} className="mb-1 block text-sm font-medium text-gray-700">
                      Training Title
                      <span className="ml-0.5 text-red-600">*</span>
                    </label>
                    <input
                      id={`title-${row.id}`}
                      {...register(`rows.${index}.title`, {
                        required: "Training Title is required.",
                      })}
                      type="text"
                      placeholder="Enter Training Title..."
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                        errors.rows?.[index]?.title
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#355fd0]"
                      }`}
                    />
                    {errors.rows?.[index]?.title && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.rows[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name={`rows.${index}.dateCompleted`}
                    control={control}
                    rules={{
                      required: "Date Completed is required.",
                      validate: (value) => {
                        const d = toDate(value);
                        if (!d) return "Invalid date.";
                        const today = new Date();
                        const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                        const tOnly = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate()
                        );
                        if (dOnly > tOnly) return "Date Completed cannot be in the future.";
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Date Completed
                          <span className="ml-0.5 text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <CustomDatePicker
                            id={`training-date-${row.id}`}
                            selected={toDate(field.value)}
                            pickerOnChange={(d: Date | null) =>
                              field.onChange(d ? toISODateInput(d) : "")
                            }
                            inputOnChange={(d: Date | null) =>
                              field.onChange(d ? toISODateInput(d) : "")
                            }
                            placeholder="MM/DD/YYYY"
                            className={[
                              "w-full rounded-md bg-white px-3 py-2 text-sm",
                              fieldState.error
                                ? "border border-red-500 focus:border-red-500"
                                : "border border-gray-300 focus:border-[#355fd0]",
                            ].join(" ")}
                          />
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            fieldState.error
                              ? "text-red-600"
                              : "text-transparent"
                          }`}
                        >
                          {fieldState.error?.message || "placeholder"}
                        </p>
                      </div>
                    )}
                  />

                  {/* Training Provider Field */}
                  <div data-testid="provider-field">
                    <label htmlFor={`provider-${row.id}`} className="mb-1 block text-sm font-medium text-gray-700">
                      Training Provider
                      <span className="ml-0.5 text-red-600">*</span>
                    </label>
                    <input
                      id={`provider-${row.id}`}
                      {...register(`rows.${index}.provider`, {
                        required: "Training Provider is required.",
                      })}
                      type="text"
                      placeholder="Enter Training Provider..."
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 ${
                        errors.rows?.[index]?.provider
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#355fd0]"
                      }`}
                    />
                    {errors.rows?.[index]?.provider && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.rows[index]?.provider?.message}
                      </p>
                    )}
                  </div>

                  {/* Proof of completion (REQUIRED) - Manual handling due to file complexity */}
                  <div data-testid="proof-field">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Proof of Completion (PDF or Image) <span className="ml-0.5 text-red-600">*</span>
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
                            onClick={() => {
                              updateRow(index, {
                                fileAction: "clear",
                                file: null,
                              });
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                          <label
                            data-testid="replace-file-btn"
                            className="text-xs text-blue-600 hover:underline cursor-pointer"
                          >
                            Replace
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.webp"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0] ?? null;
                                const err = validateProofFile(f);
                                if (err) {
                                  e.currentTarget.value = "";
                                  return;
                                }
                                updateRow(index, {
                                  file: f,
                                  fileAction: f ? "replace" : "keep",
                                });
                              }}
                            />
                          </label>
                        </div>
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
                              onClick={() => {
                                updateRow(index, {
                                  file: null,
                                  fileAction: row.existingFileUrl ? "clear" : "keep",
                                });
                              }}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              const err = validateProofFile(f);
                              if (err) {
                                e.currentTarget.value = "";
                                return;
                              }
                              updateRow(index, {
                                file: f,
                                fileAction: f
                                  ? "replace"
                                  : row.existingFileUrl
                                  ? "clear"
                                  : "keep",
                              });
                            }}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          />
                        )}
                      </>
                    )}

                    {!hasServerFile &&
                      row.fileAction === "clear" &&
                      row.existingFileUrl && (
                        <div className="mt-1 text-xs text-orange-600">
                          File will be removed on Save.
                        </div>
                      )}

                    <p
                      className={`mt-1 text-xs ${
                        rowErr.fileError
                          ? "text-red-600"
                          : "text-transparent"
                      }`}
                    >
                      {rowErr.fileError || "placeholder"}
                    </p>
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
        onPageSizeChange={(size: number) => setPageSize(size)}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        pageType="standard"
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
