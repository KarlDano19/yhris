import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../common/Section";
import Field from "../common/Field";
import CustomDatePicker from "@/components/CustomDatePicker";
import type { Employee } from "@/types/employee-201-records/employee";
import ConfirmModal from "../modals/ConfirmModal";
import { notify } from "../utils/notify";

/* -------------------------------- Types -------------------------------- */
type TrainingItem = {
  id: string;
  title: string;
  dateCompleted: string; // yyyy-mm-dd
  provider: string;
  proof?: File | null;
};
type RowErrors = {
  title?: string | null;
  dateCompleted?: string | null;
  provider?: string | null;
};
type ErrorsBag = Record<string, RowErrors>;

/* ------------------------------- Utilities ------------------------------ */
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

/* -------------------------- Seed / Extraction --------------------------- */
function extractTrainings(
  emp?: Partial<Employee>
): Array<Partial<TrainingItem>> {
  if (!emp) return [];
  const a = (emp as any)?.trainingDevelopment?.completedTrainings;
  const b = (emp as any)?.training?.completed;
  const c = (emp as any)?.trainings;
  const src: any[] = Array.isArray(a)
    ? a
    : Array.isArray(b)
    ? b
    : Array.isArray(c)
    ? c
    : [];
  return src.map((t) => ({
    title: t?.title ?? t?.name ?? "",
    dateCompleted: toISODateInput(
      t?.dateCompleted ?? t?.completedAt ?? t?.date
    ),
    provider: t?.provider ?? t?.organization ?? "",
  }));
}
function buildSeed(
  initialTrainings: Partial<TrainingItem>[],
  emp?: Partial<Employee>
): TrainingItem[] {
  const base =
    initialTrainings.length > 0 ? initialTrainings : extractTrainings(emp);
  if (!base || base.length === 0) return [];
  return base.map((r) => ({
    id: cryptoRandomId(),
    title: r.title ?? "",
    dateCompleted: r.dateCompleted ? toISODateInput(r.dateCompleted) : "",
    provider: r.provider ?? "",
    proof: (r.proof as File) ?? null,
  }));
}

