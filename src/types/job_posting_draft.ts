export interface T_JobPostingDraftData {
  // Page 1
  country?: string;
  language?: string;

  // Page 2
  jobTitle?: string;
  position?: string;
  positionDescription?: string;
  advertiseTo?: string;
  placeAdvertise?: string; // Alias for advertiseTo
  jobType?: string;
  workSetup?: string;
  jobSchedule?: string;
  schedule?: string; // Alias for jobSchedule
  requiredSlot?: string;
  hireCount?: string; // Alias for requiredSlot
  dateRequired?: string;
  hireDate?: string | Date; // Alias for dateRequired

  // Page 3
  salaryRangeType?: string; // legacy alias
  rate?: string;
  minimumAmount?: string; // legacy alias
  maximumAmount?: string; // legacy alias
  exactAmount?: string; // legacy alias
  offeredBenefits?: string; // legacy alias
  isShowSalary?: boolean; // legacy alias
  isShowBenefits?: boolean; // legacy alias
  // actual form fields
  benefits?: string[];
  is_show_salary?: boolean;
  is_show_benefits?: boolean;
  salary?: {
    salaryType?: string;
    salaryRangeMin?: string | number;
    salaryRangeMax?: string | number;
    salaryValue?: string | number;
    // legacy aliases kept for backwards compat
    rate?: string;
    minimumAmount?: string;
    maximumAmount?: string;
    exactAmount?: string;
    offeredBenefits?: string;
    isShowSalary?: boolean;
    isShowBenefits?: boolean;
  };

  // Page 4
  jobDescription?: string;
  qualifications?: string;
  jobRemark?: string;
  notesRemarks?: string; // Alias for jobRemark
  jobUrl?: string;
  uploadedJobDescription?: File | null;
  isShowRoles?: boolean; // legacy alias
  isShowRemarks?: boolean; // legacy alias
  // actual form fields
  is_show_roles?: boolean;
  is_show_remarks?: boolean;

  // Page 5
  posterType?: string;
  uploadedCustomPoster?: File | null;
  ogUrl?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;

  // Page 6
  postAs?: string;
  sharedTo?: string; // legacy alias

  // Page 7
  screeningQuestions?: any[];
  autoRejectEnabled?: boolean;
  rejectionFeedback?: string;
  isVideoIntroEnabled?: boolean;

  // Page 8
  jobStages?: any[];
}

export interface T_JobPostingDraft {
  id: number;
  draft_name: string | null;
  draft_data: T_JobPostingDraftData;
  current_step: number;
  source: 'manual' | 'session_expiry' | 'browser_close';
  job_title: string;
  position: string | null;
  uploaded_job_description: string | null;
  uploaded_custom_poster: string | null;
  created_at: string;
  updated_at: string;
}

export interface T_CreateJobDraftData {
  draft_name?: string;
  draft_data: T_JobPostingDraftData;
  current_step: number;
  source?: 'manual' | 'session_expiry' | 'browser_close';
  uploaded_job_description?: File;
  uploaded_custom_poster?: File;
}

export interface T_UpdateJobDraftData {
  draft_name?: string;
  draft_data?: T_JobPostingDraftData;
  current_step?: number;
  source?: 'manual' | 'session_expiry' | 'browser_close';
  uploaded_job_description?: File;
  uploaded_custom_poster?: File;
}

export interface T_JobDraftResponse {
  message: string;
  id?: number;
}
