import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface OverduePoliciesCardProps {
  overdueData?: any[];
  isLoading?: boolean;
  error?: any;
}

const OverduePoliciesCard: React.FC<OverduePoliciesCardProps> = ({
  overdueData,
  isLoading = false,
  error = null
}) => {
  // Calculate overdue policies with dummy data
  const calculateOverduePolicies = useMemo(() => {
    // Dummy data for visualization
    const currentOverdue = 1;
    const previousOverdue = 0;
    const increase = currentOverdue - previousOverdue;

    return {
      overduePolicies: currentOverdue,
      trend: `Increased by +${increase} (last December 2024 had ${previousOverdue} overdue)`,
      isPositive: false // Increase in overdue policies is negative
    };
  }, [overdueData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Overdue Policies</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Overdue Policies</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load overdue policies data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Overdue Policies</h3>
      <Card
        value={calculateOverduePolicies.overduePolicies.toString()}
        trend={calculateOverduePolicies.trend}
        isPositive={calculateOverduePolicies.isPositive}
      />
    </div>
  );
};

export default OverduePoliciesCard;
