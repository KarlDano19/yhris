import { useCallback, useMemo, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../common/Section";
import Field from "../common/Field";
import type { Employee } from "@/types/employee-201-records/employee";

type TrainingItem = {
  id: string;
  title: string;
  dateCompleted: string; // yyyy-mm-dd
  provider: string;
  proof?: File | null;
};

// ---------- helpers ----------
function toISODateInput(value?: string | Date | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d?.getTime?.())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function extractTrainings(emp?: Partial<Employee>): Array<Partial<TrainingItem>> {
  if (!emp) return [];
  const a = (emp as any)?.trainingDevelopment?.completedTrainings;
  const b = (emp as any)?.training?.completed;
  const c = (emp as any)?.trainings;
  const src: any[] = Array.isArray(a) ? a : Array.isArray(b) ? b : Array.isArray(c) ? c : [];
  return src.map((t) => ({
    title: t?.title ?? t?.name ?? "",
    dateCompleted: toISODateInput(t?.dateCompleted ?? t?.completedAt ?? t?.date),
    provider: t?.provider ?? t?.organization ?? "",
  }));
}

function buildSeed(
  initialTrainings: Partial<TrainingItem>[],
  emp?: Partial<Employee>
): TrainingItem[] {
  const base = initialTrainings.length > 0 ? initialTrainings : extractTrainings(emp);
  if (!base || base.length === 0) return [];
  return base.map((r) => ({
    id: crypto.randomUUID(),
    title: r.title ?? "",
    dateCompleted: r.dateCompleted ? toISODateInput(r.dateCompleted) : "",
    provider: r.provider ?? "",
    proof: (r.proof as File) ?? null,
  }));
}
// -----------------------------

export default function TrainingDevelopmentForm({
  emp,
  initialTrainings = [],
  onChange,
}: {
  emp?: Partial<Employee>;
  initialTrainings?: Partial<TrainingItem>[];
  onChange?: (rows: TrainingItem[]) => void;
}) {
  // Seed ONCE — no useEffect resync to avoid loops
  const initialSeed = useMemo(() => buildSeed(initialTrainings, emp), []); // <- empty deps on purpose
  const [rows, setRows] = useState<TrainingItem[]>(initialSeed);

  // Optional manual reset API (call from parent if you need to refresh from latest emp)
  const resetFromEmp = useCallback(() => {
    const next = buildSeed(initialTrainings, emp);
    setRows(next);
    onChange?.(next);
  }, [emp, initialTrainings, onChange]);

  const update = (id: string, patch: Partial<TrainingItem>) => {
    setRows((prev) => {
      const next = prev.map((row) => (row.id === id ? { ...row, ...patch } : row));
      onChange?.(next);
      return next;
    });
  };

  const addRow = () => {
    const fresh: TrainingItem = {
      id: crypto.randomUUID(),
      title: "",
      dateCompleted: "",
      provider: "",
      proof: null,
    };
    setRows((prev) => {
      const next = [fresh, ...prev]; // prepend
      onChange?.(next);
      return next;
    });
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      onChange?.(next);
      return next;
    });
  };

  return (
    <Section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Completed Trainings</h3>
        <div className="flex items-center gap-2">
          {/* Optional: expose reset button while testing, or call resetFromEmp from parent */}
          {/* <button
            type="button"
            onClick={resetFromEmp}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50"
          >
            Reset from employee
          </button> */}
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg border border-blue-500 text-blue-600 px-3 py-2 text-sm hover:bg-blue-50"
          >
            <span className="text-lg leading-none">＋</span>
            Add Training
          </button>
        </div>
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-sm">No trainings added yet. Click “Add Training” to get started.</p>
        </div>
      )}

      {/* Tiles */}
      {rows.map((row) => (
        <div key={row.id} className="mb-5">
          <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Delete icon (small, spaced) */}
            <button
              type="button"
              onClick={() => removeRow(row.id)}
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
              />
              <Field
                label="Date Completed"
                type="date"
                value={row.dateCompleted}
                onChange={(e) => update(row.id, { dateCompleted: e.target.value })}
              />
              <Field
                label="Training Provider"
                placeholder="Enter Training Provider..."
                value={row.provider}
                onChange={(e) => update(row.id, { provider: e.target.value })}
              />
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
                    onChange={(e) => update(row.id, { proof: e.target.files?.[0] ?? null })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Section>
  );
}
