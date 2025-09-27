// Smart Permission Hook for easy access to user permissions
import { useMemo } from 'react';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

export const useSmartPermissions = () => {
  const { data: permissions, isLoading } = useUserPermissions();
  
  const userPermissionNames = useMemo(() => {
    if (isLoading || !permissions) return [];
    
    // Extract all permission names from the grouped structure
    const allPermissions: string[] = [];
    for (const category in permissions) {
      permissions[category].forEach((permission: any) => {
        allPermissions.push(permission.name);
      });
    }
    return allPermissions;
  }, [permissions, isLoading]);
  
  const hasPermission = (permissionName: string): boolean => {
    if (isLoading || !permissions) return false;
    return userPermissionNames.includes(permissionName);
  };
  
  const canUseElement = (elementId: string): { canUse: boolean; behavior: 'hide' | 'disable' | 'show' } => {
    const requiredPermission = getPermissionForElement(elementId);
    const fallbackBehavior = getFallbackBehavior(elementId);
    
    // If no permission required, always allow
    if (!requiredPermission) {
      return { canUse: true, behavior: 'show' };
    }
    
    // Check if user has the required permission
    const hasRequiredPermission = hasPermission(requiredPermission);
    
    if (hasRequiredPermission) {
      return { canUse: true, behavior: 'show' };
    } else {
      return { 
        canUse: false, 
        behavior: fallbackBehavior === 'hide' ? 'hide' : 'disable' 
      };
    }
  };
  
  return {
    hasPermission,
    canUseElement,
    isLoading,
    userPermissions: userPermissionNames
  };
};
