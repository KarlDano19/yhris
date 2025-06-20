import { ChangeEvent } from 'react';
import Image from 'next/image';

import DropDownArrow from '@/svg/DropDownArrow';

import { DocumentType } from '@/types/document-generator/form';
import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';
import DatePickerField from './DatePickerField';

export interface FieldProps {
  formData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface DocumentTypeFieldProps extends FieldProps {
  documentType: DocumentType;
}

export const DocumentTypeField = ({ documentType, handleInputChange }: DocumentTypeFieldProps) => (
  <div className="mb-6">
    <label className="block mb-2 text-black font-semibold">
      Document Type <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        name="documentType"
        value={documentType}
        onChange={handleInputChange}
        className="rounded-md appearance-none w-full border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
        required
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
}

export const LetterheadField = ({ formData, letterheadDisplayName, onOpenLetterheadModal }: LetterheadFieldProps) => (
  <div className="mb-4 sm:mb-6">
    <label className="block mb-2 text-black">
      Letterhead Image <span className="text-xs sm:text-sm text-gray-500">(A4 portrait bond paper size)</span>
    </label>
    
    <div className="border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center">
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
            <button 
              onClick={onOpenLetterheadModal}
              className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
            >
              Change Letterhead
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={onOpenLetterheadModal}
          className="flex flex-col items-center justify-center gap-2 py-2 sm:py-3"
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

export const ColorField = ({ colorValue, handleInputChange }: ColorFieldProps) => (
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
      />
      <input
        type="text"
        name="borderColor"
        value={colorValue}
        onChange={handleInputChange}
        placeholder="#FFC107"
        className="w-24 sm:w-32 p-2 border border-gray-300 rounded-md text-black text-xs sm:text-sm"
      />
      <div className="w-full flex-1 border-b-2 rounded mt-1 sm:mt-0" style={{ borderColor: colorValue }}></div>
    </div>
  </div>
);

interface CommonFieldsProps extends FieldProps {
  documentType: DocumentType;
}

export const CommonFields = ({ formData, handleInputChange, documentType }: CommonFieldsProps) => (
  <>
    <div>
      <label className="block mb-2 text-black">
        Employee Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="employeeName"
        value={formData.employeeName}
        onChange={handleInputChange}
        placeholder="Enter employee's full name"
        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
        required
      />
    </div>

    {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
      <div>
        <label className="block mb-2 text-black">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          value={(formData as EmployeeCertificateFormData | EmploymentAgreementFormData).companyName || ''}
          onChange={handleInputChange}
          placeholder="Enter company name"
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
          required
        />
      </div>
    )}
    
    <div>
      <label className="block mb-2 text-black">
        Position/Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="position"
        value={formData.position}
        onChange={handleInputChange}
        placeholder="Enter position or title"
        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
        required
      />
    </div>
    
    {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
      <DatePickerField
        id="startDate"
        label="Start Date"
        name="startDate"
        value={(formData as EmployeeCertificateFormData | EmploymentAgreementFormData).startDate}
        handleInputChange={handleInputChange}
        required={true}
      />
    )}
  </>
);

export const DateIssuanceField = ({ formData, handleInputChange }: FieldProps) => (
  <DatePickerField
    id="dateOfIssuance"
    label="Date of Issuance"
    name="dateOfIssuance"
    value={formData.dateOfIssuance}
    handleInputChange={handleInputChange}
    required={true}
  />
);

export const PlaceIssuanceField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Place of Issuance
    </label>
    <input
      type="text"
      name="placeOfIssuance"
      value={formData.placeOfIssuance}
      onChange={handleInputChange}
      placeholder="Enter place of issuance (e.g., city)"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
    />
  </div>
);

export const SignatoryNameField = ({ formData, handleInputChange }: FieldProps) => (
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
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      required
    />
  </div>
);

export const SignatoryPositionField = ({ formData, handleInputChange }: FieldProps) => (
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
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      required
    />
  </div>
);

interface SignatureFieldProps extends FieldProps {
  onOpenSignatureModal: () => void;
}

export const SignatureField = ({ formData, onOpenSignatureModal }: SignatureFieldProps) => (
  <div className="mt-4 sm:mt-6">
    <label className="block mb-2 text-black">
      Signature <span className="text-red-500">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center">
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
          <button 
            onClick={onOpenSignatureModal}
            className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
          >
            Change Signature
          </button>
        </div>
      ) : (
        <button 
          onClick={onOpenSignatureModal}
          className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3"
          data-signature-button
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 sm:w-12 sm:h-12">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span className="text-blue-500 hover:underline focus:outline-none text-sm sm:text-base text-center">
            Click to add signature
          </span>
        </button>
      )}
    </div>
  </div>
);

interface ActionButtonsProps {
  handleReset: () => void;
  onPrint: () => void;
}

export const ActionButtons = ({ handleReset, onPrint }: ActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-between mt-6 sm:mt-8">
    <button
      onClick={handleReset}
      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-blue-500 text-blue-500 bg-white rounded-full hover:bg-blue-50 w-full sm:w-auto"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
        <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/>
      </svg>
      Reset Form
    </button>
    
    <button
      onClick={onPrint}
      className="flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-full sm:w-auto mt-3 sm:mt-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
        <path d="M6 9V2h12v7"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <path d="M6 14h12v8H6z"/>
      </svg>
      Print / Save as PDF
    </button>
  </div>
); 