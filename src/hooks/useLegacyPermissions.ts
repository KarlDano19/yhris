import { useUserPermissions } from './useUserPermissions';
import { useMemo } from 'react';

/**
 * Legacy compatibility hook that mimics your old cachedRights structure
 * This allows you to use the new RBAC system with minimal changes to existing components
 */
export const useLegacyPermissions = () => {
  const { data: permissions, isLoading } = useUserPermissions();

  const cachedRights = useMemo(() => {
    if (isLoading || !permissions) {
      return { 
        state: { 
          data: {},
          isLoading: true 
        } 
      };
    }

    // Get flat list of user permission names
    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    // Create object that matches your old cachedRights structure
    const permissionData: Record<string, boolean> = {};
    
    // Map all possible permissions to boolean values (ALL your UserRights permissions)
    const allPermissions = [
      // Dashboard Pages
      'view_post_job_page', 'view_talent_search_page', 'view_screen_applicant_page', 
      'view_onboarding_page', 'view_manage_page', 'view_train_page', 
      'view_employee_separation_page', 'view_dole_page', 'view_analytics_page', 
      'view_settings_page', 'view_audit_log_page',
      
      // Employee Management
      'create_employee', 'edit_employee', 'import_employee', 'export_employee', 'delete_employee',
      
      // Job Management
      'create_job', 'edit_job', 'delete_job', 'assign_job', 'view_all_job_history', 'schedule_interview',
      
      // Screen Applicants
      'assign_job_stage', 'create_job_stage', 'delete_job_stage', 'edit_job_stage', 
      'move_job_stage', 'unarchive_applicant', 'upload_resume',
      
      // Onboarding
      'allow_onboarding',
      
      // Employee Issues
      'create_employee_issue', 'edit_employee_issue', 'generate_employee_issue_nte',
      'investigate_employee_issue', 'decide_employee_issue', 'update_employee_issue_status',
      
      // Memo & Training
      'create_memo', 'edit_memo',
      
      // Designed Benefits
      'create_benefit',
      
      // Employee Movement
      'create_employee_movement',
      
      // Generate Documents
      'generate_documents',
      
      // Employee 201
      'view_employee_201', 'edit_employee_201',
      
      // Separation & Employee Kit
      'create_separation', 'edit_separation',
      
      // All DOLE permissions
      'create_dole_employee_compensation', 'edit_dole_employee_compensation', 
      'export_dole_employee_compensation', 'generate_dole_employee_compensation',
      'create_dole_safety_health_policy', 'edit_dole_safety_health_policy',
      'create_dole_awair', 'edit_dole_awair', 'generate_dole_awair',
      'create_dole_health_safety_organization', 'edit_dole_health_safety_organization',
      'export_dole_health_safety_organization', 'generate_dole_health_safety_organization',
      'create_dole_establishment_registration', 'edit_dole_establishment_registration',
      'create_dole_SHC_minute', 'edit_dole_SHC_minute', 'export_dole_SHC_minute',
      'create_dole_wair', 'edit_dole_wair', 'export_dole_wair', 'generate_dole_wair',
      'create_dole_annual_medical_report', 'edit_dole_annual_medical_report',
      'export_dole_annual_medical_report', 'generate_dole_annual_medical_report',
      'create_dole_work_environment_request', 'edit_dole_work_environment_request',
      'export_dole_work_environment_request', 'generate_dole_work_environment_request',
      'create_dole_osh_program', 'edit_dole_osh_program',
      
      // Settings
      'create_sub_account', 'edit_sub_account', 'delete_sub_account',
      'create_permission', 'edit_permission', 'delete_permission',
      'create_role', 'edit_role', 'delete_role', 'assign_user_roles', 'manage_roles',
      
      // General Settings
      'create_position', 'edit_position', 'delete_position',
      'create_department', 'edit_department', 'delete_department',
      'create_location', 'edit_location', 'delete_location',
      'create_employee_status', 'edit_employee_status', 'delete_employee_status',
      'create_movement_settings', 'edit_movement_settings', 'delete_movement_settings',
      'create_email_template', 'edit_email_template', 'delete_email_template',
    ];

    // Set all permissions to false by default, then enable those the user has
    allPermissions.forEach(permission => {
      permissionData[permission] = userPermissionNames.includes(permission);
    });

    return {
      state: {
        data: permissionData,
        isLoading: false
      }
    };
  }, [permissions, isLoading]);

  return cachedRights;
};

/**
 * Hook to check if user has a specific named permission (simple version)
 * Usage: const { hasPermission } = usePermission('create_employee');
 */
export const usePermission = (permissionName: string) => {
  const { data: permissions, isLoading } = useUserPermissions();

  return useMemo(() => {
    if (isLoading || !permissions) {
      return {
        hasPermission: false,
        isLoading: true
      };
    }

    // Get flat list of user permission names
    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    return {
      hasPermission: userPermissionNames.includes(permissionName),
      isLoading: false
    };
  }, [permissions, isLoading, permissionName]);
};

/**
 * Hook to check multiple permissions (AND logic - user must have ALL)
 */
export const useAllPermissions = (permissionNames: string[]) => {
  const { data: permissions, isLoading } = useUserPermissions();

  return useMemo(() => {
    if (isLoading || !permissions) {
      return {
        hasPermission: false,
        isLoading: true,
        missingPermissions: permissionNames
      };
    }

    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    const hasPermission = permissionNames.every(permission => 
      userPermissionNames.includes(permission)
    );

    return {
      hasPermission,
      isLoading: false,
      missingPermissions: permissionNames.filter(permission => 
        !userPermissionNames.includes(permission)
      )
    };
  }, [permissions, isLoading, permissionNames]);
};

/**
 * Hook to check multiple permissions (OR logic - user needs ANY)
 */
export const useAnyPermission = (permissionNames: string[]) => {
  const { data: permissions, isLoading } = useUserPermissions();

  return useMemo(() => {
    if (isLoading || !permissions) {
      return {
        hasPermission: false,
        isLoading: true,
        grantedPermissions: []
      };
    }

    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    const hasPermission = permissionNames.some(permission => 
      userPermissionNames.includes(permission)
    );

    return {
      hasPermission,
      isLoading: false,
      grantedPermissions: permissionNames.filter(permission => 
        userPermissionNames.includes(permission)
      )
    };
  }, [permissions, isLoading, permissionNames]);
};
