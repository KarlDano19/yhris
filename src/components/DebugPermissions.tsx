// Enhanced Debug Component to diagnose permission issues
import React from 'react';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

const DebugPermissions = () => {
  const cachedRights = useLegacyPermissions();
  
  // Test specific button permissions
  const createEmployeePermission = getPermissionForElement('create-employee-btn');
  const hasCreateEmployeePermission = cachedRights?.state?.data?.[createEmployeePermission] || false;
  
  console.log('🔍 PERMISSION DEBUG:', {
    fullPermissionData: cachedRights?.state?.data,
    isLoading: cachedRights?.state?.isLoading,
    createEmployeeConfig: {
      elementId: 'create-employee-btn',
      requiredPermission: createEmployeePermission,
      fallbackBehavior: getFallbackBehavior('create-employee-btn'),
      hasPermission: hasCreateEmployeePermission
    }
  });

  const permissionKeys = Object.keys(cachedRights?.state?.data || {});

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-md text-xs z-50 max-w-sm">
      <h4 className="font-bold mb-2">🔍 Permission Debug Info:</h4>
      
      <div className="mb-2 p-2 bg-white rounded border">
        <strong>CREATE Button Test:</strong>
        <div>Required Permission: {createEmployeePermission}</div>
        <div>Has Permission: {hasCreateEmployeePermission ? '✅ YES' : '❌ NO'}</div>
        <div>Fallback: {getFallbackBehavior('create-employee-btn')}</div>
      </div>
      
      <div className="mb-2 p-2 bg-white rounded border">
        <strong>All User Permissions ({permissionKeys.length}):</strong>
        <div className="max-h-32 overflow-y-auto text-xs">
          {permissionKeys.map(key => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span>{cachedRights?.state?.data?.[key] ? '✅' : '❌'}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default DebugPermissions;