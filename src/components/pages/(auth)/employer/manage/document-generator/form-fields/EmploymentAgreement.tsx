import { FieldProps } from './Common';

import { EmploymentAgreementFormData } from '@/types/document-generator/documents';

export const CompanyAddressField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Company Address
    </label>
    <input
      type="text"
      name="companyAddress"
      value={(formData as EmploymentAgreementFormData).companyAddress || ''}
      onChange={handleInputChange}
      placeholder="Enter company address"
      className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export const ProbationPeriodField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Probation Period (months) <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="probationPeriod"
      value={(formData as EmploymentAgreementFormData).probationPeriod || ''}
      onChange={handleInputChange}
      min="1"
      max="12"
      className="w-full px-3 py-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter probation period in months"
      required
    />
  </div>
);

export const WorkingHoursField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Working Hours Per Day <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="workingHours"
      value={(formData as EmploymentAgreementFormData).workingHours || ''}
      onChange={handleInputChange}
      min="1"
      max="24"
      className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter working hours per day"
      required
    />
  </div>
);

export const DailySalaryField = ({ formData, handleInputChange }: FieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Daily Salary (PHP) <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      name="dailySalary"
      value={(formData as EmploymentAgreementFormData).dailySalary || ''}
      onChange={handleInputChange}
      min="0"
      className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter daily salary in PHP"
      required
    />
  </div>
); 