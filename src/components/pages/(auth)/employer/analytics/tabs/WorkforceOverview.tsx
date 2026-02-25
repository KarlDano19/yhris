import React, { useState, useMemo, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';

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

import useGetWorkforceOverviewKPIs from '../hooks/useGetWorkforceOverviewKPIs';
import useGetApplicantVsHired from '../hooks/useGetApplicantVsHired';
import useGetRolePipeline from '../hooks/useGetRolePipeline';
import useGetAttritionRate from '../hooks/useGetAttritionRate';
import useGetJobPostItems from '../hooks/useGetJobPostItems';

import { ApplicantSummaryItem } from './components/workforce-overview-tab/applicant-vs-hired-tab/OverallApplicantsSummary';
import { AttritionRateData } from './components/workforce-overview-tab/attrition-rate-tab/AttritionRate';
import { PipelineData } from './components/workforce-overview-tab/role-pipeline-tab/RolePipelineTable';

interface WorkforceOverviewProps {
  dateFilter?: {
    from: string;
    to: string;
  };
  onDataReady?: (data: {
    activeSubTab: number;
    rolePipelineData: any[];
    rolePipelineCurrentPage: number;
    rolePipelinePageSize: number;
    allJobPostsForPrint?: any[];
    analyticsKPIs?: any;
    analyticsApplicantVsHired?: any;
    analyticsAttrition?: any;
  }) => void;
}

const WorkforceOverview: React.FC<WorkforceOverviewProps> = ({ dateFilter, onDataReady }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  // Demographic filter state
  const [selectedJobFilter, setSelectedJobFilter] = useState('All Jobs');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');

  // Pagination state for Role Pipeline
  const [rolePipelinePageSize, setRolePipelinePageSize] = useState(5);
  const [rolePipelineCurrentPage, setRolePipelineCurrentPage] = useState(1);

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const fromDate = formatDateForAPI(dateFilter?.from || '');
  const toDate = formatDateForAPI(dateFilter?.to || '');

  // Analytics API hooks
  const {
    data: kpisData,
    isLoading: kpisLoading,
    error: kpisError,
  } = useGetWorkforceOverviewKPIs({ from: fromDate, to: toDate });

  // Fetch job list (always enabled: needed for filter + print)
  const { data: jobPostData } = useGetJobPostItems({}, true);
  const jobPostRecords: any[] = Array.isArray(jobPostData)
    ? jobPostData
    : (jobPostData as any)?.records || [];
  const selectedJobId: number | undefined =
    selectedJobFilter !== 'All Jobs'
      ? jobPostRecords.find((j: any) => j.job_title === selectedJobFilter)?.id
      : undefined;

  const {
    data: applicantVsHiredData,
    isLoading: applicantVsHiredLoading,
    error: applicantVsHiredError,
  } = useGetApplicantVsHired(activeSubTab === 1, selectedJobId, fromDate, toDate);

  const {
    data: rolePipelineData,
    isLoading: rolePipelineLoading,
    error: rolePipelineError,
  } = useGetRolePipeline({
    from: fromDate,
    to: toDate,
    current_page: rolePipelineCurrentPage,
    page_size: rolePipelinePageSize,
    enabled: activeSubTab === 2,
  });


  const {
    data: attritionData,
    isLoading: attritionLoading,
    error: attritionError,
  } = useGetAttritionRate({ from: fromDate, to: toDate, enabled: activeSubTab === 3 });

  // Always-enabled fetch for print (not gated by sub-tab)
  const { data: attritionDataForPrint } = useGetAttritionRate({ from: fromDate, to: toDate, enabled: true });

  // Reset pagination on date filter change
  useEffect(() => {
    setRolePipelineCurrentPage(1);
  }, [fromDate, toDate]);

  // Transform applicants summary for OverallApplicantsSummary component
  const precomputedApplicantItems = useMemo((): ApplicantSummaryItem[] | undefined => {
    const summary = applicantVsHiredData?.applicants_summary;
    if (!summary || summary.total_applied === 0) return undefined;
    return [
      {
        status: 'Applied',
        count: summary.total_applied.toString(),
        percentage: summary.total_applied > 0 ? '100%' : '0%',
        label: '(initial total applicants)',
        color: 'text-gray-800 font-bold',
      },
      {
        status: 'Ongoing',
        count: summary.ongoing.count.toString(),
        percentage: `${summary.ongoing.percentage.toFixed(0)}%`,
        label: 'of total applied',
        color: 'text-blue-600',
      },
      {
        status: 'Hired',
        count: summary.hired.count.toString(),
        percentage: `${summary.hired.percentage.toFixed(0)}%`,
        label: 'of total applied',
        color: 'text-green-600',
      },
      {
        status: 'Rejected',
        count: summary.rejected.count.toString(),
        percentage: `${summary.rejected.percentage.toFixed(0)}%`,
        label: 'of total applied',
        color: 'text-red-600',
      },
      {
        status: 'Withdrawn',
        count: summary.withdrawn.count.toString(),
        percentage: `${summary.withdrawn.percentage.toFixed(0)}%`,
        label: 'of total applied',
        color: 'text-red-600',
      },
    ];
  }, [applicantVsHiredData]);

  // Transform demographic breakdown for DemographicBreakdown component
  const precomputedDemographic = useMemo(() => {
    const breakdown = applicantVsHiredData?.demographic_breakdown;
    const totalApplied = applicantVsHiredData?.applicants_summary?.total_applied ?? 0;
    if (!breakdown || totalApplied === 0) return undefined;
    const topRegion = breakdown.regions[0];
    const topAge = breakdown.age_groups?.reduce(
      (best: any, cur: any) => (cur.count > (best?.count ?? -1) ? cur : best),
      null
    );
    return [
      {
        demographic: 'Female Applicants',
        details: `${Math.round(breakdown.gender.female_percentage)}%`,
      },
      {
        demographic: 'Male Applicants',
        details: `${Math.round(breakdown.gender.male_percentage)}%`,
      },
      {
        demographic: 'Most Common Regions',
        details: topRegion ? `${topRegion.label} (${topRegion.count})` : '—',
      },
      {
        demographic: 'Most Common Age Group',
        details: topAge && topAge.count > 0 ? `${topAge.label} (${topAge.count} applicants)` : '—',
      },
    ];
  }, [applicantVsHiredData]);

  // Transform role pipeline records for RolePipelineTable component
  const transformedRolePipelineData = useMemo(() => {
    if (!rolePipelineData?.records) return [];
    return rolePipelineData.records.map((record) => {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      };
      const pipelineStages = record.pipeline_stages || [];
      const currentPipeline = pipelineStages.length > 0
        ? pipelineStages.map((s) => `${s.stage}: ${s.count}`).join(', ')
        : record.number_of_applicants > 0
          ? `${record.number_of_applicants} applicants`
          : 'No applicants yet';

      return {
        role: record.role,
        numberOfApplicants: record.number_of_applicants,
        status: record.status,
        dateJobOpened: formatDate(record.date_job_opened),
        dateJobClosed: record.date_job_closed ? formatDate(record.date_job_closed) : '—',
        turnaroundTime: record.turnaround_days,
        currentPipeline,
        jobId: record.id,
      };
    });
  }, [rolePipelineData]);

  // Build pipelineData map { jobId: { stageTitle: count } } for the modal
  const pipelineData = useMemo((): PipelineData => {
    if (!rolePipelineData?.records) return {};
    return rolePipelineData.records.reduce((acc: PipelineData, record: any) => {
      const stages: Array<{ stage: string; count: number }> = record.pipeline_stages || [];
      if (stages.length > 0) {
        acc[record.id] = stages.reduce((stageAcc: { [key: string]: number }, s) => {
          stageAcc[s.stage] = s.count;
          return stageAcc;
        }, {});
      }
      return acc;
    }, {});
  }, [rolePipelineData]);

  // Transform attrition trend for AttritionRate component
  const precomputedAttritionTrend = useMemo((): AttritionRateData[] | undefined => {
    if (!attritionData?.attrition_trend) return undefined;
    const hasExits = attritionData.attrition_trend.some(item => item.total_exits > 0);
    if (!hasExits) return undefined;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return attritionData.attrition_trend.map((item) => {
      const mName = typeof item.month === 'number'
        ? monthNames[item.month - 1] || String(item.month)
        : item.month;
      return {
        month: mName,
        attritionRate: `${item.attrition_rate.toFixed(2)}%`,
        totalExits: item.total_exits,
      };
    });
  }, [attritionData]);

  const paginationData = useMemo(() => ({
    totalRecords: rolePipelineData?.total_records || 0,
    totalPages: rolePipelineData?.total_pages || 1,
  }), [rolePipelineData]);

  // Transform job post records (view_type=select, all records) for print
  const rolePipelineDataForPrint = useMemo(() => {
    return jobPostRecords.map((record: any) => {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      };
      return {
        role: record.job_title,
        numberOfApplicants: record.applicant_applied_no || 0,
        status: record.is_active ? 'Ongoing' : 'Closed',
        dateJobOpened: formatDate(record.created_at),
        dateJobClosed: '—',
        turnaroundTime: 0,
        currentPipeline: record.applicant_applied_no > 0
          ? `${record.applicant_applied_no} applicants`
          : 'No applicants yet',
        jobId: record.id,
      };
    });
  }, [jobPostRecords]);

  // Provide data to Content.tsx for print functionality
  useEffect(() => {
    if (!onDataReady) return;
    onDataReady({
      activeSubTab,
      rolePipelineData: rolePipelineDataForPrint,
      rolePipelineCurrentPage,
      rolePipelinePageSize,
      allJobPostsForPrint: jobPostRecords.map((r: any) => ({
        id: r.id,
        role: r.job_title,
        number_of_applicants: r.applicant_applied_no || 0,
        status: r.is_active ? 'Ongoing' : 'Closed',
        date_job_opened: r.created_at,
        date_job_closed: null,
      })),
      analyticsKPIs: kpisData || null,
      analyticsApplicantVsHired: applicantVsHiredData || null,
      analyticsAttrition: attritionDataForPrint || null,
    });
  }, [activeSubTab, applicantVsHiredData, jobPostRecords, rolePipelineDataForPrint, rolePipelineCurrentPage, rolePipelinePageSize, kpisData, attritionDataForPrint, onDataReady]);

  // Sub Tab Navigation
  const subTabs = [
    { id: 1, name: 'Applicant vs Hired', isAvailable: true },
    { id: 2, name: 'Role Turnaround and Pipeline Analysis', isAvailable: true },
    { id: 3, name: 'Attrition Rate', isAvailable: true },
  ];

  const rolePipelinePaginationChange = (event: any) => {
    setRolePipelineCurrentPage(event.selected + 1);
  };

  const rolePipelinePageSizeChange = (value: number) => {
    setRolePipelineCurrentPage(1);
    setRolePipelinePageSize(value);
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <OverallApplicantsSummary
              isLoading={applicantVsHiredLoading}
              error={applicantVsHiredError}
              precomputedItems={precomputedApplicantItems}
              selectedJobFilter={selectedJobFilter}
              selectedStatusFilter={selectedStatusFilter}
            />
            <DemographicBreakdown
              isLoading={applicantVsHiredLoading}
              error={applicantVsHiredError}
              precomputedDemographic={precomputedDemographic}
              jobPostData={{ records: jobPostRecords }}
              selectedJobFilter={selectedJobFilter}
              onJobFilterChange={setSelectedJobFilter}
              selectedStatusFilter={selectedStatusFilter}
              onStatusFilterChange={setSelectedStatusFilter}
            />
          </div>
        );

      case 2:
        return (
          <div className="pb-8">
            <RolePipelineTable
              data={transformedRolePipelineData}
              pagination={paginationData}
              isLoading={rolePipelineLoading}
              error={rolePipelineError}
              currentPage={rolePipelineCurrentPage}
              pageSize={rolePipelinePageSize}
              onPageChange={rolePipelinePaginationChange}
              onPageSizeChange={rolePipelinePageSizeChange}
              pipelineData={pipelineData}
            />
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <AttritionRate
              isLoading={attritionLoading}
              error={attritionError}
              precomputedTrend={precomputedAttritionTrend}
              dateFilter={dateFilter}
            />
            <ExitReasons
              isLoading={attritionLoading}
              error={attritionError}
              precomputedReasons={attritionData?.exit_reasons}
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
      <div className="overflow-x-auto overflow-y-visible pb-5 -mx-4 px-4">
        {kpisLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size="lg" color="yellow" />
          </div>
        ) : kpisError ? (
          <div className="flex items-center justify-center py-6 text-red-500 text-sm">Error loading KPI data</div>
        ) : !kpisData || (
          !kpisData.total_active_employees &&
          !kpisData.new_hires &&
          !kpisData.separated_employees &&
          !kpisData.attrition_rate &&
          !kpisData.average_tenure_years
        ) ? (
          <div className="text-center text-gray-500 py-4 text-sm font-medium">No Data Available</div>
        ) : (
          <div className="flex gap-6 min-w-full w-max">
            {!!kpisData.total_active_employees && (
              <div className="flex-shrink-0">
                <TotalActiveEmployeesCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.total_active_employees}
                  prevQ4Value={kpisData.total_active_prev_q4}
                  prevQ4Year={kpisData.prev_q4_year}
                />
              </div>
            )}
            {!!kpisData.new_hires && (
              <div className="flex-shrink-0">
                <NewHiresCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.new_hires}
                  prevQ4Value={kpisData.new_hires_prev_q4}
                  prevQ4Year={kpisData.prev_q4_year}
                />
              </div>
            )}
            {!!kpisData.separated_employees && (
              <div className="flex-shrink-0">
                <SeparatedEmployeesCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.separated_employees}
                  prevQ4Value={kpisData.separated_prev_q4}
                  prevQ4Year={kpisData.prev_q4_year}
                />
              </div>
            )}
            {!!kpisData.attrition_rate && (
              <div className="flex-shrink-0">
                <AttritionRateCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.attrition_rate}
                />
              </div>
            )}
            {!!kpisData.average_tenure_years && (
              <div className="flex-shrink-0">
                <AverageTenureCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.average_tenure_years}
                />
              </div>
            )}
          </div>
        )}
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
                  className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${activeSubTab === tab.id ? 'text-savoy-blue border-b-4 border-savoy-blue' : 'text-gray-500'}`}
                >
                  {tab.name}
                </h1>
              ) : (
                <div
                  data-tooltip-id="workforce-subtab-tooltip"
                  data-tooltip-content="Coming soon."
                  data-tooltip-place="bottom"
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

        {/* Mobile tabs */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex space-x-4 min-w-max px-4">
            {subTabs.map((tab) => (
              <div
                key={tab.id}
                className={tab.isAvailable ? 'cursor-pointer flex-shrink-0' : 'cursor-not-allowed flex-shrink-0'}
              >
                {tab.isAvailable ? (
                  <h1
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`text-sm font-bold pb-2 text-center whitespace-nowrap cursor-pointer transition-all duration-200 hover:text-savoy-blue ${activeSubTab === tab.id ? 'text-savoy-blue border-b-2 border-savoy-blue' : 'text-gray-500'}`}
                  >
                    {tab.name}
                  </h1>
                ) : (
                  <div
                    data-tooltip-id="workforce-subtab-tooltip"
                    data-tooltip-content="Coming soon."
                    data-tooltip-place="bottom"
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
        <Tooltip id="workforce-subtab-tooltip" />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default WorkforceOverview;
