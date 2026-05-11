import React from 'react';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';
import { AcceptanceMemoFormData } from '@/types/document-generator/documents';
import { FormProps } from '@/types/document-generator/form';

// Import DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

// Import form components
import EmployeeCertificateForm from './forms/EmployeeCertificateForm';
import EmploymentAgreementForm from './forms/EmploymentAgreementForm';
import NoticeToExplainForm from './forms/NoticeToExplainForm';
import AcceptanceMemoDocGeneratorForm from './forms/AcceptanceMemoDocGeneratorForm';

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
  isFieldDisabled,
  isViewMode,
  showAcceptanceMemo,
}: FormProps) {
  // Render the appropriate form based on document type
  if (documentType === 'employee-certificate') {
    return (
      <EmployeeCertificateForm
        documentType={documentType}
        onDocumentTypeChange={onDocumentTypeChange}
        onFormChange={onFormChange as (data: EmployeeCertificateFormData) => void}
        initialData={initialData as EmployeeCertificateFormData}
        onPrint={onPrint}
        onOpenSignatureModal={onOpenSignatureModal}
        onOpenLetterheadModal={onOpenLetterheadModal}
        onProceed={onProceed}
        isDocumentTypeDisabled={isDocumentTypeDisabled}
        isFormDisabled={isFormDisabled}
        isFieldDisabled={isFieldDisabled}
        showAcceptanceMemo={showAcceptanceMemo}
      />
    );
  }
  
  if (documentType === 'employment-agreement') {
    return (
      <EmploymentAgreementForm
        documentType={documentType}
        onDocumentTypeChange={onDocumentTypeChange}
        onFormChange={onFormChange as (data: EmploymentAgreementFormData) => void}
        initialData={initialData as EmploymentAgreementFormData}
        onPrint={onPrint}
        onOpenSignatureModal={onOpenSignatureModal}
        onProceed={onProceed}
        isDocumentTypeDisabled={isDocumentTypeDisabled}
        isFormDisabled={isFormDisabled}
        isFieldDisabled={isFieldDisabled}
        showAcceptanceMemo={showAcceptanceMemo}
      />
    );
  }
  
  if (documentType === 'acceptance-memo') {
    return (
      <AcceptanceMemoDocGeneratorForm
        documentType={documentType}
        onDocumentTypeChange={onDocumentTypeChange}
        onFormChange={onFormChange}
        initialData={initialData as AcceptanceMemoFormData}
        onPrint={onPrint}
        onOpenSignatureModal={onOpenSignatureModal}
        onOpenLetterheadModal={onOpenLetterheadModal}
        onOpenLogoModal={onOpenLogoModal}
        onProceed={onProceed}
        isDocumentTypeDisabled={isDocumentTypeDisabled}
        isFormDisabled={isFormDisabled}
        isViewMode={isViewMode}
        showAcceptanceMemo={showAcceptanceMemo}
      />
    );
  }

  // notice-to-explain
  return (
    <NoticeToExplainForm
      documentType={documentType}
      onDocumentTypeChange={onDocumentTypeChange}
      onFormChange={onFormChange as (data: NoticeToExplainFormData) => void}
      initialData={initialData as NoticeToExplainFormData}
      onPrint={onPrint}
      onOpenSignatureModal={onOpenSignatureModal}
      onOpenLogoModal={onOpenLogoModal}
      onProceed={onProceed}
      isDocumentTypeDisabled={isDocumentTypeDisabled}
      isFormDisabled={isFormDisabled}
      isFieldDisabled={isFieldDisabled}
      showAcceptanceMemo={showAcceptanceMemo}
    />
  );
} 