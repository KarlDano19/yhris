import React from 'react';

import WorkforceOverviewDocument from './print/WorkforceOverviewDocument';
import EmployeePerformanceDocument from './print/EmployeePerformanceDocument';

import { calculateTotalActiveEmployees } from './cards/workforce-overview/calculations/totalActiveEmployeesCalc';
import { calculateNewHires } from './cards/workforce-overview/calculations/newHiresCalc';
import { calculateSeparatedEmployees } from './cards/workforce-overview/calculations/separatedEmployeesCalc';
import { calculateAttritionRate } from './cards/workforce-overview/calculations/attritionRateCalc';
import { calculateAverageTenure } from './cards/workforce-overview/calculations/averateTenureCalc';
import { calculateOverallApplicantsSummary } from './tabs/components/workforce-overview-tab/applicant-vs-hired-tab/calculations/overallApplicantsSummaryCalc';
import { calculateDemographicBreakdown } from './tabs/components/workforce-overview-tab/applicant-vs-hired-tab/calculations/demographicBreakdownCalc';
import { processRolePipelineData } from './tabs/components/workforce-overview-tab/role-pipeline-tab/calculation/rolePipelineTableCalc';
import { calculateAttritionRateData } from './tabs/components/workforce-overview-tab/attrition-rate-tab/calculations/attritionRateCalc';
import { calculateExitReasonsData } from './tabs/components/workforce-overview-tab/attrition-rate-tab/calculations/exitReasons';

// Employee Performance calculation imports
import { calculateAveragePerformance } from './cards/employee-performance/calculations/averagePerformanceCalc';
import { calculateResolvedVSOngoing } from './cards/employee-performance/calculations/resolvedVSOngoingCalc';
import { calculateIssueTypeDistribution } from './tabs/components/employeee-performance-tab/employee-issue-rate-tab/calculations/issueTypeCalc';
import { calculateMonthlyVolume } from './tabs/components/employeee-performance-tab/employee-issue-rate-tab/calculations/monthlyTypeVolumeCalc';
import { calculateDepartmentPerformance } from './tabs/components/employeee-performance-tab/performance-rate-tab/calculations/performanceRateCalc';
import { calculatePerformanceTrend } from './tabs/components/employeee-performance-tab/performance-rate-tab/calculations/performanceTrendCalc';

