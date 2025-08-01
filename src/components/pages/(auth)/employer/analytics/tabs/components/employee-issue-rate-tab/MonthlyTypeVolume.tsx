'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EmployeeIssueData {
  incident_date: string;
  issue_type?: string;
}

interface MonthlyTypeVolumeProps {
  employeeIssueData?: {
    records?: EmployeeIssueData[];
  };
}

const MonthlyTypeVolume: React.FC<MonthlyTypeVolumeProps> = ({ employeeIssueData }) => {
  // Calculate monthly issue volume from the data
  const calculateMonthlyVolume = () => {
    if (!employeeIssueData?.records || employeeIssueData.records.length === 0) {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    }

    // Initialize monthly counts
    const monthlyCounts = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    // Count issues by month
    employeeIssueData.records.forEach((issue) => {
      if (issue.incident_date) {
        const date = new Date(issue.incident_date);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth(); // 0-11
          monthlyCounts[month]++;
        }
      }
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels: monthLabels,
      data: monthlyCounts
    };
  };

  const { labels, data: monthlyData } = calculateMonthlyVolume();
  const maxValue = Math.max(...monthlyData, 1); // Ensure at least 1 for proper scaling

  const data = {
    labels,
    datasets: [
      {
        label: 'Issue Volume',
        data: monthlyData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'white',
        pointBorderColor: '#8B5CF6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return `${context[0].label} ${new Date().getFullYear()}`;
          },
          label: (context: any) => {
            return `Issues: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxValue * 1.2), // Add 20% padding
        ticks: {
          stepSize: Math.max(1, Math.ceil(maxValue / 4)), // Dynamic step size
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          borderDash: [3, 3],
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
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Issue Volume ({new Date().getFullYear()})</h3>
      </div>
      
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyTypeVolume;
