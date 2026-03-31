"use client";

// 1. React imports
import React, { useCallback, useEffect, useRef, useState } from "react";

// 2. Icon imports
import { XCircleIcon } from "@heroicons/react/24/solid";

export type UpdatePhotoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhotoUrl?: string | null;
  /** Called when user clicks Update and a new file is selected */
  onConfirm: (file: File) => Promise<any> | void;
  /** Called when user clicks Update with removal staged */
  onRemove?: () => Promise<any> | void;
  title?: string;
  maxSizeBytes?: number; // default 5MB
  isProcessing?: boolean;
  accept?: string; // default "image/*"
};

const DEFAULT_MAX = 5 * 1024 * 1024; // 5MB

export default function UpdatePhotoModal({
  open,
  onOpenChange,
  currentPhotoUrl,
  onConfirm,
  onRemove,
  title = "Update Profile Photo",
  maxSizeBytes = DEFAULT_MAX,
  isProcessing = false,
  accept = "image/*",
}: UpdatePhotoModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeQueued, setRemoveQueued] = useState(false);

  // init/cleanup on open/close
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSelectedFile(null);
    setPreviewUrl(currentPhotoUrl || null);
    setRemoveQueued(false);
    // focus for a11y
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
    };
  }, [open, currentPhotoUrl]);

  // cleanup blob URLs (from selected file)
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!(file.type || "").startsWith("image/")) {
      setError("Please select an image file.");
      e.currentTarget.value = "";
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(
        `Max file size is ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`
      );
      e.currentTarget.value = "";
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:"))
      URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    setRemoveQueued(false);
    setError(null);
    e.currentTarget.value = ""; // allow picking the same file again
  };

  // Stage/unstage removal (API runs on Update)
  const toggleRemove = useCallback(() => {
    setRemoveQueued((prev) => {
      const next = !prev;
      // If staging removal, clear selected file and preview
      if (next) {
        setSelectedFile(null);
        if (previewUrl && previewUrl.startsWith("blob:"))
          URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      } else {
        // unstage -> show current photo again
        setPreviewUrl(currentPhotoUrl || null);
      }
      setError(null);
      return next;
    });
  }, [currentPhotoUrl, previewUrl]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isProcessing) onOpenChange(false);
  };

  const handleConfirm = useCallback(async () => {
    try {
      // If user staged removal, call onRemove
      if (removeQueued) {
        if (onRemove) await onRemove();
        onOpenChange(false);
        return;
      }
      // If user selected a file, upload it
      if (selectedFile) {
        await onConfirm(selectedFile);
        onOpenChange(false);
        return;
      }
      // Nothing to do
    } catch (e: any) {
      setError(e?.message || "Failed to update photo.");
    }
  }, [removeQueued, selectedFile, onConfirm, onRemove, onOpenChange]);

  if (!open) return null;

  const canUpdate = !!selectedFile || removeQueued;
  const canRemove = !!currentPhotoUrl || !!previewUrl;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={handleBackdrop}
      aria-modal="true"
      role="dialog"
      aria-labelledby="update-photo-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-[520px] sm:max-w-[560px] rounded-2xl bg-white shadow-xl outline-none max-h-[92vh] flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#355fd0] px-6 py-3 text-white flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 id="update-photo-title" className="text-base font-semibold">
              {title}
            </h2>
            <p className="text-xs text-white/80">
              Choose a new photo or remove the existing one.
            </p>
          </div>
          <button
            data-testid="close-modal-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 hover:bg-white/10 focus:outline-none"
          >
            <XCircleIcon className="w-8 h-8 text-white cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">
          {/* Preview */}
          <div
            className="mx-auto grid place-items-center rounded-2xl bg-neutral-100 p-6"
            style={{ width: 360 }}
          >
            <div className="relative h-[220px] w-[220px] overflow-hidden bg-white shadow rounded-md">
              {removeQueued ? (
                <div className="grid h-full w-full place-items-center text-rose-600/90">
                  <span className="text-sm font-semibold">
                    Photo will be removed
                  </span>
                </div>
              ) : previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-neutral-400">
                  <svg
                    className="h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-6 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isProcessing}
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Change
              </button>
              <button
                type="button"
                onClick={toggleRemove}
                disabled={!canRemove || isProcessing}
                className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 border ${
                  removeQueued
                    ? "border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-200"
                    : "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                Remove
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canUpdate || isProcessing}
                className="rounded-md bg-[#355fd0] px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
