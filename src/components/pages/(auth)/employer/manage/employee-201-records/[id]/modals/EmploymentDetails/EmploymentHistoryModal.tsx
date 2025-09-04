"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import AddEmploymentForm from "./AddEmploymentForm";
import EmploymentHistoryEditForm from "./EmploymentHistoryEditForm";
import EmploymentHistoryAnalysis from "./EmploymentHistoryAnalysis";
import ConfirmModal from "../ConfirmModal";

// hooks
import { useGetEmploymentHistory } from "../../hooks/useGetEmploymentHistory";
import { useAddEmploymentHistory } from "../../hooks/useAddEmploymentHistory";
import { useUpdateEmploymentHistory } from "../../hooks/useUpdateEmploymentHistory";
import { useDeleteEmploymentHistory } from "../../hooks/useDeleteEmploymentHistory";

// toasts
import { notify } from "../../utils/notify";

export type EmploymentHistoryItem = {
  id?: number;
  position: string;
  company: string;
  dateFrom: string; // ISO
  dateTo?: string | null; // ISO | null
  description?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: number | string;
};

export default function EmploymentHistoryModal({
  isOpen,
  onClose,
  employeeName,
  employeeId,
}: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { entries, isLoading, error, refetch } = useGetEmploymentHistory(
    employeeId,
    { page: 1, pageSize: 50 }
  );
  const { isSaving: isAdding, addEntry } = useAddEmploymentHistory(employeeId);
  const { isUpdating, updateEntry } = useUpdateEmploymentHistory(employeeId);
  const { isDeleting, deleteEntry } = useDeleteEmploymentHistory(employeeId);

  const itemsNewestFirst: EmploymentHistoryItem[] = useMemo(() => {
    const mapped = entries.map((e) => ({
      id: e.id,
      position: e.position,
      company: e.company,
      dateFrom: e.start_date,
      dateTo: e.end_date ?? null,
      description: e.description ?? "",
    }));
    return sortEmploymentDesc(mapped);
  }, [entries]);

  const headerTitle =
    showAdd
      ? `Add Employment History: ${employeeName}`
      : editIndex !== null
      ? `Edit Employment History: ${employeeName}`
      : showAnalysis
      ? `Employment History Analysis: ${employeeName}`
      : `Employment History: ${employeeName}`;

  useEffect(() => {
    if (!isOpen) {
      setShowAdd(false);
      setEditIndex(null);
      setShowAnalysis(false);
      setConfirmIdx(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const beginEditByIndex = (idx: number) => setEditIndex(idx);
  const beginDeleteByIndex = (idx: number) => setConfirmIdx(idx);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="mt-8 w-full max-w-3xl rounded-xl bg-white shadow-xl flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-xl bg-[#355fd0] px-5 py-3 text-white">
          <h3 className="text-sm font-semibold">{headerTitle}</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Body modes */}
        {!showAdd && editIndex === null && !showAnalysis ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4">
              {/* Top row: Add button + count / error (with skeleton while loading) */}
              <div className="flex items-center justify-between">
                {isLoading ? (
                  <div className="h-8 w-44 rounded-md border bg-white animate-pulse" aria-hidden />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    disabled={!!error}
                    className={`rounded-md border px-3 py-2 text-xs font-medium ${
                      error
                        ? "cursor-not-allowed border-gray-300 text-gray-400"
                        : "border-[#355fd0] text-[#355fd0] hover:bg-[#355fd0]/5"
                    }`}
                    title={error ? "Fix the error then try again." : undefined}
                  >
                    Add Employment History
                  </button>
                )}

                {isLoading ? (
                  <div className="h-6 w-28 rounded bg-gray-200 animate-pulse" aria-hidden />
                ) : error ? (
                  <button
                    onClick={() => refetch()}
                    className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                  >
                    Failed to load. Retry
                  </button>
                ) : (
                  <div className="text-xs text-gray-500">
                    {itemsNewestFirst.length} record(s)
                  </div>
                )}
              </div>

              {/* List */}
              {isLoading ? (
                // ===== Skeleton list (3 cards) =====
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="relative rounded-xl border p-4 shadow-sm bg-white"
                    >
                      {/* action buttons skeleton */}
                      <div className="absolute right-3 top-3 flex gap-2">
                        <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                        <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                        {/* Left meta skeleton */}
                        <div className="space-y-2">
                          <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
                          <div className="h-3 w-40 rounded bg-gray-200 animate-pulse" />
                          <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
                        </div>

                        {/* Right description skeleton */}
                        <div className="sm:border-l-2 sm:pl-6 border-transparent">
                          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse mb-2" />
                          <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                            <div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse" />
                            <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : itemsNewestFirst.length ? (
                itemsNewestFirst.map((it, i) => (
                  <div
                    key={`${it.id ?? "tmp"}-${i}`}
                    className="relative rounded-xl border p-4 shadow-sm bg-[#355fd0]/5"
                  >
                    {/* actions */}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => beginEditByIndex(i)}
                        className="rounded p-1 hover:bg-white/60"
                        aria-label="Edit employment"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-[#355fd0]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => beginDeleteByIndex(i)}
                        className="rounded p-1 hover:bg-white/60"
                        aria-label="Delete employment"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                      {/* Left meta */}
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {it.position}
                        </div>
                        <div className="text-xs text-gray-500">{it.company}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDateRange(it.dateFrom, it.dateTo ?? undefined)}
                        </div>
                      </div>

                      {/* Right description */}
                      <div className="sm:border-l-2 sm:pl-6 border-black/10">
                        <div className="text-sm font-medium text-gray-700">
                          Job Description
                        </div>
                        <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">
                          {it.description || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                  No employment history yet.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-white px-6 py-4 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowAnalysis(true)}
                className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f54b8]"
              >
                Employment History Analysis
              </button>
            </div>
          </>
        ) : showAdd ? (
          <AddEmploymentForm
            onBack={() => setShowAdd(false)}
            onSaveMany={async (newItems) => {
              await notify.promise(
                (async () => {
                  for (const it of newItems) {
                    const res = await addEntry({
                      company: it.company,
                      position: it.position,
                      start_date: it.dateFrom,
                      end_date: it.dateTo ?? null,
                      description: it.description ?? "",
                    });
                    if (!res.ok) throw res.error ?? new Error("Failed to add an employment record.");
                  }
                  setShowAdd(false);
                  await refetch();
                })(),
                { success: "Employment history added.", error: "Failed to add employment history." }
              );
            }}
            isSaving={isAdding}
          />
        ) : showAnalysis ? (
          <EmploymentHistoryAnalysis
            employeeId={employeeId}
            employeeName={employeeName}
            onBack={() => setShowAnalysis(false)}
            onClose={onClose}
          />
        ) : (
          <EmploymentHistoryEditForm
            initial={itemsNewestFirst[editIndex!]}
            onBack={() => setEditIndex(null)}
            onSave={async (updated) => {
              const target = itemsNewestFirst[editIndex!];
              if (!target?.id) {
                setEditIndex(null);
                return;
              }
              await notify.promise(
                (async () => {
                  const res = await updateEntry(target.id!, {
                    company: updated.company,
                    position: updated.position,
                    start_date: updated.dateFrom,
                    end_date: updated.dateTo ?? null,
                    description: updated.description ?? "",
                  });
                  if (!res.ok) throw res.error ?? new Error("Failed to update employment.");
                  setEditIndex(null);
                  await refetch();
                })(),
                { success: "Employment updated.", error: "Failed to save changes." }
              );
            }}
            isSaving={isUpdating}
          />
        )}
      </div>

      {/* Delete confirm modal */}
      <ConfirmModal
        isOpen={confirmIdx !== null}
        title="Delete Employment"
        message="Are you sure you want to delete this employment record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        intent="danger"
        busy={deleting || isDeleting}
        closeOnBackdrop={false}
        closeOnEsc={false}
        onCancel={() => setConfirmIdx(null)}
        onConfirm={async () => {
          if (confirmIdx === null) return;
          const target = itemsNewestFirst[confirmIdx];
          if (!target?.id) {
            setConfirmIdx(null);
            return;
          }
          try {
            setDeleting(true);
            await notify.promise(
              (async () => {
                const res = await deleteEntry(target.id!);
                if (!res.ok) throw res.error ?? new Error("Failed to delete employment.");
                await refetch();
              })(),
              { success: "Employment deleted.", error: "Failed to delete employment." }
            );
          } finally {
            setDeleting(false);
            setConfirmIdx(null);
          }
        }}
      />
    </div>
  );
}

/* ===================== helpers ===================== */

function formatDateRange(from: string, to?: string) {
  const fromStr = new Date(from).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const toStr = to
    ? new Date(to).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Present";
  return `(${fromStr} – ${toStr})`;
}

function sortEmploymentDesc(arr: EmploymentHistoryItem[]) {
  const ms = (s?: string | null) => (s ? new Date(s).getTime() : NaN);
  return [...arr].sort((a, b) => {
    const aKey = Number.isFinite(ms(a.dateTo)) ? ms(a.dateTo) : ms(a.dateFrom);
    const bKey = Number.isFinite(ms(b.dateTo)) ? ms(b.dateTo) : ms(b.dateFrom);
    if (bKey !== aKey) return (bKey ?? 0) - (aKey ?? 0);
    return (ms(b.dateFrom) ?? 0) - (ms(a.dateFrom) ?? 0);
  });
}
