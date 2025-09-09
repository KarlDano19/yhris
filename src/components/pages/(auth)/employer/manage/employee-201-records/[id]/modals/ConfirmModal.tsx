"use client";

import { useEffect } from "react";

type Intent = "primary" | "danger" | "warning" | "success";

export default function ConfirmModal({
  // visibility
  isOpen = true,

  // content
  title,
  message,
  children,

  // actions
  onCancel,
  onConfirm,

  // options
  busy = false,
  confirmText = "Confirm",
  busyText = "Working…",
  cancelText = "Cancel",
  intent = "primary",
  closeOnBackdrop = true,
  closeOnEsc = true,
  maxWidth = "sm", // "xs" | "sm" | "md" | "lg"
}: {
  isOpen?: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  confirmText?: string;
  busyText?: string;
  cancelText?: string;
  intent?: Intent;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg";
}) {
  if (!isOpen) return null;

  // lock scroll + ESC
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [busy, closeOnEsc, onCancel]);

  const sizeClass =
    maxWidth === "xs"
      ? "max-w-[240px]"
      : maxWidth === "sm"
      ? "sm:max-w-sm"
      : maxWidth === "md"
      ? "sm:max-w-md"
      : "sm:max-w-lg";

  const intentStyles: Record<Intent, { bg: string; hover: string }> = {
    primary: { bg: "#355fd0", hover: "#2f54b8" },
    danger: { bg: "#ef4444", hover: "#dc2626" },
    warning: { bg: "#f59e0b", hover: "#d97706" },
    success: { bg: "#10b981", hover: "#059669" },
  };
  const clr = intentStyles[intent];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!busy && closeOnBackdrop ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeClass} rounded-lg sm:rounded-2xl bg-white shadow-xl p-3 sm:p-8`}
      >
        <div className="pt-1">
          <h3
            id="confirm-title"
            className="text-base sm:text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>

          {children ? (
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-snug">
              {children}
            </div>
          ) : message ? (
            <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-snug">
              {message}
            </p>
          ) : null}
        </div>

        <div className="mt-3 sm:mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 font-semibold text-white disabled:opacity-70 flex items-center justify-center"
            style={{ backgroundColor: clr.bg }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                clr.hover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                clr.bg;
            }}
          >
            {busy && (
              <svg
                className="mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {busy ? busyText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
