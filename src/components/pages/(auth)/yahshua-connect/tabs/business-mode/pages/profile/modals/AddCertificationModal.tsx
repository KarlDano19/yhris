

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';
import { CalendarIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Certification {
  id?: number;
  name: string;
  issuer: string;
  issuedDate?: string;
  expiresDate?: string;
  idNumber?: string;
  verified?: boolean;
}

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Certification) => void;
  initialData?: Certification | null;
}

const AddCertificationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddCertificationModalProps) => {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    issuedDate: '',
    expiresDate: '',
    idNumber: '',
    verified: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        issuer: '',
        issuedDate: '',
        expiresDate: '',
        idNumber: '',
        verified: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Certification, value: string | boolean) => {
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
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => handleChange('issuedDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.expiresDate}
                onChange={(e) => handleChange('expiresDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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

