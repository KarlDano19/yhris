import React, { useMemo } from 'react';

import Card from '../../Card';
import { calculateImprovementPostTraining } from './calculations/improvementPostTrainingCalc';

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
  // Calculate improvement post-training using shared utility
  const improvementData = useMemo(() => {
    return calculateImprovementPostTraining(evaluationData);
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
        value={`${improvementData.improvementPercentage}%`}
        trend={improvementData.trend}
        isPositive={improvementData.improvementPercentage >= 60} // Positive if 60% or higher
        showSeeMore={true}
      />
    </div>
  );
};

export default ImprovementPostTrainingCard; 