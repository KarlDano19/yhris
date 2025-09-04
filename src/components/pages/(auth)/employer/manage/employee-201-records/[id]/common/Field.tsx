import { useId } from "react";

type FieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  type?: "text" | "number" | "date" | "file";
  step?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;

  /** optional error/hint lines */
  error?: string | null;
  hint?: string;
  required?: boolean;

  /** new (backwards compatible) */
  readOnly?: boolean;
  disabled?: boolean;
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
  readOnly = false,
  disabled = false,
}: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const baseInputClasses =
    "w-full rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400";

  let stateClasses = "";
  if (disabled) {
    stateClasses =
      "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:border-gray-300";
  } else if (readOnly) {
    stateClasses =
      "border-gray-300 bg-gray-50 text-gray-700 cursor-default focus:border-gray-300";
  } else if (error) {
    stateClasses = "border-red-500 focus:border-red-500";
  } else {
    stateClasses = "border-gray-300 focus:border-[#355fd0]";
  }

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
        readOnly={readOnly}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        className={[baseInputClasses, stateClasses].join(" ")}
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
