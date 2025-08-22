import React, { useState, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { PrinterIcon, XCircleIcon } from '@heroicons/react/24/solid';

import PerformanceRateSelection from './tabs/PerformanceRateSelection';
import PerformanceTableSelection from './tabs/PerformanceTableSelection';
import IssueTypeSelection from './tabs/IssueTypeSelection';
import EmployeeIssuesSelection from './tabs/EmployeeIssuesSelection';

interface DepartmentRecord {
  name: string;
  score: number;
  count: number;
  color: string;
}

interface EmployeeRecord {
  name: string;
  department: string;
  score: string;
  lastEvaluation: string;
  status: string;
}

interface IssueTypeRecord {
  reason: string;
  count: number;
  percentage: string;
  color: string;
}

interface EmployeeIssueRecord {
  name: string;
  department: string;
  issueType: string;
  dateReported: string;
  status: string;
}

interface PrintEmpPerformanceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    selectedOption: string, 
    selectedRecords?: string[], 
    customRecords?: number,
    allSelections?: {
      departments: { option: string; records: string[] };
      employees: { option: string; records: string[] };
      issueTypes: { option: string; records: string[] };
      employeeIssues: { option: string; records: string[] };
    }
  ) => void;
  isLoading?: boolean;
  departmentRecords?: DepartmentRecord[];
  employeeRecords?: EmployeeRecord[];
  issueTypeRecords?: IssueTypeRecord[];
  employeeIssueRecords?: EmployeeIssueRecord[];
  activeSubTab?: number;
}

