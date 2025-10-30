// Utility functions for average performance calculations

export interface AveragePerformanceData {
  averageScore: number;
  totalEmployees: number;
  maxScore: number;
}

export const calculateAveragePerformance = (
  evaluationData?: any[]
): AveragePerformanceData => {
  if (!evaluationData || evaluationData.length === 0) {
    return { 
      averageScore: 0, 
      totalEmployees: 0, 
      maxScore: 100 
    };
  }

  // Calculate average percentage score across all evaluations
  const totalPercentage = evaluationData.reduce((sum: number, item: any) => {
    const formScore = parseFloat(item.form_total_score) || parseFloat(item.score) || 0;
    const maxScore = parseFloat(item.max_total_score) || 100;
    const percentage = maxScore > 0 ? (formScore / maxScore) * 100 : 0;
    return sum + percentage;
  }, 0);

  const totalEmployees = evaluationData.length;
  const averagePercentage = totalEmployees > 0 ? totalPercentage / totalEmployees : 0;

  return {
    averageScore: Math.round(averagePercentage * 100) / 100,
    totalEmployees,
    maxScore: 100 // Always 100 since we're showing percentage
  };
}; 