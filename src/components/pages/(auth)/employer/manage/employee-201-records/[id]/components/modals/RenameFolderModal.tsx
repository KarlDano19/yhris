'use client';

import React, { useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import { useUpdateFolder } from '../../hooks/useUpdateFolder';
import CustomToast from '@/components/CustomToast';

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
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: nameFieldRef, ...nameField } = register('name', { required: 'Folder name is required' });

  useEffect(() => {
    if (folder && isOpen) {
      setValue('name', folder.name);
      setValue('description', folder.description || '');
    }
  }, [folder, isOpen, setValue]);

  useEffect(() => {
    // headlessui's focus trap runs its own initial-focus pass on mount, so
    // deferring to a macrotask lets our focus win the race against it.
    if (isOpen) {
      const timeout = setTimeout(() => nameInputRef.current?.focus(), 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

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

  if (!folder) return null;

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title="Rename Folder" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Folder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...nameField}
              ref={(e) => {
                nameFieldRef(e);
                nameInputRef.current = e;
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-savoy-blue"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-savoy-blue"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold text-savoy-blue bg-white border border-savoy-blue rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
