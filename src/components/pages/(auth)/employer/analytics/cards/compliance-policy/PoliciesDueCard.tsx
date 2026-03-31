import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface PoliciesDueCardProps {
  policiesData?: any[];
  isLoading?: boolean;
  error?: any;
  precomputedCount?: number;
}

const PoliciesDueCard: React.FC<PoliciesDueCardProps> = ({
  policiesData,
  isLoading = false,
  error = null,
  precomputedCount,
}) => {
  // Calculate policies due for review
  const calculatePoliciesDue = useMemo(() => {
    const count = precomputedCount !== undefined ? precomputedCount : 3;
    return {
      policiesDue: count,
      trend: `DOLE requirements pending submission or review`,
      isPositive: count === 0
    };
  }, [policiesData, precomputedCount]);

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
