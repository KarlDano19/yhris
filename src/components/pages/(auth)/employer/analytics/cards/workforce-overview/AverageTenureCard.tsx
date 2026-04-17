import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface AverageTenureCardProps {
  isLoading?: boolean;
  error?: any;
  precomputedValue?: number;
}

const AverageTenureCard: React.FC<AverageTenureCardProps> = ({
  isLoading = false,
  error = null,
  precomputedValue,
}) => {
  const tenureData = useMemo(() => {
    const years = precomputedValue ?? 0;
    let trend = '';
    let isPositive = true;

    if (years < 1) {
      trend = 'Low tenure - consider retention strategies';
      isPositive = false;
    } else if (years < 3) {
      trend = 'Building tenure - keep engagement high';
      isPositive = true;
    } else if (years < 5) {
      trend = 'Stable tenure - continue growth opportunities';
      isPositive = true;
    } else {
      trend = 'Strong tenure - experienced workforce';
      isPositive = true;
    }

    return { averageTenure: years.toFixed(1), trend, isPositive };
  }, [precomputedValue]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load tenure data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Average Tenure (Years)</h3>
      <Card
        value={`${tenureData.averageTenure}`}
        trend={tenureData.trend}
        isPositive={tenureData.isPositive}
      />
    </div>
  );
};

export default AverageTenureCard;
