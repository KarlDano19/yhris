'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';
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
} from './form-fields/Common';

// Import document-specific fields
import {
  EndDateField,
  PurposeField
} from './form-fields/EmployeeCertificate';

// Import employment-agreement-specific fields
import {
  CompanyAddressField,
  ProbationPeriodField,
  WorkingHoursField,
  DailySalaryField
} from './form-fields/EmploymentAgreement';

// Import notice-to-explain-specific fields
import {
  LogoField,
  DateField,
  CompanyNameField,
  IncidentDateField,
  IncidentPlaceField,
  BriefBackgroundField,
  PreparedByField,
  ReviewedByField,
} from './form-fields/NoticeToExplain';

// Import DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

export default function Form({
  documentType,
  onDocumentTypeChange,
  onFormChange,
  initialData,
  onPrint,
  onOpenSignatureModal,
  onOpenLetterheadModal,
  onOpenLogoModal,
  onProceed,
  isDocumentTypeDisabled,
  isFormDisabled,
  isFieldDisabled
}: FormProps) {
  const [formData, setFormData] = useState<EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData>(initialData);
  
  // Local state for color to prevent lag
  const [colorValue, setColorValue] = useState(
    documentType === 'employee-certificate' ? 
    (formData as EmployeeCertificateFormData).borderColor : 
    documentType === 'notice-to-explain' ? 
    (formData as NoticeToExplainFormData).borderColor : 
    '#FFC107'
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  // Add a key state to force complete re-render of form fields
  const [formKey, setFormKey] = useState(0);
  
  // Get cached profile data for company name
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);

  // Update local formData when initialData changes from parent
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (documentType === 'employee-certificate') {
        setColorValue((initialData as EmployeeCertificateFormData).borderColor);
      } else if (documentType === 'notice-to-explain') {
        setColorValue((initialData as NoticeToExplainFormData).borderColor);
      }
    }
  }, [initialData, documentType]);
  
  // Populate company name from cached profile data
  useEffect(() => {
    const profileData = cachedProfile?.state?.data as { name?: string };
    if (profileData?.name) {
      const companyName = profileData.name;
      
      // Update form data based on document type
      if (documentType === 'employee-certificate') {
        const updatedData = {
          ...formData,
          companyName: companyName
        };
        setFormData(updatedData);
        onFormChange(updatedData);
      } else if (documentType === 'employment-agreement') {
        const updatedData = {
          ...formData,
          companyName: companyName
        };
        setFormData(updatedData);
        onFormChange(updatedData);
      } else if (documentType === 'notice-to-explain') {
        const updatedData = {
          ...formData,
          companyName: companyName
        };
        setFormData(updatedData);
        onFormChange(updatedData);
      }
    }
  }, [cachedProfile, documentType, formData, onFormChange]);
  
  // Debounce effect for color changes
  useEffect(() => {
    if (documentType !== 'employee-certificate' && documentType !== 'notice-to-explain') return;
    
    const timer = setTimeout(() => {
      if (documentType === 'employee-certificate') {
        const certData = formData as EmployeeCertificateFormData;
        if (colorValue !== certData.borderColor) {
          const updatedData = {
            ...formData,
            borderColor: colorValue
          };
          setFormData(updatedData);
          onFormChange(updatedData);
        }
      } else if (documentType === 'notice-to-explain') {
        const noticeData = formData as NoticeToExplainFormData;
        if (colorValue !== noticeData.borderColor) {
          const updatedData = {
            ...formData,
            borderColor: colorValue
          };
          setFormData(updatedData);
          onFormChange(updatedData);
        }
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [colorValue, formData, onFormChange, documentType]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle document type change
    if (name === 'documentType') {
      // Reset validation state when changing document type
      setIsSubmitted(false);
      // Increment form key to force re-render of all fields with clean validation
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

    // For notice-to-explain, sync employee name to received by if received by is empty
    if (documentType === 'notice-to-explain' && name === 'employeeName' && 
        'receivedBy' in formData) {
      const noticeData = formData as NoticeToExplainFormData;
      if (!noticeData.receivedBy || noticeData.receivedBy === noticeData.employeeName) {
        updatedData = {
          ...updatedData,
          receivedBy: value
        };
      }
    }
    
    // Check for date validation when changing endDate for employee certificate
    if (documentType === 'employee-certificate' && name === 'endDate' && value) {
      const certData = formData as EmployeeCertificateFormData;
      if (certData.startDate) {
        const startDate = new Date(certData.startDate);
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
    // Set isSubmitted to true to show validation errors
    setIsSubmitted(true);
    
    // Common validation for all document types
    if (!formData.employeeName || !formData.position) {
      toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
      return false;
    }
    
    // Document type specific validation
    if (documentType === 'employee-certificate') {
      const certData = formData as EmployeeCertificateFormData;
      
      // Check required fields
      if (!certData.companyName || !certData.startDate || !certData.dateOfIssuance) {
        toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
        return false;
      }
      
      // Validate dates
      if (certData.startDate && certData.endDate) {
        const startDate = new Date(certData.startDate);
        const endDate = new Date(certData.endDate);
        
        if (endDate < startDate) {
          toast.custom(() => <CustomToast message="Invalid date: End date must be after start date" type="error" />);
          return false;
        }
      }
    } else if (documentType === 'employment-agreement') {
      const agreementData = formData as EmploymentAgreementFormData;
      
      // Check required fields
      if (!agreementData.companyName || !agreementData.startDate || !agreementData.dateOfIssuance) {
        toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
        return false;
      }
    } else if (documentType === 'notice-to-explain') {
      const noticeData = formData as NoticeToExplainFormData;
      
      // Check required fields for Notice to Explain
      if (!noticeData.employeeName || !noticeData.companyName || !noticeData.position || !noticeData.dateIssued || !noticeData.incidentDate || !noticeData.incidentPlace || !noticeData.briefBackground) {
        toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
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
    // First, set isSubmitted to false to remove validation highlighting
    setIsSubmitted(false);
    
    // Reset based on document type
    if (documentType === 'employee-certificate') {
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
      setColorValue('#FFC107'); // Make sure color picker is also reset
      onFormChange(resetData);
    } else if (documentType === 'employment-agreement') {
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
    } else if (documentType === 'notice-to-explain') {
      const resetData: NoticeToExplainFormData = {
        employeeName: '',
        position: '',
        dateIssued: '',
        companyName: '',
        dateOfIssuance: '',
        placeOfIssuance: '',
        signatoryName: '',
        signatoryPosition: '',
        incidentDate: '',
        incidentPlace: '',
        briefBackground: '',
        preparedBy: '',
        reviewedBy: '',
        receivedBy: '',
        employeeExplanation: '',
        hearingNotes: '',
        managementDecision: '',
        logoImage: null,
        sampleLogoPath: '',
        signature: null,
        borderColor: '#FFC107'
      };
      setFormData(resetData);
      setColorValue('#FFC107'); // Make sure color picker is also reset
      onFormChange(resetData);
    }

    // Force a complete re-render of all form fields by incrementing the key
    setFormKey(prevKey => prevKey + 1);
  };
  
  // Get letterhead display name
  const getLetterheadDisplayName = () => {
    if (documentType === 'employee-certificate') {
      if ('letterheadImage' in formData && formData.letterheadImage) {
        return "Custom Letterhead";
      }
      
      if ('sampleLetterheadPath' in formData && formData.sampleLetterheadPath) {
        return "Sample Letterhead";
      }
    }
    
    return null;
  };
  
  // Get logo display name for notice-to-explain
  const getLogoDisplayName = () => {
    if (documentType === 'notice-to-explain') {
      const noticeData = formData as NoticeToExplainFormData;
      if (noticeData.logoImage) {
        return "Custom Logo";
      }
      
      if (noticeData.sampleLogoPath) {
        return "Sample Logo";
      }
    }
    
    return null;
  };
  
  const letterheadDisplayName = getLetterheadDisplayName();
  const logoDisplayName = getLogoDisplayName();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto transition-all duration-300">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Details</h2>
      
      {/* Use the key to force re-render of all form fields */}
      <div key={formKey}>
        {/* Document Type Selector */}
        <DocumentTypeField 
          documentType={documentType} 
          formData={formData}
          handleInputChange={handleInputChange}
          disabled={isDocumentTypeDisabled} 
        />
        
        {/* Letterhead Section - Only show for document type */}
        {(documentType === 'employee-certificate') && (
          <LetterheadField 
            formData={formData as EmployeeCertificateFormData}
            letterheadDisplayName={letterheadDisplayName}
            handleInputChange={handleInputChange}
            onOpenLetterheadModal={onOpenLetterheadModal}
            disabled={isFormDisabled}
          />
        )}
        
        {/* Logo Section - Only show for notice-to-explain */}
        {documentType === 'notice-to-explain' && (
          <LogoField 
            formData={formData as NoticeToExplainFormData}
            logoDisplayName={logoDisplayName}
            handleInputChange={handleInputChange}
            onOpenLogoModal={onOpenLogoModal}
            disabled={isFormDisabled}
          />
        )}
        
        {/* Border Color - Only show for document type and notice-to-explain */}
        {(documentType === 'employee-certificate' || documentType === 'notice-to-explain') && (
          <ColorField 
            formData={formData}
            colorValue={colorValue}
            handleInputChange={handleInputChange}
            disabled={isFormDisabled}
          />
        )}
        
        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <CommonFields 
            formData={formData}
            handleInputChange={handleInputChange}
            documentType={documentType}
            disabled={isFieldDisabled ? isFieldDisabled('employeeName') : isFormDisabled}
            isSubmitted={isSubmitted}
          />
          
          {/* Employment Agreement specific field */}
          {documentType === 'employment-agreement' && (
            <CompanyAddressField 
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={isFormDisabled}
            />
          )}
          
          {/* Document-specific fields */}
          {documentType === 'employee-certificate' && (
            <EndDateField 
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={isFormDisabled}
              isSubmitted={isSubmitted}
            />
          )}
          
          {/* Employment Agreement specific fields */}
          {documentType === 'employment-agreement' && (
            <>
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
            </>
          )}
          
          {/* Notice to Explain specific fields */}
          {documentType === 'notice-to-explain' && (
            <>
              <DateField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={false}
                isSubmitted={isSubmitted}
              />
              <CompanyNameField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={false}
                isSubmitted={isSubmitted}
              />
              <IncidentDateField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={isFieldDisabled ? isFieldDisabled('incidentDate') : isFormDisabled}
                isSubmitted={isSubmitted}
              />
              <IncidentPlaceField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={isFieldDisabled ? isFieldDisabled('incidentPlace') : isFormDisabled}
                isSubmitted={isSubmitted}
              />
              {/* Make Brief Background take full width */}
              <div className="sm:col-span-2">
                <BriefBackgroundField 
                  formData={formData as NoticeToExplainFormData}
                  handleInputChange={handleInputChange}
                  // Brief background should remain editable
                  disabled={false}
                  isSubmitted={isSubmitted}
                />
              </div>
              {/* Place Prepared By and Reviewed By side by side */}
              <PreparedByField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={false}
              />
              <ReviewedByField 
                formData={formData as NoticeToExplainFormData}
                handleInputChange={handleInputChange}
                disabled={false}
              />
            </>
          )}
          
          {/* Document-specific field */}
          {documentType === 'employee-certificate' && (
            <PurposeField 
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={isFormDisabled}
            />
          )}
          
          {/* Common fields continued */}
          {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
            <>
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
            </>
          )}
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