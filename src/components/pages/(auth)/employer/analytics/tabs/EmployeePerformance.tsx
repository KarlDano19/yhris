import React, { useState, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import AveragePerformanceCard from '../cards/employee-performance/AveragePerformanceCard';
import TrainingCompletionCard from '../cards/employee-performance/TrainingCompletionCard';
import ImprovementPostTrainingCard from '../cards/employee-performance/ImprovementPostTrainingCard';
import ResolvedVSOngoingCard from '../cards/employee-performance/ResolvedVSOngoingCard';
import PerformanceRate from './components/employeee-performance-tab/performance-rate-tab/PerformanceRate';
import PerformanceTrend from './components/employeee-performance-tab/performance-rate-tab/PerformanceTrend';
import EmployeePerformanceTable from './components/employeee-performance-tab/performance-rate-tab/EmployeePerformanceTable';
import ActionRecommendations from './components/employeee-performance-tab/performance-rate-tab/ActionRecommendations';
import IssueType from './components/employeee-performance-tab/employee-issue-rate-tab/IssueType';
import MonthlyTypeVolume from './components/employeee-performance-tab/employee-issue-rate-tab/MonthlyTypeVolume';
import EmployeeIssuesTable from './components/employeee-performance-tab/employee-issue-rate-tab/EmployeeIssuesTable';
import InterventionRecommendations from './components/employeee-performance-tab/employee-issue-rate-tab/InterventionRecommendations';

import useGetEvaluationHistoryItems from '../hooks/useGetEvaluationHistoryItems';
import useGetAllEvaluationHistoryItems from '@/components/hooks/useGetEvaluationHistoryItems';
import useGetEmployeeIssueItems from '../hooks/useGetEmployeeIssueItems';
import useGetAllEmployeeIssueItems from '@/components/hooks/useGetAllEmployeeIssueItems';
import { transformEvaluationData } from './components/employeee-performance-tab/performance-rate-tab/calculations/employeePerformanceTableCalc';


interface EmployeePerformanceData {
  averageScore: number;
  trainingCompletion: number;
  improvementRate: number;
  issueResolution: number;
  trends: {
    averageScore: number;
    trainingCompletion: number;
    improvementRate: number;
    issueResolution: number;
  };
}

interface EmployeePerformanceProps {
  data?: EmployeePerformanceData;
  dateFilter?: {
    from: string;
    to: string;
  };
  onDataReady?: (data: {
    activeSubTab: number;
    evaluationData: any[];
    employeeIssueData: any[];
    employeePerformanceTableData: any[];
    employeeIssuesTableData: any[];
  }) => void;
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ data, dateFilter, onDataReady }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllIssueTypes, setShowAllIssueTypes] = useState(false);

  // Pagination State for Employee Performance
  const [employeePerformancePageSize, setEmployeePerformancePageSize] = useState(5);
  const [employeePerformanceCurrentPage, setEmployeePerformanceCurrentPage] = useState(1);
  
  // Pagination State for Employee Issues
  const [employeeIssuePageSize, setEmployeeIssuePageSize] = useState(5);
  const [employeeIssueCurrentPage, setEmployeeIssueCurrentPage] = useState(1);

  // Filters for the evaluation history API
  const employeePerformanceFilters = {
    currentPage: employeePerformanceCurrentPage,
    pageSize: employeePerformancePageSize,
    search: '',
    ...(dateFilter?.from && { from: dateFilter.from }),
    ...(dateFilter?.to && { to: dateFilter.to }),
  };

  // Use the hook to fetch evaluation history data (Performance Rate) - Paginated for table
  const {
    data: evaluationData,
    isLoading,
    error,
  } = useGetEvaluationHistoryItems(employeePerformanceFilters);

  // Use the global hook to fetch all evaluation history data for charts
  const {
    data: allEvaluationData,
    isLoading: allEvaluationLoading,
    error: allEvaluationError,
  } = useGetAllEvaluationHistoryItems();

  // Filters for the employee issues API
  const employeeIssueFilters = {
    currentPage: employeeIssueCurrentPage,
    pageSize: employeeIssuePageSize,
    search: '',
    ...(dateFilter?.from && { from: dateFilter.from }),
    ...(dateFilter?.to && { to: dateFilter.to }),
  };

  // Use the hook to fetch employee issues data (Employee Issue Rate) - Paginated for table
  const {
    data: employeeIssueData,
    isLoading: employeeIssueLoading,
    error: employeeIssueError,
  } = useGetEmployeeIssueItems(employeeIssueFilters);

  // Use the global hook to fetch all employee issues data for charts
  const {
    data: allEmployeeIssueData,
    isLoading: allEmployeeIssueLoading,
    error: allEmployeeIssueError,
  } = useGetAllEmployeeIssueItems();

  // Sub Tab Navigation
  const subTabs = [
    { id: 1, name: 'Performance Rate', isAvailable: true }, // Real Name: Performance Rate & Action Recommendations
    { id: 2, name: 'Training Analysis', isAvailable: false },
    { id: 3, name: 'Employee Issue Rate', isAvailable: true },
  ];

  // Pagination Handlers for Employee Performance
  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setEmployeePerformanceCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setEmployeePerformanceCurrentPage(1);
    setEmployeePerformancePageSize(value);
  };

  // Pagination Handlers for Employee Issues
  const employeeIssuePaginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setEmployeeIssueCurrentPage(newCurrentPage);
  };

  const employeeIssuePageSizeChange = (value: number) => {
    setEmployeeIssueCurrentPage(1);
    setEmployeeIssuePageSize(value);
  };



  // Transform employee issues API data to match table format (Employee Issue Rate)
  const transformEmployeeIssueData = (apiData: any) => {
    if (!apiData || !apiData.records) return [];
    
    return apiData.records.map((item: any) => ({
      name: item.name || 'N/A',
      department: item.department || 'N/A',
      issueType: item.issue_type || 'Not Specified',
      dateReported: item.incident_date ? new Date(item.incident_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A',
      status: getIssueStatus(item)
    }));
  };

  // Helper function to determine issue status (Employee Issue Rate)
  const getIssueStatus = (item: any) => {
    if (item.is_decision_sent && item.is_decision_received) {
      return 'Resolved';
    } else if (item.investigate && item.investigate && item.investigate.id) {
      return 'Under Hearing';
    } else if (item.is_nte_sent && item.is_nte_received) {
      return 'NTE Issued';
    } else {
      return 'Pending';
    }
  };

  // Notify parent component when data is ready for printing
  useEffect(() => {
    if (onDataReady && allEvaluationData && allEmployeeIssueData) {
      onDataReady({
        activeSubTab,
        evaluationData: allEvaluationData,
        employeeIssueData: allEmployeeIssueData,
        employeePerformanceTableData: transformEvaluationData(evaluationData),
        employeeIssuesTableData: transformEmployeeIssueData(employeeIssueData)
      });
    }
  }, [activeSubTab, allEvaluationData, allEmployeeIssueData, evaluationData, employeeIssueData, onDataReady]);

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1: // Performance Rate & Action Recommendations
        return (
          <>
            {/* Charts Section */}
            <div className={`grid gap-6 ${showAllDepartments ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {/* Performance Rate by Department - Bar Chart */}
              <PerformanceRate 
                evaluationData={allEvaluationData} 
                onShowAllChange={setShowAllDepartments}
                showAllDepartments={showAllDepartments}
              />

              {/* Performance Trend - Line Chart */}
              <PerformanceTrend 
                evaluationData={allEvaluationData} 
                dateFilter={dateFilter} 
                showAllDepartments={showAllDepartments}
              />
            </div>

            {/* Employee Performance Table */}
            <EmployeePerformanceTable
              data={transformEvaluationData(evaluationData)}
              pagination={evaluationData ? {
                totalRecords: evaluationData.total_records,
                totalPages: evaluationData.total_pages
              } : undefined}
              isLoading={isLoading}
              error={error}
              currentPage={employeePerformanceCurrentPage}
              pageSize={employeePerformancePageSize}
              onPageChange={paginationChange}
              onPageSizeChange={pageSizeChange}
            />

            {/* Action Recommendations */}
            <div className="pb-8">
              {/* <ActionRecommendations /> */}
            </div>
          </>
        );
      
      case 2: // Training Analysis
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-600 mb-2">Coming Soon</div>
              <div className="text-gray-500">Training Analysis features are under development</div>
            </div>
          </div>
        );
      
      case 3: // Employee Issue Rate
        return (
          <>
            {/* Charts Section */}
            <div className={`grid gap-6 ${showAllIssueTypes ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {/* Issue Type - Pie Chart */}
              <IssueType 
                employeeIssueData={allEmployeeIssueData}
                isLoading={allEmployeeIssueLoading}
                error={allEmployeeIssueError}
                onShowAllChange={setShowAllIssueTypes}
                showAllIssueTypes={showAllIssueTypes}
              />

              {/* Monthly Issue Volume - Line Chart */}
              <MonthlyTypeVolume 
                employeeIssueData={allEmployeeIssueData} 
                dateFilter={dateFilter}
                isLoading={allEmployeeIssueLoading}
                error={allEmployeeIssueError}
                showAllIssueTypes={showAllIssueTypes}
              />
            </div>

            {/* Employee Issues Table */}
            <EmployeeIssuesTable
              data={transformEmployeeIssueData(employeeIssueData)}
              pagination={employeeIssueData ? {
                totalRecords: employeeIssueData.total_records,
                totalPages: employeeIssueData.total_pages
              } : undefined}
              isLoading={employeeIssueLoading}
              error={employeeIssueError}
              currentPage={employeeIssueCurrentPage}
              pageSize={employeeIssuePageSize}
              onPageChange={employeeIssuePaginationChange}
              onPageSizeChange={employeeIssuePageSizeChange}
            />

            {/* Intervention Recommendations */}
            <div className="pb-8">
              {/* <InterventionRecommendations /> */}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Performance Card */}
        <AveragePerformanceCard
          evaluationData={allEvaluationData}
          isLoading={allEvaluationLoading}
          error={allEvaluationError}
        />
        
        {/* Training Completion Card */}
        {/* <TrainingCompletionCard
          employeeData={employeeData}
          isLoading={employeeLoading}
          error={employeeError}
        /> */}
        
        {/* Improvement Post Training Card */}
        {/* <ImprovementPostTrainingCard
          evaluationData={evaluationData}
          isLoading={isLoading}
          error={error}
        /> */}
        
        {/* Resolved vs Ongoing Issues Card */}
        <ResolvedVSOngoingCard
          employeeIssueData={allEmployeeIssueData}
          isLoading={allEmployeeIssueLoading}
          error={allEmployeeIssueError}
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
                  data-tooltip-id='subtab-tooltip'
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
                    data-tooltip-id='subtab-tooltip'
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
        <Tooltip id='subtab-tooltip' />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default EmployeePerformance;
