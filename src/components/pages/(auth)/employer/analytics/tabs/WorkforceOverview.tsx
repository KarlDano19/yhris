'use client';

import React, { useState, useMemo, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import Card from '../Card';
import OverallApplicantsSummary from './components/workforce-overview-tab/applicant-vs-hired-tab/OverallApplicantsSummary';
import DemographicBreakdown from './components/workforce-overview-tab/applicant-vs-hired-tab/DemographicBreakdown';
import RolePipelineTable from './components/workforce-overview-tab/role-pipeline-tab/RolePipelineTable';
import AttritionRate from './components/workforce-overview-tab/attrition-rate-tab/AttritionRate';
import ExitReasons from './components/workforce-overview-tab/attrition-rate-tab/ExitReasons';
import useGetOverallApplicants from '../hooks/useGetOverallApplicants';
import useGetJobPostItems from '../hooks/useGetJobPostItems';

const WorkforceOverview = () => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  // Pagination State for Role Pipeline
  const [rolePipelinePageSize, setRolePipelinePageSize] = useState(5);
  const [rolePipelineCurrentPage, setRolePipelineCurrentPage] = useState(1);

  // Fetch overall applicants data across all job postings
  const { data: appliedApplicantsData, isLoading: applicantsLoading, error: applicantsError } = useGetOverallApplicants();

  // Fetch job postings data for role pipeline analysis
  const jobPostFilters = {
    currentPage: rolePipelineCurrentPage,
    pageSize: rolePipelinePageSize,
    search: '',
  };

  const { data: jobPostData, refetch: refetchJobPost } = useGetJobPostItems(jobPostFilters);

  // Refetch job postings when pagination changes or when tab is activated
  useEffect(() => {
    if (activeSubTab === 2) { // Role Turnaround and Pipeline Analysis tab
      refetchJobPost();
    }
  }, [rolePipelineCurrentPage, rolePipelinePageSize, activeSubTab]);

  // Transform job postings data for role pipeline table
  const rolePipelineData = useMemo(() => {
    if (!jobPostData?.records || !Array.isArray(jobPostData.records)) {
      return [];
    }

    return jobPostData.records.map((job: any) => {
      // Calculate turnaround time (days since job opened)
      const jobOpenedDate = new Date(job.created_at);
      const currentDate = new Date();
      const turnaroundTime = Math.ceil((currentDate.getTime() - jobOpenedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Format date
      const formattedDate = jobOpenedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Determine status based on job data
      const status = job.is_active ? 'Ongoing' : 'Closed';

      // Generate pipeline information (this would need to be enhanced with actual applicant data)
      const currentPipeline = job.total_applicants > 0 
        ? `${job.total_applicants} applicants` 
        : 'No applicants yet';

      return {
        role: job.job_title || 'Unknown Role',
        numberOfApplicants: job.total_applicants || 0,
        status: status,
        dateJobOpened: formattedDate,
        turnaroundTime: turnaroundTime,
        currentPipeline: currentPipeline
      };
    });
  }, [jobPostData]);

  // Create pagination object for the table
  const paginationData = useMemo(() => {
    if (!jobPostData) {
      return {
        totalRecords: 0,
        totalPages: 1
      };
    }
    
    return {
      totalRecords: jobPostData.total_records || jobPostData.totalRecords || 0,
      totalPages: jobPostData.total_pages || jobPostData.totalPages || 1
    };
  }, [jobPostData]);

  // Dummy data for workforce metrics
  const workforceData = [
    {
      title: <>Total Active Employees</>,
      value: '143',
      trend: 'Increased by +5 from last Q4 of 2025 (3.6%)',
      isPositive: true,
    },
    {
      title: <>New Hires</>,
      value: '12',
      trend: 'Increased by +3 from last Q4 of 2025 (33%)',
      isPositive: true,
    },
    {
      title: <>Separated Employees</>,
      value: '4',
      trend: 'Decreased by -2 from last Q4 of 2025 (33%)',
      isPositive: true, // Positive because decrease in separations is good
    },
    {
      title: <>Attrition Rate</>,
      value: '2.8%',
      trend: 'Decreased by -1.4% from last Q4 of 2025 (4.2%)',
      isPositive: true, // Positive because decrease in attrition is good
    },
    {
      title: <>Average Tenure (Years)</>,
      value: '2.3',
      trend: 'No significant change',
      isPositive: true,
    },
  ];

  // Sub Tab Navigation
  const subTabs = [
    { id: 1, name: 'Applicant vs Hired', isAvailable: true },
    { id: 2, name: 'Role Turnaround and Pipeline Analysis', isAvailable: true },
    { id: 3, name: 'Attrition Rate', isAvailable: true },
  ];

  // Pagination Handlers for Role Pipeline
  const rolePipelinePaginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setRolePipelineCurrentPage(newCurrentPage);
  };

  const rolePipelinePageSizeChange = (value: number) => {
    setRolePipelineCurrentPage(1);
    setRolePipelinePageSize(value);
  };

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1: // Applicant vs Hired
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Overall Applicants Status Summary */}
            <OverallApplicantsSummary 
              appliedApplicantsData={appliedApplicantsData}
              isLoading={applicantsLoading}
              error={applicantsError}
            />

            {/* Demographic Breakdown */}
            <DemographicBreakdown 
              appliedApplicantsData={appliedApplicantsData}
              isLoading={applicantsLoading}
              error={applicantsError}
            />
          </div>
        );
      
      case 2: // Role Turnaround and Pipeline Analysis
        return (
          <div className="pb-8">
            <RolePipelineTable
              data={rolePipelineData}
              pagination={paginationData}
              isLoading={false}
              error={null}
              currentPage={rolePipelineCurrentPage}
              pageSize={rolePipelinePageSize}
              onPageChange={rolePipelinePaginationChange}
              onPageSizeChange={rolePipelinePageSizeChange}
            />
          </div>
        );
      
      case 3: // Attrition Rate
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Attrition Rate */}
            <AttritionRate />

            {/* Exit Reasons */}
            <ExitReasons />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Workforce KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {workforceData.map((data, index) => (
          <div key={index} className="flex flex-col pl-2 pr-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">{data.title}</h3>
            <Card
              value={data.value}
              trend={data.trend}
              isPositive={data.isPositive}
            />
          </div>
        ))}
      </div>

      {/* Sub Tab Navigation */}
      <div className="mt-8">
        {/* Desktop tabs */}
        <div className="hidden md:flex flex-row justify-between space-x-2 w-3/4">
          {subTabs.map((tab) => (
            <div key={tab.id} className="cursor-pointer">
              {tab.isAvailable ? (
                <h1 
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`text-lg font-bold pb-2 text-center ${activeSubTab === tab.id ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}
                >
                  {tab.name}
                </h1>
              ) : (
                <div
                  data-tooltip-id='workforce-subtab-tooltip'
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
            {subTabs.map((tab) => (
              <div 
                key={tab.id} 
                className={tab.isAvailable ? "cursor-pointer flex-shrink-0" : "cursor-not-allowed flex-shrink-0"}
              >
                {tab.isAvailable ? (
                  <h1 
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${activeSubTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}
                  >
                    {tab.name}
                  </h1>
                ) : (
                  <div
                    data-tooltip-id='workforce-subtab-tooltip'
                    data-tooltip-content='Coming soon.'
                    data-tooltip-place='bottom'
                  >
                    <h1 className="text-sm font-bold pb-2 text-center whitespace-nowrap text-gray-400 opacity-50">
                      {tab.name}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Tooltip id='workforce-subtab-tooltip' />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default WorkforceOverview;
