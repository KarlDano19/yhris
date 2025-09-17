"use client";

import { useEffect, useState } from "react";
import SelectChevronDown from "@/svg/SelectChevronDown";

type Props = {
  label: string;
  options: string[];
  value?: string;
  error?: string | null;
  onChange?: (value: string) => void;
  onAddOption?: (newOption: string) => void;
  dataTestid?: string;
  disabled?: boolean;   
  showErrors?: boolean; 
};

export default function AddableSelect({
  label,
  options,
  value,
  error,
  onChange,
  onAddOption,
  dataTestid,
  disabled = false,
  showErrors = true,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (disabled) {
      setAdding(false);
      setDraft("");
    }
  }, [disabled]);

  const handleAdd = () => {
    if (disabled) return;
    const v = draft.trim();
    if (!v) return;
    onAddOption?.(v);
    setDraft("");
    setAdding(false);
  };

  const hasError = !!error && showErrors;

  return (
    <div data-testid={dataTestid}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-0.5 text-red-600">*</span>
      </label>

      <div className="relative">
        <select
          disabled={disabled}
          aria-invalid={hasError || undefined}
          value={value ?? ""}
          onChange={(e) => {
            if (disabled) return;
            onChange?.(e.target.value);
          }}
          className={[
            "appearance-none w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6",
            disabled
              ? "bg-stone-50 text-opacity-100 ring-gray-200 cursor-not-allowed focus:outline-none focus:ring-0"
              : hasError
              ? "ring-red-500 focus:ring-red-500"
              : "ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#355fd0]",
          ].join(" ")}
        >
          <option value="" disabled hidden>
            Select…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <SelectChevronDown />
        </div>
      </div>

      {/* error first line (only if showErrors) */}
      {hasError && <div className="mt-1 text-xs text-red-600">{error}</div>}

      {/* add action second line (hidden when disabled) */}
      {!disabled && !adding && (
        <div className="mt-1 text-xs">
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-[#355fd0] hover:underline"
          >
            + Add new {label.toLowerCase()}
          </button>
        </div>
      )}

      {!disabled && adding && (
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`New ${label.toLowerCase()}…`}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#355fd0]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-[#355fd0] px-3 py-1.5 text-xs text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setDraft("");
            }}
            className="rounded-md border px-3 py-1.5 text-xs text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
