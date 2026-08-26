'use client';

import React from 'react';

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
              {...register('name', {
                required: 'Folder name is required',
                maxLength: {
                  value: 100,
                  message: 'Folder name must be at most 100 characters',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of what this folder contains"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Folder'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
