import { useState, useEffect, ChangeEvent } from 'react';

import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { DocumentType, FormProps } from '@/types/document-generator/form';

// Import common form fields
import {
  DocumentTypeField,
  CommonFields,
  DateIssuanceField,
  PlaceIssuanceField,
  SignatoryNameField,
  SignatoryPositionField,
  SignatureField,
  ActionButtons
} from '../form-fields/Common';

// Import employment-agreement-specific fields
import {
  CompanyAddressField,
  ProbationPeriodField,
  WorkingHoursField,
  DailySalaryField
} from '../form-fields/EmploymentAgreement';

// Import DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

interface EmploymentAgreementFormProps extends Omit<FormProps, 'initialData' | 'onFormChange' | 'onOpenLetterheadModal' | 'onOpenLogoModal'> {
  initialData: EmploymentAgreementFormData;
  onFormChange: (data: EmploymentAgreementFormData) => void;
}

export default function EmploymentAgreementForm({
  documentType,
  onDocumentTypeChange,
  onFormChange,
  initialData,
  onPrint,
  onOpenSignatureModal,
  onProceed,
  isDocumentTypeDisabled,
  isFormDisabled,
  isFieldDisabled,
  showAcceptanceMemo,
}: EmploymentAgreementFormProps) {
  const [formData, setFormData] = useState<EmploymentAgreementFormData>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Update local formData when initialData changes from parent
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle document type change
    if (name === 'documentType') {
      setIsSubmitted(false);
      setFormKey(prevKey => prevKey + 1);
      onDocumentTypeChange(value as DocumentType);
      return;
    }
    
    // If field is disabled based on the isFieldDisabled function, don't allow changes
    if (isFieldDisabled && isFieldDisabled(name)) {
      return;
    }
    
    const updatedData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  // Helper function to validate form data
  const validateForm = (): boolean => {
    setIsSubmitted(true);
    
    if (!formData.employeeName || !formData.position || !formData.companyName || 
        !formData.startDate || !formData.dateOfIssuance || !formData.signatoryName || 
        !formData.signatoryPosition) {
      toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
      return false;
    }
    
    return true;
  };

  const handlePrint = () => {
    if (!validateForm()) {
      return;
    }
    
    onPrint();
  };

  const handleProceed = () => {
    if (!validateForm()) {
      return;
    }
    
    if (onProceed) {
      onProceed();
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    
    const resetData: EmploymentAgreementFormData = {
      employeeName: '',
      companyName: '',
      position: '',
      startDate: '',
      probationPeriod: '6',
      workingHours: '8',
      dailySalary: '1',
      dateOfIssuance: '',
      placeOfIssuance: '',
      signatoryName: '',
      signatoryPosition: '',
      companyAddress: '',
      signature: null
    };
    setFormData(resetData);
    onFormChange(resetData);
    setFormKey(prevKey => prevKey + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto transition-all duration-300">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Details</h2>
      
      <div key={formKey}>
        {/* Document Type Selector */}
        <DocumentTypeField
          documentType={documentType}
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={isDocumentTypeDisabled}
          showAcceptanceMemo={showAcceptanceMemo}
        />
        
        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <CommonFields 
            formData={formData}
            handleInputChange={handleInputChange}
            documentType={documentType}
            disabled={isFieldDisabled ? isFieldDisabled('employeeName') : isFormDisabled}
            isSubmitted={isSubmitted}
          />
          
          <CompanyAddressField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
          
          <ProbationPeriodField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
          
          <WorkingHoursField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
          
          <DailySalaryField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
          
          <DateIssuanceField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
            isSubmitted={isSubmitted}
          />
          
          <PlaceIssuanceField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
          
          <SignatoryNameField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
            isSubmitted={isSubmitted}
          />
          
          <SignatoryPositionField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
            isSubmitted={isSubmitted}
          />
        </div>
        
        {/* Signature Section */}
        <SignatureField 
          formData={formData}
          handleInputChange={handleInputChange}
          onOpenSignatureModal={onOpenSignatureModal}
          disabled={isFormDisabled}
          isSubmitted={isSubmitted}
        />
      </div>
      
      {/* Action Buttons */}
      <ActionButtons 
        handleReset={handleReset}
        onPrint={handlePrint}
        onProceed={onProceed ? handleProceed : undefined}
      />
    </div>
  );
}

