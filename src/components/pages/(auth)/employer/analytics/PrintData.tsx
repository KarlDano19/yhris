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
  validRegions?: string[],
  selectedJobFilter?: string,
  printOption?: string,
  allJobPostsForPrint?: any[],
  selectedRecords?: number[]
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

  // Transform all job posts data to role pipeline format
  const transformAllJobPostsToRolePipeline = (allJobPosts: any[]) => {
    if (!allJobPosts || !Array.isArray(allJobPosts)) {
      return [];
    }

    return allJobPosts.map((job: any) => {
      // Calculate turnaround time (days since job opened)
      const jobOpenedDate = new Date(job.created_at);
      const jobClosedDate = new Date(job.updated_at);
      const currentDate = new Date();
      const turnaroundTime = Math.ceil((currentDate.getTime() - jobOpenedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Helper function to format dates
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      };

      // Format dates
      const formattedDateOpened = formatDate(jobOpenedDate);
      const formattedDateClosed = formatDate(jobClosedDate);

      // Determine status based on job data
      const status = job.is_active ? 'Ongoing' : 'Closed';

      // Generate pipeline information using applicant_applied_no
      const currentPipeline = job.applicant_applied_no > 0 
        ? `${job.applicant_applied_no} applicants` 
        : 'No applicants yet';

      // Only show job closed date if status is Closed
      const dateJobClosed = status === 'Closed' ? formattedDateClosed : '—';

      return {
        role: job.job_title || 'Unknown Role',
        numberOfApplicants: job.applicant_applied_no || 0,
        status: status,
        dateJobOpened: formattedDateOpened,
        dateJobClosed: dateJobClosed,
        turnaroundTime: turnaroundTime,
        currentPipeline: currentPipeline,
        jobId: job.id,
      };
    });
  };

  // Use paginated role pipeline data for sub-tab 2 - Use shared utility function
  const getRolePipelineData = () => {
    let dataToProcess = rolePipelineData;
    
    // Handle print options for role pipeline data
    if (printOption && rolePipelineData) {
      switch (printOption) {
        case 'all':
          // For all records, use the all job posts data
          if (allJobPostsForPrint && allJobPostsForPrint.length > 0) {
            dataToProcess = transformAllJobPostsToRolePipeline(allJobPostsForPrint);
          } else {
            // Fallback to current data if all job posts not available
            dataToProcess = rolePipelineData;
          }
          break;
        case 'selected':
          // For selected records, filter by the selected IDs
          if (selectedRecords && selectedRecords.length > 0 && allJobPostsForPrint) {
            const selectedJobs = allJobPostsForPrint.filter(job => selectedRecords.includes(job.id));
            dataToProcess = transformAllJobPostsToRolePipeline(selectedJobs);
          } else {
            // Fallback to current data if no selections
            dataToProcess = rolePipelineData;
          }
          break;
        default:
          dataToProcess = rolePipelineData;
      }
    }
    
    return processRolePipelineData(dataToProcess, pipelineData);
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
  showAllIssueTypes: boolean = false,
  printOption?: string,
  selectedDepartments?: string[],
  selectedEmployees?: string[],
  allEvaluationData?: any[],
  selectedIssueTypes?: string[],
  selectedEmployeeIssues?: string[],
  allEmployeeIssueData?: any[]
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
    // Always get all departments for printing, regardless of showAllDepartments state
    const { departmentPerformanceData } = calculateDepartmentPerformance(evaluationData, true, []);
    let filteredData = departmentPerformanceData;
    
    // Handle print options for performance rate data
    if (printOption && selectedDepartments) {
      switch (printOption) {
        case 'all':
          // Use all departments
          filteredData = departmentPerformanceData;
          break;
        case 'selected':
          // Filter by selected departments
          if (selectedDepartments.length > 0) {
            filteredData = departmentPerformanceData.filter(dept => 
              selectedDepartments.includes(dept.name)
            );
          }
          break;
        default:
          filteredData = departmentPerformanceData;
      }
    }
    
    return filteredData.map(dept => ({
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

  // Calculate issue type data with filtering
  const calculateIssueTypeData = () => {
    // Always get all issue types for printing, regardless of showAllIssueTypes state
    const { labels, data, percentages, colors } = calculateIssueTypeDistribution(employeeIssueData, [], true);
    let filteredData = labels.map((label, index) => ({
      reason: label,
      count: data[index],
      percentage: percentages[index],
      color: colors[index]
    }));
    
    // Handle print options for issue type data
    if (printOption && selectedIssueTypes) {
      switch (printOption) {
        case 'all':
          // Use all issue types
          filteredData = labels.map((label, index) => ({
            reason: label,
            count: data[index],
            percentage: percentages[index],
            color: colors[index]
          }));
          break;
        case 'selected':
          // Filter by selected issue types
          if (selectedIssueTypes.length > 0) {
            filteredData = labels.map((label, index) => ({
              reason: label,
              count: data[index],
              percentage: percentages[index],
              color: colors[index]
            })).filter(issueType => 
              selectedIssueTypes.includes(issueType.reason)
            );
          }
          break;
        default:
          filteredData = labels.map((label, index) => ({
            reason: label,
            count: data[index],
            percentage: percentages[index],
            color: colors[index]
          }));
      }
    }
    
    return filteredData;
  };

  // Calculate monthly issue volume data
  const calculateMonthlyIssueVolumeData = () => {
    const { labels, data } = calculateMonthlyVolume(employeeIssueData, dateFilter);
    
    return labels.map((label, index) => ({
      month: label,
      count: data[index]
    }));
  };

  // Transform all evaluation data to table format
  const transformAllEvaluationDataToTable = (data: any[]) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
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

  // Calculate employee performance table data with filtering
  const calculateEmployeePerformanceTableData = () => {
    let filteredData = employeePerformanceTableData || [];
    
    // Handle print options for employee performance table data
    if (printOption && selectedEmployees) {
      switch (printOption) {
        case 'all':
          // Use all employees from allEvaluationData if available
          if (allEvaluationData && allEvaluationData.length > 0) {
            filteredData = transformAllEvaluationDataToTable(allEvaluationData);
          } else {
            // Fallback to paginated data
            filteredData = employeePerformanceTableData || [];
          }
          break;
        case 'selected':
          // Filter by selected employees
          if (selectedEmployees.length > 0) {
            // Use all evaluation data for selection if available
            const allData = allEvaluationData && allEvaluationData.length > 0 
              ? transformAllEvaluationDataToTable(allEvaluationData)
              : (employeePerformanceTableData || []);
            
            filteredData = allData.filter(employee => 
              selectedEmployees.includes(employee.name)
            );
          }
          break;
        default:
          filteredData = employeePerformanceTableData || [];
      }
    }
    
    return filteredData;
  };

  // Transform all employee issue data to table format
  const transformAllEmployeeIssueDataToTable = (data: any[]) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
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

  // Helper function to determine issue status
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

  // Calculate employee issues table data with filtering
  const calculateEmployeeIssuesTableData = () => {
    let filteredData = employeeIssuesTableData || [];
    
    // Handle print options for employee issues table data
    if (printOption && selectedEmployeeIssues) {
      switch (printOption) {
        case 'all':
          // Use all employee issues from allEmployeeIssueData if available
          if (allEmployeeIssueData && allEmployeeIssueData.length > 0) {
            filteredData = transformAllEmployeeIssueDataToTable(allEmployeeIssueData);
          } else {
            // Fallback to paginated data
            filteredData = employeeIssuesTableData || [];
          }
          break;
        case 'selected':
          // Filter by selected employee issues
          if (selectedEmployeeIssues.length > 0) {
            // Use all employee issue data for selection if available
            const allData = allEmployeeIssueData && allEmployeeIssueData.length > 0 
              ? transformAllEmployeeIssueDataToTable(allEmployeeIssueData)
              : (employeeIssuesTableData || []);
            
            filteredData = allData.filter(issue => 
              selectedEmployeeIssues.includes(issue.name)
            );
          }
          break;
        default:
          filteredData = employeeIssuesTableData || [];
      }
    }
    
    return filteredData;
  };

  const kpiData = calculateKPIs();
  const performanceRateData = calculatePerformanceRateData();
  const performanceTrendData = calculatePerformanceTrendData();
  const issueTypeData = calculateIssueTypeData();
  const monthlyIssueVolumeData = calculateMonthlyIssueVolumeData();
  const filteredEmployeePerformanceTableData = calculateEmployeePerformanceTableData();
  const filteredEmployeeIssuesTableData = calculateEmployeeIssuesTableData();

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
        employeePerformanceTableData={filteredEmployeePerformanceTableData}
        issueTypeData={issueTypeData}
        monthlyIssueVolumeData={monthlyIssueVolumeData}
        employeeIssuesTableData={filteredEmployeeIssuesTableData}
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
  validRegions?: string[],
  selectedJobFilter?: string,
  // Print options for Workforce Overview
  printOption?: string,
  allJobPostsForPrint?: any[],
  selectedRecords?: number[],
  // Employee Performance specific parameters
  evaluationData?: any[],
  employeeIssueData?: any[],
  employeePerformanceTableData?: any[],
  employeeIssuesTableData?: any[],
  showAllDepartments?: boolean,
  showAllIssueTypes?: boolean,
  selectedDepartments?: string[],
  selectedEmployees?: string[],
  allEvaluationData?: any[],
  selectedIssueTypes?: string[],
  selectedEmployeeIssues?: string[],
  allEmployeeIssueData?: any[]
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
        validRegions,
        selectedJobFilter || 'All Jobs',
        printOption,
        allJobPostsForPrint,
        selectedRecords
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
        showAllIssueTypes || false,
        printOption,
        selectedDepartments,
        selectedEmployees,
        allEvaluationData, // Pass the actual allEvaluationData
        selectedIssueTypes, // Pass the selected issue types
        selectedEmployeeIssues, // Pass the selected employee issues
        allEmployeeIssueData // Pass the actual allEmployeeIssueData
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