'use client';

import Link from 'next/link';
import { 
  CalendarIcon, 
  UserGroupIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badgeColor?: 'green' | 'purple';
  href?: string;
  onClick?: () => void;
}

interface QuickActionsCardProps {
  actions?: QuickAction[];
}

const QuickActionsCard = ({ actions }: QuickActionsCardProps) => {
  const defaultActions: QuickAction[] = [
    {
      icon: CalendarIcon,
      label: 'Upcoming Bookings',
      count: 1,
      badgeColor: 'purple',
      href: '#', // Placeholder - should be provided via actions prop with onClick
    },
    {
      icon: UserGroupIcon,
      label: 'My Hires',
      href: '/yahshua-connect/business-mode/hire',
    },
  ];

  const displayActions = actions || defaultActions;

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
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {displayActions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <div className="text-savoy-blue">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1 group-hover:text-savoy-blue">
                {action.label}
              </span>
              {action.count !== undefined && (
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
                onClick={action.onClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={action.label}
              href={action.href || '#'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {content}
            </Link>
          );
        })}
      </div>
      {/* View Full Profile Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/yahshua-connect/business-mode/profile"
          className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsCard;

