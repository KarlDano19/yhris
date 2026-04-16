/**
 * Job Posting API response types
 * Source of truth: app/serializers/job_posting.py
 */

// GET list items — JobPostingTableViewSerializer.to_representation
export type T_JobPostingTable = {
  id: number;
  job_title: string;
  job_schedule: string;
  job_type: string;
  work_setup: string;
  job_description: string;
  advertise_to: string;
  shared_to: string;
  og_url: string | null;
  is_active: boolean;
  is_show_roles: boolean;
  is_show_salary: boolean;
  is_show_remarks: boolean;
  is_show_benefits: boolean;
  created_at: string;
  position: string | null;
  salary_range_type: string;
  rate: string;
  minimum_amount: string | null;
  maximum_amount: string | null;
  exact_amount: string | null;
  offered_benefits: string;
  qualifications: string;
  job_remark: string;
  job_url: string | null;
  assignments_count: number;
  remaining_slots: number;
  slots_display: string;
  is_fully_staffed: boolean;
  company_logo: string;
};

// UPDATE/Edit data — JobPostingRetrieveSerializer._edit_representation
export type T_JobPostingEdit = {
  id: number;

  // Page 1 - Job Info
  country: string | null;
  language: string | null;
  job_title: string;
  position: string | null;
  position_id: number | null;
  advertise_to: string | null;

  // Page 2 - Job Type
  job_type: string | null;
  work_setup: string | null;
  job_schedule: string | null;
  date_required: string;
  required_slot: number;
  hired_count?: number;

  // Page 3 - Salary & Benefits
  salary_range_type: string | null;
  rate: string | null;
  minimum_amount: string | null;
  maximum_amount: string | null;
  exact_amount: string | null;
  is_show_salary: boolean;
  is_show_benefits: boolean;
  offered_benefits: string;
  other_benefits: string | null;

  // Page 4 - Job Description
  is_show_roles: boolean;
  is_show_remarks: boolean;
  skills: string | null;
  job_description: string | null;
  qualifications: string | null;
  job_remark: string | null;
  job_url: string | null;

  // Page 5 - Job Settings
  screening_questions: any[] | null;
  auto_reject_enabled: boolean;
  rejection_feedback: string | null;
  is_video_intro_enabled: boolean;

  // Page 6 - Post As
  poster_type: string | null;
  uploaded_image?: string | null;

  // Page 8 - Platform
  shared_to: string;

  // Meta
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

// Toggle-status mutation payloads
export type T_ToggleJobPostStatusPayload = { jobId: number; is_active: boolean };
export type T_ToggleJobSalaryPayload = { jobId: number; is_show_salary: boolean };
export type T_ToggleJobRolesPayload = { jobId: number; is_show_roles: boolean };
export type T_ToggleJobRemarkPayload = { jobId: number; is_show_remarks: boolean };
export type T_ToggleJobBenefitPayload = { jobId: number; is_show_benefits: boolean };

// Draft data — stored as JSON blob in backend
export interface T_JobPostingDraftData {
  // Page 1 - Job Info
  country?: string;
  language?: string;
  job_title?: string;
  position?: string;
  position_description?: string;
  advertise_to?: string;
  place_advertise?: string;

  // Page 2 - Job Type
  job_type?: string;
  work_setup?: string;
  job_schedule?: string;
  schedule?: string;
  required_slot?: string;
  hire_count?: string;
  date_required?: string;
  hire_date?: string | Date;

  // Page 3 - Salary & Benefits
  rate?: string;
  benefits?: string[];
  is_show_salary?: boolean;
  is_show_benefits?: boolean;
  salary?: {
    salary_type?: string;
    salary_range_min?: string | number;
    salary_range_max?: string | number;
    salary_value?: string | number;
  };

  // Page 4 - Job Description
  job_description?: string;
  qualifications?: string;
  job_remark?: string;
  notes_remarks?: string;
  job_url?: string;
  uploaded_job_description?: File | null;
  is_show_roles?: boolean;
  is_show_remarks?: boolean;

  // Page 5 - Job Settings
  screening_questions?: any[];
  auto_reject_enabled?: boolean;
  rejection_feedback?: string;
  is_video_intro_enabled?: boolean;

  // Page 6 - Post As
  poster_type?: string;
  uploaded_custom_poster?: File | null;
  post_as?: string;
  post_as_upload?: File | null;
  og_url?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;

  // Page 8 - Platform
  shared_to?: string;

  // Other
  job_stages?: any[];
}

// GET draft item — JobPostingDraftSerializer
export interface T_JobPostingDraft {
  id: number;
  draft_data: T_JobPostingDraftData;
  source: 'manual' | 'session_expiry' | 'browser_close';
  job_title: string;
  position: string | null;
  uploaded_job_description: string | null;
  uploaded_custom_poster: string | null;
  created_at: string;
  updated_at: string;
}

// POST draft payload
export interface T_CreateJobDraftData {
  draft_data: T_JobPostingDraftData;
  source?: 'manual' | 'session_expiry' | 'browser_close';
  uploaded_job_description?: File;
  uploaded_custom_poster?: File;
}

// GET sub-resource — JobPostingAssignmentSerializer
export type T_JobPostingAssignment = {
  id: number;
  job_posting: number;
  assigned_user: number;
  assigned_user_name: string;
  assigned_user_email: string;
  assigned_by: number;
  assigned_by_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_view_applicants: boolean;
  created_at: string;
};

// GET sub-resource — AvailableUsersForAssignmentAPIView
export type T_JobPostingAvailableUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_current_user: boolean;
};
