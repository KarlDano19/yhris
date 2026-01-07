import Link from 'next/link';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badgeColor?: 'green' | 'purple';
  href?: string;
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
  onViewFullProfile?: () => void;
}

const QuickActionsCard = ({ actions, onViewFullProfile }: QuickActionsCardProps) => {
  // Determine if business mode (has badge colors)
  const isBusinessMode = actions.some(action => action.badgeColor !== undefined);

  const getBadgeColorClass = (color?: 'green' | 'purple') => {
    if (color === 'green') {
      return 'bg-green-100 text-green-700';
    }
    if (color === 'purple') {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className={`${isBusinessMode ? 'text-sm' : 'text-base'} font-bold text-gray-900 mb-4`}>Quick Actions</h3>
      <div className={isBusinessMode ? 'space-y-2' : 'space-y-1'}>
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <div className={isBusinessMode ? 'text-savoy-blue' : 'text-blue-400'}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-sm font-medium ${isBusinessMode ? 'text-gray-700 flex-1 group-hover:text-savoy-blue' : 'text-gray-700 flex-1'}`}>
                {action.label}
              </span>
              {isBusinessMode && action.count !== undefined && (
                <span className={`text-xs font-semibold ${getBadgeColorClass(action.badgeColor)} px-2 py-1 rounded-full`}>
                  {action.count}
                </span>
              )}
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </>
          );

          if (action.onClick) {
            return (
              <button
                key={action.label}
                onClick={action.disabled ? undefined : action.onClick}
                disabled={action.disabled}
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content={action.tooltip || ''}
                data-tooltip-place="bottom"
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isBusinessMode ? 'group text-left hover:bg-gray-50' : `text-left ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={action.label}
              href={action.href || '#'}
              data-tooltip-id="quick-actions-tooltip"
              data-tooltip-content={action.tooltip || ''}
              data-tooltip-place="bottom"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${isBusinessMode ? 'group' : ''}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
      
      {/* View Full Profile Button */}
      {onViewFullProfile && (
        <div className={`${isBusinessMode ? 'mt-4' : 'mt-6'} pt-4 border-t border-gray-200`}>
          <button
            onClick={onViewFullProfile}
            className={`w-full ${isBusinessMode ? 'flex items-center justify-center px-4 py-2.5 bg-white border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors' : 'py-2.5 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors'}`}
          >
            View Full Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickActionsCard;

