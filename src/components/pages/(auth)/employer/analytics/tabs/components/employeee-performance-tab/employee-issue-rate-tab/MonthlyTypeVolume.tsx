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
  dateFilter?: {
    from: string;
    to: string;
  };
}

const MonthlyTypeVolume: React.FC<MonthlyTypeVolumeProps> = ({ employeeIssueData, dateFilter }) => {
  // Calculate monthly issue volume from the data
  const calculateMonthlyVolume = () => {
    if (!employeeIssueData?.records || employeeIssueData.records.length === 0) {
      return {
        labels: [],
        data: []
      };
    }

    const months = [
      { name: 'January', value: 0 },
      { name: 'February', value: 1 },
      { name: 'March', value: 2 },
      { name: 'April', value: 3 },
      { name: 'May', value: 4 },
      { name: 'June', value: 5 },
      { name: 'July', value: 6 },
      { name: 'August', value: 7 },
      { name: 'September', value: 8 },
      { name: 'October', value: 9 },
      { name: 'November', value: 10 },
      { name: 'December', value: 11 },
    ];

    // Filter issues based on date range or current year
    const filteredIssues = employeeIssueData.records.filter((issue) => {
      if (!issue.incident_date) return false;
      
      const issueDate = new Date(issue.incident_date);
      
      if (dateFilter?.from && dateFilter?.to) {
        const fromDate = new Date(dateFilter.from);
        const toDate = new Date(dateFilter.to);
        return issueDate >= fromDate && issueDate <= toDate;
      } else {
        // Fallback to current year if no date range is selected
        const currentYear = new Date().getFullYear();
        return issueDate.getFullYear() === currentYear;
      }
    });

    // If date range is selected, show all months in the range
    if (dateFilter?.from && dateFilter?.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      const fromMonth = fromDate.getMonth();
      const toMonth = toDate.getMonth();
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      
      // Create array of months in the selected range
      const rangeMonths = [];
      let currentDate = new Date(fromYear, fromMonth, 1);
      const endDate = new Date(toYear, toMonth + 1, 0); // Last day of toMonth
      
      while (currentDate <= endDate) {
        const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
        const monthValue = currentDate.getMonth();
        
        // Count issues for this month
        const monthIssues = filteredIssues.filter((issue) => {
          const issueDate = new Date(issue.incident_date);
          return issueDate.getMonth() === monthValue && 
                 issueDate.getFullYear() === currentDate.getFullYear();
        });
        
        rangeMonths.push({
          month: monthName,
          count: monthIssues.length
        });
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        labels: rangeMonths.map(item => item.month),
        data: rangeMonths.map(item => item.count)
      };
    } else {
      // For current year, only show months with data
      const monthlyData = months.map(month => {
        const monthIssues = filteredIssues.filter((issue) => {
          const issueDate = new Date(issue.incident_date);
          return issueDate.getMonth() === month.value;
        });

        return {
          month: month.name,
          count: monthIssues.length
        };
      });

      // Filter out months with no data (count = 0)
      const monthsWithData = monthlyData.filter(item => item.count > 0);
      
      return {
        labels: monthsWithData.map(item => item.month),
        data: monthsWithData.map(item => item.count)
      };
    }
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
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Issue Volume {dateFilter?.from && dateFilter?.to ? `(${new Date(dateFilter.from).toLocaleDateString('en-US', { month: 'short' })} - ${new Date(dateFilter.to).toLocaleDateString('en-US', { month: 'long' })} ${new Date(dateFilter.from).getFullYear()})` : `(${labels.length > 0 ? `${labels[0]} - ${labels[labels.length - 1]} ${new Date().getFullYear()}` : 'No Data'})`}
        </h3>
      </div>
      
      <div className="h-64">
        {monthlyData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-lg font-semibold mb-2">No Data Available</div>
              <div className="text-sm">No issues found for the selected period</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTypeVolume;
