/**
 * Types and interfaces for directives functionality
 */

export interface DirectiveData {
  id: number;
  directive_type?: 'memo' | 'policy';
  title: string;
  is_responded?: boolean;
  to?: string | string[]; 
  is_active?: boolean;

  attachments?: string;

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
}

export interface PolicyField {
  inputLabel: string;
  inputName: string
}

export interface ReadData {
  id: number;
  email: string;
  name?: string;
  read_at: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface ReadStatusData {
  read_count: number;
  unread_count: number;
  reads: ReadData[];
  unread_emails: string[];
}

export interface DirectiveReadRequest {
  email: string;
}

