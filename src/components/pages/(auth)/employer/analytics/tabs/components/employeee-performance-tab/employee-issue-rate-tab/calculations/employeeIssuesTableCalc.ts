// Utility functions for employee issues table calculations

export interface EmployeeIssueData {
  name: string;
  department: string;
  issueType: string;
  dateReported: string;
  status: string;
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'NTE Issued':
      return 'text-red-600 font-medium';
    case 'Resolved':
      return 'text-green-600 font-medium';
    case 'Under Hearing':
      return 'text-orange-600 font-medium';
    case 'Pending':
      return 'text-yellow-600 font-medium';
    default:
      return 'text-gray-600';
  }
};

export const processEmployeeIssuesData = (
  rawData?: any[]
): EmployeeIssueData[] => {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    return [];
  }

  return rawData.map((issue: any) => ({
    name: issue.employee_name || issue.name || 'Unknown',
    department: issue.department || issue.employee_department || 'Unknown',
    issueType: issue.issue_type || 'Unknown',
    dateReported: issue.incident_date || issue.date_reported || issue.created_at || 'Unknown',
    status: issue.status || 'Pending'
  }));
}; 