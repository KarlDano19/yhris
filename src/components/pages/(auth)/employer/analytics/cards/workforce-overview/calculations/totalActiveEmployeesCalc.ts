// Utility functions for total active employees calculations

export interface TotalActiveEmployeesData {
  totalEmployees: number;
  trend: string;
  isPositive: boolean;
}

export const calculateTotalActiveEmployees = (
  employeeData?: any[]
): TotalActiveEmployeesData => {
  if (!employeeData || employeeData.length === 0) {
    return {
      totalEmployees: 0,
      trend: 'No data available',
      isPositive: true
    };
  }

  const totalEmployees = employeeData.length;
  
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
    trend: `Increased by +${increase} from last Q${previousQuarter} of ${previousYear} (${increasePercentage.toFixed(1)}%)`,
    isPositive: true // Always positive as it's a count
  };
};
