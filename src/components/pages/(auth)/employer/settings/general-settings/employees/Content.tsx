'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import Location from './tabs/Location';
import Department from './tabs/Department';
import Position from './tabs/Position';
import EmployeeStatus from './tabs/EmployeeStatus';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState('location');

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
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
                onClick={() => setActiveTab('location')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'location'
                    ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Location
              </div>
              <div
                onClick={() => setActiveTab('department')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'department'
                    ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Department
              </div>
              <div
                onClick={() => setActiveTab('position')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'position'
                    ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Position
              </div>
              <div
                onClick={() => setActiveTab('employee-status')}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'employee-status'
                    ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Employee Status
              </div>
            </div>
          </div>
        </div>
        {activeTab === 'location' && <Location hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'department' && <Department hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'position' && <Position hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'employee-status' && <EmployeeStatus hasActiveSubscription={hasActiveSubscription} />}
      </div>
    </>
  );
};

export default Content;
