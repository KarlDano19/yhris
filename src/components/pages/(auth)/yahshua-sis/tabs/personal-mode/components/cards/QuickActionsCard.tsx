'use client';

import Link from 'next/link';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  href: string;
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
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-savoy-blue">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1 group-hover:text-savoy-blue">
                {action.label}
              </span>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {action.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;

