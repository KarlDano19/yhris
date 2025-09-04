import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateAttritionRate } from './calculations/attritionRateCalc';

interface AttritionRateCardProps {
  separationData?: any[];
  employeeData?: any[];
  isLoading?: boolean;
  error?: any;
}

const AttritionRateCard: React.FC<AttritionRateCardProps> = ({
  separationData,
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate attrition rate using shared utility
  const attritionData = useMemo(() => {
    return calculateAttritionRate(separationData, employeeData);
  }, [separationData, employeeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load attrition data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Attrition Rate</h3>
      <Card
        value={`${attritionData.attritionRate}%`}
        trend={attritionData.trend}
        isPositive={attritionData.isPositive}
      />
    </div>
  );
};

export default AttritionRateCard;
