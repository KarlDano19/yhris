import React, { useMemo } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '../../Card';

interface SeparatedEmployeesCardProps {
  isLoading?: boolean;
  error?: any;
  precomputedValue?: number;
  prevQ4Value?: number;
  prevQ4Year?: number;
}

const SeparatedEmployeesCard: React.FC<SeparatedEmployeesCardProps> = ({
  isLoading = false,
  error = null,
  precomputedValue,
  prevQ4Value,
  prevQ4Year,
}) => {
  const separatedEmployeesData = useMemo(() => {
    const current = precomputedValue ?? 0;
    let trend = '';
    let isPositive = false;

    if (prevQ4Value !== undefined && prevQ4Year !== undefined) {
      const diff = current - prevQ4Value;
      const pct = prevQ4Value > 0 ? Math.abs(Math.round((diff / prevQ4Value) * 100)) : 0;
      if (diff > 0) {
        trend = `Increased by +${diff} from last Q4 of ${prevQ4Year} (${pct}%)`;
        isPositive = false;
      } else if (diff < 0) {
        trend = `Decreased by ${diff} from last Q4 of ${prevQ4Year} (${pct}%)`;
        isPositive = true;
      } else {
        trend = `No change from last Q4 of ${prevQ4Year} (0%)`;
        isPositive = true;
      }
    }

    return { separatedEmployees: current, trend, isPositive };
  }, [precomputedValue, prevQ4Value, prevQ4Year]);

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
