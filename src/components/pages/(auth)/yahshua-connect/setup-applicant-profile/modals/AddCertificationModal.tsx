import { useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';

import { XMarkIcon } from '@heroicons/react/24/outline';

import DeleteIcon from '@/svg/DeleteIcon';

import { T_Certification } from '@/types/personal-mode';

// Helper function to parse date string to Date object
const parseDateString = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr || dateStr === '') return null;
  try {
    const date = new Date(dateStr);
    // Check if the date is valid
    if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
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
  initialData?: T_Certification | null;
  onSave: (data: T_Certification) => void;
}

// Form data type with Date objects for date pickers
type CertificationFormData = Omit<T_Certification, 'issuedDate' | 'expiresDate'> & {
  issuedDate: Date | null;
  expiresDate: Date | null;
};

const AddCertificationModal = ({
  isOpen,
  onClose,
  initialData = null,
  onSave,
}: AddCertificationModalProps) => {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [existingProofUrl, setExistingProofUrl] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, watch } = useForm<CertificationFormData>({
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
        const issuedDate = parseDateString(initialData.issuedDate);
        const expiresDate = parseDateString(initialData.expiresDate);

        reset({
          name: initialData.name || '',
          issuer: initialData.issuer || '',
          issuedDate: issuedDate,
          expiresDate: expiresDate,
          idNumber: initialData.idNumber || '',
          verified: initialData.verified || false,
        });
        // Only set proofFile if it's an actual File object with size
        const hasValidProofFile = initialData.proofFile instanceof File;
        setProofFile(hasValidProofFile ? initialData.proofFile || null : null);
        setExistingProofUrl(initialData.proofUrl || null);
      } else {
        reset({
          name: '',
          issuer: '',
          issuedDate: null,
          expiresDate: null,
          idNumber: '',
          verified: false,
        });
        setProofFile(null);
        setExistingProofUrl(null);
      }
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data: CertificationFormData) => {
    // Convert Date objects back to ISO string format before saving
    const dataToSave: T_Certification = {
      ...data,
      issuedDate: formatDateToISO(data.issuedDate),
      expiresDate: formatDateToISO(data.expiresDate),
      proofFile: proofFile,
      proofUrl: proofFile ? URL.createObjectURL(proofFile) : existingProofUrl,
    };

    // Add ID if editing, generate new ID if adding
    if (initialData && initialData.id) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      const newId = Date.now(); // Temporary ID
      onSave({ ...dataToSave, id: newId });
    }

    // Close modal and clear form
    reset();
    setProofFile(null);
    setExistingProofUrl(null);
    onClose();
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e?.dataTransfer?.files?.[0];

    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear the file input
    e.target.value = '';
  };

  const processFile = (file: File) => {
    // Validate file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.custom(() => <CustomToast message={`${file.name}: Invalid file type. Only PDF, PNG, and JPG files are allowed.`} type='error' />, { duration: 2000 });
      return;
    }

    setProofFile(file);
    // Clear existing proof URL when new file is uploaded
    setExistingProofUrl(null);
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setExistingProofUrl(null);
    const fileInput = document.getElementById('certification-proof-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {initialData ? 'Edit Certification' : 'Add Certification'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <form id="certification-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-5 space-y-5">
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
                        selected={field.value || null}
                        pickerOnChange={(date: Date | null) => field.onChange(date)}
                        inputOnChange={(value: any) => {
                          if (value instanceof Date && !isNaN(value.getTime())) {
                            field.onChange(value);
                          } else {
                            field.onChange(null);
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
                        selected={field.value || null}
                        minDate={issuedDateValue || undefined}
                        pickerOnChange={(date: Date | null) => field.onChange(date)}
                        inputOnChange={(value: any) => {
                          if (value instanceof Date && !isNaN(value.getTime())) {
                            field.onChange(value);
                          } else {
                            field.onChange(null);
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
                <div>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className="block w-full rounded-lg border-2 border-dashed border-gray-300 py-8 px-3 text-center hover:border-savoy-blue transition-colors"
                  >
                    {!proofFile && !existingProofUrl ? (
                      <label className="cursor-pointer">
                        <span className="text-gray-600">Drop file to upload or click to select</span>
                        <input
                          {...register('proofFile')}
                          name="proofFile"
                          id="certification-proof-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          accept=".pdf,.png,.jpg,.jpeg"
                        />
                        <p className="text-xs text-gray-500 mt-2">Maximum file size: 10 MB</p>
                      </label>
                    ) : (
                      <div className="text-left">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 font-medium">
                              {proofFile ? proofFile.name : existingProofUrl?.split('/').pop()}
                            </p>
                            {proofFile && proofFile.size && (
                              <p className="text-xs text-gray-500">{(proofFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                            {existingProofUrl && !proofFile && (
                              <a
                                href={existingProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-savoy-blue hover:underline"
                              >
                                View current file
                              </a>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-4 cursor-pointer hover:opacity-70 transition-opacity"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCertificationModal;
