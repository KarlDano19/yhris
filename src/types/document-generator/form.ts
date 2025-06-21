import { EmployeeCertificateFormData } from './documents';
import { EmploymentAgreementFormData } from './documents';
import { NoticeToExplainFormData } from './documents';

export type DocumentType = 'employee-certificate' | 'employment-agreement' | 'notice-to-explain';

export interface FormProps {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  onFormChange: (data: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData) => void;
  initialData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData;
  onPrint: () => void;
  onOpenSignatureModal: () => void;
  onOpenLetterheadModal: () => void;
  onOpenLogoModal: () => void;
  onProceed?: () => void;
  isDocumentTypeDisabled?: boolean;
  isFormDisabled?: boolean;
  isFieldDisabled?: (fieldName: string) => boolean;
} 