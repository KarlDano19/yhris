'use client';

import { useState, useEffect, ChangeEvent } from 'react';

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
} from '../components/pages/(auth)/employer/manage/document-generator/components/form-fields/common';

// Import document-specific fields
import {
  EndDateField,
  PurposeField
} from '../components/pages/(auth)/employer/manage/document-generator/components/form-fields/employee-certificate';

// Import employment-agreement-specific fields
import {
  CompanyAddressField,
  ProbationPeriodField,
  WorkingHoursField,
  DailySalaryField
} from '../components/pages/(auth)/employer/manage/document-generator/components/form-fields/employment-agreement';

// Import notice-to-explain-specific fields
import {
  LogoField,
  DateField,
  PlaceField,
  IncidentDateField,
  IncidentPlaceField,
  BriefBackgroundField,
  PreparedByField,
  ReviewedByField,
  ReceivedByField
} from '../components/pages/(auth)/employer/manage/document-generator/components/form-fields/notice-to-explain';

// Import DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

export default function Form({
  documentType,
  onDocumentTypeChange,
  onFormChange,
  initialData,
  onPrint,
  onOpenSignatureModal,
  onOpenLetterheadModal,
  onOpenLogoModal
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
      onDocumentTypeChange(value as DocumentType);
      return;
    }
    
    // Handle color picker separately to prevent lag
    if (name === 'borderColor') {
      setColorValue(value);
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
    
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  const handleReset = () => {
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
        date: '',
        place: '',
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
      onFormChange(resetData);
    }
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
      
      {/* Document Type Selector */}
      <DocumentTypeField 
        documentType={documentType} 
        formData={formData}
        handleInputChange={handleInputChange} 
      />
      
      {/* Letterhead Section - Only show for document type */}
      {(documentType === 'employee-certificate') && (
        <LetterheadField 
          formData={formData as EmployeeCertificateFormData}
          letterheadDisplayName={letterheadDisplayName}
          handleInputChange={handleInputChange}
          onOpenLetterheadModal={onOpenLetterheadModal}
        />
      )}
      
      {/* Logo Section - Only show for notice-to-explain */}
      {documentType === 'notice-to-explain' && (
        <LogoField 
          formData={formData as NoticeToExplainFormData}
          logoDisplayName={logoDisplayName}
          handleInputChange={handleInputChange}
          onOpenLogoModal={onOpenLogoModal}
        />
      )}
      
      {/* Border Color - Only show for document type and notice-to-explain */}
      {(documentType === 'employee-certificate' || documentType === 'notice-to-explain') && (
        <ColorField 
          formData={formData}
          colorValue={colorValue}
          handleInputChange={handleInputChange}
        />
      )}
      
      {/* Common Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <CommonFields 
          formData={formData}
          handleInputChange={handleInputChange}
          documentType={documentType}
        />
        
        {/* Employment Agreement specific field */}
        {documentType === 'employment-agreement' && (
          <CompanyAddressField 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        
        {/* Document-specific fields */}
        {documentType === 'employee-certificate' && (
          <EndDateField 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        
        {/* Employment Agreement specific fields */}
        {documentType === 'employment-agreement' && (
          <>
            <ProbationPeriodField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <WorkingHoursField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <DailySalaryField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </>
        )}
        
        {/* Notice to Explain specific fields */}
        {documentType === 'notice-to-explain' && (
          <>
            <DateField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <PlaceField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <IncidentDateField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <IncidentPlaceField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <BriefBackgroundField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <PreparedByField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <ReviewedByField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
            
            <ReceivedByField 
              formData={formData as NoticeToExplainFormData}
              handleInputChange={handleInputChange}
            />
          </>
        )}
        
        {/* Document-specific field */}
        {documentType === 'employee-certificate' && (
          <PurposeField 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        
        {/* Common fields continued */}
        {(documentType === 'employee-certificate' || documentType === 'employment-agreement') && (
          <>
            <DateIssuanceField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <PlaceIssuanceField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <SignatoryNameField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <SignatoryPositionField 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </>
        )}
      </div>
      
      {/* Signature Section */}
      <SignatureField 
        formData={formData}
        handleInputChange={handleInputChange}
        onOpenSignatureModal={onOpenSignatureModal}
      />
      
      {/* Action Buttons */}
      <ActionButtons 
        handleReset={handleReset}
        onPrint={onPrint}
      />
    </div>
  );
} 