const PrintEmpPerformanceSelectionModal: React.FC<PrintEmpPerformanceSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  departmentRecords = [],
  employeeRecords = [],
  issueTypeRecords = [],
  employeeIssueRecords = [],
  activeSubTab = 1
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [currentSelectionStep, setCurrentSelectionStep] = useState<number>(1);
  
  // Store selections for each step
  const [stepSelections, setStepSelections] = useState<{
    [key: number]: {
      selectedOption: string;
      selectedRecords: Set<string>;
    };
  }>({});

  const handleConfirm = () => {
    // Save current step selections before collecting all
    const updatedStepSelections = {
      ...stepSelections,
      [currentSelectionStep]: {
        selectedOption,
        selectedRecords
      }
    };
    
    // Collect all selections from all steps, including current step
    const allSelections = {
      step1: {
        selectedOption: currentSelectionStep === 1 ? selectedOption : (updatedStepSelections[1]?.selectedOption || 'all'),
        selectedRecords: currentSelectionStep === 1 ? selectedRecords : (updatedStepSelections[1]?.selectedRecords || new Set())
      },
      step2: {
        selectedOption: currentSelectionStep === 2 ? selectedOption : (updatedStepSelections[2]?.selectedOption || 'all'),
        selectedRecords: currentSelectionStep === 2 ? selectedRecords : (updatedStepSelections[2]?.selectedRecords || new Set())
      },
      step3: {
        selectedOption: currentSelectionStep === 3 ? selectedOption : (updatedStepSelections[3]?.selectedOption || 'all'),
        selectedRecords: currentSelectionStep === 3 ? selectedRecords : (updatedStepSelections[3]?.selectedRecords || new Set())
      },
      step4: {
        selectedOption: currentSelectionStep === 4 ? selectedOption : (updatedStepSelections[4]?.selectedOption || 'all'),
        selectedRecords: currentSelectionStep === 4 ? selectedRecords : (updatedStepSelections[4]?.selectedRecords || new Set())
      }
    };
    

    
    // Convert selections to arrays for the parent component
    const departmentSelections = allSelections.step1.selectedOption === 'all' 
      ? departmentRecords.map(record => record.name)
      : Array.from(allSelections.step1.selectedRecords);
      
    const employeeSelections = allSelections.step2.selectedOption === 'all'
      ? employeeRecords.map(record => record.name)
      : Array.from(allSelections.step2.selectedRecords);
      
    const issueTypeSelections = allSelections.step3.selectedOption === 'all'
      ? issueTypeRecords.map(record => record.reason)
      : Array.from(allSelections.step3.selectedRecords);
      
    const employeeIssueSelections = allSelections.step4.selectedOption === 'all'
      ? employeeIssueRecords.map(record => record.name)
      : Array.from(allSelections.step4.selectedRecords);
    

    
    // Pass all selections to the parent component
    onConfirm('all', [], 4, {
      departments: { option: allSelections.step1.selectedOption, records: departmentSelections },
      employees: { option: allSelections.step2.selectedOption, records: employeeSelections },
      issueTypes: { option: allSelections.step3.selectedOption, records: issueTypeSelections },
      employeeIssues: { option: allSelections.step4.selectedOption, records: employeeIssueSelections }
    });
    
    // Close the modal after printing
    handleClose();
  };

  const handleClose = () => {
    setSelectedOption('all');
    setSelectedRecords(new Set());
    setCurrentSelectionStep(1);
    setStepSelections({});
    onClose();
  };

  const handleRecordSelection = (recordName: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordName)) {
      newSelected.delete(recordName);
    } else {
      newSelected.add(recordName);
    }
    setSelectedRecords(newSelected);
    
    // Update step selections
    setStepSelections(prev => ({
      ...prev,
      [currentSelectionStep]: {
        selectedOption,
        selectedRecords: newSelected
      }
    }));
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    
    // Update step selections
    setStepSelections(prev => ({
      ...prev,
      [currentSelectionStep]: {
        selectedOption: option,
        selectedRecords
      }
    }));
  };

  const loadStepSelections = (step: number) => {
    const savedSelections = stepSelections[step];
    if (savedSelections) {
      setSelectedOption(savedSelections.selectedOption);
      setSelectedRecords(savedSelections.selectedRecords);
    } else {
      setSelectedOption('all');
      setSelectedRecords(new Set());
    }
  };

  const getPrintOptions = () => {
    let recordCount: number;
    let recordType: string;
    
    switch (currentSelectionStep) {
      case 1: // Performance Rate
        recordCount = departmentRecords.length;
        recordType = 'departments';
        break;
      case 2: // Performance Table
        recordCount = employeeRecords.length;
        recordType = 'employees';
        break;
      case 3: // Issue Type
        recordCount = issueTypeRecords.length;
        recordType = 'issue types';
        break;
      case 4: // Employee Issues
        recordCount = employeeIssueRecords.length;
        recordType = 'employee issues';
        break;
      default:
        recordCount = 0;
        recordType = 'records';
    }
    
    return [
      {
        id: 'all',
        title: 'All Records',
        description: `Print all ${recordCount} ${recordType}`,
        value: recordCount
      },
      {
        id: 'selected',
        title: 'Selected Records',
        description: `Print ${selectedRecords.size} manually selected ${recordType}`,
        value: selectedRecords.size
      }
    ];
  };

  const renderSubTabContent = () => {
    const printOptions = getPrintOptions();
    
    switch (currentSelectionStep) {
      case 1: // Performance Rate
        return (
          <PerformanceRateSelection
            departmentRecords={departmentRecords}
            selectedOption={selectedOption}
            setSelectedOption={handleOptionChange}
            selectedRecords={selectedRecords}
            handleRecordSelection={handleRecordSelection}
            printOptions={printOptions}
          />
        );
      case 2: // Performance Table
        return (
          <PerformanceTableSelection
            employeeRecords={employeeRecords}
            selectedOption={selectedOption}
            setSelectedOption={handleOptionChange}
            selectedRecords={selectedRecords}
            handleRecordSelection={handleRecordSelection}
            printOptions={printOptions}
          />
        );
      case 3: // Issue Type
        return (
          <IssueTypeSelection
            issueTypeRecords={issueTypeRecords}
            selectedOption={selectedOption}
            setSelectedOption={handleOptionChange}
            selectedRecords={selectedRecords}
            handleRecordSelection={handleRecordSelection}
            printOptions={printOptions}
          />
        );
      case 4: // Employee Issues
        return (
          <EmployeeIssuesSelection
            employeeIssueRecords={employeeIssueRecords}
            selectedOption={selectedOption}
            setSelectedOption={handleOptionChange}
            selectedRecords={selectedRecords}
            handleRecordSelection={handleRecordSelection}
            printOptions={printOptions}
          />
        );
      // Add other sub-tabs here as they are implemented
      default:
        return (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600 mb-2">Coming Soon</div>
            <div className="text-sm text-gray-500">Print selection for this tab is under development</div>
          </div>
        );
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center overflow-visible">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl">
                <div className="flex bg-savoy-blue p-4 items-center gap-4">
                  <PrinterIcon className="w-6 h-6 text-white" />
                  <h3 className="flex-1 text-white font-semibold">
                    {currentSelectionStep === 1 && 'Print Performance Rate Selection'}
                    {currentSelectionStep === 2 && 'Print Performance Table Selection'}
                    {currentSelectionStep === 3 && 'Print Issue Type Selection'}
                    {currentSelectionStep === 4 && 'Print Employee Issues Selection'}
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 text-white cursor-pointer"
                    onClick={() => onClose()}
                  />
                </div>

                <div className="p-6">
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`flex items-center ${currentSelectionStep >= 1 ? 'text-savoy-blue' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentSelectionStep >= 1 ? 'bg-savoy-blue text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          1
                        </div>
                        <span className="ml-2 text-sm font-medium">Performance Rate</span>
                      </div>
                      <div className={`w-8 h-1 ${currentSelectionStep >= 2 ? 'bg-savoy-blue' : 'bg-gray-200'}`}></div>
                      <div className={`flex items-center ${currentSelectionStep >= 2 ? 'text-savoy-blue' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentSelectionStep >= 2 ? 'bg-savoy-blue text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium">Performance Table</span>
                      </div>
                      <div className={`w-8 h-1 ${currentSelectionStep >= 3 ? 'bg-savoy-blue' : 'bg-gray-200'}`}></div>
                      <div className={`flex items-center ${currentSelectionStep >= 3 ? 'text-savoy-blue' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentSelectionStep >= 3 ? 'bg-savoy-blue text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          3
                        </div>
                        <span className="ml-2 text-sm font-medium">Issue Type</span>
                      </div>
                      <div className={`w-8 h-1 ${currentSelectionStep >= 4 ? 'bg-savoy-blue' : 'bg-gray-200'}`}></div>
                      <div className={`flex items-center ${currentSelectionStep >= 4 ? 'text-savoy-blue' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentSelectionStep >= 4 ? 'bg-savoy-blue text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          4
                        </div>
                        <span className="ml-2 text-sm font-medium">Employee Issues</span>
                      </div>
                    </div>
                  </div>

                  {renderSubTabContent()}

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      {currentSelectionStep > 1 && (
                        <button
                          onClick={() => {
                            // Save current selections
                            setStepSelections(prev => ({
                              ...prev,
                              [currentSelectionStep]: {
                                selectedOption,
                                selectedRecords
                              }
                            }));
                            
                            // Move to previous step and load its selections
                            const previousStep = currentSelectionStep - 1;
                            setCurrentSelectionStep(previousStep);
                            loadStepSelections(previousStep);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {currentSelectionStep < 4 && (
                        <button
                          onClick={() => {
                            // Save current selections
                            setStepSelections(prev => ({
                              ...prev,
                              [currentSelectionStep]: {
                                selectedOption,
                                selectedRecords
                              }
                            }));
                            
                            // Move to next step and load its selections
                            const nextStep = currentSelectionStep + 1;
                            setCurrentSelectionStep(nextStep);
                            loadStepSelections(nextStep);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-opacity-90 transition-colors"
                        >
                          Next
                        </button>
                      )}
                      {currentSelectionStep === 4 && (
                        <button
                          onClick={handleConfirm}
                          disabled={isLoading || (selectedOption === 'selected' && selectedRecords.size === 0)}
                          className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <PrinterIcon className="w-4 h-4" />
                              Print Report
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PrintEmpPerformanceSelectionModal;
