// Utility functions for employee performance table calculations

export interface EmployeeTableData {
  id: string;
  name: string;
  department: string;
  score: string;
  lastEvaluation: string;
  status: string;
}

export const transformEvaluationData = (apiData: any): EmployeeTableData[] => {
  if (!apiData || !apiData.records) return [];
  
  return apiData.records.map((item: any) => {
    const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
    const maxScore = parseFloat(item.max_total_score) || 100;
    const percentage = maxScore > 0 ? Math.round((formScore / maxScore) * 100 * 100) / 100 : 0;
    
    return {
      id: item.id?.toString() || `${item.employee_name}_${item.date_of_evaluation}_${formScore}`,
      name: item.employee_name || 'N/A',
      department: item.department || 'N/A',
      score: `${percentage}%`,
      lastEvaluation: item.date_of_evaluation ? new Date(item.date_of_evaluation).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A',
      status: item.status || 'N/A'
    };
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Passed':
      return 'text-green-600 font-medium';
    case 'Failed':
      return 'text-red-600 font-medium';
    default:
      return 'text-gray-600';
  }
};
