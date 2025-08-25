// Utility functions for improvement post-training calculations

export interface ImprovementPostTrainingData {
  improvementPercentage: number;
  totalEvaluations: number;
  improvedEmployees: number;
  trend: string;
}

export const calculateImprovementPostTraining = (
  evaluationData?: {
    records?: any[];
  }
): ImprovementPostTrainingData => {
  if (!evaluationData?.records || evaluationData.records.length === 0) {
    return {
      improvementPercentage: 0,
      totalEvaluations: 0,
      improvedEmployees: 0,
      trend: 'No data available'
    };
  }

  const totalEvaluations = evaluationData.records.length;
  let improvedEmployees = 0;

  // This is a placeholder calculation - in a real system, you'd compare pre and post-training performance
  // For now, we'll simulate that 70% of employees showed improvement after training
  improvedEmployees = Math.round(totalEvaluations * 0.7);

  const improvementPercentage = totalEvaluations > 0 ? (improvedEmployees / totalEvaluations) * 100 : 0;

  // Calculate trend (simulated increase from Q1)
  const previousQuarterImprovement = Math.round(totalEvaluations * 0.4); // 40% in Q1
  const increase = improvedEmployees - previousQuarterImprovement;
  const increasePercentage = previousQuarterImprovement > 0 ? (increase / previousQuarterImprovement) * 100 : 0;

  return {
    improvementPercentage: Math.round(improvementPercentage),
    totalEvaluations,
    improvedEmployees,
    trend: `Increased ${Math.round(increasePercentage)}% rate from Q1`
  };
}; 