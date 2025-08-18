import React, { useState, useMemo, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import TotalActiveEmployeesCard from '../cards/workforce-overview/TotalActiveEmployeesCard';
import NewHiresCard from '../cards/workforce-overview/NewHiresCard';
import SeparatedEmployeesCard from '../cards/workforce-overview/SeparatedEmployeesCard';
import AttritionRateCard from '../cards/workforce-overview/AttritionRateCard';
import AverageTenureCard from '../cards/workforce-overview/AverageTenureCard';
import OverallApplicantsSummary from './components/workforce-overview-tab/applicant-vs-hired-tab/OverallApplicantsSummary';
import DemographicBreakdown from './components/workforce-overview-tab/applicant-vs-hired-tab/DemographicBreakdown';
import RolePipelineTable from './components/workforce-overview-tab/role-pipeline-tab/RolePipelineTable';
import AttritionRate from './components/workforce-overview-tab/attrition-rate-tab/AttritionRate';
import ExitReasons from './components/workforce-overview-tab/attrition-rate-tab/ExitReasons';

import useGetOverallApplicants from '../hooks/useGetOverallApplicants';
import useGetJobPostItems from '../hooks/useGetJobPostItems';
import useGetAllJobPostItems from '@/components/hooks/useGetAllJobPostItems';
import useGetAllSeparationItems from '@/components/hooks/useGetAllSeparationItems';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetAppliedApplicants from '../hooks/useGetAppliedApplicants';

import { getValidRegions } from '@/helpers/advertiseOptions';

interface WorkforceOverviewProps {
  dateFilter?: {
    from: string;
    to: string;
  };
}

const WorkforceOverview: React.FC<WorkforceOverviewProps> = ({ dateFilter }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  // Pagination State for Role Pipeline
  const [rolePipelinePageSize, setRolePipelinePageSize] = useState(5);
  const [rolePipelineCurrentPage, setRolePipelineCurrentPage] = useState(1);

  // State for demographic breakdown job filter
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('All Jobs');

  // Fetch overall applicants data across all job postings
  const { data: appliedApplicantsData, isLoading: applicantsLoading, error: applicantsError } = useGetOverallApplicants();

  // Fetch job postings data for role pipeline analysis (without date filter)
  const jobPostFilters = {
    currentPage: rolePipelineCurrentPage,
    pageSize: rolePipelinePageSize,
    search: '',
  };

  const { data: jobPostData, refetch: refetchJobPost } = useGetJobPostItems(jobPostFilters);

  // Fetch all job posts data for demographic analysis (without pagination)
  const { data: allJobPostData } = useGetAllJobPostItems();

  // Get selected job when filtering
  const selectedJob = useMemo(() => {
    if (selectedJobFilter === 'All Jobs' || !allJobPostData) {
      return null;
    }
    return allJobPostData.find((job: any) => job.job_title === selectedJobFilter);
  }, [selectedJobFilter, allJobPostData]);

  // Fetch applicants for specific job when selected
  const { data: specificJobApplicants, isLoading: specificJobLoading } = useGetAppliedApplicants(selectedJob?.id);

  // Initial fetch when component mounts
  useEffect(() => {
    refetchJobPost();
  }, []);

  // Fetch all separation data for attrition rate analysis and exit reasons (without pagination)
  const { data: allSeparationData, isLoading: allSeparationLoading, error: allSeparationError } = useGetAllSeparationItems();

  // Fetch employee data for headcount calculation
  const { data: employeeData, isLoading: employeeLoading, error: employeeError } = useGetEmployeeItems();

  // Fetch job postings when component loads and when pagination changes
  useEffect(() => {
    refetchJobPost();
  }, [rolePipelineCurrentPage, rolePipelinePageSize]);

  // Refetch job postings when tab is activated
  useEffect(() => {
    if (activeSubTab === 2) { // Role Turnaround and Pipeline Analysis tab
      refetchJobPost();
    }
  }, [activeSubTab]);



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

      // Generate pipeline information using applicant_applied_no
      const currentPipeline = job.applicant_applied_no > 0 
        ? `${job.applicant_applied_no} applicants` 
        : 'No applicants yet';

      return {
        role: job.job_title || 'Unknown Role',
        numberOfApplicants: job.applicant_applied_no || 0,
        status: status,
        dateJobOpened: formattedDate,
        turnaroundTime: turnaroundTime,
        currentPipeline: currentPipeline,
        jobId: job.id
      };
    });
  }, [jobPostData]);

  // Get pipeline data for all jobs
  const pipelineData = useMemo(() => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData)) {
      return {};
    }

    const pipeline: { [jobId: number]: { [stageTitle: string]: number } } = {};

    appliedApplicantsData.forEach((applicant: any) => {
      const jobId = applicant.job_posting?.id;
      const stageTitle = applicant.job_stages_title || 'Unknown Stage';
      
      if (jobId) {
        if (!pipeline[jobId]) {
          pipeline[jobId] = {};
        }
        pipeline[jobId][stageTitle] = (pipeline[jobId][stageTitle] || 0) + 1;
      }
    });

    return pipeline;
  }, [appliedApplicantsData]);

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

  // Workforce metrics are now handled by separate calculation components

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
              appliedApplicantsData={selectedJobFilter === 'All Jobs' ? appliedApplicantsData : specificJobApplicants}
              jobPostData={{ records: allJobPostData }}
              validRegions={getValidRegions().filter((region): region is string => region !== null)}
              isLoading={selectedJobFilter === 'All Jobs' ? applicantsLoading : specificJobLoading}
              error={applicantsError}
              selectedJobFilter={selectedJobFilter}
              onJobFilterChange={setSelectedJobFilter}
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
              pipelineData={pipelineData}
            />
          </div>
        );
      
      case 3: // Attrition Rate
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Attrition Rate */}
            <AttritionRate 
              separationData={allSeparationData}
              isLoading={allSeparationLoading}
              error={allSeparationError}
              dateFilter={dateFilter}
            />

            {/* Exit Reasons */}
            <ExitReasons 
              separationData={allSeparationData}
              isLoading={allSeparationLoading}
              error={allSeparationError}
            />
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
        {/* Total Active Employees Card */}
        <TotalActiveEmployeesCard
          employeeData={employeeData}
          isLoading={employeeLoading}
          error={employeeError}
        />
        
        {/* New Hires Card */}
        <NewHiresCard
          appliedApplicantsData={appliedApplicantsData}
          isLoading={applicantsLoading}
          error={applicantsError}
        />
        
        {/* Separated Employees Card */}
        <SeparatedEmployeesCard
          separationData={allSeparationData}
          isLoading={allSeparationLoading}
          error={allSeparationError}
        />
        
        {/* Attrition Rate Card */}
        <AttritionRateCard
          separationData={allSeparationData}
          employeeData={employeeData}
          isLoading={allSeparationLoading || employeeLoading}
          error={allSeparationError || employeeError}
        />
        
        {/* Average Tenure Card */}
        <AverageTenureCard
          employeeData={employeeData}
          separationData={allSeparationData}
          isLoading={employeeLoading}
          error={employeeError}
        />
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
                  className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${activeSubTab === tab.id ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}
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
                    className={`text-sm font-bold pb-2 text-center whitespace-nowrap cursor-pointer transition-all duration-200 hover:text-savoy-blue ${activeSubTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}
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
