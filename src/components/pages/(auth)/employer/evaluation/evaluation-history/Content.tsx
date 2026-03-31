'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import classNames from '@/helpers/classNames';
import IndividualEvaluations from './tabs/IndividualEvaluations';
import TemplateResponses from './tabs/TemplateResponses';
import SeederButton from '@/components/SeederButton';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

type TabType = 'individual' | 'template-responses';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState<TabType>('individual');

  const tabs = [
    { id: 'individual' as TabType, name: 'Individual Evaluations' },
    { id: 'template-responses' as TabType, name: 'Template Responses' },
  ];

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh]'>
        <div className='flex p-4'>
          <Link href='/evaluation' className='flex-none flex gap-3 items-center hover:bg-gray-200 p-2 rounded-md'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Evaluation</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <h2 className='text-2xl font-bold text-indigo-dye'>Evaluation History</h2>
          <SeederButton
            viewType="evaluation_history"
            disabled={!hasActiveSubscription}
          />
        </div>

        {/* Tabs Navigation */}
        <div className='px-2 md:px-8 lg:px-4 mt-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200'
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className='mt-6'>
          <div style={{ display: activeTab === 'individual' ? 'block' : 'none' }}>
            <IndividualEvaluations hasActiveSubscription={hasActiveSubscription} isActive={activeTab === 'individual'} />
          </div>
          <div style={{ display: activeTab === 'template-responses' ? 'block' : 'none' }}>
            <TemplateResponses hasActiveSubscription={hasActiveSubscription} isActive={activeTab === 'template-responses'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;