// Personal Mode Types

// Education Types
export type T_Education = {
  id?: number;
  educationalAttainment?: string;
  degree: string;
  school: string;
  startYear: string;
  endYear: string;
};

// Work Experience Types
export type T_WorkExperience = {
  id?: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

// Certification Types
export type T_Certification = {
  id?: number;
  name: string;
  issuer: string;
  issuedDate?: string;
  expiresDate?: string;
  idNumber?: string;
  verified?: boolean;
  proofFile?: File | null;
  proofUrl?: string | null;
};

// Basic Information Types
export type T_BasicInfo = {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  landline?: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  birthday: Date | null;
  gender: string;
  religion: string;
  nationality: string;
  civilStatus: string;
  expectedSalary?: number | null;
  contactPersonName?: string;
  contactPersonAddress?: string;
  contactPersonMobile?: string;
  contactPersonRelationship?: string;
  contactPersonAge?: number | null;
  photo?: File | null;
  photoUrl?: string | null;
  about?: string;
};

// Portfolio Types
export type T_Portfolio = {
  id?: number;
  name: string;
  image?: string;
  imageFile?: File | null;
  imageUrl?: string | null;
  link: string;
  description?: string;
};

// Employment Document Types
export type T_EmploymentDocument = {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  fileUrl?: string;
  file?: File;
};

// Application Types
export type T_Application = {
  id: number;
  title: string;
  company: string;
  logo: string;
  appliedDate: string;
  status: string;
};

// Saved Job Types
export type T_SavedJob = {
  id: number;
  savedJobId: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  logo: string;
  logoUrl?: string;
  saved: boolean;
};

// Review Types (for My Reviews)
export type T_Review = {
  id: number;
  rating: number;
  comment?: string | null;
  review_text?: string | null;
  created_at: string;
  reviewer_name: string;
  reviewer_email: string | null;
  reviewer_photo: string | null;
  job_title: string | null;
  job_category: string | null;
};

// My Reviews Response (paginated)
export type T_MyReviewsResponse = {
  records: T_Review[];
  total_records: number;
  total_pages: number;
  starting: number;
  ending: number;
  applicant_id: number;
  applicant_name: string;
  average_rating: number | null;
  reviews_count: number;
};

// Job Card Types
export type T_JobCard = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  logo: string;
  logoUrl?: string;
  saved?: boolean;
  match?: number;
  applied?: boolean;
  onApply?: () => void;
  onCardClick?: () => void;
  isSelected?: boolean;
};

// High Match Jobs Filters
export type T_HighMatchJobsFilters = {
  min_match_percentage?: number;
  limit?: number;
};

// Job Filters (for job search)
export type T_JobFilters = {
  job_title?: string;
  location?: string | string[];
  search_type?: 'job_title' | 'location';
  view_type?: 'jobs_select' | 'location_select' | 'listing' | 'applicant_personal';
  current_page?: number;
  page_size?: number;
  search?: string;
  useApplicantPersonal?: boolean;
};

// Training Types
export type T_Training = {
  id: number;
  title: string;
  duration: string;
  level: string;
  instructor: string;
  rating: number;
  students: number;
  free: boolean;
  price?: number;
  progress: number;
};

// Personal Transaction Types
export type T_PersonalTransaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
};

