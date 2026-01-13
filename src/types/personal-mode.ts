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
  location: string;
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

