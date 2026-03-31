import React from 'react';

import WorkforceOverviewDocument from './print/WorkforceOverviewDocument';
import EmployeePerformanceDocument from './print/EmployeePerformanceDocument';

export const createAnalyticsWorkforceOverviewDocumentComponent = (
  dateFilter: { from: string; to: string },
  rolePipelineData?: any[],
  printOption?: string,
  selectedRecords?: number[],
  analyticsKPIs?: any,
  analyticsApplicantVsHired?: any,
  analyticsAttrition?: any
) => {
  const computeQ4Trend = (current: number, prevQ4: number | undefined, prevQ4Year: number | undefined): string => {
    if (prevQ4 === undefined || prevQ4Year === undefined) return '';
    const diff = current - prevQ4;
    const pct = prevQ4 > 0 ? Math.abs(Math.round((diff / prevQ4) * 100)) : 0;
    if (diff > 0) return `Increased by +${diff} from last Q4 of ${prevQ4Year} (${pct}%)`;
    if (diff < 0) return `Decreased by ${diff} from last Q4 of ${prevQ4Year} (${pct}%)`;
    return `No change from last Q4 of ${prevQ4Year} (0%)`;
  };

  const computeTenureTrend = (years: number): string => {
    if (years < 1) return 'Low tenure - consider retention strategies';
    if (years < 3) return 'Building tenure - keep engagement high';
    if (years < 5) return 'Stable tenure - continue growth opportunities';
    return 'Strong tenure - experienced workforce';
  };

  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);

  const kpiData = {
    totalEmployees: {
      value: analyticsKPIs?.total_active_employees ?? 0,
      trend: computeQ4Trend(analyticsKPIs?.total_active_employees ?? 0, analyticsKPIs?.total_active_prev_q4, analyticsKPIs?.prev_q4_year),
    },
    newHires: {
      value: analyticsKPIs?.new_hires ?? 0,
      trend: computeQ4Trend(analyticsKPIs?.new_hires ?? 0, analyticsKPIs?.new_hires_prev_q4, analyticsKPIs?.prev_q4_year),
    },
    separatedEmployees: {
      value: analyticsKPIs?.separated_employees ?? 0,
      trend: computeQ4Trend(analyticsKPIs?.separated_employees ?? 0, analyticsKPIs?.separated_prev_q4, analyticsKPIs?.prev_q4_year),
    },
    attritionRate: {
      value: (analyticsKPIs?.attrition_rate ?? 0).toFixed(1),
      trend: `New data in Q${quarter} ${now.getFullYear()}`,
    },
    averageTenure: {
      value: (analyticsKPIs?.average_tenure_years ?? 0).toFixed(1),
      trend: computeTenureTrend(analyticsKPIs?.average_tenure_years ?? 0),
    },
  };

  const summary = analyticsApplicantVsHired?.applicants_summary;
  const applicantData: Array<{ status: string; count: string; percentage: string; label: string; color: string }> = summary ? [
    { status: 'Applied', count: String(summary.total_applied), percentage: '100%', label: '(initial total applicants)', color: '#6366F1' },
    { status: 'Ongoing', count: String(summary.ongoing.count), percentage: `${summary.ongoing.percentage}%`, label: 'of total applied', color: '#F59E0B' },
    { status: 'Hired', count: String(summary.hired.count), percentage: `${summary.hired.percentage}%`, label: 'of total applied', color: '#10B981' },
    { status: 'Rejected', count: String(summary.rejected.count), percentage: `${summary.rejected.percentage}%`, label: 'of total applied', color: '#EF4444' },
    { status: 'Withdrawn', count: String(summary.withdrawn.count), percentage: `${summary.withdrawn.percentage}%`, label: 'of total applied', color: '#9CA3AF' },
  ] : [];

  const breakdown = analyticsApplicantVsHired?.demographic_breakdown;
  const topRegion = breakdown?.regions?.[0];
  const topAge = breakdown?.age_groups?.[0];
  const demographicData = breakdown ? {
    femalePercentage: `${breakdown.gender.female_percentage.toFixed(1)}% (${breakdown.gender.female_count})`,
    malePercentage: `${breakdown.gender.male_percentage.toFixed(1)}% (${breakdown.gender.male_count})`,
    mostCommonRegion: topRegion ? `${topRegion.label} (${topRegion.percentage.toFixed(1)}%)` : '—',
    mostCommonAgeGroup: topAge ? `${topAge.label} (${topAge.percentage.toFixed(1)}%)` : '—',
  } : undefined;

  const exitReasonsRaw = analyticsAttrition?.exit_reasons || [];
  const totalExitsForReasons = exitReasonsRaw.reduce((sum: number, item: any) => sum + item.count, 0);
  const attritionData = {
    attritionRate: analyticsKPIs?.attrition_rate?.toFixed(1) ?? '0.0',
    dateRange: '',
    exitReasons: exitReasonsRaw.map((item: any) => ({
      reason: item.reason,
      count: item.count,
      percentage: totalExitsForReasons > 0 ? ((item.count / totalExitsForReasons) * 100).toFixed(1) : '0.0',
    })),
  };

  const getRolePipelineData = () => {
    const allFormatted = rolePipelineData || [];
    if (printOption === 'selected' && Array.isArray(selectedRecords) && selectedRecords.length > 0) {
      return allFormatted.filter((job: any) => selectedRecords.includes(job.jobId));
    }
    return allFormatted;
  };

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
        rolePipelineData={getRolePipelineData()}
        attritionData={attritionData}
        dateFilter={dateFilter}
      />
    </div>
  );
};

