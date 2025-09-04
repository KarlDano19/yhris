import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateAveragePerformance } from './calculations/averagePerformanceCalc';

interface AveragePerformanceCardProps {
  evaluationData?: any[];
  isLoading?: boolean;
  error?: any;
}

const AveragePerformanceCard: React.FC<AveragePerformanceCardProps> = ({
  evaluationData,
  isLoading = false,
  error = null
}) => {
  // Calculate average performance score using shared utility
  const performanceData = useMemo(() => {
    return calculateAveragePerformance(evaluationData);
  }, [evaluationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          Average Employee<br />Performance Score
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
          Average Employee<br />Performance Score
        </h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load performance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        Average Employee<br />Performance Score
      </h3>
      <Card
        value={`${performanceData.averageScore}/${performanceData.maxScore}`}
        trend={`Based on ${performanceData.totalEmployees} employee evaluations`}
        showSeeMore={true}
      />
    </div>
  );
};

export default AveragePerformanceCard;
