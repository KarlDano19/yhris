// Smart Dashboard Item Component with permission checking
import React from 'react';
import Link from 'next/link';
import { Tooltip } from 'react-tooltip';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { getPermissionForElement, getFallbackBehavior } from '@/config/ui-permissions';

interface DashboardMenu {
  icon: React.ReactNode;
  text: string;
  link?: string;
  onClickEvent?: () => void;
  isAvailable: boolean;
  isGrayedOut?: boolean;
  permissionId?: string; // New field for permission checking
}

interface SmartDashboardItemProps {
  menu: DashboardMenu;
  onGrayedOutClick?: (link: string, reason: 'subscription' | 'permission', featureName?: string) => void;
  hasActiveSubscription?: boolean;
}

export const SmartDashboardItem: React.FC<SmartDashboardItemProps> = ({ 
  menu, 
  onGrayedOutClick,
  hasActiveSubscription 
}) => {
  const cachedRights = useLegacyPermissions();
  
  // Get required permission for this dashboard item
  const requiredPermission = menu.permissionId ? getPermissionForElement(menu.permissionId) : null;
  
  // Check if user has the required permission
  const hasPermission = requiredPermission 
    ? cachedRights?.state?.data?.[requiredPermission] || false
    : true; // If no permission required, allow access
  
  // Determine restriction reason and grayed out state
  const hasSubscriptionIssue = menu.isGrayedOut && hasActiveSubscription !== undefined && !hasActiveSubscription;
  const hasPermissionIssue = !hasPermission;
  
  // Priority: Permission issues take precedence over subscription issues
  const isGrayedOut = hasPermissionIssue || hasSubscriptionIssue;
  const restrictionReason: 'subscription' | 'permission' = hasPermissionIssue ? 'permission' : 'subscription';
  
  const handleGrayedOutClick = () => {
    if (onGrayedOutClick && menu.link) {
      onGrayedOutClick(menu.link, restrictionReason, menu.text);
    }
  };

  // Check if click should be blocked (either no permission OR subscription issue)
  const shouldBlockClick = isGrayedOut;

  // Render dashboard item with Link
  if (menu.isAvailable && menu.link) {
    return (
      <>
        <Link
          href={menu.link}
          aria-disabled={isGrayedOut}
          data-ignore-spinner={isGrayedOut ? "true" : undefined}
          className={`bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80 ${
            isGrayedOut ? 'opacity-50 cursor-pointer' : ''
          }`}
          onClick={shouldBlockClick ? (e) => {
            e.preventDefault();
            handleGrayedOutClick();
          } : undefined}
          data-permission-id={menu.permissionId}
          data-required-permission={requiredPermission}
          data-has-permission={hasPermission}
          data-is-grayed-out={isGrayedOut}
          data-restriction-reason={restrictionReason}
          {...(isGrayedOut && hasPermissionIssue && {
            'data-tooltip-id': `dashboard-permission-tooltip-${menu.permissionId}`,
            'data-tooltip-content': "You don't have permission to access this section",
            'data-tooltip-place': 'top'
          })}
          {...(isGrayedOut && !hasPermissionIssue && hasSubscriptionIssue && {
            'data-tooltip-id': `dashboard-subscription-tooltip-${menu.permissionId}`,
            'data-tooltip-content': "Subscription required to access this section",
            'data-tooltip-place': 'top'
          })}
        >
          {menu.icon}
          <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
        </Link>
        {isGrayedOut && hasPermissionIssue && (
          <Tooltip 
            id={`dashboard-permission-tooltip-${menu.permissionId}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
            }}
            offset={10}
          />
        )}
        {isGrayedOut && !hasPermissionIssue && hasSubscriptionIssue && (
          <Tooltip 
            id={`dashboard-subscription-tooltip-${menu.permissionId}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
            }}
            offset={10}
          />
        )}
      </>
    );
  }

  // Render dashboard item with onClick event
  if (menu.isAvailable && menu.onClickEvent) {
    return (
      <>
        <div
          className={`cursor-pointer bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none ${
            isGrayedOut ? 'opacity-50 cursor-pointer' : ''
          }`}
          onClick={shouldBlockClick ? handleGrayedOutClick : menu.onClickEvent}
          data-permission-id={menu.permissionId}
          data-required-permission={requiredPermission}
          data-has-permission={hasPermission}
          data-is-grayed-out={isGrayedOut}
          data-restriction-reason={restrictionReason}
          {...(isGrayedOut && hasPermissionIssue && {
            'data-tooltip-id': `dashboard-permission-tooltip-${menu.permissionId}`,
            'data-tooltip-content': "You don't have permission to access this section",
            'data-tooltip-place': 'top'
          })}
          {...(isGrayedOut && !hasPermissionIssue && hasSubscriptionIssue && {
            'data-tooltip-id': `dashboard-subscription-tooltip-${menu.permissionId}`,
            'data-tooltip-content': "Subscription required to access this section",
            'data-tooltip-place': 'top'
          })}
        >
          {menu.icon}
          <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
        </div>
        {isGrayedOut && hasPermissionIssue && (
          <Tooltip 
            id={`dashboard-permission-tooltip-${menu.permissionId}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
            }}
            offset={10}
          />
        )}
        {isGrayedOut && !hasPermissionIssue && hasSubscriptionIssue && (
          <Tooltip 
            id={`dashboard-subscription-tooltip-${menu.permissionId}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
            }}
            offset={10}
          />
        )}
      </>
    );
  }

  // Render unavailable item (coming soon)
  if (!menu.isAvailable) {
    return (
      <>
        <div
          data-tooltip-id='dashboard-item-tooltip'
          data-tooltip-content='Coming soon.'
          data-tooltip-place='bottom'
          aria-disabled={true}
          className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none opacity-50'
        >
          {menu.icon}
          <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
        </div>
        <Tooltip id='dashboard-item-tooltip' />
      </>
    );
  }

  return null;
};
