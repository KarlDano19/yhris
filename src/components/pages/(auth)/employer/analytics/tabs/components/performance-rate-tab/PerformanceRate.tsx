'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceRateProps {
  evaluationData?: any;
}

const PerformanceRate: React.FC<PerformanceRateProps> = ({ evaluationData }) => {
  // Calculate department performance rates from evaluation data
  const calculateDepartmentPerformance = () => {
    if (!evaluationData?.records) return [];

    // Group evaluations by department
    const departmentGroups: { [key: string]: any[] } = {};
    
    evaluationData.records.forEach((item: any) => {
      const department = item.department || 'Unknown';
      if (!departmentGroups[department]) {
        departmentGroups[department] = [];
      }
      departmentGroups[department].push(item);
    });

    // Calculate performance rate for each department
    const departmentPerformanceData = Object.entries(departmentGroups).map(([department, evaluations]) => {
      const totalScore = evaluations.reduce((sum: number, evaluation: any) => {
        return sum + (parseFloat(evaluation.score) || 0);
      }, 0);
      
      const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
      
      // Assign colors based on department
      const colors = ['#3B82F6', '#374151', '#EAB308', '#10B981', '#F59E0B', '#EF4444'];
      const colorIndex = Object.keys(departmentGroups).indexOf(department) % colors.length;
      
      return {
        name: department,
        score: Math.round(averageScore * 100) / 100,
        color: colors[colorIndex],
        count: evaluations.length
      };
    });

    return departmentPerformanceData.sort((a, b) => b.score - a.score); // Sort by score descending
  };

  const departmentPerformanceData = calculateDepartmentPerformance();

  const data = {
    labels: departmentPerformanceData.map(dept => dept.name),
    datasets: [
      {
        label: 'Score',
        data: departmentPerformanceData.map(dept => dept.score),
        backgroundColor: departmentPerformanceData.map(dept => dept.color),
        borderColor: departmentPerformanceData.map(dept => dept.color),
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Show fallback if no data
  if (departmentPerformanceData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
          Performance Rate by Department
        </h3>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-gray-600 mb-2">No Data Available</div>
            <div className="text-sm text-gray-500">No evaluation data found for departments</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
        Performance Rate by Department
      </h3>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>

      {/* Title at bottom */}
      <div className="text-center mt-4">
        <h3 className="text-lg text-gray-600">Average Score</h3>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {departmentPerformanceData.map((dept, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }}></div>
            <span className="text-sm text-gray-600">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceRate;
