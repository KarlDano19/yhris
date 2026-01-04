'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  href?: string;
  onClick?: () => void;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

const QuickActionsCard = ({ actions }: QuickActionsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => {
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
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
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
          href="/yahshua-connect/personal-mode/profile"
          className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsCard;

