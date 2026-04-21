'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import 'react-datepicker/dist/react-datepicker.css';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import ViewPdfModal from '../modals/ViewPdfModal';

import { DocumentTypeField, SignatureField } from '../form-fields/Common';
import { DatePickerField } from '../form-fields/DatePickerField';

import { AcceptanceMemoFormData } from '@/types/document-generator/documents';
import { DocumentType, FormProps } from '@/types/document-generator/form';

export default function AcceptanceMemoDocGeneratorForm({
  documentType,
  onDocumentTypeChange,
  onFormChange,
  initialData,
  onOpenSignatureModal,
  onProceed,
  isDocumentTypeDisabled,
  isFormDisabled,
  isViewMode,
  showAcceptanceMemo,
}: FormProps) {
  const router = useRouter();
  const formData = initialData as AcceptanceMemoFormData;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'documentType') {
      onDocumentTypeChange(e.target.value as DocumentType);
      return;
    }
    onFormChange({ ...formData, [e.target.name]: e.target.value } as AcceptanceMemoFormData);
  };

  const canSubmit =
    formData.authorityName.trim() &&
    formData.authorityPosition.trim() &&
    formData.authorityDate;

  const handleSubmitClick = () => {
    setIsSubmitted(true);
    if (!canSubmit) {
      toast.custom(
        <CustomToast type='error' message='Please fill in all required fields.' />
      );
      return;
    }
    if (onProceed) onProceed();
  };

  const handleReset = () => {
    onFormChange({
      companyName: formData.companyName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      authorityName: '',
      authorityPosition: '',
      authorityDate: new Date().toISOString().split('T')[0],
      signature: null,
    } as AcceptanceMemoFormData);
    setIsSubmitted(false);
  };

  const inputClass = (value: string) =>
    `w-full p-2 sm:p-3 border rounded-md text-black text-sm sm:text-base ${
      isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
    } ${
      isSubmitted && !value && !isViewMode
        ? 'border-red-500 focus:ring-1 focus:ring-red-500 outline-none'
        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
    }`;

  return (
    <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto transition-all duration-300'>
      <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black'>Details</h2>

      <div className='space-y-5'>
        {/* Document Type Selector */}
        <DocumentTypeField
          formData={formData as any}
          documentType={documentType}
          handleInputChange={handleInputChange}
          disabled={isDocumentTypeDisabled}
          showAcceptanceMemo={showAcceptanceMemo}
        />

        {/* Authority Name */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Full Name of Authorized Representative <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='authorityName'
            value={formData.authorityName}
            onChange={handleInputChange}
            placeholder='Enter full name'
            className={inputClass(formData.authorityName)}
            disabled={isViewMode}
          />
        </div>

        {/* Authority Position */}
        <div>
          <label className='block mb-2 text-black font-semibold'>
            Position / Designation <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='authorityPosition'
            value={formData.authorityPosition}
            onChange={handleInputChange}
            placeholder='Enter position'
            className={inputClass(formData.authorityPosition)}
            disabled={isViewMode}
          />
        </div>

        {/* Authority Date */}
        <DatePickerField
          id='authorityDate'
          label='Date'
          name='authorityDate'
          value={formData.authorityDate}
          handleInputChange={handleInputChange as any}
          required
          disabled={isViewMode}
          isSubmitted={isSubmitted}
        />

        {/* Signature */}
        <SignatureField
          formData={formData as any}
          handleInputChange={handleInputChange}
          onOpenSignatureModal={onOpenSignatureModal!}
          disabled={isViewMode}
          isSubmitted={isSubmitted}
        />

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-between mt-6 sm:mt-8'>
          {!isViewMode && (
            <button
              type='button'
              onClick={handleReset}
              className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-blue-500 text-blue-500 bg-white rounded-full hover:bg-blue-50 w-full sm:w-auto transition-colors duration-300'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='sm:w-5 sm:h-5'>
                <path d='M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38' />
              </svg>
              Reset Form
            </button>
          )}

          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto'>
            {isViewMode ? (
              <button
                type='button'
                onClick={() => setShowPdfModal(true)}
                className='flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full sm:w-auto transition-colors duration-300'
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='sm:w-5 sm:h-5'>
                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/>
                  <polyline points='14 2 14 8 20 8'/>
                  <line x1='16' y1='13' x2='8' y2='13'/>
                  <line x1='16' y1='17' x2='8' y2='17'/>
                  <polyline points='10 9 9 9 8 9'/>
                </svg>
                View PDF
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSubmitClick}
                disabled={isFormDisabled}
                className='flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-[#355FD0] hover:bg-blue-700 text-white rounded-full w-full sm:w-auto mt-3 sm:mt-0 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='sm:w-5 sm:h-5'>
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                Submit Acceptance Memo
              </button>
            )}
          </div>
        </div>
      </div>

      <ViewPdfModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        onConfirm={() => router.push('/settings/acceptance-form')}
      />
    </div>
  );
}
