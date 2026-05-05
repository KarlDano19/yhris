/**
 * Types and interfaces for separation functionality
 */

export interface SeparationData {
  id: number;
  employee: number;
  position: string;
  department: string;
  date_of_separation: string;
  reason_of_leaving: string;
  
  // Letter tracking
  is_letter_sent: boolean;
  is_letter_received: boolean;
  letter_received_date: string | null;
  letter_attachment: string | null;
  
  // Documents tracking
  is_documents_sent: boolean;
  is_documents_received: boolean;
  documents_received_date: string | null;
  documents_attachment: string | null;
  
  // Last pay tracking
  is_last_pay_released: boolean;
  last_pay_attachment: string | null;
  
  // Quit claim tracking
  is_quit_claim_signed: boolean;
  is_quit_claim_received: boolean;
  quit_claim_received_date: string | null;
  quit_claim_attachment: string | null;
  
  // Letter content and approval fields
  message: string | null;
  pdf_content: string | null;
  approved_by: string | null;
  effective_date: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface EmployeeData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  system_id?: string;
}

// For display in the separation view page
export interface SeparationWithEmployee extends SeparationData {
  employee_data?: EmployeeData;
  company_name?: string;
}
