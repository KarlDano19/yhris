// Business Mode Types

// Budget Type
export type T_BudgetType = 'fixed_rate' | 'hourly_rate';

// Job Status Type
export type T_JobStatus = 'active' | 'in_progress' | 'completed' | 'cancelled';

// Application Status Type
export type T_ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

// Work Status Type
export type T_WorkStatus = 'not_started' | 'started' | 'completed';

// Payment Status Type
export type T_PaymentStatus = 'pending' | 'paid' | 'cancelled';

// Daily Progress Status Type
export type T_DailyProgressStatus = 'submitted' | 'approved' | 'rejected';

// Time Record Status Type
export type T_TimeRecordStatus = 'clocked_in' | 'clocked_out';

// Hire Info Type (for displaying hired applicants)
export type T_HireInfo = {
  applicationId: number;
  applicantId: number;
  applicantName: string;
  applicantPhoto: string | null;
  applicantInitials: string;
  paymentStatus: T_PaymentStatus;
  workStatus: T_WorkStatus;
  hasClientReviewed: boolean;
  dailyProgresses: T_DailyProgress[];
  timeRecords: T_TimeRecord[];
};

// Time Record Type (for clock in/out)
export type T_TimeRecord = {
  id: number;
  business_job_application_id: number;
  record_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  expected_hours: number;
  actual_hours: number | null;
  late_minutes: number;
  early_departure_minutes: number;
  status: T_TimeRecordStatus;
  created_at: string;
  updated_at: string;
};

// Daily Progress Types
export type T_DailyProgress = {
  id: number;
  business_job_application_id: number;
  progress_date: string;
  proof_file: string | null;
  notes: string | null;
  status: T_DailyProgressStatus;
  client_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  // optional hours worked reported by applicant
  hours_worked?: number | null;
};

// Business Job Application Types
export type T_BusinessJobApplication = {
  id: number;
  business_job_posting: number;
  applicant: number;
  applicant_name: string;
  applicant_email: string;
  applicant_mobile: string;
  applicant_address: string;
  applicant_birth_date: string | null;
  applicant_nationality: string | null;
  applicant_gender: string | null;
  applicant_age: number | null;
  applicant_skills: string[];
  applicant_education: string | null;
  applicant_college: string | null;
  applicant_educational_attainment: string | null;
  applicant_work_experience: T_ApplicantWorkExperience[];
  applicant_certifications: T_ApplicantCertification[];
  applicant_photo: string | null;
  applicant_cv: string | null;
  applicant_average_rating: number | null;
  applicant_reviews_count: number | null;
  status: T_ApplicationStatus;
  batch_number: number;
  work_status: T_WorkStatus;
  started_at: string | null;
  completed_at: string | null;
  payment_status: T_PaymentStatus;
  payment_amount: number | null;
  paid_at: string | null;
  payment_proof: string | null;
  proof_of_completion: string | null;
  created_at: string;
  updated_at: string;
  // Contractual job fields
  is_contractual_job: boolean;
  is_proof_file_required: boolean;
  is_daily_progress_required: boolean;
  is_daily_progress_approval_required: boolean;
  is_strict_schedule: boolean;
  clock_in_minutes_before: number;
  clock_out_minutes_after: number;
  total_contract_days: number;
  submitted_progress_count: number;
  approved_progress_count: number;
  is_all_progress_submitted: boolean;
  daily_progresses: T_DailyProgress[];
  // Time record fields (for hourly rate jobs)
  today_time_record: T_TimeRecord | null;
  total_time_records_count: number;
  total_hours_worked: number;
  time_records: T_TimeRecord[];
  // Review tracking
  has_client_reviewed: boolean;
  has_applicant_reviewed: boolean;
};

// Applicant Work Experience (from API)
export type T_ApplicantWorkExperience = {
  position?: string;
  company?: string;
  period?: string;
  [key: string]: unknown;
};

// Applicant Certification (from API)
export type T_ApplicantCertification = {
  name?: string;
  verified?: boolean;
  [key: string]: unknown;
};

