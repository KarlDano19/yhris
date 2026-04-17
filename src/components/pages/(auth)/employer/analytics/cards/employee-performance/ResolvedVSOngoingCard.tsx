import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface PrecomputedIssueData {
  resolved_issues: number;
  ongoing_issues: number;
  total_issues: number;
  resolved_percentage: number;
  ongoing_percentage: number;
}

interface ResolvedVSOngoingCardProps {
  isLoading?: boolean;
  error?: any;
  precomputedData?: PrecomputedIssueData;
}

const ResolvedVSOngoingCard: React.FC<ResolvedVSOngoingCardProps> = ({
  isLoading = false,
  error = null,
  precomputedData,
}) => {
  const issueData = useMemo(() => {
    if (precomputedData) {
      return {
        resolvedIssues: precomputedData.resolved_issues,
        ongoingIssues: precomputedData.ongoing_issues,
        totalIssues: precomputedData.total_issues,
        resolvedPercentage: precomputedData.resolved_percentage.toFixed(1),
      };
    }
    return { resolvedIssues: 0, ongoingIssues: 0, totalIssues: 0, resolvedPercentage: '0.0' };
  }, [precomputedData]);

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
