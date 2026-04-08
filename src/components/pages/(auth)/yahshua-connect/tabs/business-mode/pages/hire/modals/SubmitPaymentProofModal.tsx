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
  isSubmitting?: boolean;
  onSubmit: (data: { payment_proof: File; payment_amount?: number }) => void;
}

const SubmitPaymentProofModal = ({
  isOpen,
  onClose,
  serviceName,
  providerName,
  priceRange,
  isSubmitting = false,
  onSubmit,
}: SubmitPaymentProofModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
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
      const amount = paymentAmount.trim() ? parseFloat(paymentAmount) : undefined;
      onSubmit({
        payment_proof: selectedFile,
        payment_amount: amount,
      });
      setSelectedFile(null);
      setPaymentAmount('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPaymentAmount('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPaymentAmount('');
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
            disabled={!selectedFile || isSubmitting}
            className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proof'}
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

      {/* Payment Amount */}
      <div className="mb-6">
        <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-2">
          Payment Amount (₱) <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          type="number"
          id="paymentAmount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Enter amount (leave blank to use job budget)"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue"
        />
        <p className="mt-1 text-xs text-gray-500">
          If left blank, the system will use the job's budget amount
        </p>
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

