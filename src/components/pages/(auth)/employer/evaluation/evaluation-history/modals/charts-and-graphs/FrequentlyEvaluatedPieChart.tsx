import { useState, useEffect, useMemo } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import ColorPaletteModal from '@/components/pages/(auth)/employer/analytics/modals/ColorPaletteModal';

import { Squares2X2Icon } from '@heroicons/react/24/solid';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface EmployeeEvaluationData {
  name: string;
  employee_id?: number;
  evaluation_count: number;
  department?: string;
  total_score?: number;
  average_score?: number;
}

interface FrequentlyEvaluatedPieChartProps {
  frequentlyEvaluatedEmployees: EmployeeEvaluationData[];
}

const FrequentlyEvaluatedPieChart = ({ 
  frequentlyEvaluatedEmployees 
}: FrequentlyEvaluatedPieChartProps) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Default color palette
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // Memoize top employees to avoid recalculating on every render
  const topEmployees = useMemo(() => {
    if (!frequentlyEvaluatedEmployees || frequentlyEvaluatedEmployees.length === 0) {
      return [];
    }
    // Take top 10 most frequently evaluated employees
    return frequentlyEvaluatedEmployees.slice(0, 10);
  }, [frequentlyEvaluatedEmployees]);

  // Load saved colors on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('frequentlyEvaluatedPieChartColorPalette');
    if (savedColors) {
      try {
        setCustomColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error loading saved color palette:', error);
      }
    }
  }, []);

  // Handle color palette save
  const handleColorPaletteSave = (colors: string[]) => {
    setCustomColors(colors);
    localStorage.setItem('frequentlyEvaluatedPieChartColorPalette', JSON.stringify(colors));
    
    // Also save the color mapping to employee names/ids for consistency
    const colorMap: Record<string, string> = {};
    topEmployees.forEach((emp, index) => {
      const key = emp.employee_id ? `emp_${emp.employee_id}` : `name_${emp.name}`;
      colorMap[key] = colors[index] || defaultColors[index % defaultColors.length];
    });
    localStorage.setItem('frequentlyEvaluatedPieChartColorMap', JSON.stringify(colorMap));
  };

  // Generate consistent colors for each employee based on their name/id
  // This ensures each employee always gets the same color regardless of position
  const employeeColorMap = useMemo(() => {
    const colorMap = new Map<string, string>();
    const allEmployees = frequentlyEvaluatedEmployees || [];
    
    // Load saved color mappings if available
    const savedColorMap = localStorage.getItem('frequentlyEvaluatedPieChartColorMap');
    let savedMap: Record<string, string> = {};
    if (savedColorMap) {
      try {
        savedMap = JSON.parse(savedColorMap);
      } catch (error) {
        console.error('Error loading saved color map:', error);
      }
    }
    
    // Assign colors to each unique employee
    allEmployees.forEach((emp, index) => {
      // Use employee_id if available for uniqueness, otherwise use name
      const key = emp.employee_id ? `emp_${emp.employee_id}` : `name_${emp.name}`;
      
      if (savedMap[key]) {
        // Use saved color if available
        colorMap.set(key, savedMap[key]);
      } else {
        // Generate consistent color based on a hash of the key
        // This ensures the same employee always gets the same color
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
          hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % defaultColors.length;
        colorMap.set(key, defaultColors[colorIndex]);
      }
    });
    
    return colorMap;
  }, [frequentlyEvaluatedEmployees]);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (topEmployees.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Get colors for each employee based on their unique identifier
    const employeeColors = topEmployees.map((emp: EmployeeEvaluationData) => {
      const employeeKey = emp.employee_id ? `emp_${emp.employee_id}` : `name_${emp.name}`;
      
      // Check if custom colors are set (from the color modal)
      if (customColors.length > 0) {
        const index = topEmployees.findIndex(e => 
          (e.employee_id && e.employee_id === emp.employee_id) || 
          (!e.employee_id && e.name === emp.name)
        );
        if (customColors[index]) {
          return customColors[index];
        }
      }
      
      // Otherwise use the employee-specific color from the map
      return employeeColorMap.get(employeeKey) || defaultColors[0];
    });

    return {
      labels: topEmployees.map((emp: EmployeeEvaluationData) => emp.name),
      datasets: [{
        data: topEmployees.map((emp: EmployeeEvaluationData) => emp.evaluation_count),
        backgroundColor: employeeColors,
        borderColor: employeeColors,
        borderWidth: 1,
      }]
    };
  }, [topEmployees, customColors, employeeColorMap]);

  if (chartData.labels.length === 0) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>No evaluation data available</p>
      </div>
    );
  }

  // Memoize chart options to prevent re-renders
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3B82F6',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value} evaluation${value !== 1 ? 's' : ''}`;
          }
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  }), []);

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex justify-end mb-2'>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Customize colors"
          >
            <Squares2X2Icon className="w-4 h-4" />
            Colors
          </button>
        </div>
        <div className='flex-1 min-h-0'>
          <Pie 
            data={chartData} 
            options={chartOptions}
          />
        </div>
      </div>

      {/* Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={handleColorPaletteSave}
        currentColors={chartData.datasets[0]?.backgroundColor || []}
        departmentNames={chartData.labels as string[]}
      />
    </>
  );
};

export default FrequentlyEvaluatedPieChart;

