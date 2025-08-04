'use client';

import React, { useMemo } from 'react';
import Card from '../../../Card';

interface AveragePerformanceCardProps {
  evaluationData?: {
    records?: any[];
  };
  isLoading?: boolean;
  error?: any;
}

const AveragePerformanceCard: React.FC<AveragePerformanceCardProps> = ({
  evaluationData,
  isLoading = false,
  error = null
}) => {
  // Calculate average performance score from evaluation data
  const calculateAveragePerformanceScore = useMemo(() => {
    if (!evaluationData?.records || evaluationData.records.length === 0) {
      return { 
        averageScore: 0, 
        totalEmployees: 0, 
        maxScore: 0 
      };
    }

    const totalScore = evaluationData.records.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.score) || 0);
    }, 0);

    const totalEmployees = evaluationData.records.length;
    const averageScore = totalEmployees > 0 ? totalScore / totalEmployees : 0;

    // Get the maximum score from form_total_score (assuming all evaluations use the same template)
    const maxScore = evaluationData.records[0]?.form_total_score || 
                     evaluationData.records[0]?.max_score || 
                     evaluationData.records[0]?.evaluation_template?.max_score || 
                     100; // Final fallback

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      totalEmployees,
      maxScore: Math.round(maxScore * 100) / 100
    };
  }, [evaluationData]);

  if (isLoading) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          Average Employee<br />Performance Score
        </h3>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pl-5 pr-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
          Average Employee<br />Performance Score
        </h3>
        <div className="bg-red-50 p-4 rounded-2xl">
          <p className="text-red-600 text-sm">Failed to load performance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-5 pr-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        Average Employee<br />Performance Score
      </h3>
      <Card
        value={`${calculateAveragePerformanceScore.averageScore}/${calculateAveragePerformanceScore.maxScore}`}
        trend={`Based on ${calculateAveragePerformanceScore.totalEmployees} employee evaluations`}
      />
    </div>
  );
};

export default AveragePerformanceCard;
