'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import SignatureModal from '@/components/pages/(auth)/employer/manage/document-generator/modals/SignatureModal';

import { T_MemoFormData } from './AcceptanceMemoPreview';

const CHECK_LABELS = [
  { key: 'systemSetup' as const, label: 'System Setup Completed' },
  { key: 'employeeData' as const, label: 'Employee Data Successfully Uploaded / Encoded' },
  { key: 'systemConfig' as const, label: 'System Configuration Verified' },
  { key: 'userTraining' as const, label: 'User Training and Orientation Completed' },
  { key: 'systemNavigation' as const, label: 'System Navigation and Basic Workflows Tested' },
];

type Props = {
  formData: T_MemoFormData;
  onChange: (data: T_MemoFormData) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
};

const AcceptanceMemoForm = ({ formData, onChange, onSubmit, onReset, isSubmitting }: Props) => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const allChecked = Object.values(formData.checks).every(Boolean);
  const canSubmit =
    allChecked &&
    formData.companyName.trim() &&
    formData.startDate &&
    formData.endDate &&
    formData.authorityName.trim() &&
    formData.authorityPosition.trim() &&
    formData.authorityDate;

  const handleChange = (field: keyof Omit<T_MemoFormData, 'checks' | 'signature'>, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const handleCheckChange = (key: keyof T_MemoFormData['checks']) => {
    onChange({ ...formData, checks: { ...formData.checks, [key]: !formData.checks[key] } });
  };

  const handleSignatureSave = (signatureData: string | File) => {
    const sig = typeof signatureData === 'string' ? signatureData : URL.createObjectURL(signatureData);
    onChange({ ...formData, signature: sig });
    setIsSignatureModalOpen(false);
  };

  const handleSubmitClick = () => {
    setIsSubmitted(true);
    if (!canSubmit) {
      toast.custom(
        <CustomToast type='error' message='Please fill in all required fields and confirm all items.' />
      );
      return;
    }
    onSubmit();
  };

  const handleResetClick = () => {
    onReset();
    setIsSubmitted(false);
  };

  const inputClass = (value: string) =>
    `w-full p-2 sm:p-3 border rounded-md text-black text-sm sm:text-base ${
      isSubmitted && !value
        ? 'border-red-500 focus:ring-1 focus:ring-red-500 outline-none'
        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
    }`;

  return (
    <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto transition-all duration-300'>
      <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black'>Details</h2>

      <div className='space-y-5'>
        {/* Company Name */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Company / Firm / Institution <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder='Enter company name'
            className={inputClass(formData.companyName)}
          />
        </div>

        {/* Dates */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block mb-2 text-black font-semibold'>
              Starting Date <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={inputClass(formData.startDate)}
            />
          </div>
          <div>
            <label className='block mb-2 text-black font-semibold'>
              Ending Date <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={inputClass(formData.endDate)}
            />
          </div>
        </div>

        {/* Authority Name */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Full Name of Authorized Representative <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.authorityName}
            onChange={(e) => handleChange('authorityName', e.target.value)}
            placeholder='Enter full name'
            className={inputClass(formData.authorityName)}
          />
        </div>

        {/* Authority Position */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Position / Designation <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.authorityPosition}
            onChange={(e) => handleChange('authorityPosition', e.target.value)}
            placeholder='Enter position'
            className={inputClass(formData.authorityPosition)}
          />
        </div>

        {/* Authority Date */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Date <span className='text-red-500'>*</span>
          </label>
          <input
            type='date'
            value={formData.authorityDate}
            onChange={(e) => handleChange('authorityDate', e.target.value)}
            className={inputClass(formData.authorityDate)}
          />
        </div>

        {/* Signature */}
        <div>
          <label className='block mb-2 text-black font-semibold'>Signature</label>
          <div className='border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center'>
            {formData.signature ? (
              <div className='flex flex-col items-center w-full'>
                <img
                  src={formData.signature}
                  alt='Signature'
                  className='max-h-24 w-auto object-contain mb-3 sm:mb-4'
                />
                <button
                  type='button'
                  onClick={() => setIsSignatureModalOpen(true)}
                  className='text-blue-500 text-xs sm:text-sm hover:underline'
                >
                  Change Signature
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => setIsSignatureModalOpen(true)}
                className='flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='36'
                  height='36'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='sm:w-12 sm:h-12 text-gray-400'
                >
                  <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'></path>
                  <polyline points='10 17 15 12 10 7'></polyline>
                  <line x1='15' y1='12' x2='3' y2='12'></line>
                </svg>
                <span className='hover:underline text-sm sm:text-base text-center text-blue-500'>
                  Click to add signature
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation checkboxes */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Confirm all of the following <span className='text-red-500'>*</span>
          </label>
          <div className='space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3'>
            {CHECK_LABELS.map(({ key, label }) => (
              <label key={key} className='flex items-start gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={formData.checks[key]}
                  onChange={() => handleCheckChange(key)}
                  className='mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-xs text-gray-700'>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-between mt-6 sm:mt-8'>
          {/* Reset */}
          <button
            type='button'
            onClick={handleResetClick}
            className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-blue-500 text-blue-500 bg-white rounded-full hover:bg-blue-50 w-full sm:w-auto transition-colors duration-300'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='sm:w-5 sm:h-5'
            >
              <path d='M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38' />
            </svg>
            Reset Form
          </button>

          {/* Submit */}
          <button
            type='button'
            onClick={handleSubmitClick}
            disabled={isSubmitting}
            className='flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-[#355FD0] hover:bg-blue-700 text-white rounded-full w-full sm:w-auto mt-3 sm:mt-0 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {isSubmitting ? (
              <svg
                className='animate-spin sm:w-5 sm:h-5 w-4 h-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='sm:w-5 sm:h-5'
                >
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                Submit Acceptance Memo
              </>
            )}
          </button>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />
    </div>
  );
};

export default AcceptanceMemoForm;
