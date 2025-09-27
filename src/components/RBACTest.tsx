import React from 'react';
import { useLegacyPermissions, usePermission } from '@/hooks/useLegacyPermissions';
import { useUserPermissions } from '@/hooks/useUserPermissions';

/**
 * Test component to verify your RBAC system is working
 * Add this to any page to test your permissions
 */
const RBACTest: React.FC = () => {
  // Test the legacy compatibility hook (your existing pattern)
  const cachedRights = useLegacyPermissions();
  
  // Test the new permission hook
  const createEmployee = usePermission('create_employee');
  const editEmployee = usePermission('edit_employee');
  const createJob = usePermission('create_job');
  
  // Test the original hook for comparison
  const { data: allPermissions, isLoading } = useUserPermissions();

  if (isLoading || cachedRights.state.isLoading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">🔄 Loading permissions...</p>
      </div>
    );
  }

  const testPermissions = [
    'create_employee',
    'edit_employee', 
    'create_job',
    'create_dole_awair',
    'settings_access'
  ];

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 RBAC Test Panel</h3>
      
      {/* Test Legacy Hook */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Legacy Compatibility Test (cachedRights)</h4>
        <div className="space-y-2">
          {testPermissions.map(permission => (
            <div key={permission} className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cachedRights?.state?.data?.[permission] 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {cachedRights?.state?.data?.[permission] ? '✅' : '❌'}
              </span>
              <code className="text-sm">{permission}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Test New Hook */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">New Permission Hooks Test</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              createEmployee.hasPermission ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {createEmployee.hasPermission ? '✅' : '❌'}
            </span>
            <code className="text-sm">create_employee (usePermission)</code>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              editEmployee.hasPermission ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {editEmployee.hasPermission ? '✅' : '❌'}
            </span>
            <code className="text-sm">edit_employee (usePermission)</code>
          </div>
        </div>
      </div>

      {/* Test Button Examples */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Button Examples</h4>
        <div className="space-x-3">
          {/* Legacy Pattern */}
          <button
            disabled={!cachedRights?.state?.data?.create_employee}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              cachedRights?.state?.data?.create_employee
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Employee (Legacy)
          </button>

          {/* New Pattern */}
          <button
            disabled={!createJob.hasPermission}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              createJob.hasPermission
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Job (New Hook)
          </button>
        </div>
      </div>

      {/* Raw Data Debug */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Debug Information</h4>
        <details className="text-sm">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
            Show Raw Permission Data
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <div className="mb-2">
              <strong>Total Categories:</strong> {allPermissions ? Object.keys(allPermissions).length : 0}
            </div>
            <div className="mb-2">
              <strong>Total Permissions:</strong> {
                allPermissions ? Object.values(allPermissions).flat().length : 0
              }
            </div>
            <div className="mb-2">
              <strong>Permission Names:</strong>
              <pre className="text-xs mt-1 p-2 bg-white rounded border max-h-32 overflow-y-auto">
                {allPermissions ? 
                  JSON.stringify(
                    Object.values(allPermissions).flat().map((p: any) => p.name), 
                    null, 
                    2
                  ) : 
                  'Loading...'
                }
              </pre>
            </div>
          </div>
        </details>
      </div>

      {/* Status Summary */}
      <div className="text-sm text-gray-600">
        <p>
          🎯 <strong>Status:</strong> RBAC system is {' '}
          {cachedRights?.state?.data && Object.keys(cachedRights.state.data).length > 0 
            ? 'working correctly!' 
            : 'not returning permissions - check backend API'}
        </p>
      </div>
    </div>
  );
};

export default RBACTest;
