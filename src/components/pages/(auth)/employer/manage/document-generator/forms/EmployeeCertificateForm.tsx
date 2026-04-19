import { useState, useEffect, ChangeEvent } from 'react';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { DocumentType, FormProps } from '@/types/document-generator/form';

// Import common form fields
import {
  DocumentTypeField,
  LetterheadField,
  ColorField,
  CommonFields,
  DateIssuanceField,
  PlaceIssuanceField,
  SignatoryNameField,
  SignatoryPositionField,
  SignatureField,
  ActionButtons
} from '../form-fields/Common';

// Import document-specific fields
import {
  EndDateField,
  PurposeField
} from '../form-fields/EmployeeCertificate';

// Import DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

interface EmployeeCertificateFormProps extends Omit<FormProps, 'initialData' | 'onFormChange' | 'onOpenLogoModal'> {
  initialData: EmployeeCertificateFormData;
  onFormChange: (data: EmployeeCertificateFormData) => void;
}

export default function EmployeeCertificateForm({
  documentType,
  onDocumentTypeChange,
  onFormChange,
  initialData,
  onPrint,
  onOpenSignatureModal,
  onOpenLetterheadModal,
  onProceed,
  isDocumentTypeDisabled,
  isFormDisabled,
  isFieldDisabled,
  showAcceptanceMemo,
}: EmployeeCertificateFormProps) {
  const [formData, setFormData] = useState<EmployeeCertificateFormData>(initialData);
  
  // Local state for color to prevent lag
  const [colorValue, setColorValue] = useState(formData.borderColor);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Update local formData when initialData changes from parent
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setColorValue(initialData.borderColor);
    }
  }, [initialData]);

  // Debounce effect for color changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (colorValue !== formData.borderColor) {
        const updatedData = {
          ...formData,
          borderColor: colorValue
        };
        setFormData(updatedData);
        onFormChange(updatedData);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [colorValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle document type change
    if (name === 'documentType') {
      setIsSubmitted(false);
      setFormKey(prevKey => prevKey + 1);
      onDocumentTypeChange(value as DocumentType);
      return;
    }
    
    // Handle color picker separately to prevent lag
    if (name === 'borderColor') {
      setColorValue(value);
      return;
    }
    
    // If field is disabled based on the isFieldDisabled function, don't allow changes
    if (isFieldDisabled && isFieldDisabled(name)) {
      return;
    }
    
    let updatedData = {
      ...formData,
      [name]: value
    };
    
    // Check for date validation when changing endDate
    if (name === 'endDate' && value) {
      if (formData.startDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(value);
        
        if (endDate < startDate) {
          toast.custom(() => <CustomToast message="Invalid date: End date must be after start date" type="error" />);
        }
      }
    }
    
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
    
    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        toast.custom(() => <CustomToast message="Invalid date: End date must be after start date" type="error" />);
        return false;
      }
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
    
    const resetData: EmployeeCertificateFormData = {
      employeeName: '',
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      purpose: '',
      dateOfIssuance: '',
      placeOfIssuance: '',
      signatoryName: '',
      signatoryPosition: '',
      letterheadImage: null,
      sampleLetterheadPath: '',
      signature: null,
      documentTitle: 'Certificate of Employment',
      borderColor: '#FFC107'
    };
    setFormData(resetData);
    setColorValue('#FFC107');
    onFormChange(resetData);
    setFormKey(prevKey => prevKey + 1);
  };
  
  // Get letterhead display name
  const getLetterheadDisplayName = () => {
    if (formData.letterheadImage) {
      return "Custom Letterhead";
    }
    
    if (formData.sampleLetterheadPath) {
      return "Sample Letterhead";
    }
    
    return null;
  };
  
  const letterheadDisplayName = getLetterheadDisplayName();

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
        
        {/* Letterhead Section */}
        <LetterheadField 
          formData={formData}
          letterheadDisplayName={letterheadDisplayName}
          handleInputChange={handleInputChange}
          onOpenLetterheadModal={onOpenLetterheadModal}
          disabled={isFormDisabled}
        />
        
        {/* Border Color */}
        <ColorField 
          formData={formData}
          colorValue={colorValue}
          handleInputChange={handleInputChange}
          disabled={isFormDisabled}
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
          
          <EndDateField 
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
            isSubmitted={isSubmitted}
          />
          
          <PurposeField 
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

