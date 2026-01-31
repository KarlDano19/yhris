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
  title?: string;
}

export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(({
  id,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  title = '',
}, ref) => {
  const cachedRights = useLegacyPermissions();

  // Get required permission for this button
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

  // Combine permission-based disabled state with prop disabled state
  const isDisabled = disabled || (!hasPermission && fallbackBehavior === 'disable');

  // Add opacity when disabled due to permissions
  const isDisabledByPermissions = !hasPermission && fallbackBehavior === 'disable';
  const finalClassName = isDisabledByPermissions
    ? `${className} opacity-50 cursor-not-allowed`.trim()
    : className;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={finalClassName}
      data-permission-id={id}
      data-required-permission={requiredPermission}
      data-has-permission={hasPermission}
      data-is-disabled={isDisabled}
      title={title}
    >
      {children}
    </button>
  );
});

SmartButton.displayName = 'SmartButton';
