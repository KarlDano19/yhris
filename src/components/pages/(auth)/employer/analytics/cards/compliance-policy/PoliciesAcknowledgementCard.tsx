import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface PoliciesAcknowledgementCardProps {
  acknowledgementData?: any[];
  isLoading?: boolean;
  error?: any;
}

const PoliciesAcknowledgementCard: React.FC<PoliciesAcknowledgementCardProps> = ({
  acknowledgementData,
  isLoading = false,
  error = null
}) => {
  // Calculate policies acknowledgement rate with dummy data
  const calculateAcknowledgementRate = useMemo(() => {
    // Dummy data for visualization
    const currentAcknowledgementRate = 87;
    const previousAcknowledgementRate = 83;
    const increase = currentAcknowledgementRate - previousAcknowledgementRate;

    return {
      acknowledgementRate: currentAcknowledgementRate,
      trend: `Increased by +${increase}% (was ${previousAcknowledgementRate}% last December 2024)`,
      isPositive: true
    };
  }, [acknowledgementData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Acknowledgement Rate</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Acknowledgement Rate</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load acknowledgement data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Policies Acknowledgement Rate</h3>
      <Card
        value={`${calculateAcknowledgementRate.acknowledgementRate}%`}
        trend={calculateAcknowledgementRate.trend}
        isPositive={calculateAcknowledgementRate.isPositive}
      />
    </div>
  );
};

export default PoliciesAcknowledgementCard;
