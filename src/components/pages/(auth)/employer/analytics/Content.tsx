'use client';

import React, { useState } from 'react';
import Link from "next/link";

import CustomDatePicker from '@/components/CustomDatePicker';
import WorkforceOverview from './tabs/WorkforceOverview';
import EmployeePerformance from './tabs/EmployeePerformance';
import CompliancePolicy from './tabs/CompliancePolicy';
import CompensationBenefits from './tabs/CompensationBenefits';
import useGetAnalyticsData from './hooks/useGetAnalyticsData';

import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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

  const {
    data: analyticsData,
    isLoading,
    error
  } = useGetAnalyticsData(appliedDateFilter);

  const tabs = [
    { id: 1, name: 'Workforce Overview', shortName: 'Workforce' },
    { id: 2, name: 'Employee Performance & Development', shortName: 'Performance' },
    { id: 3, name: 'Compliance & Policy', shortName: 'Compliance' },
    { id: 4, name: 'Compensation & Benefits', shortName: 'Compensation' },
  ];

  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <svg
            aria-hidden="true"
            className="inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (error || !analyticsData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      );
    }

    switch (activeTab) {
      case 1:
        return <WorkforceOverview  />;
      case 2:
        return <EmployeePerformance data={analyticsData.employeePerformance} dateFilter={appliedDateFilter} />;
      case 3:
        return <CompliancePolicy />;
      case 4:
        return <CompensationBenefits />;
      default:
        return <WorkforceOverview />;
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
                  console.log('Search with date range:', dateFilter);
                }}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8">
            {/* Desktop tabs */}
            <div className="hidden md:flex flex-row justify-between space-x-2">
              {tabs.map((tab) => (
                <div 
                  key={tab.id} 
                  onClick={() => handleTabChange(tab.id)} 
                  className="cursor-pointer"
                >
                  <h1 className={`text-lg font-bold pb-2 text-center ${activeTab === tab.id ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                    {tab.name}
                  </h1>
                </div>
              ))}
            </div>

            {/* Mobile tabs - horizontal scrollable */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex space-x-4 min-w-max px-4">
                {tabs.map((tab) => (
                  <div 
                    key={tab.id} 
                    onClick={() => handleTabChange(tab.id)} 
                    className="cursor-pointer flex-shrink-0"
                  >
                    <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${activeTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                      {tab.shortName}
                    </h1>
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
    </>
  );
};

export default Content;