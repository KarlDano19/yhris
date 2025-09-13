import { ChangeEvent, useEffect, useState } from 'react';

import Image from 'next/image';

import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { DatePickerField } from './DatePickerField';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';

interface FieldProps {
  formData: NoticeToExplainFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  isSubmitted?: boolean;
}

interface LogoFieldProps extends FieldProps {
  logoDisplayName: string | null;
  onOpenLogoModal: () => void;
}

export const LogoField = ({ formData, logoDisplayName, onOpenLogoModal, handleInputChange, disabled }: LogoFieldProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <label className="block mb-2 text-black">Logo</label>
      
      <div className={`border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
        {logoDisplayName ? (
          <div className="flex flex-col items-center w-full">
            <Image 
              src={formData.logoImage 
                ? URL.createObjectURL(formData.logoImage)
                : formData.sampleLogoPath} 
              alt="Logo Preview" 
              width={200}
              height={100}
              style={{ maxHeight: '10rem', width: 'auto', objectFit: 'contain' }}
              className="mb-3 sm:mb-4"
              unoptimized={formData.logoImage ? true : false}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-green-600">
                {logoDisplayName}
              </p>
              {!disabled && (
                <button 
                  onClick={onOpenLogoModal}
                  className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
                >
                  Change Logo
                </button>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={onOpenLogoModal}
            className="flex flex-col items-center justify-center gap-2 py-2 sm:py-3"
            disabled={disabled}
          >
            <div className="text-gray-400 mb-1 sm:mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-12 sm:h-12">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span className="text-blue-500 hover:underline focus:outline-none text-sm sm:text-base text-center">
              Click to select or upload a logo image
            </span>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">Choose from samples or upload your own</p>
          </button>
        )}
      </div>
    </div>
  );
};

export const DateField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => (
  <DatePickerField 
    id="dateIssued"
    label="Date Issued"
    name="dateIssued"
    value={formData.dateIssued ?? ''}
    handleInputChange={handleInputChange as any}
    required={true}
    disabled={disabled}
    isSubmitted={isSubmitted}
  />
);

export const IncidentDateField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => (
  <DatePickerField 
    id="incidentDate"
    label="Date of Incident"
    name="incidentDate"
    value={formData.incidentDate ?? ''}
    handleInputChange={handleInputChange as any}
    required={true}
    disabled={disabled}
    isSubmitted={isSubmitted}
  />
);

export const IncidentPlaceField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => {
  const [showValidation, setShowValidation] = useState(false);
  
  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.incidentPlace);
  }, [isSubmitted, formData.incidentPlace]);
  
  return (
    <div className="mb-4">
      <label htmlFor="incidentPlace" className="block text-sm font-medium text-gray-700 mb-1">
        Place of Incident <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="incidentPlace"
        name="incidentPlace"
        placeholder="Enter place of incident"
        value={formData.incidentPlace ?? ''}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 rounded-md border focus:outline-none transition-colors ${
          disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
        } ${
          showValidation
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        disabled={disabled}
      />
    </div>
  );
};

export const BriefBackgroundField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => {
  const [showValidation, setShowValidation] = useState(false);
  const maxLength = 430;
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.briefBackground);
  }, [isSubmitted, formData.briefBackground]);

  const handleBriefBackgroundChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Prevent excessive consecutive line breaks (more than 2)
    // Replace 3 or more consecutive line breaks with just 2
    value = value.replace(/\n{3,}/g, '\n\n');
    
    // Also prevent excessive spaces (more than 2 consecutive spaces)
    value = value.replace(/ {3,}/g, '  ');
    
    if (value.length <= maxLength) {
      // Reset the toast flag when back under the limit
      if (hasShownToast) setHasShownToast(false);
      
      // Update the input value if we modified it
      if (value !== e.target.value) {
        e.target.value = value;
      }
      
      handleInputChange(e);
    } else if (!hasShownToast) {
      // Show toast only once per limit exceeding attempt
      toast.custom(() => <CustomToast message={`Brief Background cannot exceed ${maxLength} characters.`} type="error" />);
      setHasShownToast(true);
      
      // Prevent further input by truncating the text
      const truncated = value.substring(0, maxLength);
      e.target.value = truncated;
      
      // Create a new event to pass the truncated value
      const newEvent = { ...e, target: { ...e.target, value: truncated, name: e.target.name } };
      handleInputChange(newEvent as any);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="briefBackground" className="block text-sm font-medium text-gray-700 mb-1">
        Brief Background <span className="text-red-500">*</span>
      </label>
      <textarea
        id="briefBackground"
        name="briefBackground"
        placeholder="Enter brief background"
        value={formData.briefBackground ?? ''}
        onChange={handleBriefBackgroundChange}
        rows={Math.max(4, Math.min(10, (formData.briefBackground || '').split('\n').length + 1))}
        maxLength={maxLength + 1}
        className={`w-full px-3 py-2 rounded-md border focus:outline-none transition-colors resize-none ${
          disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
        } ${
          showValidation
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        disabled={disabled}
      />
      <div className="text-xs text-gray-500 text-right mt-1">
        {(formData.briefBackground || '').length}/{maxLength} characters
      </div>
    </div>
  );
};

export const PreparedByField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="mb-4">
    <label htmlFor="preparedBy" className="block text-sm font-medium text-gray-700 mb-1">
      Prepared By
    </label>
    <input
      type="text"
      id="preparedBy"
      name="preparedBy"
      value={formData.preparedBy ?? ''}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      placeholder="Enter preparer's name"
      disabled={disabled}
    />
  </div>
);

export const ReviewedByField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="mb-4">
    <label htmlFor="reviewedBy" className="block text-sm font-medium text-gray-700 mb-1">
      Reviewed By
    </label>
    <input
      type="text"
      id="reviewedBy"
      name="reviewedBy"
      value={formData.reviewedBy ?? ''}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      placeholder="Enter reviewer's name"
      disabled={disabled}
    />
  </div>
);

export const CompanyNameField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => {
  const [showValidation, setShowValidation] = useState(false);
  
  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.companyName);
  }, [isSubmitted, formData.companyName]);
  
  return (
    <div className="mb-4">
      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
        Company Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="companyName"
        name="companyName"
        placeholder="Enter company name"
        value={formData.companyName ?? ''}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 rounded-md border focus:outline-none transition-colors ${
          disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
        } ${
          showValidation
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
        required
        disabled={disabled}
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}; 