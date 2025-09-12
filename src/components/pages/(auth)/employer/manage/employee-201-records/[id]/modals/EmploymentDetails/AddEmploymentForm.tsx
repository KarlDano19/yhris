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

export default function AddEmploymentForm({
  onBack,
  onSaveMany,
  defaultFrom,
  defaultTo,
  isSaving = false,
}: {
  onBack: () => void;
  onSaveMany: (items: EmploymentHistoryItem[]) => Promise<void> | void;
  defaultFrom?: string;
  defaultTo?: string;
  isSaving?: boolean;
}) {
  // DRAFT (top row)
  const [draft, setDraft] = useState<EmploymentHistoryItem>({
    position: "",
    company: "",
    dateFrom: "", // start BLANK
    dateTo: "",   // start BLANK
    description: "",
  });

  // error bag (starts EMPTY so nothing shows initially)
  const [errors, setErrors] = useState<Errs>({});
  const [touched, setTouched] = useState<Touched>({});
  const [attemptedAdd, setAttemptedAdd] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);

  // Because your Field uses defaultValue (uncontrolled), we bump a key to force remount/reset
  const [draftKey, setDraftKey] = useState(0);

  // LIST ITEMS
  const [items, setItems] = useState<EmploymentHistoryItem[]>([]);
  const [itemErrs, setItemErrs] = useState<Errs[]>([]);
  const [itemTouched, setItemTouched] = useState<Touched[]>([]);

  const setErr = (key: keyof Errs, val: string) =>
    setErrors((e) => ({ ...e, [key]: val }));
  const setTouchedField = (key: keyof Touched, v = true) =>
    setTouched((t) => ({ ...t, [key]: v }));

  const validateDraftNow = (d = draft): Errs => ({
    position: d.position.trim() ? "" : req("Position"),
    company: d.company.trim() ? "" : req("Company Name"),
    date_from: d.dateFrom ? "" : req("Date From"),
    date_to: d.dateTo ? "" : req("Date To"),
    description: d.description?.trim() ? "" : req("Job description"),
    range: rangeErr(d.dateFrom, d.dateTo || undefined),
  });

  const validateItem = (it: EmploymentHistoryItem): Errs => ({
    position: it.position?.trim() ? "" : req("Position"),
    company: it.company?.trim() ? "" : req("Company Name"),
    date_from: it.dateFrom ? "" : req("Date From"),
    date_to: it.dateTo ? "" : req("Date To"),
    description: it.description?.trim() ? "" : req("Job description"),
    range: rangeErr(it.dateFrom, it.dateTo || undefined),
  });

  const canAddDraft = useMemo(() => {
    const e = validateDraftNow();
    return !Object.values(e).some(Boolean);
  }, [draft]);

  const addDraftToList = () => {
    if (isSaving) return;
    setAttemptedAdd(true);

    const e = validateDraftNow();
    setErrors(e);
    // Only show messages for fields the user has interacted with OR after they tried to add
    // (render logic below uses touched/attemptedAdd)
    if (Object.values(e).some(Boolean)) return;

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
    setItemErrs((prev) => [...prev, validateItem({
      position: draft.position.trim(),
      company: draft.company.trim(),
      dateFrom: draft.dateFrom,
      dateTo: draft.dateTo || undefined,
      description: draft.description?.trim() || undefined,
    })]);
    setItemTouched((prev) => [...prev, {}]);

    // RESET draft to BLANK and clear errors/touched
    setDraft({ position: "", company: "", dateFrom: "", dateTo: "", description: "" });
    setErrors({});
    setTouched({});
    setAttemptedAdd(false);
    // force Field (uncontrolled) inputs to clear
    setDraftKey((k) => k + 1);
  };

  const updateItem = (idx: number, patch: Partial<EmploymentHistoryItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
    setItemErrs((prev) => {
      const next = [...prev];
      const it = { ...items[idx], ...patch } as EmploymentHistoryItem;
      next[idx] = validateItem(it);
      return next;
    });
    setItemTouched((prev) => {
      const next = [...prev];
      const keys = Object.keys(patch) as (keyof EmploymentHistoryItem)[];
      const current = { ...(next[idx] || {}) } as Touched;
      keys.forEach((k) => {
        if (k === "dateFrom") current.date_from = true;
        else if (k === "dateTo") current.date_to = true;
        else if (k === "position" || k === "company" || k === "description") current[k] = true as any;
      });
      next[idx] = current;
      return next;
    });
  };

  const removeItem = (idx: number) => {
    if (isSaving) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setItemErrs((prev) => prev.filter((_, i) => i !== idx));
    setItemTouched((prev) => prev.filter((_, i) => i !== idx));
  };

  const hasAnyError =
    // only consider draft errors when the user tried to add/save OR touched that field
    (Object.entries(errors).some(([k, v]) => {
      const key = k as keyof Errs;
      if (!v) return false;
      if (attemptedAdd || attemptedSave) return true;
      // map date keys
      if (key === "date_from") return !!touched.date_from;
      if (key === "date_to") return !!touched.date_to;
      return !!(touched as any)[key];
    })) ||
    itemErrs.some((e, i) =>
      Object.entries(e).some(([k, v]) => v && (itemTouched[i] as any)?.[k] !== false) // show once touched or on save (see below)
    );

  const handleSaveAll = async () => {
    if (isSaving) return;
    setAttemptedSave(true);

    // Validate current draft (in case the user didn't click Add)
    const e = validateDraftNow();
    setErrors(e);

    const bundle: EmploymentHistoryItem[] = [...items];
    const draftTouched =
      draft.position.trim() ||
      draft.company.trim() ||
      draft.description?.trim() ||
      draft.dateFrom ||
      draft.dateTo;

    if (draftTouched && !Object.values(e).some(Boolean)) {
      bundle.push({
        position: draft.position.trim(),
        company: draft.company.trim(),
        dateFrom: draft.dateFrom,
        dateTo: draft.dateTo || undefined,
        description: draft.description?.trim() || undefined,
      });
    }

    // Validate list
    const nextItemErrs = bundle.map(validateItem);
    setItemErrs(nextItemErrs);
    // Mark everything touched so hints appear only after the user attempts Save
    setItemTouched(nextItemErrs.map(() => ({
      position: true,
      company: true,
      date_from: true,
      date_to: true,
      description: true,
    })));

    if (nextItemErrs.some((e) => Object.values(e).some(Boolean))) return;

    if (bundle.length === 0) return;
    await onSaveMany(bundle);

    // After successful save, hard reset
    setItems([]);
    setItemErrs([]);
    setItemTouched([]);
    setDraft({ position: "", company: "", dateFrom: "", dateTo: "", description: "" });
    setErrors({});
    setTouched({});
    setAttemptedAdd(false);
    setAttemptedSave(false);
    setDraftKey((k) => k + 1);
  };

  // UI: helper to decide when to show a draft error
  const showDraftErr = (key: keyof Errs, touchKey?: keyof Touched) =>
    (errors[key] &&
      (attemptedAdd || attemptedSave || (touchKey ? touched[touchKey] : true)));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Back (under blue header) */}
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
        {/* DRAFT block */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4" key={draftKey}>
          <Field
            dataTestid="position-field"
            label="Position"
            defaultValue={draft.position}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              setDraft((d) => ({ ...d, position: v }));
              setTouchedField("position");
              setErr("position", v.trim() ? "" : req("Position"));
            }}
            error={showDraftErr("position", "position") ? (errors.position || null) : null}
            required
          />

          <Field
            dataTestid="company-field"
            label="Company Name"
            defaultValue={draft.company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              setDraft((d) => ({ ...d, company: v }));
              setTouchedField("company");
              setErr("company", v.trim() ? "" : req("Company Name"));
            }}
            error={showDraftErr("company", "company") ? (errors.company || null) : null}
            required
          />

          {/* Date From */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Date From <span className="text-red-600">*</span>
            </span>
            <CustomDatePicker
              id="draft-date-from"
              selected={toDate(draft.dateFrom)}
              pickerOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                setDraft((prev) => ({ ...prev, dateFrom: v }));
                setTouchedField("date_from");
                setErr("date_from", v ? "" : req("Date From"));
                setErr("range", rangeErr(v, draft.dateTo || undefined));
              }}
              inputOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                setDraft((prev) => ({ ...prev, dateFrom: v }));
                setTouchedField("date_from");
                setErr("date_from", v ? "" : req("Date From"));
                setErr("range", rangeErr(v, draft.dateTo || undefined));
              }}
              placeholder="MM/DD/YYYY"
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm",
                showDraftErr("date_from", "date_from") || showDraftErr("range")
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              showDraftErr("date_from", "date_from") || showDraftErr("range")
                ? "text-red-600" : "text-transparent"
            }`}>
              {errors.date_from || errors.range || "placeholder"}
            </p>
          </label>

          {/* Date To */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Date To <span className="text-red-600">*</span>
            </span>
            <CustomDatePicker
              id="draft-date-to"
              selected={toDate(draft.dateTo ?? "")}
              pickerOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                setDraft((prev) => ({ ...prev, dateTo: v }));
                setTouchedField("date_to");
                setErr("date_to", v ? "" : req("Date To"));
                setErr("range", rangeErr(draft.dateFrom, v || undefined));
              }}
              inputOnChange={(d: Date | null) => {
                const v = d ? toYmd(d) : "";
                setDraft((prev) => ({ ...prev, dateTo: v }));
                setTouchedField("date_to");
                setErr("date_to", v ? "" : req("Date To"));
                setErr("range", rangeErr(draft.dateFrom, v || undefined));
              }}
              placeholder="MM/DD/YYYY"
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm",
                showDraftErr("date_to", "date_to") || showDraftErr("range")
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              showDraftErr("date_to", "date_to") || showDraftErr("range")
                ? "text-red-600" : "text-transparent"
            }`}>
              {errors.date_to || errors.range || "placeholder"}
            </p>
          </label>
        </div>

        <div className="mt-4" data-testid="job-description-field">
          {/* Textarea + hint */}
          <label className="block" key={`desc-${draftKey}`}>
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Job Description <span className="text-red-600">*</span>
            </span>
            <textarea
              rows={4}
              placeholder="Enter a brief summary of the role, responsibilities, and key functions."
              className={[
                "w-full rounded-md bg-white px-3 py-2 text-sm outline-none",
                showDraftErr("description", "description")
                  ? "border border-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:border-[#355fd0]",
              ].join(" ")}
              defaultValue={draft.description ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setDraft((d) => ({ ...d, description: v }));
                setTouchedField("description");
                setErr("description", v.trim() ? "" : req("Job description"));
              }}
              disabled={isSaving}
            />
            <p className={`mt-1 text-xs ${
              showDraftErr("description", "description") ? "text-red-600" : "text-transparent"
            }`}>
              {errors.description || "placeholder"}
            </p>
          </label>
        </div>

        {/* Add button */}
        <div className="mt-4">
          <button
            data-testid="add-employment-more"
            type="button"
            onClick={addDraftToList}
            disabled={isSaving || !canAddDraft}
            className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5 disabled:opacity-50"
            title={errors.range ? errors.range : undefined}
          >
            Add Employment History
          </button>
        </div>

        {/* Editable list */}
        {items.map((it, idx) => {
          const e = itemErrs[idx] || {};
          const t = itemTouched[idx] || {};
          const showItemErr = (key: keyof Errs) =>
            !!e[key] && (t as any)[key] !== false; // show when touched or after Save (we mark all touched on save)

          return (
            <div key={idx} className="mt-6 rounded-md border p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field
                  label="Position"
                  defaultValue={it.position}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    updateItem(idx, { position: ev.target.value })
                  }
                  error={showItemErr("position") ? (e.position || null) : null}
                  required
                />
                <Field
                  label="Company Name"
                  defaultValue={it.company}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    updateItem(idx, { company: ev.target.value })
                  }
                  error={showItemErr("company") ? (e.company || null) : null}
                  required
                />

                {/* Date From */}
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Date From <span className="text-red-600">*</span>
                  </span>
                  <CustomDatePicker
                    id={`item-${idx}-date-from`}
                    selected={toDate(it.dateFrom)}
                    pickerOnChange={(d: Date | null) =>
                      updateItem(idx, { dateFrom: d ? toYmd(d) : "" })
                    }
                    inputOnChange={(d: Date | null) =>
                      updateItem(idx, { dateFrom: d ? toYmd(d) : "" })
                    }
                    placeholder="MM/DD/YYYY"
                    className={[
                      "w-full rounded-md bg-white px-3 py-2 text-sm",
                      (showItemErr("date_from") || showItemErr("range"))
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-gray-300 focus:border-[#355fd0]",
                    ].join(" ")}
                    disabled={isSaving}
                  />
                  <p className={`mt-1 text-xs ${
                    (showItemErr("date_from") || showItemErr("range")) ? "text-red-600" : "text-transparent"
                  }`}>
                    {e.date_from || e.range || "placeholder"}
                  </p>
                </label>

                {/* Date To */}
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Date To <span className="text-red-600">*</span>
                  </span>
                  <CustomDatePicker
                    id={`item-${idx}-date-to`}
                    selected={toDate(it.dateTo ?? "")}
                    pickerOnChange={(d: Date | null) =>
                      updateItem(idx, { dateTo: d ? toYmd(d) : "" })
                    }
                    inputOnChange={(d: Date | null) =>
                      updateItem(idx, { dateTo: d ? toYmd(d) : "" })
                    }
                    placeholder="MM/DD/YYYY"
                    className={[
                      "w-full rounded-md bg-white px-3 py-2 text-sm",
                      (showItemErr("date_to") || showItemErr("range"))
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-gray-300 focus:border-[#355fd0]",
                    ].join(" ")}
                    disabled={isSaving}
                  />
                  <p className={`mt-1 text-xs ${
                    (showItemErr("date_to") || showItemErr("range")) ? "text-red-600" : "text-transparent"
                  }`}>
                    {e.date_to || e.range || "placeholder"}
                  </p>
                </label>
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Job Description <span className="text-red-600">*</span>
                  </span>
                  <textarea
                    rows={4}
                    className={[
                      "w-full rounded-md bg-white px-3 py-2 text-sm outline-none",
                      showItemErr("description")
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-gray-300 focus:border-[#355fd0]",
                    ].join(" ")}
                    defaultValue={it.description ?? ""}
                    onChange={(ev) => updateItem(idx, { description: ev.target.value })}
                    disabled={isSaving}
                  />
                  <p className={`mt-1 text-xs ${
                    showItemErr("description") ? "text-red-600" : "text-transparent"
                  }`}>
                    {e.description || "placeholder"}
                  </p>
                </label>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={isSaving}
                  className="rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-white px-6 py-4 rounded-b-xl">
        <button
          data-testid="back-btn"
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="rounded-md border border-[#355fd0] px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/5 disabled:opacity-50"
        >
          Back
        </button>
        <button
          data-testid="save-btn"
          type="button"
          onClick={handleSaveAll}
          disabled={
            isSaving ||
            (items.length === 0 && !canAddDraft) ||
            hasAnyError
          }
          className="rounded-md bg-[#355fd0] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          title={isSaving ? "Saving…" : undefined}
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
