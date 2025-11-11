// Utility functions for overall applicants summary calculations

export interface ApplicantSummaryItem {
  status: string;
  count: string;
  percentage: string;
  label: string;
  color: string;
}

export const calculateOverallApplicantsSummary = (
  appliedApplicantsData?: any[]
): ApplicantSummaryItem[] => {
  if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData)) {
    return [];
  }

  const totalApplied = appliedApplicantsData.length;
  
  // Count applicants by status
  const statusCounts = appliedApplicantsData.reduce((acc: any, applicant: any) => {
    const status = applicant.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Define all possible statuses with their display names and colors
  const allStatuses = {
    'ongoing': { label: 'Ongoing', color: 'text-blue-600' },
    'hired': { label: 'Hired', color: 'text-green-600' },
    'rejected': { label: 'Rejected', color: 'text-red-600' },
    'withdrawn': { label: 'Withdrawn', color: 'text-red-600' },
  };

  const result: ApplicantSummaryItem[] = [];

  // Add total applied count as the first row (replacing "Applied")
  result.push({
    status: 'Applied',
    count: totalApplied.toString(),
    percentage: totalApplied > 0 ? '100%' : '0%',
    label: '(initial total applicants)',
    color: 'text-gray-800 font-bold'
  });

  // Add counts for each status (including zero counts)
  Object.entries(allStatuses).forEach(([status, config]) => {
    const count = statusCounts[status] || 0;
    const percentage = totalApplied > 0 ? (count / totalApplied * 100).toFixed(0) : '0';
    
    result.push({
      status: config.label,
      count: count.toString(),
      percentage: `${percentage}%`,
      label: 'of total applied',
      color: config.color
    });
  });

  return result;
};
