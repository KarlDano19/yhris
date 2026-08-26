'use client';

import React from 'react';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import ModalLayout from '@/components/ModalLayout';

import type { T_EmployeeDocument } from '@/types/employee-201-records/document-repository';

interface DownloadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: T_EmployeeDocument | null;
  onConfirm: () => void;
  isDownloading: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadDocumentModal({
  isOpen,
  onClose,
  document,
  onConfirm,
  isDownloading,
}: DownloadDocumentModalProps) {
  if (!document) return null;

  return (
    <ModalLayout isOpen={isOpen} handleClose={onClose} title="Download File" maxWidth="max-w-md">
      <div className="px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ArrowDownTrayIcon className="h-6 w-6 text-savoy-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Are you sure you want to download{' '}
              <strong>"{document.file_name}"</strong>?
            </p>
            {document.file_size > 0 && (
              <p className="mt-1 text-xs text-gray-400">
                File size: {formatFileSize(document.file_size)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-savoy-blue bg-white border border-savoy-blue rounded-md hover:bg-gray-50"
          disabled={isDownloading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-semibold text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-50"
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </ModalLayout>
  );
}
