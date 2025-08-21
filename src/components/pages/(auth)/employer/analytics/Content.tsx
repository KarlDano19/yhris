'use client';

import React, { useState, useEffect } from 'react';

import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';

import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip';
import toast from "react-hot-toast";

import CustomDatePicker from '@/components/CustomDatePicker';
import WorkforceOverview from './tabs/WorkforceOverview';
import EmployeePerformance from './tabs/EmployeePerformance';
import CompliancePolicy from './tabs/CompliancePolicy';
import CompensationBenefits from './tabs/CompensationBenefits';
import useFileforge from "@/components/hooks/useFileforge";
import CustomToast from "@/components/CustomToast";
import { handlePrintAnalytics } from './PrintData';

import PrintIcon from "@/svg/PrintIcon";

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  
  // Separate date filters for each tab
  const [tabDateFilters, setTabDateFilters] = useState<{ [key: number]: { from: string; to: string } }>({
    1: { from: '', to: '' },
    2: { from: '', to: '' },
    3: { from: '', to: '' },
  });
  
  const [tabAppliedDateFilters, setTabAppliedDateFilters] = useState<{ [key: number]: { from: string; to: string } }>({
    1: { from: '', to: '' },
    2: { from: '', to: '' },
    3: { from: '', to: '' },
  });

  // State for print functionality
  const [workforceData, setWorkforceData] = useState<{
    activeSubTab: number;
    employeeData: any[];
    appliedApplicantsData: any[];
    separationData: any[];
    allJobPostData: any[];
    pipelineData: any;
    rolePipelineData: any[];
    rolePipelineCurrentPage: number;
    rolePipelinePageSize: number;
    validRegions?: string[];
    selectedJobFilter?: string;
  } | null>(null);
  
  const [employeePerformanceData, setEmployeePerformanceData] = useState<{
    activeSubTab: number;
    evaluationData: any[];
    employeeIssueData: any[];
    employeePerformanceTableData: any[];
    employeeIssuesTableData: any[];
    showAllDepartments: boolean;
    showAllIssueTypes: boolean;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get current tab's date filter
  const currentDateFilter = tabDateFilters[activeTab] || { from: '', to: '' };
  const currentAppliedDateFilter = tabAppliedDateFilters[activeTab] || { from: '', to: '' };

  // Fileforge hook for PDF generation
  const { generatePDFLocally } = useFileforge({
    onSuccess: () => {
      setIsGenerating(false);
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    }
  });

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabNumber = parseInt(tabParam);
      if (tabNumber >= 1 && tabNumber <= 3) {
        setActiveTab(tabNumber);
      }
    }
  }, [searchParams]);

  const tabs = [
    { id: 1, name: 'Workforce Overview', shortName: 'Workforce', isAvailable: true },
    { id: 2, name: 'Employee Performance & Development', shortName: 'Performance', isAvailable: hasActiveSubscription },
    { id: 3, name: 'Compliance & Policy', shortName: 'Compliance', isAvailable: hasActiveSubscription, isHidden: true },
    // { id: 4, name: 'Compensation & Benefits', shortName: 'Compensation', isAvailable: false },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 1:
        return <WorkforceOverview 
          dateFilter={currentAppliedDateFilter} 
          onDataReady={setWorkforceData}
        />;
      case 2:
        return <EmployeePerformance 
          dateFilter={currentAppliedDateFilter} 
          onDataReady={setEmployeePerformanceData}
        />;
      case 3:
        return <CompliancePolicy />;
      // case 4:
      //   return <CompensationBenefits />;
      default:
        return <WorkforceOverview 
          dateFilter={currentAppliedDateFilter} 
          onDataReady={setWorkforceData}
        />;
    }
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    // Update URL to reflect the current tab
    if (tabId === 1) {
      router.push('/analytics');
    } else {
      router.push(`/analytics?tab=${tabId}`);
    }
  };

  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      
      const currentTab = tabs.find(tab => tab.id === activeTab);
      if (!currentTab) {
        throw new Error('Invalid tab');
      }

      switch (activeTab) {
        case 1: // Workforce Overview
          if (!workforceData) {
            throw new Error('No workforce data available for printing');
          }
          await handlePrintAnalytics(
            activeTab,
            currentTab.name,
            generatePDFLocally,
            workforceData.employeeData,
            workforceData.appliedApplicantsData,
            workforceData.separationData,
            workforceData.allJobPostData,
            currentAppliedDateFilter,
            workforceData.activeSubTab,
            workforceData.pipelineData,
            workforceData.rolePipelineData,
            workforceData.rolePipelineCurrentPage,
            workforceData.rolePipelinePageSize,
            workforceData.validRegions,
            workforceData.selectedJobFilter
          );
          break;
        case 2: // Employee Performance
          if (!employeePerformanceData) {
            throw new Error('No employee performance data available for printing');
          }
          await handlePrintAnalytics(
            activeTab,
            currentTab.name,
            generatePDFLocally,
            [], // employeeData - not needed for employee performance
            [], // appliedApplicantsData - not needed for employee performance
            [], // separationData - not needed for employee performance
            [], // allJobPostData - not needed for employee performance
            currentAppliedDateFilter,
            employeePerformanceData.activeSubTab,
            undefined, // pipelineData - not needed for employee performance
            undefined, // rolePipelineData - not needed for employee performance
            undefined, // rolePipelineCurrentPage - not needed for employee performance
            undefined, // rolePipelinePageSize - not needed for employee performance
            undefined, // validRegions - not needed for employee performance
            undefined, // selectedJobFilter - not needed for employee performance
            employeePerformanceData.evaluationData,
            employeePerformanceData.employeeIssueData,
            employeePerformanceData.employeePerformanceTableData,
            employeePerformanceData.employeeIssuesTableData,
            employeePerformanceData.showAllDepartments,
            employeePerformanceData.showAllIssueTypes
          );
          break;
        // Add other tabs here as they are implemented
        default:
          throw new Error(`Print functionality not implemented for tab ${activeTab}`);
      }
    } catch (error: any) {
      setIsGenerating(false);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    }
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
          <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={currentDateFilter.from}
                  pickerOnChange={(date: any) => {
                    setTabDateFilters({
                      ...tabDateFilters,
                      [activeTab]: { ...currentDateFilter, from: date }
                    });
                  }}
                  inputOnChange={(value: any) => {
                    setTabDateFilters({
                      ...tabDateFilters,
                      [activeTab]: { ...currentDateFilter, from: value }
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
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={currentDateFilter.to}
                  pickerOnChange={(date: any) => {
                    setTabDateFilters({
                      ...tabDateFilters,
                      [activeTab]: { ...currentDateFilter, to: date }
                    });
                  }}
                  inputOnChange={(value: any) => {
                    setTabDateFilters({
                      ...tabDateFilters,
                      [activeTab]: { ...currentDateFilter, to: value }
                    });
                  }}
                  minDate={currentDateFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                onClick={() => {
                  setTabAppliedDateFilters({
                    ...tabAppliedDateFilters,
                    [activeTab]: currentDateFilter
                  });
                }}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
              <button
                className='hover:bg-gray-100'
                onClick={handlePrint}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full">
                  </div>
                ) : (
                  <PrintIcon />
                )}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8">
            {/* Desktop tabs */}
            <div className="hidden md:flex flex-row justify-between space-x-2 w-3/4">
              {tabs.map((tab) => (
                <div key={tab.id} className="cursor-pointer">
                  {tab.isHidden ? (
                    <div className="text-lg font-bold pb-2 text-center invisible">
                      {tab.name}
                    </div>
                  ) : tab.isAvailable ? (
                    <h1 
                      onClick={() => handleTabChange(tab.id)}
                      className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${activeTab === tab.id ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}
                    >
                      {tab.name}
                    </h1>
                  ) : (
                    <div
                      data-tooltip-id='content-tab-tooltip'
                      data-tooltip-content='Subscription required to access this feature.'
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
                    {tab.isHidden ? (
                      <div className="text-sm font-bold pb-2 text-center whitespace-nowrap invisible">
                        {tab.shortName}
                      </div>
                    ) : tab.isAvailable ? (
                      <h1 
                        onClick={() => handleTabChange(tab.id)}
                        className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${activeTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}
                      >
                        {tab.shortName}
                      </h1>
                    ) : (
                      <div
                        data-tooltip-id='content-tab-tooltip'
                        data-tooltip-content='Subscription required to access this feature.'
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