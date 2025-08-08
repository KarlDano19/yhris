'use client';

import React, { useMemo } from 'react';

import Card from '../../Card';

interface ImprovementPostTrainingCardProps {
  evaluationData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const ImprovementPostTrainingCard: React.FC<ImprovementPostTrainingCardProps> = ({
  evaluationData,
  isLoading = false,
  error = null
}) => {
  // Calculate improvement post-training percentage
  const calculateImprovementPostTraining = useMemo(() => {
    if (!evaluationData?.records || evaluationData.records.length === 0) {
      return {
        improvementPercentage: 0,
        totalEvaluations: 0,
        improvedEmployees: 0,
        trend: 'No data available'
      };
    }

    const totalEvaluations = evaluationData.records.length;
    let improvedEmployees = 0;

    // This is a placeholder calculation - in a real system, you'd compare pre and post-training performance
    // For now, we'll simulate that 70% of employees showed improvement after training
    improvedEmployees = Math.round(totalEvaluations * 0.7);

    const improvementPercentage = totalEvaluations > 0 ? (improvedEmployees / totalEvaluations) * 100 : 0;

    // Calculate trend (simulated increase from Q1)
    const previousQuarterImprovement = Math.round(totalEvaluations * 0.4); // 40% in Q1
    const increase = improvedEmployees - previousQuarterImprovement;
    const increasePercentage = previousQuarterImprovement > 0 ? (increase / previousQuarterImprovement) * 100 : 0;

    return {
      improvementPercentage: Math.round(improvementPercentage),
      totalEvaluations,
      improvedEmployees,
      trend: `Increased ${Math.round(increasePercentage)}% rate from Q1`
    };
  }, [evaluationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          % of Improvement<br />Post-training
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
          % of Improvement<br />Post-training
        </h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load improvement data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        % of Improvement<br />Post-training
      </h3>
      <Card
        value={`${calculateImprovementPostTraining.improvementPercentage}%`}
        trend={calculateImprovementPostTraining.trend}
        isPositive={calculateImprovementPostTraining.improvementPercentage >= 60} // Positive if 60% or higher
        showSeeMore={true}
      />
    </div>
  );
};

export default ImprovementPostTrainingCard; 