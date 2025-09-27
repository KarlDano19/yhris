// UI Permission Configuration - Define permissions and their UI elements
export interface UIPermissionConfig {
  elementId: string;
  permission: string;
  type: 'button' | 'menu' | 'section' | 'action';
  fallbackBehavior?: 'hide' | 'disable' | 'readonly';
}

export const UI_PERMISSIONS: UIPermissionConfig[] = [
  // Employee Management Buttons
  { elementId: 'create-employee-btn', permission: 'create_employee', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-employee-btn', permission: 'edit_employee', type: 'action', fallbackBehavior: 'disable' },
  { elementId: 'delete-employee-btn', permission: 'edit_employee', type: 'action', fallbackBehavior: 'disable' },
  
  // Import/Export Operations
  { elementId: 'import-employee-btn', permission: 'import_employee', type: 'menu', fallbackBehavior: 'disable' },
  { elementId: 'export-employee-btn', permission: 'export_employee', type: 'menu', fallbackBehavior: 'disable' },
  { elementId: 'download-template-btn', permission: 'import_employee', type: 'menu', fallbackBehavior: 'disable' },
  
  // Job Management
  { elementId: 'create-job-btn', permission: 'create_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-job-btn', permission: 'edit_job', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'view-applicant-btn', permission: 'view_applicant', type: 'button', fallbackBehavior: 'hide' },
  { elementId: 'schedule-interview-btn', permission: 'schedule_interview', type: 'button', fallbackBehavior: 'disable' },
  
  // Orientation Management
  { elementId: 'create-orientation-btn', permission: 'create_orientation', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-orientation-btn', permission: 'edit_orientation', type: 'button', fallbackBehavior: 'disable' },
  
  // Payroll Management
  { elementId: 'create-payroll-btn', permission: 'create_payroll', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-payroll-btn', permission: 'edit_payroll', type: 'button', fallbackBehavior: 'disable' },
  
  // Employee Issues
  { elementId: 'create-issue-btn', permission: 'create_employee_issue', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-issue-btn', permission: 'edit_employee_issue', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-nte-btn', permission: 'generate_employee_issue_nte', type: 'button', fallbackBehavior: 'disable' },
  
  // Training & Memo
  { elementId: 'create-training-btn', permission: 'create_training', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-training-btn', permission: 'edit_training', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'create-memo-btn', permission: 'create_memo', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-memo-btn', permission: 'edit_memo', type: 'button', fallbackBehavior: 'disable' },
  
  // DOLE Forms (Sample - you can expand this)
  { elementId: 'create-dole-awair-btn', permission: 'create_dole_awair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'edit-dole-wair-btn', permission: 'edit_dole_wair', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'generate-dole-report-btn', permission: 'generate_dole_awair', type: 'button', fallbackBehavior: 'disable' },
  
  // Settings & Admin
  { elementId: 'settings-section', permission: 'settings_access', type: 'section', fallbackBehavior: 'hide' },
  { elementId: 'audit-log-access', permission: 'audit_log_access', type: 'section', fallbackBehavior: 'hide' },
  
  // Future Dynamic Permissions (Examples)
  { elementId: 'manage-inventory-btn', permission: 'manage_inventory', type: 'button', fallbackBehavior: 'disable' },
  { elementId: 'custom-reports-btn', permission: 'create_custom_report', type: 'button', fallbackBehavior: 'disable' },
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
