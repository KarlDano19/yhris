import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface AveragePerformanceCardProps {
  isLoading?: boolean;
  error?: any;
  precomputedValue?: number;
  evaluationCount?: number;
}

const AveragePerformanceCard: React.FC<AveragePerformanceCardProps> = ({
  isLoading = false,
  error = null,
  precomputedValue,
  evaluationCount,
}) => {
  const performanceData = useMemo(() => {
    return {
      averageScore: (precomputedValue ?? 0).toFixed(1),
      maxScore: 100,
      totalEmployees: evaluationCount ?? 0,
    };
  }, [precomputedValue, evaluationCount]);

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
