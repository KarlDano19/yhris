import React, { useState, useMemo, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';

import AveragePerformanceCard from '../cards/employee-performance/AveragePerformanceCard';
import ResolvedVSOngoingCard from '../cards/employee-performance/ResolvedVSOngoingCard';
import PerformanceRate from './components/employeee-performance-tab/performance-rate-tab/PerformanceRate';
import PerformanceTrend from './components/employeee-performance-tab/performance-rate-tab/PerformanceTrend';
import EmployeePerformanceTable from './components/employeee-performance-tab/performance-rate-tab/EmployeePerformanceTable';
import IssueType from './components/employeee-performance-tab/employee-issue-rate-tab/IssueType';
import MonthlyTypeVolume from './components/employeee-performance-tab/employee-issue-rate-tab/MonthlyTypeVolume';
import EmployeeIssuesTable from './components/employeee-performance-tab/employee-issue-rate-tab/EmployeeIssuesTable';

import useGetEmployeePerformanceKPIs from '../hooks/useGetEmployeePerformanceKPIs';
import useGetPerformanceRate from '../hooks/useGetPerformanceRate';
import useGetEmployeeIssueRate from '../hooks/useGetEmployeeIssueRate';
import useGetAllEmployeeIssueItems from '@/components/hooks/useGetAllEmployeeIssueItems';
import useGetEvaluationHistoryItems from '@/components/hooks/useGetEvaluationHistoryItems';

interface EmployeePerformanceProps {
  data?: any;
  dateFilter?: {
    from: string;
    to: string;
  };
  onDataReady?: (data: any) => void;
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ data, dateFilter, onDataReady }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllIssueTypes, setShowAllIssueTypes] = useState(false);

  // Department filter for performance trend (lifted from PerformanceTrend child)
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Pagination state for Employee Performance table
  const [employeePerformancePageSize, setEmployeePerformancePageSize] = useState(5);
  const [employeePerformanceCurrentPage, setEmployeePerformanceCurrentPage] = useState(1);
  const [performanceSearch, setPerformanceSearch] = useState('');

  // Pagination state for Employee Issues table
  const [employeeIssuePageSize, setEmployeeIssuePageSize] = useState(5);
  const [employeeIssueCurrentPage, setEmployeeIssueCurrentPage] = useState(1);
  const [issueSearch, setIssueSearch] = useState('');

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
  } = useGetEmployeePerformanceKPIs({ from: fromDate, to: toDate });

  const {
    data: performanceRateData,
    isLoading: performanceRateLoading,
    error: performanceRateError,
  } = useGetPerformanceRate({
    from: fromDate,
    to: toDate,
    department: selectedDepartment !== 'All Departments' ? selectedDepartment : undefined,
    current_page: employeePerformanceCurrentPage,
    page_size: employeePerformancePageSize,
    search: performanceSearch || undefined,
    enabled: activeSubTab === 1,
  });

  const {
    data: issueRateData,
    isLoading: issueRateLoading,
    error: issueRateError,
  } = useGetEmployeeIssueRate({
    from: fromDate,
    to: toDate,
    current_page: employeeIssueCurrentPage,
    page_size: employeeIssuePageSize,
    search: issueSearch || undefined,
    enabled: activeSubTab === 3,
  });

  // Always-enabled view_type=select hooks for print (not gated by sub-tab)
  const { data: allIssueItemsForPrint } = useGetAllEmployeeIssueItems(
    fromDate || toDate ? { from: fromDate || undefined, to: toDate || undefined } : undefined
  );
  const { data: allEvalItemsForPrint } = useGetEvaluationHistoryItems(
    fromDate || toDate ? { from: fromDate || undefined, to: toDate || undefined } : undefined
  );

  // Transform performance table records for EmployeePerformanceTable
  const performanceTableData = useMemo(() => {
    if (!performanceRateData?.performance_table?.records) return [];
    return performanceRateData.performance_table.records.map((record) => ({
      id: record.id.toString(),
      name: record.employee_name || 'N/A',
      department: record.department || 'N/A',
      score: (record.total_score != null && record.max_total_score != null)
        ? `${record.total_score}/${record.max_total_score}`
        : `${record.score_percentage.toFixed(1)}%`,
      lastEvaluation: record.date_of_evaluation
        ? new Date(record.date_of_evaluation).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      status: record.status || 'N/A',
    }));
  }, [performanceRateData]);

  // Transform issues table records for EmployeeIssuesTable
  const issuesTableData = useMemo(() => {
    if (!issueRateData?.issues_table?.records) return [];
    return issueRateData.issues_table.records.map((record) => ({
      id: record.id.toString(),
      name: record.employee_name || 'N/A',
      department: record.department || 'N/A',
      issueType: record.issue_type || 'Not Specified',
      dateReported: record.date_reported
        ? new Date(record.date_reported).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      status: record.status || 'Pending',
    }));
  }, [issueRateData]);

  // Provide data to Content.tsx for print functionality
  const defaultColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

  // Build print data from view_type=select sources (always available)
  const printIssueTypeRecords = useMemo(() => {
    const issues: any[] = Array.isArray(allIssueItemsForPrint) ? allIssueItemsForPrint : [];
    const typeCounts: Record<string, number> = {};
    issues.forEach((issue) => {
      const type = issue.issue_type || 'Not Specified';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const total = issues.length;
    return Object.entries(typeCounts).map(([reason, count], idx) => ({
      reason,
      count,
      percentage: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0.0%',
      color: defaultColors[idx % defaultColors.length],
    }));
  }, [allIssueItemsForPrint]);

  const printEmployeeIssueRecords = useMemo(() => {
    const issues: any[] = Array.isArray(allIssueItemsForPrint) ? allIssueItemsForPrint : [];
    return issues.map((issue) => {
      let status = 'Pending';
      if (issue.is_decision_sent && issue.is_decision_received) status = 'Resolved';
      else if (issue.investigate) status = 'Under Hearing';
      else if (issue.is_nte_sent && issue.is_nte_received) status = 'NTE Issued';
      return {
        id: issue.id?.toString(),
        name: issue.name || 'N/A',
        department: issue.department || 'N/A',
        issueType: issue.issue_type || 'Not Specified',
        dateReported: issue.incident_date
          ? new Date(issue.incident_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'N/A',
        status,
      };
    });
  }, [allIssueItemsForPrint]);

  const printDepartmentRecords = useMemo(() => {
    const evals: any[] = Array.isArray(allEvalItemsForPrint) ? allEvalItemsForPrint : [];
    const deptMap: Record<string, { totalScore: number; maxScore: number; count: number }> = {};
    evals.forEach((ev) => {
      const dept = ev.department || 'Unknown';
      if (!deptMap[dept]) deptMap[dept] = { totalScore: 0, maxScore: 0, count: 0 };
      deptMap[dept].totalScore += ev.form_total_score || 0;
      deptMap[dept].maxScore += ev.max_total_score || 0;
      deptMap[dept].count++;
    });
    return Object.entries(deptMap).map(([name, d], idx) => ({
      name,
      score: d.maxScore > 0 ? (d.totalScore / d.maxScore) * 100 : 0,
      count: d.count,
      color: defaultColors[idx % defaultColors.length],
    }));
  }, [allEvalItemsForPrint]);

  const printEmployeeRecords = useMemo(() => {
    const evals: any[] = Array.isArray(allEvalItemsForPrint) ? allEvalItemsForPrint : [];
    return evals.map((ev) => ({
      id: ev.id?.toString(),
      name: ev.employee_name || 'N/A',
      department: ev.department || 'N/A',
      score: (ev.form_total_score != null && ev.max_total_score != null)
        ? `${ev.form_total_score}/${ev.max_total_score}`
        : 'N/A',
      lastEvaluation: ev.date_of_evaluation
        ? new Date(ev.date_of_evaluation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A',
      status: ev.status || 'N/A',
    }));
  }, [allEvalItemsForPrint]);

  const printMonthlyIssueVolume = useMemo(() => {
    const issues: any[] = Array.isArray(allIssueItemsForPrint) ? allIssueItemsForPrint : [];
    const monthCounts: Record<string, { month: number; year: number; count: number }> = {};
    issues.forEach((issue) => {
      if (!issue.incident_date) return;
      const d = new Date(issue.incident_date);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const key = `${year}-${month}`;
      if (!monthCounts[key]) monthCounts[key] = { month, year, count: 0 };
      monthCounts[key].count++;
    });
    return Object.values(monthCounts).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
  }, [allIssueItemsForPrint]);

  useEffect(() => {
    if (!onDataReady) return;
    onDataReady({
      activeSubTab,
      employeePerformanceTableData: performanceTableData,
      employeeIssuesTableData: printEmployeeIssueRecords,
      departmentRecords: printDepartmentRecords,
      employeeRecords: printEmployeeRecords,
      issueTypeRecords: printIssueTypeRecords,
      employeeIssueRecords: printEmployeeIssueRecords,
      // Pass analytics API data for print
      analyticsKPIs: kpisData || null,
      analyticsPerformanceTrend: performanceRateData?.performance_trend || [],
      analyticsMonthlyIssueVolume: printMonthlyIssueVolume,
    });
  }, [activeSubTab, performanceRateData, performanceTableData, kpisData,
      printDepartmentRecords, printEmployeeRecords, printIssueTypeRecords, printEmployeeIssueRecords,
      printMonthlyIssueVolume, onDataReady]);

  // Sub Tab Navigation
  const subTabs = [
    { id: 1, name: 'Performance Rate', isAvailable: true },
    { id: 2, name: 'Training Analysis', isAvailable: false },
    { id: 3, name: 'Employee Issue Rate', isAvailable: true },
  ];

  const paginationChange = (event: any) => {
    setEmployeePerformanceCurrentPage(event.selected + 1);
  };

  const pageSizeChange = (value: number) => {
    setEmployeePerformanceCurrentPage(1);
    setEmployeePerformancePageSize(value);
  };

  const employeeIssuePaginationChange = (event: any) => {
    setEmployeeIssueCurrentPage(event.selected + 1);
  };

  const employeeIssuePageSizeChange = (value: number) => {
    setEmployeeIssueCurrentPage(1);
    setEmployeeIssuePageSize(value);
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1:
        return (
          <>
            <div className={`grid gap-6 ${showAllDepartments ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              <PerformanceRate
                onShowAllChange={setShowAllDepartments}
                showAllDepartments={showAllDepartments}
                precomputedDepartments={performanceRateData?.performance_by_department}
              />
              <PerformanceTrend
                dateFilter={dateFilter}
                showAllDepartments={showAllDepartments}
                precomputedTrend={performanceRateData?.performance_trend}
                externalSelectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
              />
            </div>

            <EmployeePerformanceTable
              data={performanceTableData}
              pagination={performanceRateData?.performance_table ? {
                totalRecords: performanceRateData.performance_table.total_records,
                totalPages: performanceRateData.performance_table.total_pages,
              } : undefined}
              isLoading={performanceRateLoading}
              error={performanceRateError}
              currentPage={employeePerformanceCurrentPage}
              pageSize={employeePerformancePageSize}
              onPageChange={paginationChange}
              onPageSizeChange={pageSizeChange}
            />

            <div className="pb-8"></div>
          </>
        );

      case 2:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-600 mb-2">Coming Soon</div>
              <div className="text-gray-500">Training Analysis features are under development</div>
            </div>
          </div>
        );

      case 3:
        return (
          <>
            <div className={`grid gap-6 ${showAllIssueTypes ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              <IssueType
                isLoading={issueRateLoading}
                error={issueRateError}
                onShowAllChange={setShowAllIssueTypes}
                showAllIssueTypes={showAllIssueTypes}
                precomputedDistribution={issueRateData?.issue_type_distribution}
              />
              <MonthlyTypeVolume
                dateFilter={dateFilter}
                isLoading={issueRateLoading}
                error={issueRateError}
                showAllIssueTypes={showAllIssueTypes}
                precomputedVolume={issueRateData?.monthly_issue_volume}
              />
            </div>

            <EmployeeIssuesTable
              data={issuesTableData}
              pagination={issueRateData?.issues_table ? {
                totalRecords: issueRateData.issues_table.total_records,
                totalPages: issueRateData.issues_table.total_pages,
              } : undefined}
              isLoading={issueRateLoading}
              error={issueRateError}
              currentPage={employeeIssueCurrentPage}
              pageSize={employeeIssuePageSize}
              onPageChange={employeeIssuePaginationChange}
              onPageSizeChange={employeeIssuePageSizeChange}
            />

            <div className="pb-8"></div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="overflow-x-auto overflow-y-visible pb-5 -mx-4 px-4">
        {kpisLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size="lg" color="yellow" />
          </div>
        ) : kpisError ? (
          <div className="flex items-center justify-center py-6 text-red-500 text-sm">Error loading KPI data</div>
        ) : !kpisData || (!kpisData.evaluation_count && !kpisData.total_issues) ? (
          <div className="text-center text-gray-500 py-4 text-sm font-medium">No Data Available</div>
        ) : (
          <div className="flex gap-6 min-w-full w-max">
            {!!kpisData.evaluation_count && (
              <div className="flex-shrink-0">
                <AveragePerformanceCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedValue={kpisData.average_performance}
                  evaluationCount={kpisData.evaluation_count}
                />
              </div>
            )}
            {!!kpisData.total_issues && (
              <div className="flex-shrink-0">
                <ResolvedVSOngoingCard
                  isLoading={kpisLoading}
                  error={kpisError}
                  precomputedData={kpisData}
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
                  data-tooltip-id="subtab-tooltip"
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
                    data-tooltip-id="subtab-tooltip"
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
        <Tooltip id="subtab-tooltip" />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default EmployeePerformance;
