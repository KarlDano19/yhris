/**
 * Types and interfaces for directives functionality
 */

export interface DirectiveData {
  id: number;
  directive_type?: 'memo' | 'policy';
  title: string;
  to?: string | string[]; 
  is_active?: boolean;

  custom_policy_fields?: PolicyField[];
  eligibility?: string;
  application?: string;
  coverage?: string;
  termination?: string;

  body?: string;
  name?: string;
  position?: string;
  signature?: string | File;
  qr_code?: string | File;
  attachments?: string | File;
}

export interface PolicyField {
  inputLabel: string;
  inputName: string
}

export interface SendVerificationRequest {
  email: string;
}

export interface SendVerificationResponse {
  message: string;
}

export interface SendVerificationError {
  message: string;
  status?: number;
  cooldown_remaining?: number;
}

export interface VerifyDirectiveParams {
  directiveId: number;
  email: string;
  code: string;
}

export interface ReadData {
  id: number;
  email: string;
  is_verified: boolean;
  verified_at: string | null;
  read_at: string;
}

export interface ReadStatusData {
  responded_count: number;
  unresponded_count: number;
  responded_emails: string[];
  unresponded_emails: string[];
  verified_reads: ReadData[];
  is_fully_responded: boolean;
  total_pages?: number;
  total_records?: number;
  current_page?: number;
  starting?: number;
  ending?: number;
}

