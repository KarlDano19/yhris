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
    isOpen: boolean,
    id: number,
}

export type T_Separation = {
    date: string;
    name: string;
    position: string;
    department: string;
    reason: string;
};

export type T_Login = {
    email: string;
    password: string;
}

export type T_Register = {
    accountType: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

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
}
export type T_Investigation = {
  date: string;
  presider: string;
  witness: string;
  decision: string;
  other: string;
  isAttendHearing: string;
  briefBackground: string;
  attachment: File;
};

export type T_IncidentReport = {
  name: string;
  position: string;
  department: string;
  incidentDate: string;
  incidentPlace: string;
  briefBackground: string;
};

export type T_CreateMemoPolicy = {
  date: string;
  type: string;
  isResponse: boolean;
  title: string;
  email: string;
  body: string;
  name: string;
  position: string;
  signature: File;
  qrCode: File;
  file: File;
  purpose: string;
  policy: string;
  procedure: string;
  eligibility: string;
  application: string;
  coverage: string;
  termination: string;
  createPolicyFile: File | null;
};
