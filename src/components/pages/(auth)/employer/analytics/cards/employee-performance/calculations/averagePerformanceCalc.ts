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
      maxScore: 0 
    };
  }

  const totalScore = evaluationData.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.score) || 0);
  }, 0);

  const totalEmployees = evaluationData.length;
  const averageScore = totalEmployees > 0 ? totalScore / totalEmployees : 0;

  // Get the maximum score from form_total_score (assuming all evaluations use the same template)
  const maxScore = evaluationData[0]?.form_total_score || 
                   evaluationData[0]?.max_score || 
                   evaluationData[0]?.evaluation_template?.max_score || 
                   100; // Final fallback

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    totalEmployees,
    maxScore: Math.round(maxScore * 100) / 100
  };
}; 