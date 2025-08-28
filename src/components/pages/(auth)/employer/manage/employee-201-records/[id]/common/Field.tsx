// components/common/Field.tsx
import { useId } from "react";

type FieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  type?: "text" | "number" | "date" | "file";
  step?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // 👈 NEW
  className?: string;

  /** new: optional error/hint lines */
  error?: string | null;
  hint?: string;
  required?: boolean;
};

export default function Field({
  label,
  placeholder,
  defaultValue,
  value,
  type = "text",
  step,
  onChange,
  onBlur,
  className = "",
  error,
  hint,
  required = false,
}: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        defaultValue={
          typeof defaultValue === "number" ? String(defaultValue) : defaultValue
        }
        value={
          type !== "file"
            ? typeof value === "number"
              ? String(value)
              : value
            : undefined
        }
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={[
          "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-[#355fd0]",
        ].join(" ")}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
