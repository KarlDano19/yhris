'use client';
import React, { useState } from 'react';

import Link from 'next/link';

import IndividualEvaluations from './tabs/IndividualEvaluations';
import TemplateResponses from './tabs/TemplateResponses';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState('individual');

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className='pl-4 md:pl-10 mb-5'>
          <div
            className='overflow-x-auto'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#2d3e58 #f1f1f1'
            }}
          >
            <div className='flex gap-2 min-w-max pb-2'>
              <div
                onClick={() => setActiveTab('individual')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'individual'
                    ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Individual Evaluations
              </div>
              <div
                onClick={() => setActiveTab('template-responses')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'template-responses'
                    ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Template Responses
              </div>
            </div>
          </div>
        </div>
        {activeTab === 'individual' && <IndividualEvaluations hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'template-responses' && <TemplateResponses hasActiveSubscription={hasActiveSubscription} />}
      </div>
    </>
  );
};

export default Content;
