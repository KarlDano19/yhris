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
  salaryRangeType?: string;
  rate?: string;
  minimumAmount?: string;
  maximumAmount?: string;
  exactAmount?: string;
  offeredBenefits?: string;
  isShowSalary?: boolean;
  isShowBenefits?: boolean;
  salary?: {
    salaryType?: string;
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
  isShowRoles?: boolean;
  isShowRemarks?: boolean;

  // Page 5
  posterType?: string;
  uploadedCustomPoster?: File | null;
  ogUrl?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;

  // Page 6
  sharedTo?: string;

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
