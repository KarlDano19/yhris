'use client';

import React from 'react';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { useDeleteFolder } from '../../hooks/useDeleteFolder';
import { T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  folder: T_EmployeeDocumentFolder | null;
}

export default function DeleteFolderModal({
  isOpen,
  onClose,
  employeeId,
  folder,
}: DeleteFolderModalProps) {
  const { mutate: deleteFolder, isLoading } = useDeleteFolder(employeeId);

  const handleDelete = () => {
    if (!folder) return;

    deleteFolder(folder.id, {
      onSuccess: (response) => {
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            message={response.message || 'Folder deleted successfully'}
            type="success"
          />
        ));
        onClose();
      },
      onError: (error) => {
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            message={error.message || 'Failed to delete folder'}
            type="error"
          />
        ));
      },
    });
  };

  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Folder</h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the folder <strong>"{folder.name}"</strong>?
              </p>
              {folder.document_count > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    This folder contains <strong>{folder.document_count} document(s)</strong>.
                    Please move or delete all documents before deleting the folder.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            disabled={isLoading || folder.document_count > 0}
          >
            {isLoading ? 'Deleting...' : 'Delete Folder'}
          </button>
        </div>
      </div>
    </div>
  );
}
