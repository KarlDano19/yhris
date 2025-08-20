"use client";

import { useMemo, useState } from "react";
import type { EmploymentHistoryItem } from "./EmploymentHistoryModal";

/** Multi-add employment history form */
export default function AddEmploymentForm({
  onBack,
  onSaveMany,
  defaultFrom,
  defaultTo,
}: {
  onBack: () => void;
  onSaveMany: (items: EmploymentHistoryItem[]) => void;
  defaultFrom?: string;
  defaultTo?: string;
}) {
  const todayIso = new Date().toISOString().slice(0, 10);

  // Top draft (blank first row)
  const [draft, setDraft] = useState<EmploymentHistoryItem>({
    position: "",
    company: "",
    dateFrom: defaultFrom ?? todayIso,
    dateTo: defaultTo ?? todayIso,
    description: "",
  });

  // Appended editable items
  const [items, setItems] = useState<EmploymentHistoryItem[]>([]);

  const canAddDraft = useMemo(
    () => draft.position.trim() && draft.company.trim() && !!draft.dateFrom,
    [draft]
  );

  const addDraftToList = () => {
    if (!canAddDraft) return;
    setItems((prev) => [
      ...prev,
      {
        position: draft.position.trim(),
        company: draft.company.trim(),
        dateFrom: draft.dateFrom,
        dateTo: draft.dateTo || undefined,
        description: draft.description?.trim() || undefined,
      },
    ]);
    // Clear “draft” text fields; keep date defaults
    setDraft((d) => ({
      ...d,
      position: "",
      company: "",
      description: "",
    }));
  };

  const updateItem = (idx: number, patch: Partial<EmploymentHistoryItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save everything (list + any valid, still-filled draft)
  const handleSaveAll = () => {
    console.log("heyheyhey")
    const bundle: EmploymentHistoryItem[] = [...items];
    if (draft.position.trim() && draft.company.trim() && draft.dateFrom) {
      bundle.push({
        position: draft.position.trim(),
        company: draft.company.trim(),
        dateFrom: draft.dateFrom,
        dateTo: draft.dateTo || undefined,
        description: draft.description?.trim() || undefined,
      });
    }
    if (bundle.length === 0) return; // nothing to save
    onSaveMany(bundle);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Back (under blue header) */}
      <div className="px-6 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#355fd0] hover:underline"
        >
          <span aria-hidden>←</span> Back
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* DRAFT block (empty top row) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Position">
            <input
              placeholder="Enter Position..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
              value={draft.position}
              onChange={(e) =>
                setDraft((d) => ({ ...d, position: e.target.value }))
              }
            />
          </Field>

          <Field label="Company Name">
            <input
              placeholder="Enter Company Name..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
              value={draft.company}
              onChange={(e) =>
                setDraft((d) => ({ ...d, company: e.target.value }))
              }
            />
          </Field>

          <Field label="Date From">
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                value={draft.dateFrom}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, dateFrom: e.target.value }))
                }
              />
              <CalendarIcon />
            </div>
          </Field>

          <Field label="Date To">
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                value={draft.dateTo ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, dateTo: e.target.value }))
                }
              />
              <CalendarIcon />
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Job Description">
            <textarea
              rows={4}
              placeholder="Enter a brief summary of the employee’s role, responsibilities, and key functions (e.g., Responsible for managing payroll processing and compliance reporting)."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
              value={draft.description ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
            />
          </Field>
        </div>

        {/* Add button (adds the draft to the list below) */}
        <div className="mt-4">
          <button
            type="button"
            onClick={addDraftToList}
            disabled={!canAddDraft}
            className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5 disabled:opacity-50"
          >
            Add Employment History
          </button>
        </div>

        {/* Editable list of all appended items */}
        {items.map((it, idx) => (
          <div key={idx} className="mt-6 rounded-md border p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Field label="Position">
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
                  value={it.position}
                  onChange={(e) =>
                    updateItem(idx, { position: e.target.value })
                  }
                />
              </Field>
              <Field label="Company Name">
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
                  value={it.company}
                  onChange={(e) => updateItem(idx, { company: e.target.value })}
                />
              </Field>
              <Field label="Date From">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                    value={it.dateFrom}
                    onChange={(e) =>
                      updateItem(idx, { dateFrom: e.target.value })
                    }
                  />
                  <CalendarIcon />
                </div>
              </Field>
              <Field label="Date To">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                    value={it.dateTo ?? ""}
                    onChange={(e) =>
                      updateItem(idx, { dateTo: e.target.value })
                    }
                  />
                  <CalendarIcon />
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Job Description">
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
                  value={it.description ?? ""}
                  onChange={(e) =>
                    updateItem(idx, { description: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom bar: Back + Save */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-white px-6 py-4 rounded-b-xl">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={items.length === 0 && !canAddDraft}
          className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* --- small UI helpers --- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="#9CA3AF"
        strokeWidth="1.5"
      />
      <path
        d="M8 2v4M16 2v4M3 10h18"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
