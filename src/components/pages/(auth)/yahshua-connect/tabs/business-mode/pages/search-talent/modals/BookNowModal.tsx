'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from '../../../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Talent } from '@/types/business-mode';

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  talent: Talent | null;
  onConfirm: (bookingData: {
    preferredDate: Date | null;
    preferredTime: string;
    estimatedDuration: string;
    budget?: string;
    projectDescription: string;
  }) => void;
}

const BookNowModal = ({ isOpen, onClose, talent, onConfirm }: BookNowModalProps) => {
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [preferredTime, setPreferredTime] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    preferredDate?: string;
    preferredTime?: string;
    estimatedDuration?: string;
    projectDescription?: string;
  }>({});

  const durationDropdownRef = useRef<HTMLDivElement>(null);

  // Duration options
  const durationOptions = [
    '1 hour', '2 hours', '3 hours', '4 hours', '5 hours', '6 hours', '7 hours', '8 hours', 'Full day (8+ hours)'
  ];

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDurationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setPreferredDate(null);
      setPreferredTime('');
      setEstimatedDuration('');
      setBudget('');
      setProjectDescription('');
      setValidationErrors({});
      setShowDurationDropdown(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const errors: typeof validationErrors = {};

    if (!preferredDate) {
      errors.preferredDate = 'Preferred date is required';
    }

    if (!preferredTime) {
      errors.preferredTime = 'Preferred time is required';
    }

    if (!estimatedDuration) {
      errors.estimatedDuration = 'Estimated duration is required';
    }

    if (!projectDescription.trim()) {
      errors.projectDescription = 'Project description is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onConfirm({
      preferredDate,
      preferredTime,
      estimatedDuration,
      budget: budget.trim() || undefined,
      projectDescription: projectDescription.trim(),
    });
  };

  const handleClose = () => {
    setPreferredDate(null);
    setPreferredTime('');
    setEstimatedDuration('');
    setBudget('');
    setProjectDescription('');
    setValidationErrors({});
    onClose();
  };

  if (!talent) return null;

  const footerContent = (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleClose}
        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
      >
        Send Booking Request
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Book ${talent.name}`}
      size="2xl"
      footerContent={footerContent}
    >
      <div className="space-y-6">
        {/* Talent Info Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{talent.title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-700">
              {talent.expected_salary
                ? `₱${talent.expected_salary.toLocaleString()}/month`
                : 'Not specified'
              }
            </p>
          </div>
        </div>

        {/* Developer Information */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-lg font-semibold">
            {talent.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{talent.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-700">
                {talent.rating.toFixed(1)} ({talent.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          {/* Preferred Date and Time - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preferred Date */}
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date <span className="text-red-600">*</span>
              </label>
              <CustomDatePicker
                id="preferredDate"
                selected={preferredDate}
                pickerOnChange={(date: Date | null) => {
                  setPreferredDate(date);
                  if (validationErrors.preferredDate) {
                    setValidationErrors(prev => ({ ...prev, preferredDate: undefined }));
                  }
                }}
                inputOnChange={(date: Date | null) => {
                  setPreferredDate(date);
                  if (validationErrors.preferredDate) {
                    setValidationErrors(prev => ({ ...prev, preferredDate: undefined }));
                  }
                }}
                placeholder="mm/dd/yyyy"
                className={`block w-full rounded-lg border shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm px-3 py-2 pr-10 ${
                  validationErrors.preferredDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.preferredDate && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.preferredDate}</p>
              )}
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="preferredTime" className="block text-xs text-gray-600 mb-1">
                Preferred Time <span className="text-red-600">*</span>
              </label>
              <input
                type="time"
                id="preferredTime"
                value={preferredTime}
                onChange={(e) => {
                  setPreferredTime(e.target.value);
                  if (validationErrors.preferredTime) {
                    setValidationErrors(prev => ({ ...prev, preferredTime: undefined }));
                  }
                }}
                className={`block w-full rounded-lg border shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm px-3 py-2 ${
                  validationErrors.preferredTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.preferredTime && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.preferredTime}</p>
              )}
            </div>
          </div>

          {/* Estimated Duration and Budget - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Duration */}
            <div className="relative" ref={durationDropdownRef}>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                  className={`w-full rounded-lg border shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm px-3 py-2 text-left bg-white flex items-center justify-between ${
                    validationErrors.estimatedDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <span className={estimatedDuration ? 'text-gray-900' : 'text-gray-400'}>
                    {estimatedDuration || 'Select duration'}
                  </span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </button>
                {showDurationDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    {durationOptions.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => {
                          setEstimatedDuration(duration);
                          setShowDurationDropdown(false);
                          if (validationErrors.estimatedDuration) {
                            setValidationErrors(prev => ({ ...prev, estimatedDuration: undefined }));
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {validationErrors.estimatedDuration && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.estimatedDuration}</p>
              )}
            </div>

            {/* Budget (Optional) */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Your Budget <span className="text-gray-500 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="text"
                  id="budget"
                  value={budget}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setBudget(value);
                  }}
                  placeholder="Enter your budget"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm pl-8 pr-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Describe Your Project / Task <span className="text-red-600">*</span>
            </label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => {
                setProjectDescription(e.target.value);
                if (validationErrors.projectDescription) {
                  setValidationErrors(prev => ({ ...prev, projectDescription: undefined }));
                }
              }}
              placeholder="Tell them what you need help with..."
              rows={4}
              className={`block w-full rounded-lg border shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm px-3 py-2 ${
                validationErrors.projectDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.projectDescription && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.projectDescription}</p>
            )}
          </div>
        </div>

        {/* Secure Booking Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Secure Booking</p>
              <p className="text-xs text-gray-600">
                Your payment is protected. Funds are only released when you approve the completed work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookNowModal;

