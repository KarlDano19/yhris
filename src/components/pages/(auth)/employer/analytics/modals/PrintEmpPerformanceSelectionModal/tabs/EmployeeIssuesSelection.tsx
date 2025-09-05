import React, { useState } from 'react';

import SelectChevronDown from '@/svg/SelectChevronDown';

interface EmployeeIssueRecord {
  id: string;
  name: string;
  department: string;
  issueType: string;
  dateReported: string;
  status: string;
}

interface EmployeeIssuesSelectionProps {
  employeeIssueRecords: EmployeeIssueRecord[];
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

const EmployeeIssuesSelection: React.FC<EmployeeIssuesSelectionProps> = ({
  employeeIssueRecords,
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
          Choose how you want to select employee issues for printing:
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

      {/* Employee Issue Records Dropdown */}
      {selectedOption === 'selected' && (
        <div className="mb-6">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Select Employee Issues to Include ({employeeIssueRecords.length} total)
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
                  ? 'Select employee issues to include...' 
                  : selectedRecords.size === 1
                    ? employeeIssueRecords.find(record => selectedRecords.has(record.id))?.name || 
                      'Selected issue'
                    : selectedRecords.size === employeeIssueRecords.length
                      ? 'All employee issues selected'
                      : `${selectedRecords.size} employee issues selected`
                }
              </span>
              <SelectChevronDown />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {employeeIssueRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleRecordSelection(record.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecords.has(record.id)}
                      onChange={() => handleRecordSelection(record.id)}
                      className="rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue mr-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {record.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="mr-3">Dept: {record.department}</span>
                        <span className="mr-3">Type: {record.issueType}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Resolved' ? 'text-green-600 bg-green-50 border-green-200' :
                          record.status === 'Under Hearing' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          record.status === 'NTE Issued' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          'text-red-600 bg-red-50 border-red-200'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Reported: {record.dateReported}
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

export default EmployeeIssuesSelection;
