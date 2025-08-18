"use client";
import { useEffect } from "react";

export default function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
  busy = false,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
        onClick={!busy ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-[240px] sm:max-w-sm rounded-lg sm:rounded-2xl bg-white shadow-xl p-3 sm:p-8">
        <div className="pt-1">
          <h3
            id="confirm-title"
            className="text-base sm:text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-snug">
            {message}
          </p>
        </div>

        <div className="mt-3 sm:mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-[#355fd0] px-3 py-1.5 text-xs sm:text-sm sm:px-5 sm:py-2 font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-70 flex items-center justify-center"
          >
            {busy && (
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {busy ? "Saving…" : "Confirm Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
