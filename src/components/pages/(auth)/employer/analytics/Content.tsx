'use client';

import React, { useState } from 'react';

import Link from "next/link";

import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip';

import CustomDatePicker from '@/components/CustomDatePicker';
import WorkforceOverview from './tabs/WorkforceOverview';
import EmployeePerformance from './tabs/EmployeePerformance';
import CompliancePolicy from './tabs/CompliancePolicy';
import CompensationBenefits from './tabs/CompensationBenefits';


const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: '',
  });
  const [appliedDateFilter, setAppliedDateFilter] = useState({
    from: '',
    to: '',
  });

  const tabs = [
    { id: 1, name: 'Workforce Overview', shortName: 'Workforce', isAvailable: true },
    { id: 2, name: 'Employee Performance & Development', shortName: 'Performance', isAvailable: true },
    { id: 3, name: 'Compliance & Policy', shortName: 'Compliance', isAvailable: true },
    // { id: 4, name: 'Compensation & Benefits', shortName: 'Compensation', isAvailable: false },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 1:
        return <WorkforceOverview dateFilter={appliedDateFilter} />;
      case 2:
        return <EmployeePerformance dateFilter={appliedDateFilter} />;
      case 3:
        return <CompliancePolicy />;
      // case 4:
      //   return <CompensationBenefits />;
      default:
        return <WorkforceOverview dateFilter={appliedDateFilter} />;
    }
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Analytics</h2>
          
          {/* Date Range Picker */}
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={dateFilter.from}
                  pickerOnChange={(date: any) => {
                    setDateFilter({ ...dateFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setDateFilter({
                      ...dateFilter,
                      from: value,
                    });
                  }}
                />
              </div>
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={dateFilter.to}
                  pickerOnChange={(date: any) => {
                    setDateFilter({ ...dateFilter, to: date });
                  }}
                  inputOnChange={(value: any) => {
                    setDateFilter({
                      ...dateFilter,
                      to: value,
                    });
                  }}
                  minDate={dateFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                onClick={() => {
                  setAppliedDateFilter(dateFilter);
                }}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8">
            {/* Desktop tabs */}
            <div className="hidden md:flex flex-row justify-between space-x-2 w-3/4">
              {tabs.map((tab) => (
                <div key={tab.id} className="cursor-pointer">
                  {tab.isAvailable ? (
                    <h1 
                      onClick={() => handleTabChange(tab.id)}
                      className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue hover:border-b-4 hover:border-savoy-blue ${activeTab === tab.id ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}
                    >
                      {tab.name}
                    </h1>
                  ) : (
                    <div
                      data-tooltip-id='content-tab-tooltip'
                      data-tooltip-content='Coming soon.'
                      data-tooltip-place='bottom'
                      className="cursor-not-allowed"
                    >
                      <h1 className="text-lg font-bold pb-2 text-center text-gray-400 opacity-50">
                        {tab.name}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile tabs - horizontal scrollable */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex space-x-4 min-w-max px-4">
                {tabs.map((tab) => (
                  <div 
                    key={tab.id} 
                    className={tab.isAvailable ? "cursor-pointer flex-shrink-0" : "cursor-not-allowed flex-shrink-0"}
                  >
                    {tab.isAvailable ? (
                      <h1 
                        onClick={() => handleTabChange(tab.id)}
                        className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${activeTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}
                      >
                        {tab.shortName}
                      </h1>
                    ) : (
                      <div
                        data-tooltip-id='content-tab-tooltip'
                        data-tooltip-content='Coming soon.'
                        data-tooltip-place='bottom'
                      >
                        <h1 className="text-sm font-bold pb-2 text-center whitespace-nowrap text-gray-400 opacity-50">
                          {tab.shortName}
                        </h1>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className='mt-8'>
            {renderActiveTab()}
          </div>
        </div>
      </div>
      <Tooltip id='content-tab-tooltip' />
    </>
  );
};

export default Content;