export const createAnalyticsWorkforceOverviewDocumentComponent = (
  employeeData: any[],
  appliedApplicantsData: any[],
  separationData: any[],
  allJobPostData: any[],
  dateFilter: { from: string; to: string },
  activeSubTab: number = 1,
  pipelineData?: { [jobId: number]: { [stageTitle: string]: number } },
  rolePipelineData?: any[],
  rolePipelineCurrentPage?: number,
  rolePipelinePageSize?: number,
  validRegions?: string[],
  selectedJobFilter?: string
) => {
  // Calculate KPI data
  const calculateKPIs = () => {
    // Total Active Employees - Use shared utility function
    const totalEmployeesData = calculateTotalActiveEmployees(employeeData);
    const totalEmployeesTrend = totalEmployeesData.trend;

    // New Hires - Use shared utility function
    const newHiresData = calculateNewHires(appliedApplicantsData);
    const newHiresTrend = newHiresData.trend;

    // Separated Employees - Use shared utility function
    const separatedEmployeesData = calculateSeparatedEmployees(separationData);
    const separatedEmployeesTrend = separatedEmployeesData.trend;

    // Attrition Rate - Use shared utility function
    const attritionData = calculateAttritionRate(separationData, employeeData);
    const attritionTrend = attritionData.trend;

    // Average Tenure - Use shared utility function
    const tenureData = calculateAverageTenure(employeeData, separationData);
    const averageTenureTrend = tenureData.trend;

    return {
      totalEmployees: { value: totalEmployeesData.totalEmployees, trend: totalEmployeesTrend },
      newHires: { value: newHiresData.newHires, trend: newHiresTrend },
      separatedEmployees: { value: separatedEmployeesData.separatedEmployees, trend: separatedEmployeesTrend },
      attritionRate: { value: attritionData.attritionRate.toFixed(1), trend: attritionTrend },
      averageTenure: { value: tenureData.averageTenure.toFixed(1), trend: averageTenureTrend }
    };
  };

  // Calculate applicant data for sub-tab 1 - Use shared utility function
  const calculateApplicantData = () => {
    return calculateOverallApplicantsSummary(appliedApplicantsData);
  };

  // Calculate demographic data for sub-tab 1 - Use shared utility function
  const calculateDemographicData = () => {
    return calculateDemographicBreakdown(
      appliedApplicantsData,
      { records: allJobPostData },
      validRegions,
      selectedJobFilter
    );
  };

  // Use paginated role pipeline data for sub-tab 2 - Use shared utility function
  const getRolePipelineData = () => {
    return processRolePipelineData(rolePipelineData, pipelineData);
  };

  // Calculate attrition data for sub-tab 3 - Use shared utility function
  const calculateAttritionData = () => {
    // Use the shared attrition rate calculation utility
    const { dateRange, attritionData } = calculateAttritionRateData(separationData, dateFilter, employeeData?.length || 143);
    
    // Calculate overall attrition rate from the monthly data
    const totalExits = attritionData.reduce((sum, item) => sum + item.totalExits, 0);
    const totalEmployees = employeeData?.length || 143;
    const overallAttritionRate = totalEmployees > 0 ? (totalExits / totalEmployees) * 100 : 0;

    return {
      attritionRate: overallAttritionRate.toFixed(1),
      monthlyAttritionData: attritionData,
      dateRange: dateRange
    };
  };

  // Calculate exit reasons data for sub-tab 3 - Use shared utility function
  const calculateExitReasonsForPrint = () => {
    // Use the shared exit reasons calculation utility
    const { exitReasonsData } = calculateExitReasonsData(separationData, 'All Positions');
    
    // Calculate total exits for percentage calculation
    const totalExits = exitReasonsData.reduce((sum: number, item: any) => sum + item.count, 0);
    
    // Convert to the format expected by the print component
    const exitReasonsArray = exitReasonsData.map((item: any) => ({
      reason: item.reason,
      count: item.count,
      percentage: totalExits > 0 ? ((item.count / totalExits) * 100).toFixed(1) : '0.0'
    }));

    return exitReasonsArray;
  };

  const kpiData = calculateKPIs();
  const applicantData = calculateApplicantData();
  const demographicData = calculateDemographicData();
  const rolePipelineDataForPrint = getRolePipelineData() || [];
  const attritionData = calculateAttritionData();
  const exitReasonsData = calculateExitReasonsForPrint();

  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <WorkforceOverviewDocument 
        kpiData={kpiData}
        applicantData={applicantData}
        demographicData={demographicData}
        rolePipelineData={rolePipelineDataForPrint}
        attritionData={{ ...attritionData, exitReasons: exitReasonsData }}
        dateFilter={dateFilter}
        activeSubTab={activeSubTab}
      />
    </div>
  );
};

