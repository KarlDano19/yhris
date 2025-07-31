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

const PerformanceRate: React.FC = () => {
  const departmentPerformanceData = [
    { name: 'Sales', score: 88, color: '#3B82F6' },
    { name: 'IT', score: 74, color: '#374151' },
    { name: 'HR', score: 92, color: '#EAB308' },
  ];

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

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
        Performance Rate by Department (Jan - Mar 2025)
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
