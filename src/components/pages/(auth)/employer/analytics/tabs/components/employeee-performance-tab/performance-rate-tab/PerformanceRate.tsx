'use client';

import React, { useState } from 'react';
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
  const [showAllDepartments, setShowAllDepartments] = useState(false);

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

    // Generate random colors for each department
    const generateRandomColor = (departmentName: string) => {
      // Use department name as seed for consistent colors
      let hash = 0;
      for (let i = 0; i < departmentName.length; i++) {
        const char = departmentName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      // Generate colors with good contrast and saturation
      const hue = Math.abs(hash) % 360;
      const saturation = 60 + (Math.abs(hash) % 30); // 60-90% saturation
      const lightness = 30 + (Math.abs(hash) % 20); // 30-50% lightness
      
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Calculate performance rate for each department
    const departmentPerformanceData = Object.entries(departmentGroups).map(([department, evaluations]) => {
      const totalScore = evaluations.reduce((sum: number, evaluation: any) => {
        return sum + (parseFloat(evaluation.score) || 0);
      }, 0);
      
      const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
      
      return {
        name: department,
        score: Math.round(averageScore * 100) / 100,
        color: generateRandomColor(department),
        count: evaluations.length
      };
    });

    const sortedData = departmentPerformanceData.sort((a, b) => b.score - a.score); // Sort by score descending
    
    // Show top 10 by default, or all if showAllDepartments is true
    return showAllDepartments ? sortedData : sortedData.slice(0, 10);
  };

  const departmentPerformanceData = calculateDepartmentPerformance();

  // Calculate total number of departments (before filtering)
  const getTotalDepartments = () => {
    if (!evaluationData?.records) return 0;
    
    const departmentGroups: { [key: string]: any[] } = {};
    evaluationData.records.forEach((item: any) => {
      const department = item.department || 'Unknown';
      if (!departmentGroups[department]) {
        departmentGroups[department] = [];
      }
      departmentGroups[department].push(item);
    });
    
    return Object.keys(departmentGroups).length;
  };

  const totalDepartments = getTotalDepartments();

  // Calculate dynamic height based on number of departments
  const getChartHeight = () => {
    const baseHeight = 400; // 24rem = 384px
    const minHeight = 300; // 18rem = 288px
    const maxHeight = 600; // 36rem = 576px
    
    if (departmentPerformanceData.length <= 8) {
      return baseHeight;
    } else if (departmentPerformanceData.length <= 15) {
      return Math.min(baseHeight + (departmentPerformanceData.length - 8) * 20, maxHeight);
    } else {
      return maxHeight;
    }
  };

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
          display: false,
        },
      },
    },
  };

  // Show fallback if no data
  if (departmentPerformanceData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <h3 className="text-lg font-semibold text-gray-900 mb-8">
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
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance Rate by Department
        </h3>
        {totalDepartments > 10 && (
          <button
            onClick={() => setShowAllDepartments(!showAllDepartments)}
            className="px-3 py-1 text-sm bg-savoy-blue text-white rounded hover:bg-opacity-90 transition-colors"
          >
            {showAllDepartments ? 'Show Top 10' : 'Show All'}
          </button>
        )}
      </div>
      <div style={{ height: `${getChartHeight()}px` }}>
        <Bar data={data} options={options} />
      </div>

      {/* Title at bottom */}
      <div className="mt-4">
        <h3 className="text-lg text-gray-600 text-center mb-3">Average Score</h3>
        <div className="overflow-x-auto">
          <div className="flex justify-start space-x-6 min-w-max pb-2 px-2">
            {departmentPerformanceData.map((dept, index) => (
              <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-gray-600 whitespace-nowrap">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRate;
