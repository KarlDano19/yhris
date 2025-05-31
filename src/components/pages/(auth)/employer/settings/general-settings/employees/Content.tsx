'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import Location from './tabs/Location';
import Department from './tabs/Department';
import Position from './tabs/Position';

const Content = () => {
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
        {/* Tab Navigation */}
        <div className='flex pl-10 mb-5'>
          <div onClick={() => setActiveTab('location')} className={`cursor-pointer ${activeTab === 'location' ? ' bg-sky-600 text-white px-2 py-1 rounded-md' : 'bg-gray-100 px-2 py-1 rounded-md'}`}>
            Location
          </div>
          <div onClick={() => setActiveTab('department')} className={`cursor-pointer ${activeTab === 'department' ? ' bg-sky-600 text-white px-2 py-1 rounded-md' : 'bg-gray-100 px-2 py-1 rounded-md'}`}>
            Department
          </div>
          <div onClick={() => setActiveTab('position')} className={`cursor-pointer ${activeTab === 'position' ? ' bg-sky-600 text-white px-2 py-1 rounded-md' : 'bg-gray-100 px-2 py-1 rounded-md'}`}>
            Position
          </div>
        </div>
        {/* Tab Content */}
        {activeTab === 'location' && <Location />}
        {/* Add components for Department and Position here */}
        {activeTab === 'department' && <Department />}
        {activeTab === 'position' && <Position />}
      </div>
    </>
  );
};

export default Content;