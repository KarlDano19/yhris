import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface PoliciesDueCardProps {
  policiesData?: any[];
  isLoading?: boolean;
  error?: any;
}

const PoliciesDueCard: React.FC<PoliciesDueCardProps> = ({
  policiesData,
  isLoading = false,
  error = null
}) => {
  // Calculate policies due for review with dummy data
  const calculatePoliciesDue = useMemo(() => {
    // Dummy data for visualization
    const currentPoliciesDue = 3;
    const previousPoliciesDue = 4;
    const decrease = previousPoliciesDue - currentPoliciesDue;

    return {
      policiesDue: currentPoliciesDue,
      trend: `Decreased by -${decrease} (last December 2024 had ${previousPoliciesDue} policies approaching review)`,
      isPositive: true // Decrease in policies due is positive
    };
  }, [policiesData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Due for Review</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Due for Review</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load policies data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Due for Review</h3>
      <Card
        value={calculatePoliciesDue.policiesDue.toString()}
        trend={calculatePoliciesDue.trend}
        isPositive={calculatePoliciesDue.isPositive}
      />
    </div>
  );
};

export default PoliciesDueCard;
