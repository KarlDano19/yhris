"use client";

import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import AddEmploymentForm from "./AddEmploymentForm";
import EmploymentHistoryEditForm from "./EmploymentHistoryEditForm";
import EmploymentHistoryAnalysis from "./EmploymentHistoryAnalysis";
import ConfirmModal from "../ConfirmModal";

/* ===================== Types ===================== */

export type EmploymentHistoryItem = {
  position: string;
  company: string;
  dateFrom: string; // ISO
  dateTo?: string;  // ISO | undefined (ongoing)
  description?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;

  items: EmploymentHistoryItem[];

  onAddItem?: (item: EmploymentHistoryItem) => void;
  onEditItem?: (item: EmploymentHistoryItem, index: number) => void;
  onDeleteItem?: (index: number) => void;
};

/* ===================== Component ===================== */

export default function EmploymentHistoryModal({
  isOpen,
  onClose,
  employeeName,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: Props) {
  // keep a local copy while modal is open
  const [localItems, setLocalItems] = useState<EmploymentHistoryItem[]>(items);
  useEffect(() => {
    if (!isOpen) setLocalItems(items);
  }, [items, isOpen]);

  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // delete confirm
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // NOTE: non-dismissible => no ESC handler, no backdrop click handler
  if (!isOpen) return null;

  const headerTitle =
    showAdd
      ? `Add Employment History: ${employeeName}`
      : editIndex !== null
      ? `Edit Employment History: ${employeeName}`
      : showAnalysis
      ? `Employment History Analysis: ${employeeName}`
      : `Employment History: ${employeeName}`;

  const itemsNewestFirst = sortEmploymentDesc(localItems);

  const beginEditByRef = (itemRef: EmploymentHistoryItem) => {
    const idx = localItems.indexOf(itemRef);
    if (idx >= 0) setEditIndex(idx);
  };

  const beginDeleteByRef = (itemRef: EmploymentHistoryItem) => {
    const idx = localItems.indexOf(itemRef);
    if (idx >= 0) setConfirmIdx(idx);
  };

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
              {/* Add button inside body, top-right */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="rounded-md border border-[#355fd0] px-3 py-2 text-xs font-medium text-[#355fd0] hover:bg-[#355fd0]/5"
                >
                  Add Employment History
                </button>
              </div>

              {itemsNewestFirst.length ? (
                itemsNewestFirst.map((it, i) => (
                  <div
                    key={`${it.company}-${it.position}-${i}`}
                    className="relative rounded-xl border p-4 shadow-sm bg-[#355fd0]/5"
                  >
                    {/* icon actions - top right */}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => beginEditByRef(it)}
                        className="rounded p-1 hover:bg-white/60"
                        aria-label="Edit employment"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => beginDeleteByRef(it)}
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
                          {formatDateRange(it.dateFrom, it.dateTo)}
                        </div>
                      </div>

                      {/* Right description (wider) */}
                      <div className="sm:border-l-2 sm:pl-6 border-[#1f3b8a]">
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

            {/* Footer (outlined/filled) */}
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
            onSaveMany={(newItems) => {
              // merge new items and sort
              setLocalItems((prev) => sortEmploymentDesc([...newItems, ...prev]));
              newItems.forEach((it) => onAddItem?.(it));
              setShowAdd(false);
            }}
          />
        ) : showAnalysis ? (
          <EmploymentHistoryAnalysis
            employeeName={employeeName}
            items={localItems}
            onBack={() => setShowAnalysis(false)}
            onClose={onClose}
          />
        ) : (
          <EmploymentHistoryEditForm
            initial={localItems[editIndex!]}
            onBack={() => setEditIndex(null)}
            onSave={(updated) => {
              setLocalItems((prev) => {
                const next = [...prev];
                next[editIndex!] = updated;
                return sortEmploymentDesc(next);
              });
              onEditItem?.(updated, editIndex!);
              setEditIndex(null);
            }}
          />
        )}
      </div>

      {/* Delete confirm modal (non-dismissible) */}
      <ConfirmModal
        isOpen={confirmIdx !== null}
        title="Delete Employment"
        message="Are you sure you want to delete this employment record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        intent="danger"
        busy={deleting}
        closeOnBackdrop={false}
        closeOnEsc={false}
        onCancel={() => setConfirmIdx(null)}
        onConfirm={async () => {
          if (confirmIdx === null) return;
          try {
            setDeleting(true);
            setLocalItems((prev) => prev.filter((_, i) => i !== confirmIdx));
            onDeleteItem?.(confirmIdx);
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
  const ms = (s?: string) => (s ? new Date(s).getTime() : NaN);
  return [...arr].sort((a, b) => {
    const aKey = Number.isFinite(ms(a.dateTo)) ? ms(a.dateTo) : ms(a.dateFrom);
    const bKey = Number.isFinite(ms(b.dateTo)) ? ms(b.dateTo) : ms(b.dateFrom);
    if (bKey !== aKey) return (bKey ?? 0) - (aKey ?? 0);
    return (ms(b.dateFrom) ?? 0) - (ms(a.dateFrom) ?? 0);
  });
}
