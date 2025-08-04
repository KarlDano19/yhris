'use client';

import React, { useMemo } from 'react';

import Card from '../../../Card';

interface ResolvedVSOngoingCardProps {
  employeeIssueData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const ResolvedVSOngoingCard: React.FC<ResolvedVSOngoingCardProps> = ({
  employeeIssueData,
  isLoading = false,
  error = null
}) => {
  // Calculate resolved vs ongoing issues percentages
  const calculateIssueResolutionRate = useMemo(() => {
    if (!employeeIssueData?.records || employeeIssueData.records.length === 0) {
      return {
        resolvedPercentage: 0,
        ongoingPercentage: 0,
        totalIssues: 0,
        resolvedIssues: 0,
        ongoingIssues: 0
      };
    }

    const totalIssues = employeeIssueData.records.length;
    let resolvedIssues = 0;
    let ongoingIssues = 0;

    employeeIssueData.records.forEach((issue: any) => {
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
  }, [employeeIssueData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          % of Resolved Employee<br />Issues vs. Ongoing Issues
        </h3>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          % of Resolved Employee<br />Issues vs. Ongoing Issues
        </h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load issue data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        % of Resolved Employee<br />Issues vs. Ongoing Issues
      </h3>
      <Card
        value={`${calculateIssueResolutionRate.resolvedPercentage}%`}
        trend={`${calculateIssueResolutionRate.resolvedIssues} resolved, ${calculateIssueResolutionRate.ongoingIssues} ongoing out of ${calculateIssueResolutionRate.totalIssues} total issues`}
      />
    </div>
  );
};

export default ResolvedVSOngoingCard;
