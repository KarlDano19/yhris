import React, { ReactNode } from 'react';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '@/hooks/useUserPermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredAnyPermissions?: string[];
  requiredAllPermissions?: string[];
  fallback?: ReactNode;
  hideOnNoAccess?: boolean;
}

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @param children - Content to render if user has required permissions
 * @param requiredPermission - Single permission required
 * @param requiredAnyPermissions - User must have at least one of these permissions
 * @param requiredAllPermissions - User must have all of these permissions
 * @param fallback - Content to show if access is denied (default: Access Denied message)
 * @param hideOnNoAccess - If true, renders nothing instead of fallback when access denied
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  requiredAnyPermissions,
  requiredAllPermissions,
  fallback,
  hideOnNoAccess = false,
}: ProtectedRouteProps) {
  const hasSinglePermission = useHasPermission(requiredPermission || '');
  const hasAnyPermission = useHasAnyPermission(requiredAnyPermissions || []);
  const hasAllPermissions = useHasAllPermissions(requiredAllPermissions || []);

  // Determine if user has access
  let hasAccess = true;

  if (requiredPermission) {
    hasAccess = hasAccess && hasSinglePermission;
  }

  if (requiredAnyPermissions && requiredAnyPermissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission;
  }

  if (requiredAllPermissions && requiredAllPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (hideOnNoAccess) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className='flex items-center justify-center p-8'>
      <div className='text-center'>
        <div className='text-6xl mb-4'>🔒</div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Access Denied</h3>
        <p className='text-sm text-gray-500'>
          You don&apos;t have permission to view this content.
        </p>
      </div>
    </div>
  );
}

/**
 * Higher-order component for protecting entire pages
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string,
  fallback?: ReactNode
) {
  return function PermissionProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredPermission={requiredPermission} fallback={fallback}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Component that renders children only if user has the required permission
 * More concise version for inline use
 */
export function IfHasPermission({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const hasPermission = useHasPermission(permission);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component that renders children only if user has ANY of the required permissions
 */
export function IfHasAnyPermission({
  permissions,
  children,
}: {
  permissions: string[];
  children: ReactNode;
}) {
  const hasAnyPermission = useHasAnyPermission(permissions);

  if (!hasAnyPermission) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component that renders children only if user has ALL of the required permissions
 */
export function IfHasAllPermissions({
  permissions,
  children,
}: {
  permissions: string[];
  children: ReactNode;
}) {
  const hasAllPermissions = useHasAllPermissions(permissions);

  if (!hasAllPermissions) {
    return null;
  }

  return <>{children}</>;
}
