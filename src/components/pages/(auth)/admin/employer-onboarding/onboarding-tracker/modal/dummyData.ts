export type T_OnboardingItem = {
  id: number;
  title: string;
  description: string;
  estimated_minutes: number;
  is_completed: boolean;
  completed_at: string | null;
  tutorial_url?: string;
  is_skipped?: boolean;
  skipped_at?: string | null;
};

export type T_OnboardingGroup = {
  id: number;
  name: string;
  description: string;
  order_position: number;
  total_items: number;
  completed_items: number;
  items: T_OnboardingItem[];
};

export type T_OnboardingRecord = {
  id: number;
  employer_name: string;
  derived_status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress_pct: number;
  created_at: string;
};

export type T_OnboardingDetail = {
  id: number;
  employer_name: string;
  status: string;
  progress_pct: number;
  total_items: number;
  completed_items: number;
  groups: T_OnboardingGroup[];
};

export type T_EmployerChecklist = {
  progress_pct: number;
  total_items: number;
  completed_items: number;
  groups: T_OnboardingGroup[];
};
