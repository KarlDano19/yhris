import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  category: string;
  is_active: boolean;
}

interface PermissionsByCategory {
  [category: string]: Permission[];
}

async function getUserPermissions(): Promise<PermissionsByCategory> {
  try {
    const token = getCookie('token');
    if (!token) {
      return {};
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/permissions/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch permissions');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return {};
  }
}

/**
 * Hook to get all user permissions grouped by category
 */
export function useUserPermissions() {
  return useQuery({
    queryKey: ['userPermissions'],
    queryFn: getUserPermissions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to check if user has a specific permission
 * @param permissionName - The permission name to check (e.g., 'create_employee')
 * @returns boolean indicating if user has the permission
 */
export function useHasPermission(permissionName: string): boolean {
  const { data: permissions, isLoading } = useUserPermissions();

  if (isLoading || !permissions) {
    return false;
  }

  // Check if permission exists in any category
  for (const category in permissions) {
    const hasPermission = permissions[category].some(
      (permission: Permission) => permission.name === permissionName
    );
    if (hasPermission) {
      return true;
    }
  }

  return false;
}

/**
 * Hook to check if user has any of the specified permissions
 * @param permissionNames - Array of permission names to check
 * @returns boolean indicating if user has at least one of the permissions
 */
export function useHasAnyPermission(permissionNames: string[]): boolean {
  const { data: permissions, isLoading } = useUserPermissions();

  if (isLoading || !permissions || !permissionNames.length) {
    return false;
  }

  return permissionNames.some(permissionName => {
    for (const category in permissions) {
      const hasPermission = permissions[category].some(
        (permission: Permission) => permission.name === permissionName
      );
      if (hasPermission) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Hook to check if user has all of the specified permissions
 * @param permissionNames - Array of permission names to check
 * @returns boolean indicating if user has all of the permissions
 */
export function useHasAllPermissions(permissionNames: string[]): boolean {
  const { data: permissions, isLoading } = useUserPermissions();

  if (isLoading || !permissions || !permissionNames.length) {
    return false;
  }

  return permissionNames.every(permissionName => {
    for (const category in permissions) {
      const hasPermission = permissions[category].some(
        (permission: Permission) => permission.name === permissionName
      );
      if (hasPermission) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Hook to get permissions for a specific category
 * @param category - The category name (e.g., 'Employee Management')
 * @returns Array of permissions in that category
 */
export function usePermissionsByCategory(category: string): Permission[] {
  const { data: permissions } = useUserPermissions();

  if (!permissions || !permissions[category]) {
    return [];
  }

  return permissions[category];
}

/**
 * Hook to get all permission names as a flat array
 * @returns Array of permission names
 */
export function useAllPermissionNames(): string[] {
  const { data: permissions } = useUserPermissions();

  if (!permissions) {
    return [];
  }

  const allPermissions: string[] = [];
  for (const category in permissions) {
    permissions[category].forEach(permission => {
      allPermissions.push(permission.name);
    });
  }

  return allPermissions;
}
