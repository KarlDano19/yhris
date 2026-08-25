/**
 * Types and interfaces for Policy Handbook functionality
 */

export type PolicyHandbookSectionCategory =
  | 'pay_schedule'
  | 'rate_calculation'
  | 'overtime_rules'
  | 'night_differential'
  | 'timekeeping'
  | 'geotagging_geofencing'
  | 'government_contributions'
  | 'tax_settings'
  | 'de_minimis_benefits'
  | 'thirteenth_month_pay'
  | 'payslip_components'
  | 'custom'
  | 'approval_workflow'
  | 'roles_permissions'
  | 'employee_id_format';

export type PolicyHandbookSectionType = 'dynamic_summary' | 'uploaded' | 'ai_drafted' | 'manual';

export interface PolicyHandbookSectionData {
  id: number;
  handbook_id: number;
  category: PolicyHandbookSectionCategory;
  title: string;
  description: string;
  body: string;
  order: number;
  section_type: PolicyHandbookSectionType;
  is_ai_generated: boolean;
  last_generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyHandbookData {
  id: number;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  sections: PolicyHandbookSectionData[];
}

export interface PolicyHandbookUpdateData {
  title?: string;
  status?: 'draft' | 'published';
}

export interface PolicyHandbookSectionFormData {
  category: PolicyHandbookSectionCategory | '';
  title: string;
  description?: string;
  body: string;
}

export interface PolicyHandbookVersionData {
  id: number;
  section_id: number;
  body_snapshot: string;
  change_source: 'ai_generated' | 'ai_regenerated' | 'manual_edit' | 'hris_synced';
  edited_by: string | null;
  created_at: string;
}
