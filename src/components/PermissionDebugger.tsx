// Temporary Debug Component for Permissions
import React from 'react';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';

export const PermissionDebugger: React.FC = () => {
  const cachedRights = useLegacyPermissions();
  
  const dashboardPermissions = [
    'view_post_job_page',
    'view_talent_search_page', 
    'view_screen_applicant_page',
    'view_onboarding_page',
    'view_manage_page',
    'view_train_page',
    'view_employee_separation_page',
    'view_dole_page',
    'view_analytics_page',
    'view_settings_page',
    'view_audit_log_page'
  ];

  if (cachedRights?.state?.isLoading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800">Loading permissions...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 text-xs rounded-lg mb-4">
      <h3 className="font-bold mb-2">Permission Debug (HR Manager):</h3>
      <div className="grid grid-cols-2 gap-2">
        {dashboardPermissions.map(permission => (
          <div key={permission} className={`p-2 rounded ${
            cachedRights?.state?.data?.[permission] 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className="font-mono text-xs">
              {permission}: {cachedRights?.state?.data?.[permission] ? '✅' : '❌'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-gray-600">
        Total permissions loaded: {Object.keys(cachedRights?.state?.data || {}).length}
      </div>
    </div>
  );
};
