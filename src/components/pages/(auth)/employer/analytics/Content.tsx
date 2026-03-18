'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';

import { Tooltip } from 'react-tooltip';
import toast from "react-hot-toast";

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from "@/components/CustomToast";
import useFileforge from "@/components/hooks/useFileforge";
import WorkforceOverview from './tabs/WorkforceOverview';
import EmployeePerformance from './tabs/EmployeePerformance';
import CompliancePolicy from './tabs/CompliancePolicy';
// import CompensationBenefits from './tabs/CompensationBenefits';
import PrintRolePipelineRecordsSelectionModal from './modals/PrintRolePipelineRecordsSelectionModal';
import PrintEmpPerformanceSelectionModal from './modals/PrintEmpPerformanceSelectionModal/PrintEmpPerformanceSelectionModal';
import useAddAnalyticsPrintAudit from './hooks/useAddAnalyticsPrintAudit';

import { handlePrintAnalytics } from './PrintData';

import { ArrowLeftIcon, MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PrintIcon from "@/svg/PrintIcon";

import { useQueryClient } from '@tanstack/react-query';

const REFRESH_COOLDOWN_SECONDS = 30;

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const { mutate: logAudit } = useAddAnalyticsPrintAudit();
  const queryClient = useQueryClient();
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
    rolePipelineData: any[];
    rolePipelineCurrentPage: number;
    rolePipelinePageSize: number;
    allJobPostsForPrint?: any[];
    analyticsKPIs?: any;
    analyticsApplicantVsHired?: any;
    analyticsAttrition?: any;
  } | null>(null);

  const [employeePerformanceData, setEmployeePerformanceData] = useState<{
    activeSubTab: number;
    employeePerformanceTableData: any[];
    employeeIssuesTableData: any[];
    departmentRecords?: Array<{
      name: string;
      score: number;
      count: number;
      color: string;
    }>;
    employeeRecords?: Array<{
      id?: string;
      name: string;
      department: string;
      score: string;
      lastEvaluation: string;
      status: string;
    }>;
    issueTypeRecords?: Array<{
      reason: string;
      count: number;
      percentage: string;
      color: string;
    }>;
    employeeIssueRecords?: Array<{
      id?: string;
      name: string;
      department: string;
      issueType: string;
      dateReported: string;
      status: string;
    }>;
    analyticsKPIs?: any;
    analyticsPerformanceTrend?: any[];
    analyticsMonthlyIssueVolume?: any[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRefresh = useCallback(() => {
    if (refreshCooldown > 0) return;

    // Invalidate only analytics-related queries to avoid 'thundering herd' problem
    queryClient.invalidateQueries({
      predicate: (query) => {
        // Check if query key is analytics-related
        return Array.isArray(query.queryKey) &&
               query.queryKey.some(key =>
                 typeof key === 'string' &&
                 (key.toLowerCase().includes('analytics') ||
                  key.toLowerCase().includes('workforce') ||
                  key.toLowerCase().includes('performance') ||
                  key.toLowerCase().includes('compliance') ||
                  key.toLowerCase().includes('attrition') ||
                  key.toLowerCase().includes('issue'))
               );
      }
    });

    setRefreshCooldown(REFRESH_COOLDOWN_SECONDS);
    cooldownTimerRef.current = setInterval(() => {
      setRefreshCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current!);
          cooldownTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [refreshCooldown, queryClient]);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);
  const [showEmpPerformancePrintModal, setShowEmpPerformancePrintModal] = useState(false);

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
    // For Workforce Overview tab, show the print records selection modal
    if (activeTab === 1) {
      setShowPrintModal(true);
      return;
    }

    // For Employee Performance tab, show the print records selection modal
    if (activeTab === 2) {
      setShowEmpPerformancePrintModal(true);
      return;
    }

    // For other tabs, proceed with normal print functionality
    await executePrint();
  };

  const executePrint = async (
    selectedOption?: string, 
    selectedRecords?: number[] | string[], 
    step?: number,
    departmentOption?: string,
    departmentRecords?: string[],
    employeeOption?: string,
    employeeRecords?: string[],
    issueTypeOption?: string,
    issueTypeRecords?: string[],
    employeeIssueOption?: string,
    employeeIssueRecords?: string[]
  ) => {
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
            currentAppliedDateFilter,
            workforceData.activeSubTab,
            workforceData.rolePipelineData,
            selectedOption,
            selectedRecords as number[],
            workforceData.analyticsKPIs,
            workforceData.analyticsApplicantVsHired,
            workforceData.analyticsAttrition
          );
          
          // Log audit after successful print
          logAudit({
            report_type: 'workforce-overview'
          });
          break;
        case 2: // Employee Performance
          if (!employeePerformanceData) {
            throw new Error('No employee performance data available for printing');
          }
          
          // Use the new parameters if provided, otherwise fall back to step-based logic
          const selectedDepartments = departmentRecords || (step === 1 ? selectedRecords as string[] : undefined);
          const selectedEmployees = employeeRecords || (step === 2 ? selectedRecords as string[] : undefined);
          const selectedIssueTypes = issueTypeRecords || (step === 3 ? selectedRecords as string[] : undefined);
          const selectedEmployeeIssues = employeeIssueRecords || (step === 4 ? selectedRecords as string[] : undefined);
          
          await handlePrintAnalytics(
            activeTab,
            currentTab.name,
            generatePDFLocally,
            currentAppliedDateFilter,
            employeePerformanceData.activeSubTab,
            undefined, // rolePipelineData
            selectedOption,
            undefined, // selectedRecords (workforce)
            undefined, // analyticsKPIs (workforce)
            undefined, // analyticsApplicantVsHired
            undefined, // analyticsAttrition
            employeePerformanceData.employeePerformanceTableData,
            employeePerformanceData.employeeIssuesTableData,
            selectedDepartments,
            selectedEmployees,
            selectedIssueTypes,
            selectedEmployeeIssues,
            departmentOption,
            employeeOption,
            issueTypeOption,
            employeeIssueOption,
            employeePerformanceData.analyticsKPIs,
            employeePerformanceData.analyticsPerformanceTrend,
            employeePerformanceData.analyticsMonthlyIssueVolume,
            employeePerformanceData.departmentRecords,
            employeePerformanceData.issueTypeRecords
          );
          
          // Log audit after successful print
          logAudit({
            report_type: 'employee-performance-development'
          });
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

  const handlePrintModalConfirm = async (selectedOption: string, selectedRecords?: number[]) => {
    setShowPrintModal(false);
    await executePrint(selectedOption, selectedRecords);
  };

  const handleEmpPerformancePrintModalConfirm = async (
    selectedOption: string, 
    selectedRecords?: string[], 
    step?: number,
    allSelections?: {
      departments: { option: string; records: string[] };
      employees: { option: string; records: string[] };
      issueTypes: { option: string; records: string[] };
      employeeIssues: { option: string; records: string[] };
    }
  ) => {
    setShowEmpPerformancePrintModal(false);
    

    
    if (allSelections) {

      
      // Use the new allSelections structure
      await executePrint(
        'all', // Use 'all' as the main option since we're handling individual selections
        [], // Empty array since we're using allSelections
        4, // Always step 4 since we're collecting all selections
        allSelections.departments.option,
        allSelections.departments.records,
        allSelections.employees.option,
        allSelections.employees.records,
        allSelections.issueTypes.option,
        allSelections.issueTypes.records,
        allSelections.employeeIssues.option,
        allSelections.employeeIssues.records
      );
    } else {
      // Fallback to old structure for backward compatibility
      await executePrint(selectedOption, selectedRecords, step);
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
          <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto'>
              <div className='relative w-full sm:w-auto'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full sm:w-40 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
              <p className='text-center sm:text-left'>to</p>
              <div className='relative w-full sm:w-auto'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full sm:w-40 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
            <div className='flex gap-2 w-full sm:w-auto justify-end sm:justify-start'>
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
              <button
                data-tooltip-id='content-tab-tooltip'
                data-tooltip-content={refreshCooldown > 0 ? `Refresh available in ${refreshCooldown}s` : 'Refresh data'}
                data-tooltip-place='bottom'
                className={`bg-white border border-gray-300 rounded-md p-2 transition-colors ${refreshCooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={handleRefresh}
                disabled={refreshCooldown > 0}
              >
                <ArrowPathIcon className='h-5 w-5' />
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
      
      {/* Print Records Selection Modal */}
      <PrintRolePipelineRecordsSelectionModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onConfirm={handlePrintModalConfirm}
        currentPageSize={workforceData?.rolePipelinePageSize || 5}
        isLoading={isGenerating}
        jobRecords={workforceData?.allJobPostsForPrint || []}
      />
      
      {/* Employee Performance Print Records Selection Modal */}
      <PrintEmpPerformanceSelectionModal
        isOpen={showEmpPerformancePrintModal}
        onClose={() => setShowEmpPerformancePrintModal(false)}
        onConfirm={handleEmpPerformancePrintModalConfirm}
        isLoading={isGenerating}
        departmentRecords={employeePerformanceData?.departmentRecords || []}
        employeeRecords={employeePerformanceData?.employeeRecords || []}
        issueTypeRecords={employeePerformanceData?.issueTypeRecords || []}
        employeeIssueRecords={employeePerformanceData?.employeeIssueRecords || []}
        activeSubTab={employeePerformanceData?.activeSubTab || 1}
      />
      
      <Tooltip id='content-tab-tooltip' />
    </>
  );
};

export default Content;