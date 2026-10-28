'use client';

import React, { useState } from 'react';

import BackButton from '@/components/BackButton';
import DirectiveList from './DirectiveList';

type DirectiveType = 'memo' | 'policy';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState<DirectiveType>('memo');

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
      <div className='flex p-4'>
        <BackButton label="Manage" href="/manage" />
      </div>

      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Create Memo/Policy</h2>
      </div>

      <div className='px-2 md:px-8 lg:px-4 mt-6'>
        <div className='flex gap-2'>
          <div
            onClick={() => setActiveTab('memo')}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
              activeTab === 'memo'
                ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Memos
          </div>
          <div
            onClick={() => setActiveTab('policy')}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
              activeTab === 'policy'
                ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            Policies
          </div>
        </div>
      </div>

      {activeTab === 'memo' && <DirectiveList directiveType='memo' hasActiveSubscription={hasActiveSubscription} />}
      {activeTab === 'policy' && <DirectiveList directiveType='policy' hasActiveSubscription={hasActiveSubscription} />}
    </div>
  );
};

export default Content;
