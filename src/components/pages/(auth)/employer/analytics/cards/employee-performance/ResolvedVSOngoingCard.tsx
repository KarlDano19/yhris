import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateResolvedVSOngoing } from './calculations/resolvedVSOngoingCalc';

interface ResolvedVSOngoingCardProps {
  employeeIssueData?: any[];
  isLoading?: boolean;
  error?: any;
}

const ResolvedVSOngoingCard: React.FC<ResolvedVSOngoingCardProps> = ({
  employeeIssueData,
  isLoading = false,
  error = null
}) => {
  // Calculate resolved vs ongoing issues using shared utility
  const issueData = useMemo(() => {
    return calculateResolvedVSOngoing(employeeIssueData);
  }, [employeeIssueData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          % of Resolved Employee<br />Issues vs. Ongoing Issues
        </h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
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
        value={`${issueData.resolvedPercentage}%`}
        trend={`${issueData.resolvedIssues} resolved, ${issueData.ongoingIssues} ongoing out of ${issueData.totalIssues} total issues`}
        showSeeMore={true}
      />
    </div>
  );
};

export default ResolvedVSOngoingCard;
