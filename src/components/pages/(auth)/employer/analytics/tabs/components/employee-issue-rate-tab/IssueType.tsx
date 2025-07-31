'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const IssueType: React.FC = () => {
  const data = {
    labels: ['Tardiness', 'Poor Performance', 'Absenteeism', 'Insubordination', 'Misconduct'],
    datasets: [
      {
        data: [12, 6, 4, 3, 2],
        backgroundColor: [
          '#8B5CF6', // Purple
          '#F97316', // Orange
          '#3B82F6', // Blue
          '#EF4444', // Reddish-orange
          '#06B6D4', // Light blue/cyan
        ],
        borderWidth: 0,
        cutout: '45%', // Creates the donut hole
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const totalIssues = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Issue Type (Jan - Mar 2025)</h3>
      </div>
      
      <div className="h-64 relative">
        <Doughnut data={data} options={options} />
        {/* Center text overlay */}
        <div className="absolute top-1/2 left-48 -translate-x-1/2 -translate-y-1/2">
            <div className="text-4xl font-bold text-gray-900">{totalIssues}</div>
        </div>
      </div>
    </div>
  );
};

export default IssueType;
