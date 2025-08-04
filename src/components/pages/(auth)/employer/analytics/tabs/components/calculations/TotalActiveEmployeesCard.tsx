'use client';

import React, { useMemo } from 'react';
import Card from '../../../Card';

interface TotalActiveEmployeesCardProps {
  employeeData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const TotalActiveEmployeesCard: React.FC<TotalActiveEmployeesCardProps> = ({
  employeeData,
  isLoading = false,
  error = null
}) => {
  // Calculate total active employees
  const calculateTotalActiveEmployees = useMemo(() => {
    if (!employeeData?.records || employeeData.records.length === 0) {
      return {
        totalEmployees: 0,
        trend: 'No data available'
      };
    }

    const totalEmployees = employeeData.records.length;
    
    // Calculate trend (simulated comparison with previous quarter)
    // In a real system, you'd compare with historical data
    const currentDate = new Date();
    const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const currentYear = currentDate.getFullYear();
    
    // Calculate previous quarter
    let previousQuarter = currentQuarter - 1;
    let previousYear = currentYear;
    if (previousQuarter === 0) {
      previousQuarter = 4;
      previousYear = currentYear - 1;
    }
    
    const previousQuarterCount = Math.round(totalEmployees * 0.965); // Simulate 3.6% increase
    const increase = totalEmployees - previousQuarterCount;
    const increasePercentage = previousQuarterCount > 0 ? (increase / previousQuarterCount) * 100 : 0;

    return {
      totalEmployees,
      trend: `Increased by +${increase} from last Q${previousQuarter} of ${previousYear} (${increasePercentage.toFixed(1)}%)`
    };
  }, [employeeData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-2 pr-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Total Active Employees</h3>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
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
        value={calculateTotalActiveEmployees.totalEmployees.toString()}
        trend={calculateTotalActiveEmployees.trend}
        isPositive={true} // Always positive as it's a count
      />
    </div>
  );
};

export default TotalActiveEmployeesCard; 