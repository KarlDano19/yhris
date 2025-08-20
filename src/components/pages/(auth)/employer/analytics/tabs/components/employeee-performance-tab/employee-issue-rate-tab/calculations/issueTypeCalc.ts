// Utility functions for issue type distribution calculations

export interface IssueTypeData {
  labels: string[];
  data: number[];
  totalIssues: number;
  percentages: string[];
}

export const calculateIssueTypeDistribution = (
  employeeIssueData?: any[] | {
    records?: any[];
  }
): IssueTypeData => {
  // Handle both paginated structure (records) and flat array structure
  const dataArray = Array.isArray(employeeIssueData) ? employeeIssueData : employeeIssueData?.records;
  
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    return {
      labels: ['No Data'],
      data: [1],
      totalIssues: 0,
      percentages: ['100']
    };
  }

  // Count issues by type
  const issueTypeCounts: { [key: string]: number } = {};
  let totalIssues = 0;

  dataArray.forEach((issue: any) => {
    const issueType = issue.issue_type || 'Unspecified';
    issueTypeCounts[issueType] = (issueTypeCounts[issueType] || 0) + 1;
    totalIssues++;
  });

  // Convert to arrays for chart
  const labels = Object.keys(issueTypeCounts);
  const data = Object.values(issueTypeCounts);
  
  // Calculate percentages
  const percentages = data.map(count => ((count / totalIssues) * 100).toFixed(1));

  return {
    labels,
    data,
    totalIssues,
    percentages
  };
}; 