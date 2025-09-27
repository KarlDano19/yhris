export interface PermissionConfig {
    name: string;
    category: string;
    description: string;
    routes?: string[];
    components?: string[];
    actions?: string[];
    menuItems?: string[];
    fields?: string[];
    metadata?: {
      icon?: string;
      color?: string;
      priority?: number;
    };
  }
  
  // Complete configuration mapping ALL your UserRights to UI elements
  export const PERMISSION_CONFIG: Record<string, PermissionConfig> = {
    // Employee Management
    'create_employee': {
      name: 'create_employee',
      category: 'employee',
      description: 'Create new employees in the system',
      routes: ['/employees/create'],
      components: ['EmployeeCreateForm', 'EmployeeCreateModal', 'EmployeeQuickAdd'],
      actions: ['create-employee-btn', 'add-employee-btn', 'quick-add-employee-btn'],
      menuItems: ['employees-create', 'sidebar-employee-create'],
      fields: ['employee-create-form', 'employee-basic-info'],
      metadata: { icon: 'UserPlus', color: 'blue', priority: 1 }
    },
    
    'edit_employee': {
      name: 'edit_employee',
      category: 'employee',
      description: 'Edit existing employee information',
      routes: ['/employees/:id/edit', '/employees/:id', '/employees/*/profile'],
      components: ['EmployeeEditForm', 'EmployeeProfile', 'EmployeeDetailsModal'],
      actions: ['edit-employee-btn', 'save-employee-btn', 'update-employee-btn'],
      fields: ['employee-edit-form', 'employee-personal-info', 'employee-contact-info'],
      metadata: { icon: 'Edit', color: 'green', priority: 2 }
    },
    
    'import_employee': {
      name: 'import_employee',
      category: 'employee',
      description: 'Import employees from files (CSV, Excel)',
      components: ['EmployeeImportModal', 'EmployeeImportForm', 'FileUploadArea'],
      actions: ['import-employees-btn', 'upload-employees-btn', 'bulk-import-btn'],
      fields: ['employee-import-form', 'file-upload-field'],
      metadata: { icon: 'Upload', color: 'purple', priority: 3 }
    },
    
    'export_employee': {
      name: 'export_employee',
      category: 'employee',
      description: 'Export employee data to files',
      actions: ['export-employees-btn', 'download-employees-btn', 'export-csv-btn', 'export-excel-btn'],
      metadata: { icon: 'Download', color: 'orange', priority: 4 }
    },
  
    // Job Management
    'create_job': {
      name: 'create_job',
      category: 'job',
      description: 'Create new job postings',
      routes: ['/jobs/create', '/job-postings/new'],
      components: ['JobCreateForm', 'JobPostingModal', 'QuickJobForm'],
      actions: ['create-job-btn', 'post-job-btn', 'add-job-posting-btn'],
      menuItems: ['jobs-create', 'sidebar-job-create'],
      fields: ['job-create-form', 'job-basic-info', 'job-requirements'],
      metadata: { icon: 'Briefcase', color: 'indigo', priority: 1 }
    },
    
    'edit_job': {
      name: 'edit_job',
      category: 'job',
      description: 'Edit existing job postings',
      routes: ['/jobs/:id/edit', '/jobs/:id', '/job-postings/:id/edit'],
      components: ['JobEditForm', 'JobDetailsModal', 'JobSettingsPanel'],
      actions: ['edit-job-btn', 'save-job-btn', 'update-job-btn', 'publish-job-btn'],
      fields: ['job-edit-form', 'job-description-field', 'job-requirements-field'],
      metadata: { icon: 'Edit', color: 'green', priority: 2 }
    },
    
    'view_applicant': {
      name: 'view_applicant',
      category: 'job',
      description: 'View job applicants and their information',
      routes: ['/jobs/:id/applicants', '/applicants', '/applications'],
      components: ['ApplicantList', 'ApplicantProfile', 'ApplicantDetailsModal'],
      actions: ['view-applicants-btn', 'show-applicants-btn', 'applicant-details-btn'],
      menuItems: ['applicants-menu', 'sidebar-applicants'],
      metadata: { icon: 'Users', color: 'cyan', priority: 3 }
    },
    
    'schedule_interview': {
      name: 'schedule_interview',
      category: 'job',
      description: 'Schedule interviews with applicants',
      components: ['InterviewScheduleModal', 'InterviewCalendar', 'InterviewForm'],
      actions: ['schedule-interview-btn', 'book-interview-btn', 'set-interview-btn'],
      fields: ['interview-schedule-form', 'interview-datetime-field'],
      metadata: { icon: 'Calendar', color: 'teal', priority: 4 }
    },
  
    // DOLE Permissions (Complete set)
    'create_dole_employee_compensation': {
      name: 'create_dole_employee_compensation',
      category: 'dole',
      description: 'Create DOLE employee compensation reports',
      routes: ['/dole/employee-compensation/create'],
      components: ['DOLECompensationCreateForm', 'DOLECompensationWizard'],
      actions: ['create-compensation-report-btn', 'new-dole-compensation-btn'],
      menuItems: ['dole-compensation-create'],
      fields: ['dole-compensation-form'],
      metadata: { icon: 'DollarSign', color: 'emerald', priority: 1 }
    },
    
    'edit_dole_employee_compensation': {
      name: 'edit_dole_employee_compensation',
      category: 'dole',
      description: 'Edit DOLE employee compensation reports',
      routes: ['/dole/employee-compensation/:id/edit'],
      components: ['DOLECompensationEditForm', 'DOLECompensationDetails'],
      actions: ['edit-compensation-btn', 'save-compensation-btn'],
      fields: ['dole-compensation-edit-form'],
      metadata: { icon: 'Edit', color: 'green', priority: 2 }
    },
    
    'export_dole_employee_compensation': {
      name: 'export_dole_employee_compensation',
      category: 'dole',
      description: 'Export DOLE employee compensation reports',
      actions: ['export-compensation-btn', 'download-compensation-report-btn'],
      metadata: { icon: 'Download', color: 'blue', priority: 3 }
    },
    
    'generate_dole_employee_compensation': {
      name: 'generate_dole_employee_compensation',
      category: 'dole',
      description: 'Auto-generate DOLE employee compensation reports',
      components: ['DOLECompensationGenerator', 'DOLEAutoGenModal'],
      actions: ['generate-compensation-btn', 'auto-generate-compensation-btn'],
      metadata: { icon: 'Zap', color: 'yellow', priority: 4 }
    },
  
    // Add all other DOLE permissions (20+ more)...
    'create_dole_awair': {
      name: 'create_dole_awair',
      category: 'dole',
      description: 'Create DOLE AWAIR reports',
      routes: ['/dole/awair/create'],
      components: ['DOLEAWAIRCreateForm', 'DOLEAWAIRModal'],
      actions: ['create-awair-btn', 'new-awair-report-btn'],
      menuItems: ['dole-awair-create'],
      fields: ['dole-awair-form'],
      metadata: { icon: 'AlertTriangle', color: 'red', priority: 5 }
    },
  
    // System Settings
    'settings_access': {
      name: 'settings_access',
      category: 'system',
      description: 'Access system settings and configuration',
      routes: ['/settings', '/settings/*', '/admin', '/configuration'],
      components: ['SettingsPanel', 'AdminDashboard', 'ConfigurationForm'],
      actions: ['access-settings-btn', 'admin-panel-btn'],
      menuItems: ['settings-menu', 'admin-menu', 'sidebar-settings'],
      metadata: { icon: 'Settings', color: 'gray', priority: 1 }
    },
    
    'audit_log_access': {
      name: 'audit_log_access',
      category: 'system',
      description: 'View system audit logs and user activity',
      routes: ['/audit-logs', '/logs', '/activity'],
      components: ['AuditLogViewer', 'ActivityLog', 'SystemLogsPanel'],
      actions: ['view-logs-btn', 'export-logs-btn', 'filter-logs-btn'],
      menuItems: ['audit-logs-menu', 'logs-menu'],
      metadata: { icon: 'FileText', color: 'slate', priority: 2 }
    },
  
    // Add ALL other permissions from your UserRights...
    // (I'm showing key examples - you'd include all 60+ permissions)
  };
  
  // Helper functions for dynamic configuration
  export const getPermissionsByCategory = (category: string): PermissionConfig[] => {
    return Object.values(PERMISSION_CONFIG).filter(p => p.category === category);
  };
  
  export const getAllCategories = (): string[] => {
    return Array.from(new Set(Object.values(PERMISSION_CONFIG).map(p => p.category)));
  };
  
  export const getCategoryDisplayName = (category: string): string => {
    const displayNames: Record<string, string> = {
      'employee': 'Employee Management',
      'job': 'Job Management', 
      'orientation': 'Orientation',
      'employee_issue': 'Employee Issues',
      'memo': 'Memos',
      'training': 'Training',
      'payroll': 'Payroll',
      'separation': 'Employee Separation',
      'employee_kit': 'Employee Kits',
      'dole': 'DOLE Compliance',
      'system': 'System Administration',
      'rbac': 'Role & Permission Management'
    };
    return displayNames[category] || category;
  };
  
  // Auto-generated route configurations
  export const ROUTE_PERMISSIONS = Object.values(PERMISSION_CONFIG)
    .filter(config => config.routes && config.routes.length > 0)
    .flatMap(config => 
      config.routes!.map(route => ({
        path: route,
        requiredPermissions: [config.name],
        redirectTo: getDefaultRedirect(config.category)
      }))
    );
  
  // Auto-generated component configurations
  export const COMPONENT_PERMISSIONS = Object.values(PERMISSION_CONFIG)
    .filter(config => config.components && config.components.length > 0)
    .flatMap(config =>
      config.components!.map(componentKey => ({
        key: componentKey,
        requiredPermissions: [config.name],
        fallback: 'hide' as const,
        category: config.category
      }))
    );
  
  // Auto-generated action configurations
  export const ACTION_PERMISSIONS = Object.values(PERMISSION_CONFIG)
    .filter(config => config.actions && config.actions.length > 0)
    .flatMap(config =>
      config.actions!.map(actionKey => ({
        key: actionKey,
        requiredPermissions: [config.name],
        type: 'button' as const,
        fallback: 'hide' as const,
        metadata: config.metadata
      }))
    );
  
  function getDefaultRedirect(category: string): string {
    const redirects: Record<string, string> = {
      'employee': '/employees',
      'job': '/jobs',
      'dole': '/dole',
      'system': '/dashboard'
    };
    return redirects[category] || '/dashboard';
  }

