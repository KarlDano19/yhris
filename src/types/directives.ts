/**
 * Types and interfaces for directives functionality
 */

export interface DirectiveData {
  id: number;
  title: string;
  body?: string;
  directive_type?: 'memo' | 'policy';
  type?: 'memo' | 'policy'; // For backward compatibility
  name?: string;
  position?: string;
  signature?: string;
  date?: string;
  created_at?: string;
  purpose?: string;
  policy?: string;
  procedure?: string;
  eligibility?: string;
  application?: string;
  coverage?: string;
  termination?: string;
  reads?: ReadData[];
  read_count?: number;
  to?: string; // JSON string of email addresses
  is_responded?: boolean;
  is_active?: boolean;
  attachments?: string;
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
  directive_id: number;
  total_recipients: number;
  read_count: number;
  unread_count: number;
  reads: ReadData[];
  unread_emails: string[];
}

export interface DirectiveReadRequest {
  email: string;
}

