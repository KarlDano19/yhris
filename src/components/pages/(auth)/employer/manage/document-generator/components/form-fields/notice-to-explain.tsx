import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';
import { DatePickerField } from './DatePickerField';

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
    id="date"
    label="Date"
    name="date"
    value={formData.date}
    handleInputChange={handleInputChange as any}
    required={true}
    disabled={disabled}
    isSubmitted={isSubmitted}
  />
);

export const PlaceField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => {
  const [showValidation, setShowValidation] = useState(false);
  
  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.place);
  }, [isSubmitted, formData.place]);
  
  return (
    <div className="mb-4">
      <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
        Place <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="place"
        name="place"
        placeholder="Enter place"
        value={formData.place}
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

export const IncidentDateField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => (
  <DatePickerField 
    id="incidentDate"
    label="Date of Incident"
    name="incidentDate"
    value={formData.incidentDate}
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
        value={formData.incidentPlace}
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
  
  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.briefBackground);
  }, [isSubmitted, formData.briefBackground]);
  
  return (
    <div className="mb-4">
      <label htmlFor="briefBackground" className="block text-sm font-medium text-gray-700 mb-1">
        Brief Background <span className="text-red-500">*</span>
      </label>
      <textarea
        id="briefBackground"
        name="briefBackground"
        placeholder="Enter brief background"
        value={formData.briefBackground}
        onChange={handleInputChange}
        rows={4}
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

export const PreparedByField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="mb-4">
    <label htmlFor="preparedBy" className="block text-sm font-medium text-gray-700 mb-1">
      Prepared By
    </label>
    <input
      type="text"
      id="preparedBy"
      name="preparedBy"
      value={formData.preparedBy}
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
      value={formData.reviewedBy}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      placeholder="Enter reviewer's name"
      disabled={disabled}
    />
  </div>
);

export const EmployeeExplanationField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="sm:col-span-2">
    <label htmlFor="employeeExplanation" className="block mb-2 text-black">
      Employee Explanation
    </label>
    <textarea
      id="employeeExplanation"
      name="employeeExplanation"
      value={formData.employeeExplanation || ''}
      onChange={handleInputChange}
      rows={4}
      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      placeholder="Employee's explanation will be written here"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
      disabled={disabled}
    />
  </div>
);

export const HearingNotesField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="sm:col-span-2">
    <label htmlFor="hearingNotes" className="block mb-2 text-black">
      Hearing Notes
    </label>
    <textarea
      id="hearingNotes"
      name="hearingNotes"
      value={formData.hearingNotes || ''}
      onChange={handleInputChange}
      rows={4}
      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      placeholder="Notes from the hearing"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
      disabled={disabled}
    />
  </div>
);

export const ManagementDecisionField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div className="sm:col-span-2">
    <label htmlFor="managementDecision" className="block mb-2 text-black">
      Management Decision
    </label>
    <textarea
      id="managementDecision"
      name="managementDecision"
      value={formData.managementDecision || ''}
      onChange={handleInputChange}
      rows={4}
      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      placeholder="Management's decision will be written here"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
      disabled={disabled}
    />
  </div>
); 