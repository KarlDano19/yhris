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
};

export type T_IncidentReportEmail = {
  id: string;
  actionType: string;
  emailType: string;
  issueNTEForm: any;
  sendDecisionForm: any;
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
}

export type T_OshProgram = {
  // Tab 1: Company Profile
  company_name: string;
  date_established: string;
  complete_address: string;
  phone_number: string;
  fax_number: string;
  website_url: string;
  company_owner: string;
  number_of_male_employees: number;
  number_of_female_employees: number;
  total_number_of_employees: number;
  business_description: string[] | string;
  manufacturing_description: string;
  bank_and_financial_institution_description: string;
  service_description: string;
  security_agency_description: string;
  agri_fishing_description: string;
  maintenance_description: string;
  wholesale_retail_description: string;
  construction_description: string;
  utilities_description: string;
  others_description: string;
  product_description: string;
  services_description: string;

  // Tab 2: OSH Program and Policy
  basic_components: string;
  company_commitment: string;
  date: string;
  name_of_owner: string;
  signature: File | string;

  // Tab 3: Risk Management
  emergency_and_disaster_preparedness: Array<{
    task: string;
    hazard_identified: string;
    risk_description: string;
    priority: string;
    control_measures: string;
  }> | string;

  // Tab 4: Health and Welfare Program
  routine_medical_surveillance: string[];
  special_medical_surveillance: string[];
  schedule_of_annual_medical_examination: string[];
  random_drug_testing: boolean;
  no_of_treatment_rooms_first_aid_rooms: number;
  no_of_clinics_in_the_workplace: number;
  hospitals_youre_affiliated_with: string;
  
  // Committee Members
  chairperson_less_than_ten: string;
  secretary_less_than_ten: string;
  member_less_than_ten: string;
  chairperson_medium_to_high: string;
  secretary_medium_to_high: string;
  ex_officio_members: string;
  ex_officio_members_1: string;
  ex_officio_members_2: string;
  members: string;
  members_2: string;
  chairperson_joint_coordinating: string;
  secretary_joint_coordinating: string;
  ex_officio_members_3: string;
  ex_officio_members_4: string;
  duties_and_responsibilities: boolean;

  // OSH Personnel
  safety_officer: any;
  health_personnel: any;
  health_training: any;
  risk_assessment: any;
  safety_meeting: any;
  reported_incidents: any;

  // Tab 5: Safety Measures
  ppe: any;
  ppe_description: string;
  safety_signage: File | string;
  
  // Facilities
  adequate_supply_of_drinking_water: boolean;
  adequate_supply_of_drinking_water_remarks: string;
  adequate_sanitary_and_washing_facilities: boolean;
  adequate_sanitary_and_washing_facilities_remarks: string;
  suitable_living_accommodation: boolean;
  suitable_living_accommodation_remarks: string;
  separate_sanitary_washing_and_sleeping_facilities: boolean;
  separate_sanitary_washing_and_sleeping_facilities_remarks: string;
  lactation_station: boolean;
  lactation_station_remarks: string;
  ramps_railings_and_like: boolean;
  ramps_railings_and_like_remarks: string;
  other_workers_welfare_facilities: boolean;
  other_workers_welfare_facilities_remarks: string;

  // Emergency and Disaster
  written_emergency_and_disaster_program: boolean;
  drills: any;
  written_pollution_control_program: boolean;
  polution_control_officer: string;
  waste_management_system_message: string;
  prohibited_acts_and_penalties_message: string;

  // Tab 6: Compliance and Cost
  cost_osh_program: number;
  ppe_cost: number;
  osh_training_cost: number;
  safety_signages_cost: number;
  machine_guards_cost: number;
  medical_examinations_cost: number;
  medical_supplies_cost: number;
  others_name: string;
  others_cost: number;
  annex_a_message: string;
  name_of_owner_manager: string;
  employees_representative: string;
  date_filled: string;

  // Additional fields for form handling
  id?: string;
  [key: string]: any; // Add index signature for dynamic access
};
