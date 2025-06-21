import { ChangeEvent, useState, useEffect } from 'react';

import Image from 'next/image';

import { DatePickerField } from './DatePickerField';

import { DocumentType } from '@/types/document-generator/form';
import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';

import DropDownArrow from '@/svg/DropDownArrow';

export interface FieldProps {
  formData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  isSubmitted?: boolean;
}

interface DocumentTypeFieldProps extends FieldProps {
  documentType: DocumentType;
}

export const DocumentTypeField = ({ documentType, handleInputChange, disabled }: DocumentTypeFieldProps) => (
  <div className="mb-6">
    <label className="block mb-2 text-black font-semibold">
      Document Type <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        name="documentType"
        value={documentType}
        onChange={handleInputChange}
        className={`rounded-md appearance-none w-full border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required
        disabled={disabled}
      >
        <option value="employee-certificate">Certificate of Employment (No Compensation)</option>
        <option value="employment-agreement">Employment Agreement</option>
        <option value="notice-to-explain">Notice to Explain</option>
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <DropDownArrow />
      </div>
    </div>
  </div>
);

interface LetterheadFieldProps {
  formData: EmployeeCertificateFormData;
  letterheadDisplayName: string | null;
  onOpenLetterheadModal: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const LetterheadField = ({ formData, letterheadDisplayName, onOpenLetterheadModal, disabled }: LetterheadFieldProps) => (
  <div className="mb-4 sm:mb-6">
    <label className="block mb-2 text-black">
      Letterhead Image <span className="text-xs sm:text-sm text-gray-500">(A4 portrait bond paper size)</span>
    </label>
    
    <div className={`border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
      {letterheadDisplayName ? (
        <div className="flex flex-col items-center w-full">
          <Image 
            src={formData.letterheadImage 
              ? URL.createObjectURL(formData.letterheadImage)
              : formData.sampleLetterheadPath || ''} 
            alt="Letterhead Preview" 
            width={200}
            height={100}
            style={{ maxHeight: '10rem', width: 'auto', objectFit: 'contain' }}
            className="mb-3 sm:mb-4"
            unoptimized={true}
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-green-600">
              {letterheadDisplayName}
            </p>
            {!disabled && (
              <button 
                onClick={onOpenLetterheadModal}
                className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
              >
                Change Letterhead
              </button>
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={onOpenLetterheadModal}
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
            Click to select or upload a letterhead image
          </span>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">Choose from samples or upload your own</p>
        </button>
      )}
    </div>
  </div>
);

interface ColorFieldProps extends FieldProps {
  colorValue: string;
}

export const ColorField = ({ colorValue, handleInputChange, disabled }: ColorFieldProps) => (
  <div className="mb-4 sm:mb-6">
    <label className="block mb-2 text-black">
      Decorative Border Color
    </label>
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
      <input
        type="color"
        name="borderColor"
        value={colorValue}
        onChange={handleInputChange}
        className="w-10 h-8 sm:w-12 border border-gray-300 rounded cursor-pointer"
        disabled={disabled}
      />
      <input
        type="text"
        name="borderColor"
        value={colorValue}
        onChange={handleInputChange}
        placeholder="#FFC107"
        className={`w-24 sm:w-32 p-2 border border-gray-300 rounded-md text-black text-xs sm:text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        disabled={disabled}
      />
      <div className="w-full flex-1 border-b-2 rounded mt-1 sm:mt-0" style={{ borderColor: colorValue }}></div>
    </div>
  </div>
);

interface CommonFieldsProps {
  formData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  documentType: DocumentType;
  disabled?: boolean;
  isSubmitted?: boolean;
}

export function CommonFields({
  formData,
  handleInputChange,
  documentType,
  disabled = false,
  isSubmitted = false,
}: CommonFieldsProps) {
  // Get the correct employeeName and position based on document type
  let employeeName = '';
  let position = '';
  let companyName = '';
  let startDate = '';
  
  if (documentType === 'employee-certificate') {
    const certData = formData as EmployeeCertificateFormData;
    employeeName = certData.employeeName;
    position = certData.position;
    companyName = certData.companyName;
    startDate = certData.startDate;
  } else if (documentType === 'employment-agreement') {
    const agreementData = formData as EmploymentAgreementFormData;
    employeeName = agreementData.employeeName;
    position = agreementData.position;
    companyName = agreementData.companyName;
    startDate = agreementData.startDate;
  } else if (documentType === 'notice-to-explain') {
    const noticeData = formData as NoticeToExplainFormData;
    employeeName = noticeData.employeeName;
    position = noticeData.position;
  }

  // Add local state for validation
  const [showEmployeeNameValidation, setShowEmployeeNameValidation] = useState(false);
  const [showPositionValidation, setShowPositionValidation] = useState(false);
  
  // Update validation state when isSubmitted or field values change
  useEffect(() => {
    setShowEmployeeNameValidation(isSubmitted === true && !employeeName);
    setShowPositionValidation(isSubmitted === true && !position);
  }, [isSubmitted, employeeName, position]);

  return (
    <>
      <div className="mb-4">
        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
          Employee Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="employeeName"
          name="employeeName"
          value={employeeName}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md ${
            disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
          } ${
            showEmployeeNameValidation
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
          placeholder="Enter employee name"
          required
          disabled={disabled}
        />
      </div>
      
      {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${
              disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter company name"
            required
            disabled={disabled}
          />
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position/Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={position}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md ${
            disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
          } ${
            showPositionValidation
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
          placeholder="Enter position or title"
          required
          disabled={disabled}
        />
      </div>
      
      {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
        <DatePickerField
          id="startDate"
          label="Start Date"
          name="startDate"
          value={startDate}
          handleInputChange={handleInputChange}
          required={true}
          disabled={disabled}
          isSubmitted={isSubmitted}
        />
      )}
    </>
  );
}

export const DateIssuanceField = ({ formData, handleInputChange, disabled, isSubmitted }: FieldProps) => (
  <DatePickerField
    id="dateOfIssuance"
    label="Date of Issuance"
    name="dateOfIssuance"
    value={formData.dateOfIssuance}
    handleInputChange={handleInputChange}
    required={true}
    disabled={disabled}
    isSubmitted={isSubmitted}
  />
);

export const PlaceIssuanceField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Place of Issuance
    </label>
    <input
      type="text"
      name="placeOfIssuance"
      value={formData.placeOfIssuance}
      onChange={handleInputChange}
      placeholder="Enter place of issuance (e.g., city)"
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? 'bg-gray-100 text-gray-700' : 'bg-white'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      disabled={disabled}
    />
  </div>
);

export const SignatoryNameField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Signatory Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="signatoryName"
      value={formData.signatoryName}
      onChange={handleInputChange}
      placeholder="Enter name of signatory"
      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      required
      disabled={disabled}
    />
  </div>
);

export const SignatoryPositionField = ({ formData, handleInputChange, disabled }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Signatory Position <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="signatoryPosition"
      value={formData.signatoryPosition}
      onChange={handleInputChange}
      placeholder="Enter position of signatory"
      className={`w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      required
      disabled={disabled}
    />
  </div>
);

interface SignatureFieldProps extends FieldProps {
  onOpenSignatureModal: () => void;
  isSubmitted?: boolean;
}

export const SignatureField = ({ formData, onOpenSignatureModal, disabled, isSubmitted = false }: SignatureFieldProps) => {
  // Use local state to track validation
  const [showValidation, setShowValidation] = useState(false);
  
  // Update validation state when isSubmitted or signature changes
  useEffect(() => {
    setShowValidation(isSubmitted === true && !formData.signature);
  }, [isSubmitted, formData.signature]);

  const handleSignatureClick = () => {
    onOpenSignatureModal();
  };

  return (
    <div className="mt-4 sm:mt-6">
      <label className="block mb-2 text-black">
        Signature <span className="text-red-500">*</span>
      </label>
      <div className={`border-2 border-dashed rounded-md p-3 sm:p-6 flex flex-col items-center justify-center ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      } ${
        showValidation ? 'border-red-500' : 'border-gray-300'
      }`}>
        {formData.signature ? (
          <div className="flex flex-col items-center w-full">
            <Image 
              src={typeof formData.signature === 'string' 
                ? formData.signature 
                : URL.createObjectURL(formData.signature as File)} 
              alt="Signature Preview" 
              width={160}
              height={80}
              style={{ maxHeight: '6rem', width: 'auto', objectFit: 'contain' }}
              className="mb-3 sm:mb-4"
              unoptimized={true}
            />
            {!disabled && (
              <button 
                onClick={handleSignatureClick}
                className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
              >
                Change Signature
              </button>
            )}
          </div>
        ) : (
          <button 
            onClick={handleSignatureClick}
            className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3"
            data-signature-button
            disabled={disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`sm:w-12 sm:h-12 ${showValidation ? 'text-red-400' : 'text-gray-400'}`}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span className={`hover:underline focus:outline-none text-sm sm:text-base text-center ${showValidation ? 'text-red-500' : 'text-blue-500'}`}>
              Click to add signature
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

interface ActionButtonsProps {
  handleReset: () => void;
  onPrint: () => void;
  onProceed?: () => void;
}

export const ActionButtons = ({ handleReset, onPrint, onProceed }: ActionButtonsProps) => {
  const [printLoading, setPrintLoading] = useState(false);
  const [proceedLoading, setProceedLoading] = useState(false);

  const handlePrintClick = () => {
    setPrintLoading(true);
    
    // Set a timeout to turn off loading after 3 seconds
    setTimeout(() => {
      setPrintLoading(false);
      onPrint();
    }, 3000);
  };

  const handleProceedClick = () => {
    if (!onProceed) return;
    
    setProceedLoading(true);
    
    // Set a timeout to turn off loading after 3 seconds
    setTimeout(() => {
      setProceedLoading(false);
      onProceed();
    }, 3000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-between mt-6 sm:mt-8">
      <button
        onClick={handleReset}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-blue-500 text-blue-500 bg-white rounded-full hover:bg-blue-50 w-full sm:w-auto transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
          <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/>
        </svg>
        Reset Form
      </button>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <button
          onClick={handlePrintClick}
          disabled={printLoading}
          className={`flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 ${printLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full w-full sm:w-auto mt-3 sm:mt-0 transition-colors duration-300`}
        >
          {printLoading ? (
            <svg className="animate-spin sm:w-5 sm:h-5 w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
              <path d="M6 9V2h12v7"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <path d="M6 14h12v8H6z"/>
            </svg>
          )}
          {printLoading ? 'Printing...' : 'Print'}
        </button>
        
        {onProceed && (
          <button
            onClick={handleProceedClick}
            disabled={proceedLoading}
            className={`flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 ${proceedLoading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full w-full sm:w-auto mt-3 sm:mt-0 transition-colors duration-300`}
          >
            {proceedLoading ? (
              <svg className="animate-spin sm:w-5 sm:h-5 w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            )}
            {proceedLoading ? 'Processing...' : 'Proceed'}
          </button>
        )}
      </div>
    </div>
  );
}; 