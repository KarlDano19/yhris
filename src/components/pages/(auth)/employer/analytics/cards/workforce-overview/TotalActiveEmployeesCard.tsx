import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';
import { calculateTotalActiveEmployees } from './calculations/totalActiveEmployeesCalc';

interface TotalActiveEmployeesCardProps {
  employeeData?: any[];
  isLoading?: boolean;
  error?: any;
}

const TotalActiveEmployeesCard: React.FC<TotalActiveEmployeesCardProps> = ({
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate total active employees using shared utility
  const totalEmployeesData = useMemo(() => {
    return calculateTotalActiveEmployees(employeeData);
  }, [employeeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Total Active Employees</h3>
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner size="md" color="yellow" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Total Active Employees</h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load employee data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 pr-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Total Active Employees</h3>
      <Card
        value={totalEmployeesData.totalEmployees.toString()}
        trend={totalEmployeesData.trend}
        isPositive={totalEmployeesData.isPositive}
      />
    </div>
  );
};

export default TotalActiveEmployeesCard; 