import { ChangeEvent } from 'react';
import Image from 'next/image';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';
import DatePickerField from './DatePickerField';

interface FieldProps {
  formData: NoticeToExplainFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface LogoFieldProps extends FieldProps {
  logoDisplayName: string | null;
  onOpenLogoModal: () => void;
}

export const LogoField = ({ formData, logoDisplayName, onOpenLogoModal, handleInputChange }: LogoFieldProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <label className="block mb-2 text-black">Logo</label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 flex flex-col items-center justify-center">
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
              <button 
                onClick={onOpenLogoModal}
                className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
              >
                Change Logo
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={onOpenLogoModal}
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
              Click to select or upload a logo image
            </span>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">Choose from samples or upload your own</p>
          </button>
        )}
      </div>
    </div>
  );
};

export const DateField = ({ formData, handleInputChange }: FieldProps) => (
  <DatePickerField
    id="date"
    label="Date"
    name="date"
    value={formData.date}
    handleInputChange={handleInputChange}
    required={true}
  />
);

export const PlaceField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label htmlFor="place" className="block mb-2 text-black">
      Place
    </label>
    <input
      type="text"
      id="place"
      name="place"
      value={formData.place || ''}
      onChange={handleInputChange}
      placeholder="Enter place (e.g., Carmen)"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
    />
  </div>
);

export const IncidentDateField = ({ formData, handleInputChange }: FieldProps) => (
  <DatePickerField
    id="incidentDate"
    label="Date of Incident"
    name="incidentDate"
    value={formData.incidentDate}
    handleInputChange={handleInputChange}
    required={true}
  />
);

export const IncidentPlaceField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label htmlFor="incidentPlace" className="block mb-2 text-black">
      Place of Incident
    </label>
    <input
      type="text"
      id="incidentPlace"
      name="incidentPlace"
      value={formData.incidentPlace || ''}
      onChange={handleInputChange}
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Enter place of incident"
    />
  </div>
);

export const BriefBackgroundField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="sm:col-span-2">
    <label htmlFor="briefBackground" className="block mb-2 text-black">
      Brief Background
    </label>
    <textarea
      id="briefBackground"
      name="briefBackground"
      value={formData.briefBackground || ''}
      onChange={handleInputChange}
      rows={4}
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Enter brief background of the incident"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
    />
  </div>
);

export const PreparedByField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label htmlFor="preparedBy" className="block mb-2 text-black">
      Prepared By
    </label>
    <input
      type="text"
      id="preparedBy"
      name="preparedBy"
      value={formData.preparedBy || ''}
      onChange={handleInputChange}
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="HR Representative"
    />
  </div>
);

export const ReviewedByField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label htmlFor="reviewedBy" className="block mb-2 text-black">
      Reviewed By
    </label>
    <input
      type="text"
      id="reviewedBy"
      name="reviewedBy"
      value={formData.reviewedBy || ''}
      onChange={handleInputChange}
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="HR Manager"
    />
  </div>
);

export const EmployeeExplanationField = ({ formData, handleInputChange }: FieldProps) => (
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
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Employee's explanation will be written here"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
    />
  </div>
);

export const HearingNotesField = ({ formData, handleInputChange }: FieldProps) => (
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
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Notes from the hearing"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
    />
  </div>
);

export const ManagementDecisionField = ({ formData, handleInputChange }: FieldProps) => (
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
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Management's decision will be written here"
      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
    />
  </div>
); 