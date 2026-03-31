import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface AttritionRateCardProps {
  isLoading?: boolean;
  error?: any;
  precomputedValue?: number;
}

const AttritionRateCard: React.FC<AttritionRateCardProps> = ({
  isLoading = false,
  error = null,
  precomputedValue,
}) => {
  const attritionData = useMemo(() => {
    const rate = precomputedValue ?? 0;
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const trend = `New data in Q${quarter} ${now.getFullYear()}`;
    return { attritionRate: rate.toFixed(2), trend, isPositive: false };
  }, [precomputedValue]);

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
