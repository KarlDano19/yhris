// Utility functions for training completion calculations

export interface TrainingCompletionData {
  completionPercentage: number;
  totalEmployees: number;
  completedTraining: number;
  trend: string;
}

export const calculateTrainingCompletion = (
  employeeData?: {
    records?: any[];
  }
): TrainingCompletionData => {
  if (!employeeData?.records || employeeData.records.length === 0) {
    return {
      completionPercentage: 0,
      totalEmployees: 0,
      completedTraining: 0,
      trend: 'No data available'
    };
  }

  const totalEmployees = employeeData.records.length;
  let completedTraining = 0;

  // This is a placeholder calculation - in a real system, you'd check actual training completion data
  // For now, we'll simulate that 75% of employees have completed training
  completedTraining = Math.round(totalEmployees * 0.75);

  const completionPercentage = totalEmployees > 0 ? (completedTraining / totalEmployees) * 100 : 0;

  // Calculate trend (simulated increase from Q1)
  const previousQuarterCompletion = Math.round(totalEmployees * 0.5); // 50% in Q1
  const increase = completedTraining - previousQuarterCompletion;
  const increasePercentage = previousQuarterCompletion > 0 ? (increase / previousQuarterCompletion) * 100 : 0;

  return {
    completionPercentage: Math.round(completionPercentage),
    totalEmployees,
    completedTraining,
    trend: `Increased ${Math.round(increasePercentage)}% rate from Q1`
  };
}; 