'use client';

import React, { useState } from 'react';

import { Tooltip } from 'react-tooltip';

import Card from '../Card';
import PerformanceRate from './components/performance-rate-tab/PerformanceRate';
import ITPerformanceTrend from './components/performance-rate-tab/ITPerformanceTrend';
import EmployeePerformanceTable from './components/performance-rate-tab/EmployeePerformanceTable';
import ActionRecommendations from './components/performance-rate-tab/ActionRecommendations';
import IssueType from './components/employee-issue-rate-tab/IssueType';
import MonthlyTypeVolume from './components/employee-issue-rate-tab/MonthlyTypeVolume';
import EmployeeIssuesTable from './components/employee-issue-rate-tab/EmployeeIssuesTable';
import InterventionRecommendations from './components/employee-issue-rate-tab/InterventionRecommendations';
import useGetEvaluationHistoryItems from '../hooks/useGetEvaluationHistoryItems';

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
  data: EmployeePerformanceData;
  dateFilter?: {
    from: string;
    to: string;
  };
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ data, dateFilter }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters for the evaluation history API
  const filters = {
    currentPage,
    pageSize,
    search: '',
    ...(dateFilter?.from && { from: dateFilter.from }),
    ...(dateFilter?.to && { to: dateFilter.to }),
  };

  // Use the hook to fetch evaluation history data
  const {
    data: evaluationData,
    isLoading,
    error,
  } = useGetEvaluationHistoryItems(filters);

  // Calculate average performance score from evaluation data
  const calculateAveragePerformanceScore = () => {
    if (!evaluationData?.records || evaluationData.records.length === 0) {
      return { averageScore: 0, totalEmployees: 0, maxScore: 0 };
    }

    const totalScore = evaluationData.records.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.score) || 0);
    }, 0);

    const totalEmployees = evaluationData.records.length;
    const averageScore = totalEmployees > 0 ? totalScore / totalEmployees : 0;

    // Get the maximum score from form_total_score (assuming all evaluations use the same template)
    const maxScore = evaluationData.records[0]?.form_total_score || 
                     evaluationData.records[0]?.max_score || 
                     evaluationData.records[0]?.evaluation_template?.max_score || 
                     100; // Final fallback

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      totalEmployees,
      maxScore: Math.round(maxScore * 100) / 100
    };
  };

  const { averageScore, totalEmployees, maxScore } = calculateAveragePerformanceScore();

  const Data = [
    {
      title: <>Average Employee<br />Performance Score</>,
      value: `${averageScore}/${maxScore}`,
      trend: `Based on ${totalEmployees} employee evaluations`,
    },
    // {
    //   title: <>% of Employees<br />Completed Training</>,
    //   value: `${data.trainingCompletion}%`,
    //   trend: `Increased ${data.trends.trainingCompletion}% rate from Q1`,
    // },
    // {
    //   title: <>% of Improvement<br />Post-training</>,
    //   value: `${data.improvementRate}%`,
    //   trend: `Increased ${data.trends.improvementRate}% rate from Q1`,
    // },
    {
      title: <>% of Resolved Employee<br />Issues vs. Ongoing Issues</>,
      value: `${data.issueResolution}%`,
      trend: `Increased ${data.trends.issueResolution}% rate from Q1`,
    }
  ];

  // Real Name: Performance Rate & Action Recommendations
  const subTabs = [
    { id: 1, name: 'Performance Rate', isAvailable: true },
    { id: 2, name: 'Training Analysis', isAvailable: false },
    { id: 3, name: 'Employee Issue Rate', isAvailable: true },
  ];

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  // Transform API data to match table format
  const transformEvaluationData = (apiData: any) => {
    if (!apiData || !apiData.records) return [];
    
    return apiData.records.map((item: any) => ({
      name: item.employee_name || 'N/A',
      department: item.department || 'N/A',
      score: item.score?.toString() || 'N/A',
      lastEvaluation: item.date_of_evaluation ? new Date(item.date_of_evaluation).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A',
      status: item.status || 'N/A'
    }));
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1: // Performance Rate & Action Recommendations
        return (
          <>
            {/* Charts Section */}
            <div className={`grid gap-6 ${pageSize >= 10 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {/* Performance Rate by Department - Bar Chart */}
              <PerformanceRate evaluationData={evaluationData} />

              {/* IT Performance Trend - Line Chart */}
              <ITPerformanceTrend evaluationData={evaluationData} dateFilter={dateFilter} />
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
              currentPage={currentPage}
              pageSize={pageSize}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issue Type - Pie Chart */}
              <IssueType />

              {/* Monthly Issue Volume - Line Chart */}
              <MonthlyTypeVolume />
            </div>

            {/* Employee Issues Table */}
              <EmployeeIssuesTable />

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
        {Data.map((data, index) => (
          <div key={index} className="flex flex-col pl-5 pr-5">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">{data.title}</h3>
            <Card
              value={data.value}
              trend={data.trend}
            />
          </div>
        ))}
      </div>

      {/* Sub Tab Navigation */}
      <div className="mt-8">
        {/* Desktop tabs */}
        <div className="hidden md:flex flex-row justify-between space-x-2">
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
                    className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${activeSubTab === tab.id ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}
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
