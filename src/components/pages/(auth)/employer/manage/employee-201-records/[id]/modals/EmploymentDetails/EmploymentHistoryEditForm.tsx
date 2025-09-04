"use client";

import { useMemo, useState } from "react";
import type { EmploymentHistoryItem } from "./EmploymentHistoryModal";
import CustomDatePicker from "@/components/CustomDatePicker";
import Field from "../../common/Field";

type Errs = {
  position?: string;
  company?: string;
  date_from?: string;
  date_to?: string;
  description?: string;
  range?: string;
};
type Touched = {
  position?: boolean;
  company?: boolean;
  date_from?: boolean;
  date_to?: boolean;
  description?: boolean;
};

const req = (name: string) => `${name} is required.`;
const toYmd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const toDate = (ymd?: string | null) => {
  if (!ymd) return null;
  const d = new Date(ymd);
  return Number.isNaN(d.getTime()) ? null : d;
};
const rangeErr = (from?: string, to?: string) => {
  if (!from || !to) return "";
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Number.isFinite(a) && Number.isFinite(b) && b < a
    ? "“Date To” must be on/after “Date From”."
    : "";
};

export default function EmploymentHistoryEditForm({
  initial,
  onBack,
  onSave,
  isSaving = false,
}: {
  initial: (EmploymentHistoryItem & { id?: number | string });
  onBack: () => void;
  onSave: (item: EmploymentHistoryItem & { id?: number | string }) => Promise<void> | void;
  isSaving?: boolean;
}) {
  const [form, setForm] = useState<EmploymentHistoryItem & { id?: number | string }>(initial);

  // error bag starts empty so *no hints show initially*
  const [errors, setErrors] = useState<Errs>({});
  const [touched, setTouched] = useState<Touched>({});
  const [attemptedSave, setAttemptedSave] = useState(false);

  // Because your Field uses defaultValue (uncontrolled), bump a key to force reset if needed
  const [keyBump, setKeyBump] = useState(0);

  const upd = (patch: Partial<EmploymentHistoryItem>) =>
    setForm((f) => ({ ...f, ...patch }));

  const validate = (f = form): Errs => ({
    position: f.position?.trim() ? "" : req("Position"),
    company: f.company?.trim() ? "" : req("Company Name"),
    date_from: f.dateFrom ? "" : req("Date From"),
    date_to: f.dateTo ? "" : req("Date To"),
    description: f.description?.trim() ? "" : req("Job Description"),
    range: rangeErr(f.dateFrom, f.dateTo || undefined),
  });

  const currentErrs = useMemo(() => validate(form), [form]);

  // Show error only after touch or after Save attempt
  const showErr = (key: keyof Errs, touchKey?: keyof Touched) =>
    !!currentErrs[key] &&
    (attemptedSave || (touchKey ? touched[touchKey] : true));

  const anyError =
    Object.entries(currentErrs).some(([k, v]) => {
      if (!v) return false;
      const key = k as keyof Errs;
      if (attemptedSave) return true;
      if (key === "date_from") return !!touched.date_from;
      if (key === "date_to") return !!touched.date_to;
      return !!(touched as any)[key];
    });

  const canSave = !anyError && !isSaving;

  const handleSave = async () => {
    if (isSaving) return;
    setAttemptedSave(true);
    setErrors(currentErrs);
    if (Object.values(currentErrs).some(Boolean)) return;
    await onSave(form);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" key={keyBump}>
      {/* Back under blue header */}
      <div className="px-6 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className={`flex items-center gap-2 text-sm font-medium ${
            isSaving ? "text-gray-400" : "text-[#355fd0] hover:underline"
          }`}
        >
          <span aria-hidden>←</span> Back
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field
            label="Position"
            defaultValue={form.position}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              upd({ position: v });
              setTouched((t) => ({ ...t, position: true }));
              setErrors((old) => ({ ...old, position: v.trim() ? "" : req("Position") }));
            }}
            error={showErr("position", "position") ? (currentErrs.position || null) : null}
            required
          />

          <Field
            label="Company Name"
            defaultValue={form.company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              upd({ company: v });
              setTouched((t) => ({ ...t, company: true }));
              setErrors((old) => ({ ...old, company: v.trim() ? "" : req("Company Name") }));
            }}
            error={showErr("company", "company") ? (currentErrs.company || null) : null}
            required
          />

          {/* Date From (using your DatePicker + hint pattern) */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Date From <span className="text-red-600">*</span>
            </span>
            <CustomDatePicker
              id="edit-date-from"
              selected={toDate(form.dateFrom)}
              pickerOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                upd({ dateFrom: v });
                setTouched((t) => ({ ...t, date_from: true }));
                setErrors((old) => ({
                  ...old,
                  date_from: v ? "" : req("Date From"),
                  range: rangeErr(v, form.dateTo || undefined),
                }));
              }}
              inputOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                upd({ dateFrom: v });
                setTouched((t) => ({ ...t, date_from: true }));
                setErrors((old) => ({
                  ...old,
                  date_from: v ? "" : req("Date From"),
                  range: rangeErr(v, form.dateTo || undefined),
                }));
              }}
              placeholder="MM/DD/YYYY"
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm",
                (showErr("date_from", "date_from") || showErr("range"))
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              (showErr("date_from", "date_from") || showErr("range")) ? "text-red-600" : "text-transparent"
            }`}>
              {currentErrs.date_from || currentErrs.range || "placeholder"}
            </p>
          </label>

          {/* Date To */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Date To <span className="text-red-600">*</span>
            </span>
            <CustomDatePicker
              id="edit-date-to"
              selected={toDate(form.dateTo ?? "")}
              pickerOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                upd({ dateTo: v || undefined });
                setTouched((t) => ({ ...t, date_to: true }));
                setErrors((old) => ({
                  ...old,
                  date_to: v ? "" : req("Date To"),
                  range: rangeErr(form.dateFrom, v || undefined),
                }));
              }}
              inputOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                upd({ dateTo: v || undefined });
                setTouched((t) => ({ ...t, date_to: true }));
                setErrors((old) => ({
                  ...old,
                  date_to: v ? "" : req("Date To"),
                  range: rangeErr(form.dateFrom, v || undefined),
                }));
              }}
              placeholder="MM/DD/YYYY"
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm",
                (showErr("date_to", "date_to") || showErr("range"))
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              (showErr("date_to", "date_to") || showErr("range")) ? "text-red-600" : "text-transparent"
            }`}>
              {currentErrs.date_to || currentErrs.range || "placeholder"}
            </p>
          </label>
        </div>

        <div className="mt-4">
          {/* Description (textarea + hint) */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Job Description <span className="text-red-600">*</span>
            </span>
            <textarea
              rows={4}
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm outline-none",
                showErr("description", "description")
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              defaultValue={form.description ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                upd({ description: v });
                setTouched((t) => ({ ...t, description: true }));
                setErrors((old) => ({ ...old, description: v.trim() ? "" : req("Job Description") }));
              }}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              showErr("description", "description") ? "text-red-600" : "text-transparent"
            }`}>
              {currentErrs.description || "placeholder"}
            </p>
          </label>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-white px-6 py-4 rounded-b-xl">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          title={isSaving ? "Saving…" : undefined}
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
