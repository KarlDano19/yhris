"use client";

import { useEffect } from "react";

export default function LeaveConfirmModal({
  onCancel,
  onDiscard,
  onSaveAndLeave,
  message,
}: {
  onCancel: () => void;
  onDiscard: () => void;
  onSaveAndLeave: () => void | Promise<void>;
  message?: string;
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
      data-testid="leave-confirm-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-confirm-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />
      <div className="relative w-full max-w-[260px] sm:max-w-sm rounded-lg sm:rounded-2xl bg-white shadow-xl p-3 sm:p-8">
        <h3 id="leave-confirm-title" className="text-base sm:text-lg font-semibold text-gray-900">
          Leave without saving?
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 leading-snug">
          {message ?? "You have unsaved changes. What would you like to do?"}
        </p>
        <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
          <button
            data-testid="stay-btn"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
          >
            Stay
          </button>
          <button
            data-testid="discard-btn"
            onClick={onDiscard}
            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs sm:text-sm text-rose-700 hover:bg-rose-100"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
