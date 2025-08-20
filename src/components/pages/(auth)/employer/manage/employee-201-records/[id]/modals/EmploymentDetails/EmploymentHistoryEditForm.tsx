"use client";

import { useState } from "react";
import type { EmploymentHistoryItem } from "./EmploymentHistoryModal";

export default function EmploymentHistoryEditForm({
  initial,
  onBack,
  onSave,
}: {
  initial: EmploymentHistoryItem;
  onBack: () => void;
  onSave: (item: EmploymentHistoryItem) => void;
}) {
  const [form, setForm] = useState<EmploymentHistoryItem>(initial);

  const canSave =
    form.position.trim() && form.company.trim() && Boolean(form.dateFrom);

  const upd = (patch: Partial<EmploymentHistoryItem>) =>
    setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Back under blue header */}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Position">
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
              value={form.position}
              onChange={(e) => upd({ position: e.target.value })}
            />
          </Field>

          <Field label="Company Name">
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
              value={form.company}
              onChange={(e) => upd({ company: e.target.value })}
            />
          </Field>

          <Field label="Date From">
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                value={form.dateFrom}
                onChange={(e) => upd({ dateFrom: e.target.value })}
              />
              <CalendarIcon />
            </div>
          </Field>

          <Field label="Date To">
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-[#355fd0]"
                value={form.dateTo ?? ""}
                onChange={(e) => upd({ dateTo: e.target.value || undefined })}
              />
              <CalendarIcon />
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Job Description">
            <textarea
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#355fd0]"
              value={form.description ?? ""}
              onChange={(e) => upd({ description: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {/* Sticky footer */}
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
          disabled={!canSave}
          onClick={() => onSave(form)}
          className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

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
