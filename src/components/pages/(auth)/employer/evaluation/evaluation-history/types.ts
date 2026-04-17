export interface EmployeeEvaluationData {
  name: string;
  department: string;
  evaluation_count: number;
  total_score: number;
  average_score: number;
}

export interface EvaluationResponseDetailsModalProps {
  isOpen: { id: number; open: boolean } | null;
  setIsOpen: React.Dispatch<{ id: number; open: boolean } | null>;
  selectedTemplate: any;
}

export type TabType = 'respondents' | 'questions' | 'analytics';

export interface SelectedRecipients {
  recipients: string;
  employeeName: string;
  department: string;
}