/* ------------------------------- Validation ----------------------------- */
function validateRow(row: TrainingItem): RowErrors {
  const errs: RowErrors = {};
  errs.title = isEmpty(row.title) ? "Training Title is required." : null;

  if (isEmpty(row.dateCompleted)) {
    errs.dateCompleted = "Date Completed is required.";
  } else {
    const d = toDate(row.dateCompleted);
    if (!d) {
      errs.dateCompleted = "Invalid date.";
    } else {
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

/* --------------------------------- View --------------------------------- */
export default function TrainingDevelopmentForm({
  emp,
  initialTrainings = [],
  onChange,
  onErrorsChange,
  onReady,
}: {
  emp?: Partial<Employee>;
  initialTrainings?: Partial<TrainingItem>[];
  onChange?: (rows: TrainingItem[]) => void;
  onErrorsChange?: (hasErrors: boolean) => void;
  onReady?: (rows: TrainingItem[]) => void;
}) {
  // Seed once
  const initialSeed = useMemo(() => buildSeed(initialTrainings, emp), []); // intentionally []
  const [rows, setRows] = useState<TrainingItem[]>(initialSeed);
  const [errors, setErrors] = useState<ErrorsBag>({});

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Pre-validate on mount if rows exist
  useEffect(() => {
    if (rows.length === 0) return;
    const bag: ErrorsBag = {};
    for (const r of rows) bag[r.id] = validateRow(r);
    setErrors(bag);
  }, []); // once

  useEffect(() => {
    onReady?.(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const hasErrors = useMemo(
    () =>
      Object.values(errors).some(
        (rowErr) =>
          !!(rowErr?.title || rowErr?.dateCompleted || rowErr?.provider)
      ),
    [errors]
  );

  // Keep parent callbacks in refs
  const onErrorsChangeRef = useRef(onErrorsChange);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onErrorsChangeRef.current = onErrorsChange;
  }, [onErrorsChange]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Notify parent AFTER commit (avoids parent update during child render)
  useEffect(() => {
    onErrorsChangeRef.current?.(hasErrors);
  }, [hasErrors]);
  useEffect(() => {
    onChangeRef.current?.(rows);
  }, [rows]);

  /* ------------------------------ CRUD helpers --------------------------- */
  const update = (id: string, patch: Partial<TrainingItem>) => {
    setRows((prev) => {
      const next = prev.map((row) =>
        row.id === id ? { ...row, ...patch } : row
      );
      // validate this row based on the *next* value
      const updated = next.find((r) => r.id === id)!;
      setErrors((prevErrs) => ({ ...prevErrs, [id]: validateRow(updated) }));
      return next;
    });
  };

  const addRow = () => {
    const fresh: TrainingItem = {
      id: cryptoRandomId(),
      title: "",
      dateCompleted: "",
      provider: "",
      proof: null,
    };
    setRows((prev) => [fresh, ...prev]);
    setErrors((prevErrs) => ({ ...prevErrs, [fresh.id]: validateRow(fresh) }));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setErrors((prevErrs) => {
      const { [id]: _removed, ...rest } = prevErrs;
      return rest;
    });
  };

  /* --------------------------- Confirm modal handlers -------------------- */
  const confirmRemove = (id: string) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    const idToDelete = confirmId;
    try {
      setConfirmBusy(true);
      const ok = await notify.promise(
        (async () => {
          await sleep(700);
          return true;
        })(),
        {
          loading: "Deleting training…",
          success: "Training deleted.",
          error: "Failed to delete training.",
        }
      );
      if (ok) removeRow(idToDelete);
    } finally {
      setConfirmBusy(false);
      setConfirmOpen(false);
      setConfirmId(null);
    }
  };
  const handleCancelDelete = () => {
    if (confirmBusy) return;
    setConfirmOpen(false);
    setConfirmId(null);
  };

  /* --------------------------------- Render -------------------------------- */
  return (
    <Section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">
          Completed Trainings
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg border border-blue-500 text-blue-600 px-3 py-2 text-sm hover:bg-blue-50"
          >
            Add Training
          </button>
        </div>
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-sm">
            No trainings added yet. Click “Add Training” to get started.
          </p>
        </div>
      )}

      {/* Tiles */}
      {rows.map((row) => {
        const rowErr = errors[row.id] ?? {};
        return (
          <div key={row.id} className="mb-5">
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Delete icon */}
              <button
                type="button"
                onClick={() => confirmRemove(row.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-300 text-red-600 hover:bg-red-50"
                title="Remove Training"
                aria-label="Remove Training"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Training Title"
                  placeholder="Enter Training Title..."
                  value={row.title}
                  onChange={(e) => update(row.id, { title: e.target.value })}
                  error={rowErr.title ?? null}
                  required
                />

                {/* Date Completed using CustomDatePicker */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date Completed
                    <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <CustomDatePicker
                      id={`training-date-${row.id}`}
                      selected={toDate(row.dateCompleted)}
                      pickerOnChange={(d: Date | null) =>
                        update(row.id, {
                          dateCompleted: d ? toISODateInput(d) : "",
                        })
                      }
                      inputOnChange={(d: Date | null) =>
                        update(row.id, {
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
                  label="Training Provider"
                  placeholder="Enter Training Provider..."
                  value={row.provider}
                  onChange={(e) => update(row.id, { provider: e.target.value })}
                  error={rowErr.provider ?? null}
                  required
                />

                {/* Proof upload (optional) */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Proof of Completion (e.g., Certificate)
                  </label>
                  {row.proof ? (
                    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                      <span className="truncate">{row.proof.name}</span>
                      <button
                        type="button"
                        onClick={() => update(row.id, { proof: null })}
                        className="ml-2 text-xs text-red-600 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) =>
                        update(row.id, { proof: e.target.files?.[0] ?? null })
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    />
                  )}
                  {/* reserved helper line for grid alignment */}
                  <p className="mt-1 text-xs text-transparent">placeholder</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {confirmOpen && (
        <ConfirmModal
          title="Delete training?"
          message="This action cannot be undone."
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
