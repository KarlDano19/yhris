import React, { useState, useRef } from 'react';

import SelectChevronDown from '@/svg/SelectChevronDown';

interface EmployeeRecord {
  id?: string;
  name: string;
  department: string;
  score: string;
  lastEvaluation: string;
  status: string;
}

interface PerformanceTableSelectionProps {
  employeeRecords: EmployeeRecord[];
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

const PerformanceTableSelection: React.FC<PerformanceTableSelectionProps> = ({
  employeeRecords,
  selectedOption,
  setSelectedOption,
  selectedRecords,
  handleRecordSelection,
  printOptions
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToSelectedItem = (index: number) => {
    if (dropdownRef.current && index >= 0) {
      const selectedElement = dropdownRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  };

  return (
    <>
      {/* Print Options */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Choose how you want to select employees for printing:
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

      {/* Employee Records Dropdown */}
      {selectedOption === 'selected' && (
        <div className="mb-6">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Select Employees to Include ({employeeRecords.length} total)
            </h4>
          </div>

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (!isDropdownOpen) {
                    setIsDropdownOpen(true);
                    setSelectedIndex(0);
                  }
                } else if (e.key === 'Escape') {
                  setIsDropdownOpen(false);
                  setSelectedIndex(-1);
                }
              }}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue"
            >
              <span className="text-gray-900">
                {selectedRecords.size === 0 
                  ? 'Select employees to include...' 
                  : selectedRecords.size === 1
                    ? employeeRecords.find(record => selectedRecords.has(record.id || `emp_${record.name}`))?.name || 
                      'Selected employee'
                    : selectedRecords.size === employeeRecords.length
                      ? 'All employees selected'
                      : `${selectedRecords.size} employees selected`
                }
              </span>
              <SelectChevronDown />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const newIndex = selectedIndex < employeeRecords.length - 1 ? selectedIndex + 1 : selectedIndex;
                    setSelectedIndex(newIndex);
                    scrollToSelectedItem(newIndex);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
                    setSelectedIndex(newIndex);
                    if (newIndex >= 0) {
                      scrollToSelectedItem(newIndex);
                    }
                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    if (selectedIndex >= 0 && employeeRecords[selectedIndex]) {
                      handleRecordSelection(employeeRecords[selectedIndex].id || `emp_${employeeRecords[selectedIndex].name}`);
                      // Keep the selection highlighted for continued navigation
                    }
                  } else if (e.key === 'Escape') {
                    setIsDropdownOpen(false);
                    setSelectedIndex(-1);
                  }
                }}
                tabIndex={-1}
              >
                {employeeRecords.map((record, index) => (
                  <div
                    key={record.id || `emp_${record.name}`}
                    className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleRecordSelection(record.id || `emp_${record.name}`)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecords.has(record.id || `emp_${record.name}`)}
                      onChange={() => handleRecordSelection(record.id || `emp_${record.name}`)}
                      className="rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue mr-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {record.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="mr-3">Dept: {record.department}</span>
                        <span className="mr-3">Score: {record.score}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Excellent' ? 'text-green-600 bg-green-50 border-green-200' :
                          record.status === 'Good' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          record.status === 'Fair' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          'text-red-600 bg-red-50 border-red-200'
                        }`}>
                          {record.status}
                        </span>
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

export default PerformanceTableSelection;
