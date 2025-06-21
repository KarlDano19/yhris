import { FieldProps } from './Common';
import { DatePickerField } from './DatePickerField';
import { useState, useEffect } from 'react';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';

export const DocumentTitleField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="mb-4 sm:mb-6">
    <label className="block mb-2 text-black">
      Document Title <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center">
      <input
        type="text"
        name="documentTitle"
        value={(formData as EmployeeCertificateFormData).documentTitle || ''}
        onChange={handleInputChange}
        placeholder="Document"
        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
        required
      />
    </div>
  </div>
);

export const EndDateField = ({ formData, handleInputChange, disabled }: FieldProps) => {
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const certData = formData as EmployeeCertificateFormData;
  
  // Validate dates whenever start date or end date changes
  useEffect(() => {
    if (certData.startDate && certData.endDate) {
      const startDate = new Date(certData.startDate);
      const endDate = new Date(certData.endDate);
      setIsInvalidDate(endDate < startDate);
    } else {
      setIsInvalidDate(false);
    }
  }, [certData.startDate, certData.endDate]);

  return (
    <DatePickerField
      id="endDate"
      label="End Date"
      name="endDate"
      value={certData.endDate}
      handleInputChange={handleInputChange}
      required={false}
      disabled={disabled}
      className={isInvalidDate ? 'date-error' : ''}
      customValidation={isInvalidDate}
    />
  );
};

export const PurposeField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="sm:col-span-2">
    <label className="block mb-2 text-black">
      Purpose
    </label>
    <textarea
      name="purpose"
      value={(formData as EmployeeCertificateFormData).purpose || ''}
      onChange={handleInputChange}
      placeholder="Enter purpose of this document"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md h-20 sm:h-24 text-black text-sm sm:text-base"
    ></textarea>
  </div>
); 