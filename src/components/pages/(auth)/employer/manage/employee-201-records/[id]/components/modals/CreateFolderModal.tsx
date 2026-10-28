'use client';

import React, { useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import { useCreateFolder } from '../../hooks/useCreateFolder';
import CustomToast from '@/components/CustomToast';

import { T_CreateFolderData } from '@/types/employee-201-records/document-repository';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  employeeId,
}: CreateFolderModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<T_CreateFolderData>();
  const { mutate: createFolder, isLoading } = useCreateFolder(employeeId);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: nameFieldRef, ...nameField } = register('name', {
    required: 'Folder name is required',
    maxLength: {
      value: 100,
      message: 'Folder name must be at most 100 characters',
    },
  });

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

  const onSubmit = (data: T_CreateFolderData) => {
    createFolder(data, {
      onSuccess: (response) => {
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            message={response.message || 'Folder created successfully'}
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
            message={error.message || 'Failed to create folder'}
            type="error"
          />
        ));
      },
    });
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title="Create New Folder" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-6 py-4 space-y-4">
          {/* Folder Name */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-savoy-blue focus:border-transparent"
              placeholder="e.g., Requirements"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-savoy-blue focus:border-transparent"
              placeholder="Brief description of what this folder contains"
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
            className="px-4 py-2 text-sm font-semibold text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
