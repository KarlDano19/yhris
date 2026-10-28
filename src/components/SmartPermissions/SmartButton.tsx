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
  /**
   * When true, SmartButton delegates rendering to its single child element instead
   * of wrapping it in a <button>. Use this when the child is already a button-like
   * element (e.g. headlessui MenuButton) to avoid nested <button> hydration errors.
   * The child receives `disabled` and any permission-driven className additions.
   */
  asChild?: boolean;
}

export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(({
  id,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  title = '',
  asChild = false,
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
  const isDisabledByPermissions = !hasPermission && fallbackBehavior === 'disable';

  // asChild mode: inject disabled/className into the child element rather than
  // rendering a wrapping <button>, preventing nested button DOM violations.
  if (asChild && React.isValidElement(children)) {
    const childProps = (children as React.ReactElement<any>).props;
    const mergedClassName = isDisabledByPermissions
      ? `${childProps.className || ''} opacity-50 cursor-not-allowed`.trim()
      : childProps.className;
    return React.cloneElement(children as React.ReactElement<any>, {
      disabled: isDisabled,
      className: mergedClassName,
    });
  }

  // Add opacity when disabled due to permissions
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
