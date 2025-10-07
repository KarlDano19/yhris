'use client';

import React, { Fragment, useState } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

import ManageOrgChart from './components/ManageOrgChart';

const Content = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Export menu options
  const exportOptions = [
    {
      name: 'as PDF',
      action: () => handleExport('pdf'),
      disabled: false
    },
    {
      name: 'as PNG',
      action: () => handleExport('png'),
      disabled: false
    }
  ];

  const handleExport = async (format: 'pdf' | 'png') => {
    setIsExporting(true);
    try {
      // TODO: Implement actual export functionality
      console.log(`Exporting organizational structure as ${format.toUpperCase()}`);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Organizational structure exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b-2 flex-shrink-0'>
        <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Manage | Organizational Structure</h4>
        </Link>
        
        {/* Export Dropdown */}
        <Menu as='div' className='relative'>
          <Menu.Button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50' disabled={isExporting}>
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            <ChevronDownIcon className='h-4 w-4' />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-2 w-full min-w-[120px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                {exportOptions.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer text-left ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } ${item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => {
                          if (!item.disabled) {
                            item.action();
                          }
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='bg-white shadow-sm flex-1 flex flex-col'>     
          {/* Organizational Chart */}
          <ManageOrgChart />
        </div>
      </div>
    </div>
  );
};

export default Content;
