"use client";

import React from "react";

type Props = {
  show: boolean;
  isLoading?: boolean;
  count?: number;            // when loading=false, shows this count
  className?: string;        // optional extra classes for positioning
  srLabel?: string;          // optional screen-reader label override
};

export default function TileBadge({
  show,
  isLoading = false,
  count = 0,
  className = "",
  srLabel,
}: Props) {
  if (!show) return null;

  const text = count > 99 ? "99+" : String(count);
  const ariaText =
    srLabel ??
    (isLoading ? "Loading incomplete count…" : `${text} incomplete employee records`);

  return (
    <span
      className={
        "absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full " +
        "bg-rose-500 text-white ring-2 ring-white shadow-sm sm:h-7 sm:w-7 " +
        className
      }
      aria-live="polite"
    >
      {isLoading ? (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            className="opacity-30"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <span className="text-[14px] font-bold leading-none sm:text-[13px]">{text}</span>
      )}
      <span className="sr-only">{ariaText}</span>
    </span>
  );
}
