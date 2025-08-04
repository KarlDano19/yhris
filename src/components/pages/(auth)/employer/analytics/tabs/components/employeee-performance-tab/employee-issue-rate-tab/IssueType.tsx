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

interface EmployeeIssueData {
  issue_type?: string;
}

interface IssueTypeProps {
  employeeIssueData?: {
    records?: EmployeeIssueData[];
  };
}

const IssueType: React.FC<IssueTypeProps> = ({ employeeIssueData }) => {
  // Calculate issue type distribution from the data
  const calculateIssueTypeDistribution = () => {
    if (!employeeIssueData?.records || employeeIssueData.records.length === 0) {
      return {
        labels: ['No Data'],
        data: [1],
        totalIssues: 0,
        percentages: [100]
      };
    }

    // Count issues by type
    const issueTypeCounts: { [key: string]: number } = {};
    let totalIssues = 0;

    employeeIssueData.records.forEach((issue) => {
      const issueType = issue.issue_type || 'Unspecified';
      issueTypeCounts[issueType] = (issueTypeCounts[issueType] || 0) + 1;
      totalIssues++;
    });

    // Convert to arrays for chart
    const labels = Object.keys(issueTypeCounts);
    const data = Object.values(issueTypeCounts);
    
    // Calculate percentages
    const percentages = data.map(count => ((count / totalIssues) * 100).toFixed(1));

    return {
      labels,
      data,
      totalIssues,
      percentages
    };
  };

  const { labels, data, totalIssues, percentages } = calculateIssueTypeDistribution();

  // Color palette for different issue types
  const colors = [
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5A2B', // Brown
    '#9CA3AF', // Gray
    '#EC4899', // Pink
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
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
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, index: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index];
                const percentage = percentages[index];
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.backgroundColor[index],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: index,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const index = context.dataIndex;
            const count = context.parsed;
            const percentage = percentages[index];
            return [
              `Count: ${count}`,
              `Percentage: ${percentage}%`
            ];
          }
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Issue Type Distribution</h3>
      </div>
      
      <div className="h-64 relative">
        <Doughnut data={chartData} options={options} />
        {/* Center text overlay */}
        <div className="absolute top-1/2 left-20 md:left-40 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-4xl font-bold text-gray-900">{totalIssues}</div>
        </div>
      </div>
    </div>
  );
};

export default IssueType;