// Field-based protection for forms
export const FIELD_PERMISSIONS: Record<string, string[]> = Object.values(PERMISSION_CONFIG)
  .filter(config => config.fields && config.fields.length > 0)
  .reduce((acc, config) => {
    config.fields!.forEach(fieldKey => {
      if (!acc[fieldKey]) {
        acc[fieldKey] = [];
      }
      acc[fieldKey].push(config.name);
    });
    return acc;
  }, {} as Record<string, string[]>);

// Helper functions to get permissions by type
export const getPermissionConfig = (permissionName: string): PermissionConfig | undefined => {
  return PERMISSION_CONFIG[permissionName];
};

export const getRoutePermissions = (path: string): string[] => {
  const route = ROUTE_PERMISSIONS.find(r => {
    // Simple path matching (you might want to use a proper router matcher)
    const regex = new RegExp(r.path.replace(/:\w+/g, '[^/]+').replace(/\*/g, '.*'));
    return regex.test(path);
  });
  return route?.requiredPermissions || [];
};

export const getComponentPermissions = (componentKey: string) => {
  return COMPONENT_PERMISSIONS.find(c => c.key === componentKey);
};

export const getActionPermissions = (actionKey: string) => {
  return ACTION_PERMISSIONS.find(a => a.key === actionKey);
};

export const getFieldPermissions = (fieldKey: string): string[] => {
  return FIELD_PERMISSIONS[fieldKey] || [];
};
