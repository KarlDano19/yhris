import { printEmployeeCertificate } from './EmployeeCertificate';
import { printEmploymentAgreement } from './EmploymentAgreement';
import { printNoticeToExplain } from './NoticeToExplain';

import { DocumentType } from '@/types/document-generator/form';
import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';
import { NoticeToExplainFormData } from '@/types/document-generator/documents';

interface PrintOptions {
  elementId: string;
  title: string;
  fileName?: string;
}

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

// Export individual print functions for direct use if needed
export { printEmployeeCertificate, printEmploymentAgreement, printNoticeToExplain }; 