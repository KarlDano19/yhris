import React, { useState, useEffect, useMemo } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import LoadingSpinner from '@/components/LoadingSpinner';
import ColorPaletteModal from '../../../../modals/ColorPaletteModal';

import { Squares2X2Icon } from '@heroicons/react/24/solid';

ChartJS.register(ArcElement, Tooltip, Legend);


interface IssueTypeProps {
  isLoading?: boolean;
  error?: any;
  onShowAllChange?: (showAll: boolean) => void;
  showAllIssueTypes?: boolean;
  precomputedDistribution?: Array<{ issue_type: string; count: number; percentage: number }>;
}

const IssueType: React.FC<IssueTypeProps> = ({
  isLoading = false,
  error = null,
  onShowAllChange,
  showAllIssueTypes = false,
  precomputedDistribution,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { labels, data, totalIssues, percentages, colors, totalIssueTypes } = useMemo(() => {
    if (precomputedDistribution) {
      const defaultColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];
      let colorMapping: { [key: string]: string } = {};
      try {
        const saved = localStorage.getItem('issueTypeColorMapping');
        if (saved) colorMapping = JSON.parse(saved);
      } catch {}

      const filtered = showAllIssueTypes ? precomputedDistribution : precomputedDistribution.slice(0, 10);
      const lbls = filtered.map(i => i.issue_type || 'Unknown');
      const vals = filtered.map(i => i.count);
      const pcts = filtered.map(i => i.percentage.toFixed(1));
      const clrs = filtered.map((i, idx) => customColors[idx] || colorMapping[i.issue_type] || defaultColors[idx % defaultColors.length]);
      return {
        labels: lbls,
        data: vals,
        totalIssues: filtered.reduce((s, i) => s + i.count, 0),
        percentages: pcts,
        colors: clrs,
        totalIssueTypes: precomputedDistribution.length,
      };
    }
    return {
      labels: [],
      data: [],
      totalIssues: 0,
      percentages: [],
      colors: [],
      totalIssueTypes: 0,
    };
  }, [customColors, showAllIssueTypes, precomputedDistribution]);

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
          <LoadingSpinner size="lg" color="yellow" />
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

  // Show fallback if no data
  if (totalIssues === 0) {
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
        <div className='h-14'></div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-500 mb-2">No Data Available</div>
          </div>
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
      {totalIssues > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Issue Types</h4>
          <div className={`border border-gray-200 rounded-lg p-3 bg-gray-50 ${showAllIssueTypes ? '' : 'max-h-48 overflow-y-auto'}`}>
            <div className={showAllIssueTypes ? 'grid grid-cols-3 gap-4' : 'space-y-2'}>
              {labels.map((label, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-8 h-8 rounded flex-shrink-0" 
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
      )}

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