export const createAnalyticsEmployeePerformanceDocumentComponent = (
  dateFilter: { from: string; to: string },
  activeSubTab: number = 1,
  employeePerformanceTableData?: any[],
  employeeIssuesTableData?: any[],
  printOption?: string,
  selectedDepartments?: string[],
  selectedEmployees?: string[],
  selectedIssueTypes?: string[],
  selectedEmployeeIssues?: string[],
  departmentPrintOption?: string,
  employeePrintOption?: string,
  issueTypePrintOption?: string,
  employeeIssuePrintOption?: string,
  analyticsKPIs?: any,
  analyticsPerformanceTrend?: any[],
  analyticsMonthlyIssueVolume?: any[],
  departmentRecords?: Array<{ name: string; score: number; count: number; color: string }>,
  issueTypeRecords?: Array<{ reason: string; count: number; percentage: string; color: string }>
) => {
  const kpiData = {
    averagePerformance: {
      value: (analyticsKPIs?.average_performance ?? 0).toFixed(1),
      maxScore: 100,
      totalEmployees: 0,
    },
    resolvedVSOngoing: {
      resolvedPercentage: (analyticsKPIs?.resolved_percentage ?? 0).toFixed(1),
      ongoingPercentage: (analyticsKPIs?.ongoing_percentage ?? 0).toFixed(1),
      totalIssues: analyticsKPIs?.total_issues ?? 0,
      resolvedIssues: analyticsKPIs?.resolved_issues ?? 0,
      ongoingIssues: analyticsKPIs?.ongoing_issues ?? 0,
    },
  };

  const calculatePerformanceRateData = () => {
    let filteredDepartments = departmentRecords || [];
    const currentPrintOption = departmentPrintOption || printOption;
    if (currentPrintOption === 'selected' && selectedDepartments && selectedDepartments.length > 0) {
      filteredDepartments = filteredDepartments.filter(d => selectedDepartments.includes(d.name));
    }
    return filteredDepartments;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const performanceTrendData = (analyticsPerformanceTrend || []).map((item: any) => {
    const mName = typeof item.month === 'number' ? monthNames[item.month - 1] || String(item.month) : item.month;
    return { month: mName, score: item.score, count: item.count };
  });

  const calculateIssueTypeData = () => {
    let filteredIssueTypes = (issueTypeRecords || []).map(i => ({
      reason: i.reason,
      count: i.count,
      percentage: i.percentage,
      color: i.color,
    }));
    const currentIssuePrintOption = issueTypePrintOption || printOption;
    if (currentIssuePrintOption === 'selected' && selectedIssueTypes && selectedIssueTypes.length > 0) {
      filteredIssueTypes = filteredIssueTypes.filter(i => selectedIssueTypes.includes(i.reason));
    }
    return filteredIssueTypes;
  };

  const monthlyIssueVolumeData = (analyticsMonthlyIssueVolume || []).map((item: any) => {
    const mName = typeof item.month === 'number' ? monthNames[item.month - 1] || String(item.month) : item.month;
    return { month: mName.substring(0, 3), count: item.count };
  });

  const calculateEmployeePerformanceTableData = () => {
    let filteredData = employeePerformanceTableData || [];
    const currentPrintOption = employeePrintOption || printOption;
    if (currentPrintOption === 'selected' && selectedEmployees && selectedEmployees.length > 0) {
      filteredData = filteredData.filter((employee: any) => selectedEmployees.includes(employee.id));
    }
    return filteredData;
  };

  const calculateEmployeeIssuesTableData = () => {
    let filteredData = employeeIssuesTableData || [];
    const currentPrintOption = employeeIssuePrintOption || printOption;
    if (currentPrintOption === 'selected' && selectedEmployeeIssues && selectedEmployeeIssues.length > 0) {
      filteredData = filteredData.filter((issue: any) => selectedEmployeeIssues.includes(issue.id));
    }
    return filteredData;
  };

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
        performanceRateData={calculatePerformanceRateData()}
        performanceTrendData={performanceTrendData}
        employeePerformanceTableData={calculateEmployeePerformanceTableData()}
        issueTypeData={calculateIssueTypeData()}
        monthlyIssueVolumeData={monthlyIssueVolumeData}
        employeeIssuesTableData={calculateEmployeeIssuesTableData()}
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
  dateFilter: { from: string; to: string },
  activeSubTab: number = 1,
  // Workforce Overview
  rolePipelineData?: any[],
  printOption?: string,
  selectedRecords?: number[],
  analyticsKPIs?: any,
  analyticsApplicantVsHired?: any,
  analyticsAttrition?: any,
  // Employee Performance
  employeePerformanceTableData?: any[],
  employeeIssuesTableData?: any[],
  selectedDepartments?: string[],
  selectedEmployees?: string[],
  selectedIssueTypes?: string[],
  selectedEmployeeIssues?: string[],
  departmentPrintOption?: string,
  employeePrintOption?: string,
  issueTypePrintOption?: string,
  employeeIssuePrintOption?: string,
  analyticsKPIsPerformance?: any,
  analyticsPerformanceTrend?: any[],
  analyticsMonthlyIssueVolume?: any[],
  departmentRecords?: Array<{ name: string; score: number; count: number; color: string }>,
  issueTypeRecords?: Array<{ reason: string; count: number; percentage: string; color: string }>
) => {
  let documentComponent: React.ReactElement;

  switch (tabId) {
    case 1: // Workforce Overview
      documentComponent = createAnalyticsWorkforceOverviewDocumentComponent(
        dateFilter,
        rolePipelineData,
        printOption,
        selectedRecords,
        analyticsKPIs,
        analyticsApplicantVsHired,
        analyticsAttrition
      );
      break;
    case 2: // Employee Performance
      documentComponent = createAnalyticsEmployeePerformanceDocumentComponent(
        dateFilter,
        activeSubTab,
        employeePerformanceTableData,
        employeeIssuesTableData,
        printOption,
        selectedDepartments,
        selectedEmployees,
        selectedIssueTypes,
        selectedEmployeeIssues,
        departmentPrintOption,
        employeePrintOption,
        issueTypePrintOption,
        employeeIssuePrintOption,
        analyticsKPIsPerformance,
        analyticsPerformanceTrend,
        analyticsMonthlyIssueVolume,
        departmentRecords,
        issueTypeRecords
      );
      break;
    default:
      throw new Error(`Print functionality not implemented for tab ${tabId}`);
  }

  const filename = generateAnalyticsFilename(tabName, dateFilter);
  await generatePDFLocally(documentComponent, filename);
};
