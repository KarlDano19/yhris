"use client";

export default function Tab({
  children,
  icon,
  active,
  dot,
  onClick,
  disabled = false,
  tooltip,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  dot?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}) {
  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
      disabled={disabled}
      title={tooltip}
      className={`relative flex flex-col items-center w-10 h-10 md:w-20 md:h-20 text-center focus:outline-none shrink-0
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
    >
      <div
        className={`mb-1 ${
          active && !disabled
            ? "text-[#355fd0]"
            : "text-gray-500"
        }`}
      >
        {icon}
      </div>
      <span
        className={`hidden md:block leading-tight break-words whitespace-normal w-18 md:w-18 text-[10px] ${
          active && !disabled
            ? "font-semibold text-[#355fd0]"
            : "text-gray-500"
        }`}
      >
        {children}
      </span>
      {dot && (
        <span className="absolute top-1 right-1 inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
      )}
    </button>
  );
}
