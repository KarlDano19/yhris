'use client';

import Link from 'next/link';
import { MagnifyingGlassIcon, BriefcaseIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const QuickActionsCard = () => {
  const actions = [
    {
      icon: MagnifyingGlassIcon,
      label: 'Browse Requests',
      href: '/yahshua-sis/business-mode/browse-requests',
    },
    {
      icon: BriefcaseIcon,
      label: 'Active Jobs',
      href: '/yahshua-sis/business-mode/active-jobs',
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Earnings',
      href: '/yahshua-sis/business-mode/earnings',
    },
  ];

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
              <span className="text-sm font-medium text-gray-700 group-hover:text-savoy-blue">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;

