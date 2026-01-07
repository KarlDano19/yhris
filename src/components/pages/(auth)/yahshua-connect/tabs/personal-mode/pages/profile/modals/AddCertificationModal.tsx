import { useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Modal from '../../../../../components/Modal';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import EyePassword from '@/svg/EyePassword';
import DeleteIcon from '@/svg/DeleteIcon';
import ViewDocumentModal from './ViewDocumentModal';
import { ArrowUpTrayIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

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
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [existingProofUrl, setExistingProofUrl] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

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
        setProofFile(initialData.proofFile || null);
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
      proofUrl: proofFile ? undefined : existingProofUrl, // Keep existing URL if no new file
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
    // Reset the file input
    const fileInput = document.getElementById('certification-proof-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveExistingProof = () => {
    setExistingProofUrl(null);
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
            <div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className="block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center"
              >
                <label
                  className={`${
                    !proofFile && !existingProofUrl
                      ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                      : 'hidden'
                  }`}
                >
                  Drop file to upload or click to select
                  <input
                    {...register('proofFile')}
                    name="proofFile"
                    id="certification-proof-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </label>
                
                {/* Show existing proof when editing */}
                {existingProofUrl && !proofFile && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Existing Certificate Proof:</p>
                    <div className="flex items-center justify-between py-2 px-3 mb-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 font-light">
                          {existingProofUrl.split('/').pop()}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDocument({ name: 'Certificate Proof', url: existingProofUrl });
                          }}
                        >
                          <EyePassword visible />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExistingProof();
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show new file when selected */}
                {proofFile && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">New File to Upload:</p>
                    <div className="flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 font-light">{proofFile.name}</p>
                        <p className="text-xs text-gray-500">{(proofFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDocument({ name: proofFile.name, url: URL.createObjectURL(proofFile) });
                          }}
                        >
                          <EyePassword visible />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs pl-2 mt-1 text-gray-500">Maximum file size: 10 MB per file</p>
            </div>
          </div>
        </div>
      </form>

      {viewingDocument && (
        <ViewDocumentModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          fileUrl={viewingDocument.url}
        />
      )}
    </Modal>
  );
};

export default AddCertificationModal;

