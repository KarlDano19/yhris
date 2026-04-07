import { useState, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import Modal from '../../../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface SubmitDailyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  contractStartDate: string;
  contractEndDate: string;
  budgetType: 'fixed_rate' | 'hourly_rate';
  isProofFileRequired?: boolean;
  dailyProgresses?: any[];
  onSubmit: (data: {
    progress_date: string;
    proof_file?: File;
    notes: string;
  }) => void;
}

const SubmitDailyProgressModal = ({
  isOpen,
  onClose,
  jobTitle,
  contractStartDate,
  contractEndDate,
  isProofFileRequired = true,
  dailyProgresses = [],
  onSubmit,
}: SubmitDailyProgressModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progressDate, setProgressDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const acceptedTypes = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > maxFileSize) {
        alert('File size must be less than 10MB');
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
    // File is required only if isProofFileRequired is true
    const isValid = progressDate && (isProofFileRequired ? selectedFile : true);

    if (isValid) {
      // Format date to YYYY-MM-DD for API
      const year = progressDate.getFullYear();
      const month = String(progressDate.getMonth() + 1).padStart(2, '0');
      const day = String(progressDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const data: {
        progress_date: string;
        proof_file?: File;
        notes: string;
      } = {
        progress_date: formattedDate,
        notes: notes,
      };

      // Only include proof_file if a file was selected
      if (selectedFile) {
        data.proof_file = selectedFile;
      }

      onSubmit(data);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setProgressDate(null);
    setNotes('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setProgressDate(null);
      setNotes('');
    }
  }, [isOpen]);

  // Parse contract dates for date picker constraints
  // ORIGINAL CODE (COMMENTED OUT FOR TESTING)
  // Restricts to contract dates AND prevents future dates beyond today
  // const minDate = contractStartDate ? new Date(contractStartDate) : undefined;
  // const today = new Date();
  // today.setHours(23, 59, 59, 999);
  // const contractEnd = contractEndDate ? new Date(contractEndDate) : undefined;
  // const maxDate = contractEnd ? (contractEnd < today ? contractEnd : today) : today;

  // TESTING CODE (ALLOW ANY DATE WITHIN CONTRACT PERIOD - INCLUDING FUTURE DATES)
  const minDate = contractStartDate ? new Date(contractStartDate) : undefined;
  const maxDate = contractEndDate ? new Date(contractEndDate) : undefined;

  // Calculate dates that already have submitted progress (to exclude from picker)
  const excludedDates = dailyProgresses.map((progress) => {
    return new Date(progress.progress_date);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Submit Daily Progress"
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
            disabled={!progressDate || (isProofFileRequired && !selectedFile)}
            className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Progress
          </button>
        </div>
      }
    >
      {/* Job Information */}
      <div className="mb-6">
        <p className="text-base font-bold text-gray-900 mb-1">{jobTitle}</p>
        <p className="text-sm text-gray-600">
          Contract: {new Date(contractStartDate).toLocaleDateString()} -{' '}
          {new Date(contractEndDate).toLocaleDateString()}
        </p>
      </div>

      {/* Progress Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Progress Date <span className="text-red-500">*</span>
        </label>
        <CustomDatePicker
          id="progressDate"
          selected={progressDate}
          pickerOnChange={(date: Date | null) => setProgressDate(date)}
          inputOnChange={(date: Date | null) => setProgressDate(date)}
          minDate={minDate}
          maxDate={maxDate}
          excludeDates={excludedDates}
          placeholder="mm/dd/yyyy"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue shadow-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          {/* ORIGINAL: Select today or a past date within the contract period (up to today) */}
          {/* TESTING: */}Select any date within the contract period ({minDate?.toLocaleDateString()} - {maxDate?.toLocaleDateString()})
          {excludedDates.length > 0 && '. Dates with submitted progress are disabled.'}
        </p>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Describe what you accomplished today..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue resize-none"
        />
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proof of Work{' '}
          {isProofFileRequired ? (
            <span className="text-red-500">*</span>
          ) : (
            <span className="text-gray-500 text-xs">(Optional)</span>
          )}
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
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SubmitDailyProgressModal;

