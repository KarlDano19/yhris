import { useState, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import Modal from '../../../../../components/Modal';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface SubmitPaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  providerName: string;
  priceRange: string;
  onSubmit: (file: File) => void;
}

const SubmitPaymentProofModal = ({
  isOpen,
  onClose,
  serviceName,
  providerName,
  priceRange,
  onSubmit,
}: SubmitPaymentProofModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const acceptedTypes = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > maxFileSize) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: maxFileSize,
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Submit Payment Proof"
      size="md"
      footerContent={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Proof
          </button>
        </div>
      }
    >
      {/* Service Information */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-900 mb-1">{serviceName}</p>
        <p className="text-sm text-gray-600 mb-2">Hired: {providerName}</p>
        <p className="text-base font-semibold text-green-600">{priceRange}</p>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Payment Screenshot/Receipt
        </label>
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-savoy-blue bg-blue-50'
              : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="space-y-2">
              <CloudArrowUpIcon className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SubmitPaymentProofModal;

