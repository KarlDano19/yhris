// Utility functions for employee issues table calculations

export interface EmployeeIssueData {
  id: string;
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

 