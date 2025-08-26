import React, { useMemo } from 'react';

import Card from '../../Card';
import { calculateTrainingCompletion } from './calculations/trainingCompletionCalc';

interface TrainingCompletionCardProps {
  employeeData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const TrainingCompletionCard: React.FC<TrainingCompletionCardProps> = ({
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate training completion using shared utility
  const trainingData = useMemo(() => {
    return calculateTrainingCompletion(employeeData);
  }, [employeeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          % of Employees<br />Completed Training
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
          % of Employees<br />Completed Training
        </h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load training data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        % of Employees<br />Completed Training
      </h3>
      <Card
        value={`${trainingData.completionPercentage}%`}
        trend={trainingData.trend}
        isPositive={trainingData.completionPercentage >= 70} // Positive if 70% or higher
        showSeeMore={true}
      />
    </div>
  );
};

export default TrainingCompletionCard; 