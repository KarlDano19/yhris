import React, { useState, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { PrinterIcon, XCircleIcon, CheckIcon } from '@heroicons/react/24/solid';

import SelectChevronDown from '@/svg/SelectChevronDown';

interface JobRecord {
  id: number;
  job_title?: string;
  numberOfApplicants?: number;
  applicant_applied_no?: number;
  status?: string;
  is_active?: boolean;
  dateJobOpened?: string;
  created_at?: string;
  dateJobClosed?: string;
  updated_at?: string;
  turnaroundTime?: number;
  currentPipeline?: string;
}

interface PrintRolePipelineRecordsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedOption: string, selectedRecords?: number[], customRecords?: number) => void;
  currentPageSize: number;
  isLoading?: boolean;
  jobRecords?: JobRecord[];
}

const PrintRolePipelineRecordsSelectionModal: React.FC<PrintRolePipelineRecordsSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPageSize,
  isLoading = false,
  jobRecords = []
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConfirm = () => {
    let selectedIds: number[] = [];
    
    switch (selectedOption) {
      case 'all':
        // Use all records
        selectedIds = jobRecords.map(record => record.id);
        break;
      case 'selected':
        // Use manually selected records
        selectedIds = Array.from(selectedRecords);
        break;
    }
    
    onConfirm(selectedOption, selectedIds, undefined);
  };

  const handleClose = () => {
    setSelectedOption('all');
    setSelectedRecords(new Set());
    setIsDropdownOpen(false);
    onClose();
  };

  const handleRecordSelection = (recordId: number) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const formatTurnaroundTime = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const printOptions = [
    {
      id: 'all',
      title: 'All Records',
      description: `Print all ${jobRecords.length} records`,
      value: jobRecords.length
    },
    {
      id: 'selected',
      title: 'Selected Records',
      description: `Print ${selectedRecords.size} manually selected records`,
      value: selectedRecords.size
    }
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <div className="flex bg-savoy-blue p-4 items-center gap-4">
                  <PrinterIcon className="w-6 h-6 text-white" />
                  <h3 className="flex-1 text-white font-semibold">
                    Print Role Pipeline Records Selection
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 text-white cursor-pointer"
                    onClick={handleClose}
                  />
                </div>

                <div className="p-6">
                  {/* Print Options */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Choose how you want to select records for printing:
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

                  {/* Job Records Dropdown */}
                  {selectedOption === 'selected' && (
                    <div className="mb-6">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Select Roles to Include ({jobRecords.length} total)
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
                              ? 'Select roles to include...' 
                              : selectedRecords.size === 1
                                ? jobRecords.find(record => selectedRecords.has(record.id))?.job_title || 
                                  'Selected job'
                                : selectedRecords.size === jobRecords.length
                                  ? 'All jobs selected'
                                  : `${selectedRecords.size} jobs selected`
                            }
                          </span>
                            <SelectChevronDown />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {jobRecords.map((record) => (
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
                                    {record.job_title || 'Unknown Role'}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                                      (record.status === 'Ongoing' || record.is_active) 
                                        ? 'text-blue-600 bg-blue-50 border-blue-200' 
                                        : 'text-red-600 bg-red-50 border-red-200'
                                    }`}>
                                      {record.status || (record.is_active ? 'Ongoing' : 'Closed')}
                                    </span>
                                    <span className="mr-3">Applicants: { record.applicant_applied_no || 0}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
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

export default PrintRolePipelineRecordsSelectionModal;