// Business Job Types
export type T_BusinessJob = {
  id: number;
  job_title: string;
  category: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  budget_type: T_BudgetType;
  min_amount: number | null;
  max_amount: number | null;
  hourly_rate: number | null;
  contract_start_date: string;
  contract_end_date: string | null;
  time_from: string | null;
  time_to: string | null;
  status: T_JobStatus;
  current_batch_number: number;
  is_urgent: boolean;
  is_active: boolean;
  is_proof_file_required: boolean;
  is_daily_progress_required: boolean;
  is_daily_progress_approval_required: boolean;
  is_strict_schedule: boolean;
  clock_in_minutes_before: number;
  clock_out_minutes_after: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
  created_by_rating: number | null;
  created_by_reviews_count: number;
  created_by_photo: string | null;
  applications_count: number;
  average_rating: number | null;
  reviews_count: number;
  has_applied: boolean;
  applications: T_BusinessJobApplication[];
};

// Create Business Job Data
export type T_CreateBusinessJobData = {
  job_title: string;
  category: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  budget_type: T_BudgetType;
  min_amount?: number | null;
  max_amount?: number | null;
  hourly_rate?: number | null;
  contract_start_date: string; // YYYY-MM-DD format
  contract_end_date?: string | null; // YYYY-MM-DD format
  time_from?: string | null; // HH:MM format
  time_to?: string | null; // HH:MM format
  is_urgent?: boolean;
  is_proof_file_required?: boolean;
  is_daily_progress_required?: boolean; // For hourly rate jobs
  is_daily_progress_approval_required?: boolean; // Whether client must approve daily progress
  is_strict_schedule?: boolean; // For hourly rate jobs - enforce time window
  clock_in_minutes_before?: number; // Minutes before time_from that applicant can clock in
  clock_out_minutes_after?: number; // Minutes after time_to that applicant can clock out
};

// Business Job Response
export type T_BusinessJobResponse = {
  id: number;
  job_title: string;
  category: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  budget_type: string;
  min_amount: number | null;
  max_amount: number | null;
  hourly_rate: number | null;
  date: string;
  time_from: string | null;
  time_to: string | null;
  status: string;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
  applications_count: number;
};

// My Business Jobs Response (Paginated)
export type T_MyBusinessJobsResponse = {
  records: T_BusinessJob[];
  total_count: number;
  page_count: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
};

