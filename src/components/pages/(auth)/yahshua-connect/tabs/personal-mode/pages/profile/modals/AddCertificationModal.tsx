import { useState, useEffect } from 'react';

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
}

const AddCertificationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddCertificationModalProps) => {
  const [formData, setFormData] = useState<T_Certification>({
    name: '',
    issuer: '',
    issuedDate: '',
    expiresDate: '',
    idNumber: '',
    verified: false,
  });

  // Date objects for the date pickers
  const [issuedDate, setIssuedDate] = useState<Date | null>(null);
  const [expiresDate, setExpiresDate] = useState<Date | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIssuedDate(parseDateString(initialData.issuedDate));
      setExpiresDate(parseDateString(initialData.expiresDate));
    } else {
      setFormData({
        name: '',
        issuer: '',
        issuedDate: '',
        expiresDate: '',
        idNumber: '',
        verified: false,
      });
      setIssuedDate(null);
      setExpiresDate(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert Date objects back to ISO string format before saving
    const dataToSave = {
      ...formData,
      issuedDate: formatDateToISO(issuedDate),
      expiresDate: formatDateToISO(expiresDate),
    };
    onSave(dataToSave);
    onClose();
  };

  const handleChange = (field: keyof T_Certification, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <form id="certification-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Certification Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., AWS Certified Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Issuing Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => handleChange('issuer', e.target.value)}
              placeholder="e.g., Amazon Web Services"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <div className="relative">
              <CustomDatePicker
                id="certification-issue-date"
                placeholder="mm/dd/yyyy"
                className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                selected={issuedDate}
                pickerOnChange={(date: Date | null) => {
                  setIssuedDate(date);
                }}
                inputOnChange={(value: any) => {
                  if (value instanceof Date) {
                    setIssuedDate(value);
                  }
                }}
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <CustomDatePicker
                id="certification-expiry-date"
                placeholder="mm/dd/yyyy"
                className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                selected={expiresDate}
                minDate={issuedDate || undefined}
                pickerOnChange={(date: Date | null) => {
                  setExpiresDate(date);
                }}
                inputOnChange={(value: any) => {
                  if (value instanceof Date) {
                    setExpiresDate(value);
                  }
                }}
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
              value={formData.idNumber}
              onChange={(e) => handleChange('idNumber', e.target.value)}
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

