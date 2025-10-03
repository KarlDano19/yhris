// Smart Menu Helper - Wraps menu options with permission checking
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

interface MenuOption {
  id: string;
  name: string;
  action: () => void;
  [key: string]: any; // Allow other properties
}

interface SmartMenuOption extends MenuOption {
  disabled?: boolean;
  hasPermission?: boolean;
  originalAction: () => void;
}

export const useSmartMenuOptions = (menuOptions: MenuOption[]): SmartMenuOption[] => {
  const cachedRights = useLegacyPermissions();
  
  return menuOptions.map(option => {
    // Get required permission for this menu item
    const requiredPermission = getPermissionForElement(option.id);
    const fallbackBehavior = getFallbackBehavior(option.id);
    
    // Check if user has the required permission
    const hasPermission = requiredPermission 
      ? cachedRights?.state?.data?.[requiredPermission] || false
      : true; // If no permission required, allow access
    
    const isDisabled = !hasPermission && fallbackBehavior === 'disable';
    
    // Create a safe action that only executes if user has permission
    const safeAction = () => {
      if (hasPermission && !isDisabled) {
        option.action();
      }
    };
    
    return {
      ...option,
      originalAction: option.action,
      action: safeAction,
      disabled: isDisabled,
      hasPermission: hasPermission,
    };
  }).filter(option => {
    // Filter out hidden items
    const requiredPermission = getPermissionForElement(option.id);
    const fallbackBehavior = getFallbackBehavior(option.id);
    const hasPermission = option.hasPermission;
    
    return !(fallbackBehavior === 'hide' && !hasPermission);
  });
};
