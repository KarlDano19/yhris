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
  id: number | null;
};

// Post a Job

export type T_CreateJob = {
  id: number;
  JobNo: string;
  country: string;
  isActive: boolean;
  language: string;
  jobTitle: string;
  placeAdvertise: string;
  jobType: string[];
  schedule: string[];
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

export type T_Separation = {
  date: string;
  name: string;
  position: string;
  department: string;
  reason: string;
};

export type T_SendNTEModal = {
  isOpen: boolean;
  id: number;
};

export type T_SendDecisionModal = {
  isOpen: boolean;
  id: number;
};

export type T_InvestigationModal = {
  isOpen: boolean;
  id: number;
};

export type T_DesignBenefitsModal = {
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

export type T_SeparationEmail = {
  id: string;
  actionType: string;
  emailType: string;
  separationLetter: any;
  signDocuments: any;
  quitClaim: any;
  dateReceived: any;
};

export type T_Login = {
  email: string;
  password: string;
};

export type T_Register = {
  accountType: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type T_EmployerProfile = {
  companyName: string;
  companyLogo: Blob;
  companyDescription: string;
  typeOfIndustry: string;
  noOfEmployees: string;
  workSetUp: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  building: string;
  street: string;
  locality: string;
  city: string;
  zipCode: string;
  country: string;
  language: string;
  currency: string;
  imagePath: any;
};

export type T_IncidentReport = {
  name: string;
  position: string;
  department: string;
  incidentDate: string;
  incidentPlace: string;
  briefBackground: string;
};

export type T_IncidentReportEmail = {
  id: string;
  actionType: string;
  emailType: string;
  issueNTE: any;
  sendDecision: any;
  dateReceived: any;
};

export type T_Investigation = {
  employee_issue: string;
  date: string;
  presider: string;
  witness: string;
  resultOfInvestigation: string;
  decision: string;
  other: string;
  isAttendHearing: string;
  briefBackground: string;
  attachments: File;
};

export type T_Directive = {
  type: string;
  title: string;
  email: string;
  withResponse: boolean;
  file: Array;
  body: string;
  name: string;
  position: string;
  signature: string | File;
  qrCode: any;
  purpose: string;
  policy: string;
  procedure: string;
  eligibility: string;
  application: string;
  coverage: string;
  termination: string;
};

export type T_Benefit = {
  title: string;
  email: string;
  purpose: string;
  benefits: string;
  coverage: string;
  eligibility: string;
  cc: string;
  bcc: string;
};
