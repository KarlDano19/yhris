import { FieldProps } from './common';

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

export const EndDateField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      End Date
    </label>
    <input
      type="date"
      name="endDate"
      value={(formData as EmployeeCertificateFormData).endDate || ''}
      onChange={handleInputChange}
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
    />
  </div>
);

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