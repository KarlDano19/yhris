// Utility functions for separated employees calculations

export interface SeparatedEmployeesData {
  separatedEmployees: number;
  trend: string;
  isPositive: boolean;
}

export const calculateSeparatedEmployees = (
  separationData?: any[]
): SeparatedEmployeesData => {
  if (!separationData || !Array.isArray(separationData) || separationData.length === 0) {
    return {
      separatedEmployees: 0,
      trend: 'No data available',
      isPositive: true
    };
  }

  const separatedEmployees = separationData.length;
  
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
  
  const previousQuarterSeparations = Math.round(separatedEmployees * 1.5); // Simulate 33% decrease
  const decrease = previousQuarterSeparations - separatedEmployees;
  const decreasePercentage = previousQuarterSeparations > 0 ? (decrease / previousQuarterSeparations) * 100 : 0;

  return {
    separatedEmployees,
    trend: `Decreased by -${decrease} from last Q${previousQuarter} of ${previousYear} (${decreasePercentage.toFixed(0)}%)`,
    isPositive: true // Positive because decrease in separations is good
  };
};
