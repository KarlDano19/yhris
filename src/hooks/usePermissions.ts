import { useMemo } from 'react';
import { useUserPermissions } from './useUserPermissions';
import { 
  PERMISSION_CONFIG, 
  ACTION_PERMISSIONS, 
  COMPONENT_PERMISSIONS, 
  ROUTE_PERMISSIONS,
  getPermissionConfig,
  getActionPermissions,
  getComponentPermissions,
  getRoutePermissions 
} from '@/config/permissions';

export const usePermissionConfig = () => {
  const { data: permissions, isLoading } = useUserPermissions();

  const config = useMemo(() => {
    if (!permissions || isLoading) {
      return {
        routes: {},
        components: {},
        actions: {},
        menuItems: {},
        fields: {},
        userPermissions: []
      };
    }

    // Get flat list of user permission names
    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    // Build configuration based on user's permissions
    const routes: Record<string, string[]> = {};
    const components: Record<string, string[]> = {};
    const actions: Record<string, string[]> = {};
    const menuItems: Record<string, string[]> = {};
    const fields: Record<string, string[]> = {};

    userPermissionNames.forEach(permissionName => {
      const permConfig = PERMISSION_CONFIG[permissionName];
      if (permConfig) {
        // Routes
        permConfig.routes?.forEach(route => {
          if (!routes[route]) routes[route] = [];
          routes[route].push(permissionName);
        });

        // Components  
        permConfig.components?.forEach(component => {
          if (!components[component]) components[component] = [];
          components[component].push(permissionName);
        });

        // Actions
        permConfig.actions?.forEach(action => {
          if (!actions[action]) actions[action] = [];
          actions[action].push(permissionName);
        });

        // Menu items
        permConfig.menuItems?.forEach(menuItem => {
          if (!menuItems[menuItem]) menuItems[menuItem] = [];
          menuItems[menuItem].push(permissionName);
        });

        // Fields
        permConfig.fields?.forEach(field => {
          if (!fields[field]) fields[field] = [];
          fields[field].push(permissionName);
        });
      }
    });

    return {
      routes,
      components,
      actions,
      menuItems,
      fields,
      userPermissions: userPermissionNames
    };
  }, [permissions, isLoading]);

  return config;
};

// Enhanced permission check hooks
export const useHasPermissionForAction = (actionKey: string): boolean => {
  const config = usePermissionConfig();
  return config.actions[actionKey]?.length > 0;
};

export const useHasPermissionForComponent = (componentKey: string): boolean => {
  const config = usePermissionConfig();
  return config.components[componentKey]?.length > 0;
};

export const useHasPermissionForRoute = (routePath: string): boolean => {
  const config = usePermissionConfig();
  
  // Check exact match first
  if (config.routes[routePath]?.length > 0) {
    return true;
  }
  
  // Check pattern matches
  for (const route in config.routes) {
    if (route.includes('*') || route.includes(':')) {
      const regex = new RegExp(route.replace(/:\w+/g, '[^/]+').replace(/\*/g, '.*'));
      if (regex.test(routePath)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Hook to check if user has a specific named permission (simple version)
 * Usage: const { hasPermission } = usePermission('create_employee');
 */
export const usePermission = (permissionName: string) => {
  const { data: permissions, isLoading } = useUserPermissions();

  return useMemo(() => {
    if (isLoading || !permissions) {
      return {
        hasPermission: false,
        isLoading: true
      };
    }

    // Get flat list of user permission names
    const userPermissionNames = Object.values(permissions)
      .flat()
      .map((p: any) => p.name);

    return {
      hasPermission: userPermissionNames.includes(permissionName),
      isLoading: false
    };
  }, [permissions, isLoading, permissionName]);
};
