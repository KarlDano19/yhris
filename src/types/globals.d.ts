export type T_LetterModal = {
  type: acceptance | separation;
  id: number;
};

export type T_DocumentsModal = {
  isOpen: boolean;
  id: number;
};

export type T_LastPayModal = {
  isOpen: boolean;
  id: number;
};

export type T_QuitclaimModal = {
  isOpen: boolean;
  id: number;
};

export type T_Separation = {
  date: string;
  name: string;
  position: string;
  department: string;
  reason: string;
};

export type T_JobPreviewModal = {
  isOpen: boolean;
  id: number;
};

// Post a Job

export type T_CreateJob = {
  country: string;
  language: string;
  jobTitle: string;
  placeAdvertise: string;
  jobType: string;
  schedule: string;
  hireCount: number;
  hireDate: string;
  salary: {
    salaryType: string;
    salaryValue: string;
  };
  rate: string;
  benefits: string[];
  jobDescription: string;
  jobDescriptionFile: File;
  postAs: string;
  postAsUpload: File;
  postIn: string[];
};

export type T_JobPostHistory = {
  isActive: boolean;
};

//  jobType: {
//     fullTime: boolean;
//     partTime: boolean;
//     internship: boolean;
//     projectBased: boolean;
//     other: boolean;
//   };