// Applicant Profile Data (for display in modals)
export type T_ApplicantProfileData = {
  id: number;
  applicantId: number;
  name: string;
  initials: string;
  photo?: string | null;
  rating: number;
  reviewsCount: number;
  appliedDate: string;
  applicationMessage: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  status: T_ApplicationStatus;
  skills: string[];
  workExperience: {
    position: string;
    company: string;
    period: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: {
    name: string;
    verified: boolean;
  }[];
  resume: {
    filename: string;
    type: string;
  };
  reviews: {
    reviewerName: string;
    reviewerInitials: string;
    quote: string;
    date: string;
    rating: number;
  }[];
};

// Applicant Data (for list display)
export type T_ApplicantData = {
  id: number;
  applicantId: number;
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  description: string;
  services: string[];
  appliedDate: string;
  status: T_ApplicationStatus;
  email: string;
  phone: string;
  photo: string | null;
};

// Hire Payment Data
export type T_HirePaymentData = {
  id: number;
  serviceName: string;
  providerName: string;
  priceRange: string;
};

// Update Business Job Data
export type T_UpdateBusinessJobData = {
  jobId: number;
  job_title?: string;
  category?: string;
  description?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  budget_type?: T_BudgetType;
  min_amount?: number | null;
  max_amount?: number | null;
  hourly_rate?: number | null;
  date?: string;
  time_from?: string | null;
  time_to?: string | null;
  is_urgent?: boolean;
  is_active?: boolean;
};

// Update Application Status Data
export type T_UpdateApplicationStatusData = {
  applicationId: number;
  status: 'accepted' | 'rejected';
};

// Application Status Response
export type T_ApplicationStatusResponse = {
  id: number;
  business_job_posting: number;
  applicant: number;
  applicant_name: string;
  applicant_email: string;
  applicant_mobile: string;
  applicant_photo: string | null;
  applicant_average_rating: number | null;
  applicant_reviews_count: number | null;
  status: string;
  work_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

// Start Job Data
export type T_StartJobData = {
  applicationId: number;
};

// Submit Daily Progress Data
export type T_SubmitDailyProgressData = {
  applicationId: number;
  progress_date: string;
  proof_file?: File;
  notes?: string;
};

// Review Daily Progress Data
export type T_ReviewDailyProgressData = {
  progressId: number;
  status: 'approved' | 'rejected';
  client_feedback?: string;
};

// Submit Payment Data
export type T_SubmitPaymentData = {
  applicationId: number;
  payment_amount?: number;
  payment_proof?: File;
};

// Daily Progress Response (Paginated)
export type T_DailyProgressResponse = {
  records: T_DailyProgress[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  starting: number;
  ending: number;
};

// Applicant Review Types
export type T_ApplicantReview = {
  id: number;
  reviewer_applicant: number;
  reviewer_name: string;
  reviewed_applicant: number;
  reviewed_applicant_name: string;
  business_job_application: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

// Submit Applicant Review Data
export type T_SubmitApplicantReviewData = {
  applicationId: number;
  rating: number;
  review_text?: string;
};

// Talent Type (for Search Talent feature)
export type Talent = {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  jobsDone: number;
  portfolioCount?: number;
  location: string;
  hourlyMin: number;
  hourlyMax: number;
  skills: string[];
  languages: string[];
  education?: string;
  about?: string;
  availability?: string;
  // Additional fields from API
  email?: string;
  mobile?: string;
  photo?: string | null;
  cv?: string | null;
  portfolio_url?: string | null;
  description?: string | null;
  setup_preference?: string | null;
  expected_salary?: number | null;
  work_experience?: any[];
  certifications?: any[];
  portfolio?: any[];
  college?: string | null;
  educational_attainment?: string | null;
};

// Active Job Type (for applicant's view of their active jobs)
export type T_ActiveJob = {
  id: number;
  applicationId: number;
  title: string;
  clientName: string;
  clientInitials: string;
  clientPhoto: string | null;
  clientId: number;
  location: string;
  time: string;
  priceRange: string;
  status: string;
  workStatus: string;
  paymentStatus: string;
  urgent: boolean;
  // Contractual job fields
  contractStartDate: string;
  contractEndDate: string | null;
  isContractual: boolean;
  isProofFileRequired: boolean;
  isDailyProgressRequired: boolean;
  isDailyProgressApprovalRequired: boolean;
  isStrictSchedule: boolean;
  clockInMinutesBefore: number;
  clockOutMinutesAfter: number;
  totalContractDays: number;
  submittedProgressCount: number;
  approvedProgressCount: number;
  isAllProgressSubmitted: boolean;
  dailyProgresses: T_DailyProgress[];
  budgetType: T_BudgetType;
  // Time record fields (for hourly rate jobs)
  todayTimeRecord: T_TimeRecord | null;
  totalTimeRecordsCount: number;
  totalHoursWorked: number;
  timeRecords: T_TimeRecord[];
  // Hourly rate specific
  hourlyRate: number | null;
  timeFrom: string | null;
  timeTo: string | null;
  // Can start job flag (based on contract start date)
  canStartJob: boolean;
  // Review tracking
  hasApplicantReviewed: boolean;
};

// Clock In/Out Data Types
export type T_ClockInData = {
  applicationId: number;
};

export type T_ClockOutData = {
  applicationId: number;
};

export type T_ClockInResponse = {
  message: string;
  data: T_TimeRecord;
};

export type T_ClockOutResponse = {
  message: string;
  data: T_TimeRecord;
  requires_daily_progress: boolean;
  is_daily_progress_required: boolean;
};

export type T_TimeRecordsResponse = {
  records: T_TimeRecord[];
  total_count: number;
  page_count: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  summary: {
    total_hours: number;
    total_records: number;
  };
};
