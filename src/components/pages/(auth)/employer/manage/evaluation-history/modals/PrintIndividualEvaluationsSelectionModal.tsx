import React, { useState, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { PrinterIcon, XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

interface EvaluationRecord {
  id: number;
  employee_name: string;
  date_of_evaluation: string;
  evaluation_period: string;
  evaluation_form: string;
  form_total_score: number;
  max_total_score: number;
  passing_score: number;
}

interface PrintIndividualEvaluationsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedOption: string, selectedForms?: string[]) => void;
  isLoading?: boolean;
  evaluationRecords?: EvaluationRecord[];
}

const PrintIndividualEvaluationsSelectionModal: React.FC<PrintIndividualEvaluationsSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  evaluationRecords = []
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique evaluation forms from the records
  const uniqueForms = Array.from(new Set(evaluationRecords.map(record => record.evaluation_form)))
    .sort((a, b) => a.localeCompare(b));

  // Function to scroll selected item into view
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

  const handleConfirm = () => {
    let formsToInclude: string[] = [];
    
    switch (selectedOption) {
      case 'all':
        // Use all forms
        formsToInclude = uniqueForms;
        break;
      case 'selected':
        // Use manually selected forms
        formsToInclude = Array.from(selectedForms);
        break;
    }
    
    onConfirm(selectedOption, formsToInclude);

    // Close the modal after printing
    handleClose();
  };

  const handleClose = () => {
    setSelectedOption('all');
    setSelectedForms(new Set());
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    onClose();
  };

  const handleFormSelection = (formName: string) => {
    const newSelected = new Set(selectedForms);
    if (newSelected.has(formName)) {
      newSelected.delete(formName);
    } else {
      newSelected.add(formName);
    }
    setSelectedForms(newSelected);
  };

  // Count records per evaluation form
  const getFormRecordCount = (formName: string) => {
    return evaluationRecords.filter(record => record.evaluation_form === formName).length;
  };

  const printOptions = [
    {
      id: 'all',
      title: 'All Evaluation Forms',
      description: `Print all ${evaluationRecords.length} evaluation records`,
      value: evaluationRecords.length
    },
    {
      id: 'selected',
      title: 'Selected Evaluation Forms',
      description: `Print ${
        Array.from(selectedForms).reduce((total, formName) => 
          total + getFormRecordCount(formName), 0)
      } records from selected forms`,
      value: selectedForms.size
    }
  ];

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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-2xl">
                <div className="flex bg-savoy-blue p-4 items-center gap-4 rounded-t-lg">
                  <PrinterIcon className="w-6 h-6 text-white" />
                  <h3 className="flex-1 text-white font-semibold">
                    Print Individual Evaluations Selection
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 text-white cursor-pointer"
                    onClick={() => onClose()}
                  />
                </div>

                <div className="p-6">
                  {/* Print Options */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Choose how you want to select evaluation records for printing:
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

                  {/* Evaluation Forms Dropdown */}
                  {selectedOption === 'selected' && (
                    <div className="mb-6">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Select Evaluation Forms to Include ({uniqueForms.length} total)
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
                            {selectedForms.size === 0 
                              ? 'Select evaluation forms to include...' 
                              : selectedForms.size === 1
                                ? Array.from(selectedForms)[0]
                                : selectedForms.size === uniqueForms.length
                                  ? 'All evaluation forms selected'
                                  : `${selectedForms.size} evaluation forms selected`
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
                                const newIndex = selectedIndex < uniqueForms.length - 1 ? selectedIndex + 1 : selectedIndex;
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
                                if (selectedIndex >= 0 && uniqueForms[selectedIndex]) {
                                  handleFormSelection(uniqueForms[selectedIndex]);
                                }
                              } else if (e.key === 'Escape') {
                                setIsDropdownOpen(false);
                                setSelectedIndex(-1);
                              }
                            }}
                            tabIndex={-1}
                          >
                            {uniqueForms.map((formName, index) => {
                              const recordCount = getFormRecordCount(formName);
                              return (
                                <div
                                  key={formName}
                                  className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                    index === selectedIndex 
                                      ? 'bg-blue-100' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleFormSelection(formName)}
                                  onMouseEnter={() => setSelectedIndex(index)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedForms.has(formName)}
                                    onChange={() => handleFormSelection(formName)}
                                    className="rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue mr-3"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {formName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {recordCount} evaluation{recordCount !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading || (selectedOption === 'selected' && selectedForms.size === 0)}
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

export default PrintIndividualEvaluationsSelectionModal;

