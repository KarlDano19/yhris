import { printEmployeeCertificate } from './documents/EmployeeCertificate';
import { printEmploymentAgreement } from './documents/EmploymentAgreement';
import { printNoticeToExplain } from './documents/NoticeToExplain';

import { PrintOptions } from '@/types/document-generator/documents';
import { DocumentType } from '@/types/document-generator/form';
import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';

/**
 * Main print function that routes to the appropriate print function based on document type
 */
export const print = (
  formData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData, 
  options: PrintOptions
): Promise<Blob | null> => {
  // Determine the document type based on the formData structure
  const documentType: DocumentType = 
    'incidentDate' in formData && 'incidentPlace' in formData && 'briefBackground' in formData
      ? 'notice-to-explain'
      : 'probationPeriod' in formData && 'workingHours' in formData && 'dailySalary' in formData
        ? 'employment-agreement'
        : 'employee-certificate';
  
  // Route to the appropriate print function
  switch (documentType) {
    case 'notice-to-explain':
      return printNoticeToExplain(formData as NoticeToExplainFormData, options);
    case 'employment-agreement':
      printEmploymentAgreement(formData as EmploymentAgreementFormData, options);
      return Promise.resolve(null);
    case 'employee-certificate':
      printEmployeeCertificate(formData as EmployeeCertificateFormData, options);
      return Promise.resolve(null);
    default:
      return Promise.resolve(null);
  }
};

/**
 * Print function with audit logging
 */
export const printWithAudit = async (
  formData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData, 
  options: PrintOptions,
  logAudit: (data: { document_type: string; document_data: Record<string, any> }) => void
): Promise<Blob | null> => {
  // Determine the document type based on the formData structure
  const documentType: DocumentType = 
    'incidentDate' in formData && 'incidentPlace' in formData && 'briefBackground' in formData
      ? 'notice-to-explain'
      : 'probationPeriod' in formData && 'workingHours' in formData && 'dailySalary' in formData
        ? 'employment-agreement'
        : 'employee-certificate';

  // Log the print action to audit logs
  try {
    await logAudit({
      document_type: documentType,
      document_data: formData
    });
  } catch (error) {
    // Continue with printing even if audit logging fails
  }
  
  // Route to the appropriate print function
  switch (documentType) {
    case 'notice-to-explain':
      return printNoticeToExplain(formData as NoticeToExplainFormData, options);
    case 'employment-agreement':
      printEmploymentAgreement(formData as EmploymentAgreementFormData, options);
      return Promise.resolve(null);
    case 'employee-certificate':
      printEmployeeCertificate(formData as EmployeeCertificateFormData, options);
      return Promise.resolve(null);
    default:
      return Promise.resolve(null);
  }
};