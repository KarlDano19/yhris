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
  employeeIssueData?: EmployeeIssueData[] | {
    records?: EmployeeIssueData[];
  };
  isLoading?: boolean;
  error?: any;
}

const IssueType: React.FC<IssueTypeProps> = ({ employeeIssueData, isLoading = false, error = null }) => {
  // Calculate issue type distribution from the data
  const calculateIssueTypeDistribution = () => {
    // Handle both paginated structure (records) and flat array structure
    const dataArray = Array.isArray(employeeIssueData) ? employeeIssueData : employeeIssueData?.records;
    
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
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

    dataArray.forEach((issue: EmployeeIssueData) => {
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
          padding: 13,
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

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Issue Type Distribution</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Issue Type Distribution</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading issue type data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Issue Type Distribution</h3>
      </div>
      
      <div className="h-64 relative">
        <Doughnut data={chartData} options={options} />
        {/* Center text overlay */}
        <div className="absolute top-1/2 left-20 md:left-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-4xl font-bold text-gray-900">{totalIssues < 10 ? `0${totalIssues}` : totalIssues}</div>
        </div>
      </div>
    </div>
  );
};

export default IssueType;
