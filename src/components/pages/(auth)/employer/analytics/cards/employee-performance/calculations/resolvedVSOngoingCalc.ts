// Utility functions for resolved vs ongoing employee issues calculations

export interface ResolvedVSOngoingData {
  resolvedPercentage: number;
  ongoingPercentage: number;
  totalIssues: number;
  resolvedIssues: number;
  ongoingIssues: number;
}

export const calculateResolvedVSOngoing = (
  employeeIssueData?: any[]
): ResolvedVSOngoingData => {
  if (!employeeIssueData || !Array.isArray(employeeIssueData) || employeeIssueData.length === 0) {
    return {
      resolvedPercentage: 0,
      ongoingPercentage: 0,
      totalIssues: 0,
      resolvedIssues: 0,
      ongoingIssues: 0
    };
  }

  const totalIssues = employeeIssueData.length;
  let resolvedIssues = 0;
  let ongoingIssues = 0;

  employeeIssueData.forEach((issue: any) => {
    // Resolved: decision has been sent AND received (employee signed)
    if (issue.is_decision_sent && issue.is_decision_received) {
      resolvedIssues++;
    } 
    // Ongoing: decision has not been sent yet (company hasn't reached decision)
    else if (!issue.is_decision_sent) {
      ongoingIssues++;
    }
    // Note: Issues where decision is sent but not received are not counted in either category
  });

  const resolvedPercentage = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100) : 0;
  const ongoingPercentage = totalIssues > 0 ? ((ongoingIssues / totalIssues) * 100) : 0;

  return {
    resolvedPercentage: Math.round(resolvedPercentage * 10) / 10, // Round to 1 decimal
    ongoingPercentage: Math.round(ongoingPercentage * 10) / 10, // Round to 1 decimal
    totalIssues,
    resolvedIssues,
    ongoingIssues
  };
}; 