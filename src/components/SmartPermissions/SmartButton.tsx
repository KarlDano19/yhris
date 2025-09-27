// Smart Button Component with REAL permission checking
import React from 'react';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

interface SmartButtonProps {
  id: string; 
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean; 
  type?: 'button' | 'submit' | 'reset';
}

export const SmartButton: React.FC<SmartButtonProps> = ({
  id,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const cachedRights = useLegacyPermissions();
  
  // Get required permission for this button
  const requiredPermission = getPermissionForElement(id);
  const fallbackBehavior = getFallbackBehavior(id);
  
  // Check if user has the required permission
  const hasPermission = requiredPermission 
    ? cachedRights?.state?.data?.[requiredPermission] || false
    : true; // If no permission required, allow access
  
  // Debug logging
  console.log(`SmartButton ${id}:`, {
    requiredPermission,
    hasPermission,
    fallbackBehavior,
    permissionData: cachedRights?.state?.data?.[requiredPermission]
  });
  
  // Handle hide behavior
  if (!hasPermission && fallbackBehavior === 'hide') {
    return null;
  }
  
  // Combine permission-based disabled state with prop disabled state
  const isDisabled = disabled || (!hasPermission && fallbackBehavior === 'disable');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      data-permission-id={id}
      data-required-permission={requiredPermission}
      data-has-permission={hasPermission}
      data-is-disabled={isDisabled}
    >
      {children}
    </button>
  );
};
