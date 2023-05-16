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

// Post a Job

export type T_CreateJob = {
  country: string;
  language: string;
  jobTitle: string;
  placeAdvertise: string;
  jobType: string;
  otherJobType: string | null;
  schedule: string;
  hireCount: number;
  hireDate: string;
  salary: {
    salaryType: string;
    salaryValue: string;
  };
  rate: string;
};

//  jobType: {
//     fullTime: boolean;
//     partTime: boolean;
//     internship: boolean;
//     projectBased: boolean;
//     other: boolean;
//   };
