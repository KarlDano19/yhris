'use client';

import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';
import CustomToast from '@/components/CustomToast';
import SelectChevronDown from '@/svg/SelectChevronDown';

import type { T_EmployeeDocument, T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

interface MoveDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  documents: T_EmployeeDocument[];
  folders: T_EmployeeDocumentFolder[];
}

type T_MoveDocumentFormData = {
  folder_id: string;
};

export default function MoveDocumentModal({
  isOpen,
  onClose,
  employeeId,
  documents,
  folders,
}: MoveDocumentModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<T_MoveDocumentFormData>();
  const { mutateAsync: updateDocument } = useUpdateDocument(employeeId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBulk = documents.length > 1;

  useEffect(() => {
    // Only re-initialize when the modal opens — `documents` is a freshly
    // filtered array on every parent render, so keying off it directly would
    // reset the user's folder selection mid-pick.
    if (!isOpen) return;

    if (documents.length === 1) {
      const [document] = documents;
      setValue('folder_id', document.folder_id ? String(document.folder_id) : '');
    } else {
      setValue('folder_id', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: T_MoveDocumentFormData) => {
    if (documents.length === 0) return;

    const targetFolderId = data.folder_id ? Number(data.folder_id) : null;
    setIsSubmitting(true);

    try {
      const results = await Promise.allSettled(
        documents.map((document) =>
          updateDocument({ documentId: document.id, data: { folder_id: targetFolderId } })
        )
      );

      const failedCount = results.filter((r) => r.status === 'rejected').length;

      if (failedCount === 0) {
        toast.custom((t) => (
          <CustomToast
            message={isBulk ? `${documents.length} documents moved successfully` : 'Document moved successfully'}
            type="success"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            message={`${documents.length - failedCount}/${documents.length} document(s) moved. ${failedCount} failed.`}
            type={failedCount === documents.length ? 'error' : 'success'}
          />
        ));
      }

      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (documents.length === 0) return null;

  return (
    <ModalLayout
      isOpen={isOpen}
      handleClose={handleClose}
      title={isBulk ? `Move ${documents.length} Documents` : 'Move Document'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-6 py-4 space-y-4">
          {!isBulk && (
            <p className="text-sm text-gray-500 truncate" title={documents[0].file_name}>
              {documents[0].file_name}
            </p>
          )}
          <div>
            <label htmlFor="folder_id" className="block text-sm font-medium text-gray-700 mb-1">
              Destination Folder
            </label>
            <div className="relative">
              <select
                id="folder_id"
                {...register('folder_id')}
                className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-savoy-blue"
              >
                <option value="">Root (No Folder)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold text-savoy-blue bg-white border border-savoy-blue rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-savoy-blue rounded-md hover:opacity-90 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Moving...' : 'Move'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
