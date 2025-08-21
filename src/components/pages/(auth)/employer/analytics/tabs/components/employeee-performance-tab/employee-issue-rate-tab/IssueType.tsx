import React, { useState, useEffect, useMemo } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { calculateIssueTypeDistribution } from './calculations/issueTypeCalc';
import ColorPaletteModal from '../../../../modals/ColorPaletteModal';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

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
  onShowAllChange?: (showAll: boolean) => void;
  showAllIssueTypes?: boolean;
}

const IssueType: React.FC<IssueTypeProps> = ({ employeeIssueData, isLoading = false, error = null, onShowAllChange, showAllIssueTypes = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate issue type distribution using shared utility
  const { labels, data, totalIssues, percentages, colors, totalIssueTypes } = calculateIssueTypeDistribution(employeeIssueData, customColors, showAllIssueTypes);

  // Handle color palette save
  const handleColorPaletteSave = (colors: string[]) => {
    // Create a mapping of issue type names to their new colors
    const issueTypeColorMap: { [key: string]: string } = {};
    labels.forEach((label, index) => {
      issueTypeColorMap[label] = colors[index] || '#8B5CF6';
    });
    
    // Save the issue type-to-color mapping
    localStorage.setItem('issueTypeColorMapping', JSON.stringify(issueTypeColorMap));
    
    // Update custom colors for immediate use
    setCustomColors(colors);
  };

  // Load saved color palette on component mount
  useEffect(() => {
    // Load legacy color palette format for backward compatibility
    const savedColors = localStorage.getItem('issueTypeColorPalette');
    if (savedColors) {
      try {
        setCustomColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error loading saved color palette:', error);
      }
    }
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the default legend to use custom one
      },
      tooltip: {
        enabled: false,
        mode: 'nearest' as const,
        intersect: false,
        external: function(context: any) {
          // Tooltip Element
          let tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.zIndex = '10000';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all .1s ease';
            document.body.appendChild(tooltipEl);
          }

          const tooltipModel = context.tooltip;

          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          // Set Text
          if (tooltipModel.body) {
            const titleLines = tooltipModel.title || [];
            const bodyLines = tooltipModel.body.map((bodyItem: any) => bodyItem.lines);

            let innerHtml = '';

            titleLines.forEach(function(title: string) {
              innerHtml += '<div style="font-weight: 600; margin-bottom: 4px;">' + title + '</div>';
            });

            bodyLines.forEach(function(body: string[]) {
              body.forEach(function(line: string) {
                innerHtml += '<div>' + line + '</div>';
              });
            });

            tooltipEl.innerHTML = innerHtml;
          }

          const position = context.chart.canvas.getBoundingClientRect();

          // Display, position, and set styles to match original
          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 80 + 'px';
          tooltipEl.style.fontFamily = 'inherit';
          tooltipEl.style.fontSize = '12px';
          tooltipEl.style.color = 'white';
          tooltipEl.style.padding = '12px';
          tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          tooltipEl.style.borderRadius = '8px';
          tooltipEl.style.border = '1px solid #8B5CF6';
          tooltipEl.style.pointerEvents = 'none';
        },
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
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading issue type data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[#A8B5C7]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Issue Type Distribution</h3>
          <span className='text-sm text-gray-500'>
            ({totalIssues < 10 ? `0${totalIssues}` : totalIssues} issues)
          </span>
        </div>
        <div className="flex gap-2">
        <button
          onClick={() => setIsColorModalOpen(true)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
          title="Customize colors"
        >
          <Squares2X2Icon className="w-4 h-4" />
          Colors
        </button>
          {totalIssueTypes > 10 && (
            <button
              onClick={() => {
                const newShowAll = !showAllIssueTypes;
                onShowAllChange?.(newShowAll);
              }}
              className="px-3 py-1 text-sm bg-savoy-blue text-white rounded hover:bg-opacity-90 transition-colors"
            >
              {showAllIssueTypes ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
      </div>
      
      <div className="h-80 relative">
        <Pie data={chartData} options={options} />
      </div>

      {/* Custom Scrollable Legend */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Issue Types</h4>
        <div className={`border border-gray-200 rounded-lg p-3 bg-gray-50 ${showAllIssueTypes ? '' : 'max-h-48 overflow-y-auto'}`}>
          <div className={showAllIssueTypes ? 'grid grid-cols-3 gap-4' : 'space-y-2'}>
            {labels.map((label, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <span className="text-gray-700 flex-1 min-w-0">
                  <span className="truncate block">{label}</span>
                  <span className="text-gray-500 text-xs">({percentages[index]}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={handleColorPaletteSave}
        currentColors={colors}
        departmentNames={labels}
      />
    </div>
  );
};

export default IssueType;
