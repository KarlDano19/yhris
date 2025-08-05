'use client';

import React, { useState, useEffect } from 'react';
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

import ColorPaletteModal from '../../modals/ColorPaletteModal';
import { generateDistinctColors } from '@/helpers/colorGenerator';

import { Squares2X2Icon } from '@heroicons/react/24/solid';

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
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Generate default colors dynamically (unlimited)
  const defaultColors = generateDistinctColors(20);

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

    // Use custom colors or generate consistent colors based on department name
    const getColorForDepartment = (departmentName: string, index: number) => {
      // First, try to get saved department-specific color mapping
      const savedMapping = localStorage.getItem('departmentColorMapping');
      if (savedMapping) {
        try {
          const departmentColorMap = JSON.parse(savedMapping);
          if (departmentColorMap[departmentName]) {
            return departmentColorMap[departmentName];
          }
        } catch (error) {
          console.error('Error loading department color mapping:', error);
        }
      }
      
      // If no saved mapping, use custom colors by index
      if (customColors.length > 0 && customColors[index]) {
        return customColors[index];
      }
      
      // Otherwise, use default colors or generate consistent colors
      if (defaultColors[index]) {
        return defaultColors[index];
      }
      
      // Fallback to unlimited color generation
      const generatedColors = generateDistinctColors(Math.max(index + 1, 20));
      return generatedColors[index];
    };

    // Calculate performance rate for each department
    const departmentPerformanceData = Object.entries(departmentGroups).map(([department, evaluations], index) => {
      const totalScore = evaluations.reduce((sum: number, evaluation: any) => {
        return sum + (parseFloat(evaluation.score) || 0);
      }, 0);
      
      const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
      
      return {
        name: department,
        score: Math.round(averageScore * 100) / 100,
        color: getColorForDepartment(department, index),
        count: evaluations.length
      };
    });

    const sortedData = departmentPerformanceData.sort((a, b) => b.score - a.score);
    
    return showAllDepartments ? sortedData : sortedData.slice(0, 10);
  };

  const departmentPerformanceData = calculateDepartmentPerformance();



  // Handle color palette save
  const handleColorPaletteSave = (colors: string[]) => {
    // Create a mapping of department names to their new colors
    const departmentColorMap: { [key: string]: string } = {};
    departmentPerformanceData.forEach((dept, index) => {
      departmentColorMap[dept.name] = colors[index] || defaultColors[index] || '#3B82F6';
    });
    
    // Save the department-to-color mapping
    localStorage.setItem('departmentColorMapping', JSON.stringify(departmentColorMap));
    
    // Update custom colors for immediate use
    setCustomColors(colors);
  };

  // Load saved color palette on component mount
  useEffect(() => {
    // Load legacy color palette format for backward compatibility
    const savedColors = localStorage.getItem('departmentColorPalette');
    if (savedColors) {
      try {
        setCustomColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error loading saved color palette:', error);
      }
    }
  }, []);

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
    const baseHeight = 400;
    const minHeight = 300;
    const maxHeight = 600;
    
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
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3B82F6',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const index = context.dataIndex;
            const score = context.parsed.y;
            const dept = departmentPerformanceData[index];
            return [
              `Score: ${score}%`,
              `Employees: ${dept.count}`
            ];
          }
        }
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
    <>
      <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Rate by Department
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsColorModalOpen(true)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
              title="Customize colors"
            >
              <Squares2X2Icon className="w-4 h-4" />
              Colors
            </button>
            {totalDepartments > 10 && (
              <button
                onClick={() => setShowAllDepartments(!showAllDepartments)}
                className="px-3 py-1 text-sm bg-savoy-blue text-white rounded hover:bg-opacity-90 transition-colors"
              >
                {showAllDepartments ? 'Show Top 10' : 'Show All'}
              </button>
            )}
          </div>
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

      {/* Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={handleColorPaletteSave}
        currentColors={departmentPerformanceData.map(dept => dept.color)}
        departmentNames={departmentPerformanceData.map(dept => dept.name)}
      />
    </>
  );
};

export default PerformanceRate;
