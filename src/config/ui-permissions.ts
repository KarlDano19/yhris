// UI Permission Configuration - Define permissions and their UI elements
// This file is synchronized with backend permissions from migration 0097_auto_20251002_1020.py

export interface UIPermissionConfig {
  elementId: string;
  permission: string;
  type: 'button' | 'menu' | 'section' | 'action';
  fallbackBehavior?: 'hide' | 'disable' | 'readonly';
}

export const UI_PERMISSIONS: UIPermissionConfig[] = [
  // Dashboard Pages (view permissions - usually for navigation/sections)
  { elementId: 'post-job-page', permission: 'view_post_job_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'talent-search-page', permission: 'view_talent_search_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'screen-applicant-page', permission: 'view_screen_applicant_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'onboarding-page', permission: 'view_onboarding_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'manage-page', permission: 'view_manage_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'train-page', permission: 'view_train_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'employee-separation-page', permission: 'view_employee_separation_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'dole-page', permission: 'view_dole_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'analytics-page', permission: 'view_analytics_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'settings-page', permission: 'view_settings_page', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'audit-log-page', permission: 'view_audit_log_page', type: 'section', fallbackBehavior: 'hide' },

  // Employee Management
  { elementId: 'create-employee-btn', permission: 'create_employee', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-employee-btn', permission: 'edit_employee', type: 'action', fallbackBehavior: 'disable' },
  { elementId: 'import-employee-btn', permission: 'import_employee', type: 'menu', fallbackBehavior: 'disable' },
  { elementId: 'export-employee-btn', permission: 'export_employee', type: 'menu', fallbackBehavior: 'disable' },
  { elementId: 'delete-employee-btn', permission: 'delete_employee', type: 'action', fallbackBehavior: 'disable' },
  
  // Job Management
  { elementId: 'create-job-btn', permission: 'create_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-job-btn', permission: 'edit_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-job-btn', permission: 'delete_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'assign-job-btn', permission: 'assign_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'view-all-job-history-btn', permission: 'view_all_job_history', type: 'button', fallbackBehavior: 'hide' },
  { elementId: 'schedule-interview-btn', permission: 'schedule_interview', type: 'button', fallbackBehavior: 'disable' },

  // Screen Applicants
  { elementId: 'assign-job-stage-btn', permission: 'assign_job_stage', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'create-job-stage-btn', permission: 'create_job_stage', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-job-stage-btn', permission: 'delete_job_stage', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-job-stage-btn', permission: 'edit_job_stage', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'move-job-stage-btn', permission: 'move_job_stage', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'unarchive-applicant-btn', permission: 'unarchive_applicant', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'upload-resume-btn', permission: 'upload_resume', type: 'button', fallbackBehavior: 'disable' },

  // Onboarding
  { elementId: 'allow-onboarding-btn', permission: 'allow_onboarding', type: 'button', fallbackBehavior: 'disable' },

  // Employee Issues
  { elementId: 'create-employee-issue-btn', permission: 'create_employee_issue', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-employee-issue-btn', permission: 'edit_employee_issue', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-employee-issue-nte-btn', permission: 'generate_employee_issue_nte', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'update-employee-issue-status-btn', permission: 'update_employee_issue_status', type: 'button', fallbackBehavior: 'disable' },

  // Memo & Training
  { elementId: 'create-memo-btn', permission: 'create_memo', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-memo-btn', permission: 'edit_memo', type: 'button', fallbackBehavior: 'disable' },

  // Designed Benefits
  { elementId: 'create-benefit-btn', permission: 'create_benefit', type: 'button', fallbackBehavior: 'disable' },

  // Employee Movement
  { elementId: 'create-employee-movement-btn', permission: 'create_employee_movement', type: 'button', fallbackBehavior: 'disable' },

  // Generate Documents
  { elementId: 'generate-documents-btn', permission: 'generate_documents', type: 'button', fallbackBehavior: 'disable' },

  // Employee 201
  { elementId: 'view-employee-201-btn', permission: 'view_employee_201', type: 'button', fallbackBehavior: 'hide' },
  { elementId: 'edit-employee-201-btn', permission: 'edit_employee_201', type: 'button', fallbackBehavior: 'disable' },

  // Separation & Employee Kit
  { elementId: 'create-separation-btn', permission: 'create_separation', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-separation-btn', permission: 'edit_separation', type: 'button', fallbackBehavior: 'disable' },

  // DOLE Employee Compensation
  { elementId: 'create-dole-employee-compensation-btn', permission: 'create_dole_employee_compensation', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-employee-compensation-btn', permission: 'edit_dole_employee_compensation', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-employee-compensation-btn', permission: 'export_dole_employee_compensation', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-employee-compensation-btn', permission: 'generate_dole_employee_compensation', type: 'button', fallbackBehavior: 'disable' },

  // DOLE Safety Health Policy
  { elementId: 'create-dole-safety-health-policy-btn', permission: 'create_dole_safety_health_policy', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-safety-health-policy-btn', permission: 'edit_dole_safety_health_policy', type: 'button', fallbackBehavior: 'disable' },

  // DOLE AWAIR (Accident, Work-related Illness, and Injury Reports)
  { elementId: 'create-dole-awair-btn', permission: 'create_dole_awair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-awair-btn', permission: 'edit_dole_awair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-awair-btn', permission: 'generate_dole_awair', type: 'button', fallbackBehavior: 'disable' },

  // DOLE Health Safety Organization
  { elementId: 'create-dole-health-safety-organization-btn', permission: 'create_dole_health_safety_organization', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-health-safety-organization-btn', permission: 'edit_dole_health_safety_organization', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-health-safety-organization-btn', permission: 'export_dole_health_safety_organization', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-health-safety-organization-btn', permission: 'generate_dole_health_safety_organization', type: 'button', fallbackBehavior: 'disable' },

  // DOLE Establishment Registration
  { elementId: 'create-dole-establishment-registration-btn', permission: 'create_dole_establishment_registration', type: 'button', fallbackBehavior: 'disable' },

  // DOLE SHC Minutes (Safety and Health Committee)
  { elementId: 'create-dole-shc-minute-btn', permission: 'create_dole_SHC_minute', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-shc-minute-btn', permission: 'edit_dole_SHC_minute', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-shc-minute-btn', permission: 'export_dole_SHC_minute', type: 'button', fallbackBehavior: 'disable' },

  // DOLE WAIR (Work Accident/Illness Report)
  { elementId: 'create-dole-wair-btn', permission: 'create_dole_wair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-wair-btn', permission: 'edit_dole_wair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-wair-btn', permission: 'export_dole_wair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-wair-btn', permission: 'generate_dole_wair', type: 'button', fallbackBehavior: 'disable' },

  // DOLE Annual Medical Report
  { elementId: 'create-dole-annual-medical-report-btn', permission: 'create_dole_annual_medical_report', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-annual-medical-report-btn', permission: 'edit_dole_annual_medical_report', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-annual-medical-report-btn', permission: 'export_dole_annual_medical_report', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-annual-medical-report-btn', permission: 'generate_dole_annual_medical_report', type: 'button', fallbackBehavior: 'disable' },
  
  // DOLE Work Environment Request
  { elementId: 'create-dole-work-environment-request-btn', permission: 'create_dole_work_environment_request', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-work-environment-request-btn', permission: 'edit_dole_work_environment_request', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'export-dole-work-environment-request-btn', permission: 'export_dole_work_environment_request', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-work-environment-request-btn', permission: 'generate_dole_work_environment_request', type: 'button', fallbackBehavior: 'disable' },

  // DOLE OSH Program (Occupational Safety and Health)
  { elementId: 'create-dole-osh-program-btn', permission: 'create_dole_osh_program', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-osh-program-btn', permission: 'edit_dole_osh_program', type: 'button', fallbackBehavior: 'disable' },

  // Settings & Sub Accounts
  { elementId: 'create-sub-account-btn', permission: 'create_sub_account', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-sub-account-btn', permission: 'edit_sub_account', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-sub-account-btn', permission: 'delete_sub_account', type: 'button', fallbackBehavior: 'disable' },

  // Permissions Management
  { elementId: 'create-permission-btn', permission: 'create_permission', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-permission-btn', permission: 'edit_permission', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-permission-btn', permission: 'delete_permission', type: 'button', fallbackBehavior: 'disable' },

  // Role Management
  { elementId: 'create-role-btn', permission: 'create_role', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-role-btn', permission: 'edit_role', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-role-btn', permission: 'delete_role', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'assign-user-roles-btn', permission: 'assign_user_roles', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'manage-roles-btn', permission: 'manage_roles', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Positions
  { elementId: 'create-position-btn', permission: 'create_position', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-position-btn', permission: 'edit_position', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-position-btn', permission: 'delete_position', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Departments
  { elementId: 'create-department-btn', permission: 'create_department', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-department-btn', permission: 'edit_department', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-department-btn', permission: 'delete_department', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Locations
  { elementId: 'create-location-btn', permission: 'create_location', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-location-btn', permission: 'edit_location', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-location-btn', permission: 'delete_location', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Employee Status
  { elementId: 'create-employee-status-btn', permission: 'create_employee_status', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-employee-status-btn', permission: 'edit_employee_status', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-employee-status-btn', permission: 'delete_employee_status', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Movement Settings
  { elementId: 'create-movement-settings-btn', permission: 'create_movement_settings', type: 'button', fallbackBehavior: 'disable' },

  // General Settings - Email Templates
  { elementId: 'create-email-template-btn', permission: 'create_email_template', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-email-template-btn', permission: 'edit_email_template', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'delete-email-template-btn', permission: 'delete_email_template', type: 'button', fallbackBehavior: 'disable' },

];

// Helper functions
export const getPermissionForElement = (elementId: string): string | null => {
  const config = UI_PERMISSIONS.find(p => p.elementId === elementId);
  return config?.permission || null;
};

export const getFallbackBehavior = (elementId: string): 'hide' | 'disable' | 'readonly' => {
  const config = UI_PERMISSIONS.find(p => p.elementId === elementId);
  return config?.fallbackBehavior || 'disable';
};

export const getElementType = (elementId: string): 'button' | 'menu' | 'section' | 'action' => {
  const config = UI_PERMISSIONS.find(p => p.elementId === elementId);
  return config?.type || 'button';
};
