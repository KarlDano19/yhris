import { FieldProps } from './common';

import { EmploymentAgreementFormData } from '@/types/document-generator/documents';

export const CompanyAddressField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Company Address
    </label>
    <input
      type="text"
      name="companyAddress"
      value={(formData as EmploymentAgreementFormData).companyAddress || ''}
      onChange={handleInputChange}
      placeholder="Enter company address"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
    />
  </div>
);

export const ProbationPeriodField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Probation Period (months) <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      disabled
      name="probationPeriod"
      value={(formData as EmploymentAgreementFormData).probationPeriod || ''}
      onChange={handleInputChange}
      min="1"
      max="12"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base cursor-not-allowed"
      placeholder="Enter probation period in months"
      required
    />
  </div>
);

export const WorkingHoursField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Working Hours Per Day <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="workingHours"
      value={(formData as EmploymentAgreementFormData).workingHours || ''}
      onChange={handleInputChange}
      min="1"
      max="24"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Enter working hours per day"
      required
    />
  </div>
);

export const DailySalaryField = ({ formData, handleInputChange }: FieldProps) => (
  <div>
    <label className="block mb-2 text-black">
      Daily Salary (PHP) <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="dailySalary"
      value={(formData as EmploymentAgreementFormData).dailySalary || ''}
      onChange={handleInputChange}
      min="0"
      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-black text-sm sm:text-base"
      placeholder="Enter daily salary in PHP"
      required
    />
  </div>
); 