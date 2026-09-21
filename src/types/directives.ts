/**
 * Types and interfaces for directives functionality
 */

export interface DirectiveAttachment {
  id: number;
  attachment: string;
  attachment_name: string;
  created_at?: string;
}

// One assigned multi-signatory. Backed by the polymorphic DocumentSignatory table.
export interface Signatory {
  id?: number;
  user_id: string | number;
  user_name?: string;
  status?: 'pending' | 'signed';
  signed_at?: string | null;
  signature_url?: string | null;
}

export interface DirectiveData {
  id: number;
  directive_type?: 'memo' | 'policy';
  title: string;
  to?: string | string[];
  is_active?: boolean;
  company_name?: string;

  custom_policy_fields?: PolicyField[];
  eligibility?: string;
  application?: string;
  coverage?: string;
  termination?: string;

  body?: string;
  name?: string;
  position?: string;
  signature?: string | File | FileList;
  // A full-bleed A4 portrait image carrying the company header and footer. The document is
  // printed on top of it on every page — see utils/directive_document.py.
  letterhead?: string | File | FileList | null;
  qr_code?: string | File;
  attachments?: string | File | File[] | DirectiveAttachment[];
  attachment?: string; // Backward compatibility field - URL of first attachment

  // The memo/policy rendered as a fixed-page PDF, or the PDF the user uploaded in its place.
  // Absent on every memo created before this existed — the public page reads that absence to
  // fall back to the legacy HTML rendering.
  document?: string | File | null;
  document_source?: 'generated' | 'uploaded' | null;
  signature_placement?: string | null; // "x,y,width" — see helpers/signaturePlacement.ts

  // Multi-signatory. On write, only user_ids are sent; on read, the detail endpoint
  // returns the full rows plus is_ready / signatory_status.
  signatories?: Signatory[];
  is_ready?: boolean; // read-only: true when every assigned signatory has signed
  signatory_status?: 'none' | 'pending' | 'ready'; // read-only: table badge
}

// MemoFormData — form state type (extends DirectiveData with UI-only fields)
export interface MemoFormData extends DirectiveData {
  employee_id?: string | number | null; // UI-only: seeds EmployeeSelect; not sent to backend
}

export interface PolicyField {
  inputLabel: string;
  inputName: string
}

export interface MaskedEmail {
  index: number;
  masked: string;
}

export interface SendVerificationRequest {
  emailIndex: number;
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
  emailIndex: number;
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

