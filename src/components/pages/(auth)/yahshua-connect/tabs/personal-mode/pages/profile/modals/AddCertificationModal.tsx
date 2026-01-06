import { useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import Modal from '../../../../../components/Modal';

import CustomDatePicker from '@/components/CustomDatePicker';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import { T_Certification } from '@/types/personal-mode';

// Helper function to parse date string to Date object
const parseDateString = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    return null;
  } catch {
    return null;
  }
};

// Helper function to format Date to ISO string (YYYY-MM-DD)
const formatDateToISO = (date: Date | null): string => {
  if (!date) return '';
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T_Certification) => void;
  initialData?: T_Certification | null;
  onAddToLocal: (data: T_Certification) => void;
  onUpdateLocal: (data: T_Certification) => void;
}

// Form data type with Date objects for date pickers
type CertificationFormData = Omit<T_Certification, 'issuedDate' | 'expiresDate'> & {
  issuedDate: Date | null;
  expiresDate: Date | null;
};

const AddCertificationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  onAddToLocal,
  onUpdateLocal,
}: AddCertificationModalProps) => {
  const { register, handleSubmit, control, reset, watch, setValue } = useForm<CertificationFormData>({
    defaultValues: {
      name: '',
      issuer: '',
      issuedDate: null,
      expiresDate: null,
      idNumber: '',
      verified: false,
    },
  });

  const issuedDateValue = watch('issuedDate');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          issuer: initialData.issuer || '',
          issuedDate: parseDateString(initialData.issuedDate),
          expiresDate: parseDateString(initialData.expiresDate),
          idNumber: initialData.idNumber || '',
          verified: initialData.verified || false,
        });
      } else {
        reset({
          name: '',
          issuer: '',
          issuedDate: null,
          expiresDate: null,
          idNumber: '',
          verified: false,
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data: CertificationFormData) => {
    // Convert Date objects back to ISO string format before saving
    const dataToSave: T_Certification = {
      ...data,
      issuedDate: formatDateToISO(data.issuedDate),
      expiresDate: formatDateToISO(data.expiresDate),
    };
    
    // Update local state in parent modal (no API call)
    if (initialData && initialData.id) {
      // Update existing
      onUpdateLocal(dataToSave);
    } else {
      // Add new - generate ID
      const newId = Date.now(); // Temporary ID
      onAddToLocal({ ...dataToSave, id: newId });
    }
    
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
    }
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="certification-form"
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Certification' : 'Add Certification'}
      size="2xl"
      footerContent={footerContent}
    >
      <form id="certification-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {/* Certification Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="e.g., AWS Certified Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Issuing Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('issuer', { required: true })}
              placeholder="e.g., Amazon Web Services"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <div className="relative">
              <Controller
                control={control}
                name="issuedDate"
                render={({ field }) => (
                  <CustomDatePicker
                    id="certification-issue-date"
                    placeholder="mm/dd/yyyy"
                    className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                    selected={field.value}
                    pickerOnChange={(date: Date | null) => field.onChange(date)}
                    inputOnChange={(value: any) => {
                      if (value instanceof Date) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <Controller
                control={control}
                name="expiresDate"
                render={({ field }) => (
                  <CustomDatePicker
                    id="certification-expiry-date"
                    placeholder="mm/dd/yyyy"
                    className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                    selected={field.value}
                    minDate={issuedDateValue || undefined}
                    pickerOnChange={(date: Date | null) => field.onChange(date)}
                    inputOnChange={(value: any) => {
                      if (value instanceof Date) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Credential ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              type="text"
              {...register('idNumber')}
              placeholder="e.g., ABC-123-XYZ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Upload Certificate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Certificate (Proof)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-savoy-blue hover:bg-savoy-blue/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddCertificationModal;

