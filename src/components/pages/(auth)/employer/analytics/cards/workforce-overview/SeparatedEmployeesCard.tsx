import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateSeparatedEmployees } from './calculations/separatedEmployeesCalc';

interface SeparatedEmployeesCardProps {
  separationData?: any[];
  isLoading?: boolean;
  error?: any;
}

const SeparatedEmployeesCard: React.FC<SeparatedEmployeesCardProps> = ({
  separationData,
  isLoading = false,
  error = null
}) => {
  // Calculate separated employees using shared utility
  const separatedEmployeesData = useMemo(() => {
    return calculateSeparatedEmployees(separationData);
  }, [separationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Separated Employees</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Separated Employees</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load separation data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Separated Employees</h3>
      <Card
        value={separatedEmployeesData.separatedEmployees.toString()}
        trend={separatedEmployeesData.trend}
        isPositive={separatedEmployeesData.isPositive}
      />
    </div>
  );
};

export default SeparatedEmployeesCard; 