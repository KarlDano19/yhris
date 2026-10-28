export interface T_KickoffPortalData {
  company_name: string;
  contact_person: string;
  contact_email: string;
  expired?: boolean;
  already_completed?: boolean;
}

export interface T_KickoffSignatory {
  contact_person: string;
  signature_data: string;
  date_signed?: string;
}

export interface T_KickoffAcknowledgementPayload {
  company_name: string;
  contact_person: string;
  contact_email: string;
  signature_data: string;
  date_signed?: string;
  agreed_to_terms: boolean;
  signatories?: T_KickoffSignatory[];
}

export interface T_KickoffAcknowledgementResponse {
  message: string;
  has_existing_account: boolean;
}
