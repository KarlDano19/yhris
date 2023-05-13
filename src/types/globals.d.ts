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

// Employee Separation
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

export type T_IncidentReport = {
  name: string;
  position: string;
  department: string;
  incidentDate: string;
  incidentPlace: string;
  briefBackground: string;
};

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
