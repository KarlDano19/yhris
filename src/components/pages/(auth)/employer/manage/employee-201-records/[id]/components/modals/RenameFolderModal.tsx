'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { useUpdateFolder } from '../../hooks/useUpdateFolder';
import { T_UpdateFolderData, T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

interface RenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  folder: T_EmployeeDocumentFolder | null;
}

export default function RenameFolderModal({
  isOpen,
  onClose,
  employeeId,
  folder,
}: RenameFolderModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<T_UpdateFolderData>();
  const { mutate: updateFolder, isLoading } = useUpdateFolder(employeeId);

  useEffect(() => {
    if (folder && isOpen) {
      setValue('name', folder.name);
      setValue('description', folder.description || '');
    }
  }, [folder, isOpen, setValue]);

  const onSubmit = (data: T_UpdateFolderData) => {
    if (!folder) return;

    updateFolder(
      { folderId: folder.id, data },
      {
        onSuccess: (response) => {
          toast.custom((t) => (
            <CustomToast
              toast={toast}
              t={t}
              message={response.message || 'Folder updated successfully'}
              type="success"
            />
          ));
          reset();
          onClose();
        },
        onError: (error) => {
          toast.custom((t) => (
            <CustomToast
              toast={toast}
              t={t}
              message={error.message || 'Failed to update folder'}
              type="error"
            />
          ));
        },
      }
    );
  };

  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rename Folder</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Folder name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
