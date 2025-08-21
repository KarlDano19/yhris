import React, { useState } from 'react';

import SelectChevronDown from '@/svg/SelectChevronDown';

interface DepartmentRecord {
  name: string;
  score: number;
  count: number;
  color: string;
}

interface PerformanceRateSelectionProps {
  departmentRecords: DepartmentRecord[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  selectedRecords: Set<string>;
  handleRecordSelection: (recordName: string) => void;
  printOptions: Array<{
    id: string;
    title: string;
    description: string;
    value: number;
  }>;
}

const PerformanceRateSelection: React.FC<PerformanceRateSelectionProps> = ({
  departmentRecords,
  selectedOption,
  setSelectedOption,
  selectedRecords,
  handleRecordSelection,
  printOptions
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Print Options */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Choose how you want to select departments for printing:
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {printOptions.map((option) => (
            <div
              key={option.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option.id
                  ? 'border-savoy-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {option.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {option.description}
                  </p>
                </div>
                <div className="ml-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === option.id
                      ? 'border-savoy-blue bg-savoy-blue'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Records Dropdown */}
      {selectedOption === 'selected' && (
        <div className="mb-6">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Select Departments to Include ({departmentRecords.length} total)
            </h4>
          </div>

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue"
            >
              <span className="text-gray-900">
                {selectedRecords.size === 0 
                  ? 'Select departments to include...' 
                  : selectedRecords.size === 1
                    ? departmentRecords.find(record => selectedRecords.has(record.name))?.name || 
                      'Selected department'
                    : selectedRecords.size === departmentRecords.length
                      ? 'All departments selected'
                      : `${selectedRecords.size} departments selected`
                }
              </span>
              <SelectChevronDown />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {departmentRecords.map((record) => (
                  <div
                    key={record.name}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleRecordSelection(record.name)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecords.has(record.name)}
                      onChange={() => handleRecordSelection(record.name)}
                      className="rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue mr-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: record.color }}
                        ></div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {record.name}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="mr-3">Score: {record.score}%</span>
                        <span>Employees: {record.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceRateSelection;
