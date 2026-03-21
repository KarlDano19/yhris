'use client';

import React from 'react';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

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
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Download File</h2>
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isDownloading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
