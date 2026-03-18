"use client";

// 7. SVG component imports
import SelectChevronDown from "@/svg/SelectChevronDown";

type Props = {
  label: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  className?: string;
  error?: string | null;
  onChange?: (value: string) => void;
};

export default function LabeledSelect({
  label,
  options,
  value,
  defaultValue,
  className = "",
  error,
  onChange,
}: Props) {
  const val = value ?? defaultValue ?? "";
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-0.5 text-red-600">*</span>
      </label>
      <div className="relative">
        <select
          value={val}
          onChange={(e) => onChange?.(e.target.value)}
          className={[
            "appearance-none w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100",
            error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#355fd0]",
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

      <p className={`mt-1 text-xs ${error ? "text-red-600" : "text-transparent"}`}>
        {error || "placeholder"}
      </p>
    </div>
  );
}
