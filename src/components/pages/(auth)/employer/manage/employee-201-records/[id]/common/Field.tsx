export default function Field({
  label,
  placeholder,
  defaultValue,
  className = "",
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#355fd0]"
      />
    </div>
  );
}