export const createAnalyticsEmployeePerformanceDocumentComponent = (
  evaluationData: any[],
  employeeIssueData: any[],
  dateFilter: { from: string; to: string },
  activeSubTab: number = 1,
  employeePerformanceTableData?: any[],
  employeeIssuesTableData?: any[],
  showAllDepartments: boolean = false,
  showAllIssueTypes: boolean = false
) => {
  // Calculate KPI data
  const calculateKPIs = () => {
    // Average Performance - Use shared utility function
    const averagePerformanceData = calculateAveragePerformance(evaluationData);

    // Resolved vs Ongoing Issues - Use shared utility function
    const resolvedVSOngoingData = calculateResolvedVSOngoing(employeeIssueData);

    return {
      averagePerformance: {
        value: averagePerformanceData.averageScore,
        maxScore: averagePerformanceData.maxScore,
        totalEmployees: averagePerformanceData.totalEmployees
      },
      resolvedVSOngoing: {
        resolvedPercentage: resolvedVSOngoingData.resolvedPercentage,
        ongoingPercentage: resolvedVSOngoingData.ongoingPercentage,
        totalIssues: resolvedVSOngoingData.totalIssues,
        resolvedIssues: resolvedVSOngoingData.resolvedIssues,
        ongoingIssues: resolvedVSOngoingData.ongoingIssues
      }
    };
  };

  // Calculate performance rate data by department using shared utility
  const calculatePerformanceRateData = () => {
    const { departmentPerformanceData } = calculateDepartmentPerformance(evaluationData, showAllDepartments, []);
    return departmentPerformanceData.map(dept => ({
      name: dept.name,
      score: dept.score,
      count: dept.count,
      color: dept.color
    }));
  };

  // Calculate performance trend data using shared utility
  const calculatePerformanceTrendData = () => {
    const { displayData } = calculatePerformanceTrend(evaluationData, dateFilter, 'All Departments');
    return displayData;
  };

  // Calculate issue type data
  const calculateIssueTypeData = () => {
    
    const { labels, data, percentages, colors } = calculateIssueTypeDistribution(employeeIssueData, [], showAllIssueTypes);
    
    return labels.map((label, index) => ({
      reason: label,
      count: data[index],
      percentage: percentages[index],
      color: colors[index]
    }));
  };

  // Calculate monthly issue volume data
  const calculateMonthlyIssueVolumeData = () => {
    const { labels, data } = calculateMonthlyVolume(employeeIssueData, dateFilter);
    
    return labels.map((label, index) => ({
      month: label,
      count: data[index]
    }));
  };

  const kpiData = calculateKPIs();
  const performanceRateData = calculatePerformanceRateData();
  const performanceTrendData = calculatePerformanceTrendData();
  const issueTypeData = calculateIssueTypeData();
  const monthlyIssueVolumeData = calculateMonthlyIssueVolumeData();

  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <EmployeePerformanceDocument 
        kpiData={kpiData}
        performanceRateData={performanceRateData}
        performanceTrendData={performanceTrendData}
        employeePerformanceTableData={employeePerformanceTableData || []}
        issueTypeData={issueTypeData}
        monthlyIssueVolumeData={monthlyIssueVolumeData}
        employeeIssuesTableData={employeeIssuesTableData || []}
        dateFilter={dateFilter}
        activeSubTab={activeSubTab}
      />
    </div>
  );
};

export const generateAnalyticsFilename = (tabName: string, dateFilter: { from: string; to: string }) => {
  const dateFrom = dateFilter.from ? new Date(dateFilter.from).toISOString().split('T')[0] : 'all-time';
  const dateTo = dateFilter.to ? new Date(dateFilter.to).toISOString().split('T')[0] : 'all-time';
  return `analytics-${tabName.toLowerCase().replace(/\s+/g, '-')}-${dateFrom}-to-${dateTo}.pdf`;
};

export const handlePrintAnalytics = async (
  tabId: number,
  tabName: string,
  generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>,
  employeeData: any[],
  appliedApplicantsData: any[],
  separationData: any[],
  allJobPostData: any[],
  dateFilter: { from: string; to: string },
  activeSubTab: number = 1,
  pipelineData?: { [jobId: number]: { [stageTitle: string]: number } },
  rolePipelineData?: any[],
  rolePipelineCurrentPage?: number,
  rolePipelinePageSize?: number,
  validRegions?: string[],
  selectedJobFilter?: string,
  // Employee Performance specific parameters
  evaluationData?: any[],
  employeeIssueData?: any[],
  employeePerformanceTableData?: any[],
  employeeIssuesTableData?: any[],
  showAllDepartments?: boolean,
  showAllIssueTypes?: boolean
) => {
  // Create document component based on tab
  let documentComponent: React.ReactElement;
  
  switch (tabId) {
    case 1: // Workforce Overview
      documentComponent = createAnalyticsWorkforceOverviewDocumentComponent(
        employeeData,
        appliedApplicantsData,
        separationData,
        allJobPostData,
        dateFilter,
        activeSubTab,
        pipelineData,
        rolePipelineData,
        rolePipelineCurrentPage,
        rolePipelinePageSize,
        validRegions,
        selectedJobFilter || 'All Jobs'
      );
      break;
    case 2: // Employee Performance
      documentComponent = createAnalyticsEmployeePerformanceDocumentComponent(
        evaluationData || [],
        employeeIssueData || [],
        dateFilter,
        activeSubTab,
        employeePerformanceTableData,
        employeeIssuesTableData,
        showAllDepartments || false,
        showAllIssueTypes || false
      );
      break;
    // Add other tabs here as they are implemented
    default:
      throw new Error(`Print functionality not implemented for tab ${tabId}`);
  }
  
  const filename = generateAnalyticsFilename(tabName, dateFilter);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
}; 