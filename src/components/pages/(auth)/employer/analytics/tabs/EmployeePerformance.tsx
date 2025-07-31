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
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ data }) => {
  const [activeSubTab, setActiveSubTab] = useState(1);

  const Data = [
    {
      title: <>Average Employee<br />Performance Score</>,
      value: `${data.averageScore}/5`,
      trend: `Increased ${data.trends.averageScore} score from Q1`,
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

  const subTabs = [
    { id: 1, name: 'Performance Rate & Action Recommendations', isAvailable: true },
    { id: 2, name: 'Training Analysis', isAvailable: false },
    { id: 3, name: 'Employee Issue Rate', isAvailable: true },
  ];

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 1: // Performance Rate & Action Recommendations
        return (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Rate by Department - Bar Chart */}
              <PerformanceRate />

              {/* IT Performance Trend - Line Chart */}
              <ITPerformanceTrend />
            </div>

            {/* Employee Performance Table */}
            <EmployeePerformanceTable />

            {/* Action Recommendations */}
            <div className="pb-8">
              <ActionRecommendations />
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
              <InterventionRecommendations />
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
