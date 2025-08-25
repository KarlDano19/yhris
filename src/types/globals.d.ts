import { type } from "os";

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

export type T_DeleteSepartionModal = {
  open: boolean;
  id: number;
  name: string;
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
  qualifications: string;
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
  id: number;
  attachment?: string;
};

export type T_SendDecisionModal = {
  isOpen: boolean;
  id: number;
};

export type T_InvestigationModal = {
  isOpen: boolean;
  id: number;
};

export type T_InvestigationReportDetailsModal = {
  isOpen: boolean;
  id: number;
};

export type T_UploadEmployeeIssueAttachmentModal = {
  isOpen: boolean;
  id: number;
};

export type T_NTEAttachmentViewModal = {
  isOpen: boolean;
  id: number;
};

export type T_DecisionAttachmentViewModal = {
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
  dateReceived?: any;
  separationLetter: any;
  signDocuments: any;
  quitClaim: any;
  dateReceived: any;
  lastPay: any;
};

export type T_ApplicantOrientEmail = {
  id?: string;
  is_contract_sent?:boolean,
  is_contract_received?:boolean,
  contract_received_date?:string,
  is_orientation_completed?:boolean,
  is_introduction_sent?:boolean,
  is_enrolled?: boolean
};

export type T_Login = {
  email: string;
  password: string;
};

export type T_Register = {
  accountType: string;
  name: string;
  firstname?: string,
  middlename?: string
  lastname?: string,
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
  region: string;
  province: string;
  city: string;
  locality: string;
  country: string;
  building: string;
  street: string;
  zipCode: string;
  language: string;
  currency: string;
  imagePath: any;
};

export type T_ExportAgreement = {
  is_export_agree: boolean;
};

export interface CachedProfileData {
  is_export_agreed: boolean;
}

export type T_IncidentReport = {
  name: string;
  position: string;
  department: string;
  incidentDate: string;
  incidentPlace: string;
  briefBackground: string;
  issueType: string;
};

export type T_NTEForm = {
  template: string;
  subject?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  message: string;
};

export type T_IncidentReportEmail = {
  id: string;
  actionType: string;
  emailType: string;
  issueNTEForm: T_NTEForm;
  sendDecisionForm: any;
  dateReceived: any;
  // NTE
  nte_subject: string;
  nte_to: string;
  nte_cc: string;
  nte_bcc: string;
  nte_message: string;
  // Decision
  decision_subject: string;
  decision_to: string;
  decision_cc: string;
  decision_bcc: string;
  decision_message: string;
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
  email: string[];
  withResponse: boolean;
  file: Array | never;
  body: string;
  name: string;
  position: string;
  signature: string | File;
  qrCode: any;
  policyField: T_PolicyField[]
  eligibility: string;
  application: string;
  coverage: string;
  termination: string;
  purpose: string;
  policy: string;
  procedure: string;
};

export type T_PolicyField ={
  inputLabel: string;
  inputName: string
}

export type T_Benefit = {
  title: string;
  email: string[];
  purpose: string;
  benefits: string;
  coverage: string;
  eligibility: string;
  cc: string[];
  bcc: string[];
};

export type T_UserPassword = {
  password: string;
  confirmPassword: string;
  code: string;
};

export type T_ApplyJob = {
  applicantId: number;
  jobStageId: number;
  status: string;
};

export type T_Payment = {
  users: string,
  path: string,
  url: string,
  additional_employees: number,
  plan_id: number,
  payment_id: number,
  subscription_type: string,
  periodicity: string,
  periodicity_duration: string,
  voucher_code: string,
}

export type Voucher = {
  id: number;
  code: string;
  discount: string;
  applied_plan: string,
  no_of_employees: string;
  redeemed: boolean;
  redemption_count: {
    id: number;
    name: string;
    plan: string;
    date: string;
  }[];
  redemption_from: string;
  redemption_to: string;
  prepared_by: string;
}

export type EmailTemplate = {
  subject: string;
  to: string;
  cc: string;
  bcc: string;
  body: string;
  attachment: string;
}

export type T_ApplicantProfile = {
  id: number;
  userId: number;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  about: string;
  imagePath: string;
  profilePicture: string;
  birthDay: any;
  age: number;
  gender: string;
  religion: string;
  nationality: string;
  civilStatus: string;
  address: string;
  mobile: string;
  landLineNo: string;
  contactPersonName: string;
  contactPersonAddress: string;
  contactPersonContactNo: string;
  contactPersonRelationship: string;
  contactPersonAge: number;
  education?: string;
  college?: string;
  expected_salary?: number;
  educationalAttainment?: string;
  skills?: string[];
  experiences?: {
    position: string;
    majorRole: string;
    companyOrg: string;
    dateFrom: string;
    dateTo: string;
  }[];
}
