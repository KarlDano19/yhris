
import { BuildingOfficeIcon, BoltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';

type TabType = 'company-jobs' | 'gig-opportunities' | 'hire-talent';

interface TabsContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabsContent = ({ activeTab, onTabChange }: TabsContentProps) => {
  const tabs = [
    {
      id: 'company-jobs' as TabType,
      label: 'Company Jobs',
      icon: BuildingOfficeIcon,
    },
    {
      id: 'gig-opportunities' as TabType,
      label: 'Gig Opportunities',
      icon: BoltIcon,
    },
    {
      id: 'hire-talent' as TabType,
      label: 'Hire Talent',
      icon: UserGroupIcon,
    },
  ];

  return (
    <div className="max-w-7xl px-4 sm:px-6 mx-auto">
      <div className="px-4 lg:px-5">
        <div className="flex space-x-6 md:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={classNames(
                  'flex items-center gap-2 pb-3 border-b-2 transition-colors',
                  isActive
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                type="button"
              >
                <Icon
                  className={classNames(
                    'h-5 w-5',
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  )}
                />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabsContent;

