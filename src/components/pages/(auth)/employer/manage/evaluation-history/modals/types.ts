export type T_ModalData = {
  id: number;
  open: boolean;
};

export interface EmployeeEvaluationData {
  name: string;
  department: string;
  evaluation_count: number;
  total_score: number;
  average_score: number;
}

export interface EvaluationResponseDetailsModalProps {
  isOpen: T_ModalData | null;
  setIsOpen: React.Dispatch<T_ModalData | null>;
  selectedTemplate: any;
  templateResponseDetails: any;
  isLoadingTemplateDetails: boolean;
}

export type TabType = 'respondents' | 'questions' | 'analytics';

export interface SelectedRecipients {
  recipients: string;
  employeeName: string;
  department: string;
}

export interface DateFilter {
  from: any;
  to: any;
}

export interface PaginationState {
  totalRecords: number;
  totalPages: number;
}

