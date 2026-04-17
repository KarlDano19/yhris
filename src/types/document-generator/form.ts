import { EmployeeCertificateFormData } from './documents';
import { EmploymentAgreementFormData } from './documents';
import { NoticeToExplainFormData } from './documents';
import { AcceptanceMemoFormData } from './documents';

export type DocumentType =
  | 'employee-certificate'
  | 'employment-agreement'
  | 'notice-to-explain'
  | 'acceptance-memo';

export interface FormProps {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  onFormChange: (data: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData | AcceptanceMemoFormData) => void;
  initialData: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData | AcceptanceMemoFormData;
  onPrint: () => void;
  onOpenSignatureModal: () => void;
  onOpenLetterheadModal: () => void;
  onOpenLogoModal: () => void;
  onProceed?: () => void;
  isDocumentTypeDisabled?: boolean;
  isFormDisabled?: boolean;
  isFieldDisabled?: (fieldName: string) => boolean;
  isViewMode?: boolean;
  showAcceptanceMemo?: boolean;
} 