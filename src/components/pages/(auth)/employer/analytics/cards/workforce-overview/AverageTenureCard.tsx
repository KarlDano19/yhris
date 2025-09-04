import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateAverageTenure } from './calculations/averateTenureCalc';

interface AverageTenureCardProps {
  employeeData?: any[];
  separationData?: any[];
  isLoading?: boolean;
  error?: any;
}

const AverageTenureCard: React.FC<AverageTenureCardProps> = ({
  employeeData,
  separationData,
  isLoading = false,
  error = null
}) => {
  // Calculate average tenure using shared utility
  const tenureData = useMemo(() => {
    return calculateAverageTenure(employeeData, separationData);
  }, [employeeData, separationData]);

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
