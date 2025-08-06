'use client';

import React, { useMemo } from 'react';

import Card from '../../../Card';

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
  // Calculate training completion percentage
  const calculateTrainingCompletion = useMemo(() => {
    if (!employeeData?.records || employeeData.records.length === 0) {
      return {
        completionPercentage: 0,
        totalEmployees: 0,
        completedTraining: 0,
        trend: 'No data available'
      };
    }

    const totalEmployees = employeeData.records.length;
    let completedTraining = 0;

    // This is a placeholder calculation - in a real system, you'd check actual training completion data
    // For now, we'll simulate that 75% of employees have completed training
    completedTraining = Math.round(totalEmployees * 0.75);

    const completionPercentage = totalEmployees > 0 ? (completedTraining / totalEmployees) * 100 : 0;

    // Calculate trend (simulated increase from Q1)
    const previousQuarterCompletion = Math.round(totalEmployees * 0.5); // 50% in Q1
    const increase = completedTraining - previousQuarterCompletion;
    const increasePercentage = previousQuarterCompletion > 0 ? (increase / previousQuarterCompletion) * 100 : 0;

    return {
      completionPercentage: Math.round(completionPercentage),
      totalEmployees,
      completedTraining,
      trend: `Increased ${Math.round(increasePercentage)}% rate from Q1`
    };
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
        value={`${calculateTrainingCompletion.completionPercentage}%`}
        trend={calculateTrainingCompletion.trend}
        isPositive={calculateTrainingCompletion.completionPercentage >= 70} // Positive if 70% or higher
      />
    </div>
  );
};

export default TrainingCompletionCard; 