import { ChartBarIcon, UsersIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

import { TabType } from '../../../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className='border-b border-gray-200'>
      <nav className='-mb-px flex space-x-8'>
        <button
          onClick={() => onTabChange('respondents')}
          className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'respondents'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <UsersIcon className='h-4 w-4' />
          Respondents
        </button>
        <button
          onClick={() => onTabChange('questions')}
          className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ClipboardDocumentListIcon className='h-4 w-4' />
          Questions & Responses
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ChartBarIcon className='h-4 w-4' />
          Analytics
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation;


