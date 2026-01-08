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
  date: string;
  time_from: string | null;
  time_to: string | null;
  status: T_JobStatus;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
  created_by_rating: number | null;
  created_by_reviews_count: number;
  created_by_photo: string | null;
  applications_count: number;
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
  date: string; // YYYY-MM-DD format
  time_from?: string | null; // HH:MM format
  time_to?: string | null; // HH:MM format
  is_urgent?: boolean;
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
  rating: number;
  reviewsCount: number;
  appliedDate: string;
  applicationMessage: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
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
