type FieldProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  type?: "text" | "date" | "file";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function Field({
  label,
  placeholder,
  defaultValue,
  value,
  type = "text",
  onChange,
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={type !== "file" ? value : undefined}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
      />
    </div>
  );
}
