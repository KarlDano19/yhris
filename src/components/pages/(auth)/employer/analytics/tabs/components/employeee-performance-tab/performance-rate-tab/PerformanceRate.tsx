import React, { useState, useEffect, useMemo } from 'react';

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

import ColorPaletteModal from '../../../../modals/ColorPaletteModal';
import { calculateDepartmentPerformance } from './calculations/performanceRateCalc';

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
  onShowAllChange?: (showAll: boolean) => void;
  showAllDepartments?: boolean;
}

const PerformanceRate: React.FC<PerformanceRateProps> = ({ evaluationData, onShowAllChange, showAllDepartments = false }) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Calculate department performance using shared utility
  const { departmentPerformanceData, totalDepartments } = useMemo(() => {
    return calculateDepartmentPerformance(evaluationData, showAllDepartments, customColors);
  }, [evaluationData, showAllDepartments, customColors]);



  // Handle color palette save
  const handleColorPaletteSave = (colors: string[]) => {
    // Create a mapping of department names to their new colors
    const departmentColorMap: { [key: string]: string } = {};
    departmentPerformanceData.forEach((dept, index) => {
      departmentColorMap[dept.name] = colors[index] || '#3B82F6';
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
        min: 0,
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
          stepSize: 20,
          callback: function(value: any) {
            return value;
          }
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
                onClick={() => {
                  const newShowAll = !showAllDepartments;
                  onShowAllChange?.(newShowAll);
                }}
                className="px-3 py-1 text-sm bg-savoy-blue text-white rounded hover:bg-opacity-90 transition-colors"
              >
                {showAllDepartments ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>
        </div>
        <div style={{ height: `${getChartHeight()}px` }}>
          <Bar data={data} options={options} />
        </div>

        {/* Title at bottom */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Departments</h4>
          <div className={`border border-gray-200 rounded-lg p-3 bg-gray-50 ${showAllDepartments ? '' : 'max-h-48 overflow-y-auto'}`}>
            <div className={showAllDepartments ? 'grid grid-cols-3 gap-4' : 'space-y-2'}>
              {departmentPerformanceData.map((dept, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded flex-shrink-0" 
                    style={{ backgroundColor: dept.color }}
                  ></div>
                  <span className="text-gray-700 flex-1 min-w-0">
                    <span className="truncate block">{dept.name}</span>
                    <span className="text-gray-500 text-xs">Score: {dept.score}% | Employees: {dept.count}</span>
                  </span>
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
