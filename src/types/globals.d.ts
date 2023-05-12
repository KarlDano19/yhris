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
  date: string;
  presider: string;
  witness: string;
  decision: string;
  other: string;
  isAttendHearing: string;
  briefBackground: string;
  attachment: File;
};
