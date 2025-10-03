// Smart Menu Item Component with REAL permission checking
import React from 'react';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

interface SmartMenuItemProps {
  id: string;
  name: string;
  action: () => void;
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
}

export const SmartMenuItem: React.FC<SmartMenuItemProps> = ({
  id,
  name,
  action,
  className = '',
  activeClassName = 'bg-gray-100 text-gray-900',
  disabledClassName = 'bg-gray-200 cursor-not-allowed opacity-50'
}) => {
  const cachedRights = useLegacyPermissions();
  
  // Get required permission for this menu item
  const requiredPermission = getPermissionForElement(id);
  const fallbackBehavior = getFallbackBehavior(id);
  
  // Check if user has the required permission
  const hasPermission = requiredPermission 
    ? cachedRights?.state?.data?.[requiredPermission] || false
    : true; // If no permission required, allow access
  
  // Handle hide behavior
  if (!hasPermission && fallbackBehavior === 'hide') {
    return null;
  }
  
  const isDisabled = !hasPermission && fallbackBehavior === 'disable';
  
  // Create a safe action that only executes if user has permission
  const safeAction = () => {
    if (hasPermission && !isDisabled) {
      action();
    }
  };
  
  return (
    <div
      className={`${className} ${isDisabled ? disabledClassName : ''}`}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        safeAction();
      }}
      onMouseDown={(e) => {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={isDisabled ? { 
        pointerEvents: 'none',
        userSelect: 'none'
      } : {}}
      data-permission-id={id}
      data-required-permission={requiredPermission}
      data-has-permission={hasPermission}
      data-is-disabled={isDisabled}
    >
      {name}
    </div>
  );
};
