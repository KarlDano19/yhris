"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from "@heroicons/react/24/solid";

interface ChangesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  versionNumber: string;
  changes: string;
}

export default function ChangesDetailsModal({
  isOpen,
  onClose,
  onViewDetails,
  versionNumber,
  changes,
}: ChangesDetailsModalProps) {
  
  // Format changes summary as bullet points
  const formatChangesSummary = (changesSummary: string) => {
    if (!changesSummary) return 'No changes details available';
    
    // Split by semicolon to get individual change groups
    const changeGroups = changesSummary.split(';').map(group => group.trim()).filter(group => group.length > 0);
    
    if (changeGroups.length === 0) return 'No changes details available';
    
    return (
      <div className="space-y-3">
        {changeGroups.map((group, index) => {
          // Split each group by colon to separate section name from changes
          const [sectionName, ...changesList] = group.split(':');
          const changesText = changesList.join(':').trim();
          
          if (!changesText) {
            // If no colon found, treat the whole group as a single change
            return (
              <div key={index} className="text-sm text-gray-900">
                • {group}
              </div>
            );
          }
          
          // Split changes by comma to get individual changes
          const individualChanges = changesText.split(',').map(change => change.trim()).filter(change => change.length > 0);
          
          return (
            <div key={index} className="space-y-1">
              <div className="text-sm font-medium text-gray-800">
                {sectionName}:
              </div>
              <ul className="list-none pl-4 space-y-1">
                {individualChanges.map((change, changeIndex) => (
                  <li key={changeIndex} className="text-sm text-gray-900 flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={()=>{}}
      >
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center rounded-t-lg">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      Version Changes Details
                    </h3>
                    <p className="text-white text-sm opacity-90 mt-1">
                      {versionNumber}
                    </p>
                  </div>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer hover:text-gray-200"
                    onClick={onClose}
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-900">
                      {formatChangesSummary(changes)}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                    {onViewDetails && (
                      <button
                        onClick={onViewDetails}
                        className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue border border-transparent rounded-md hover:bg-savoy-blue-dark"
                      >
                        View Full Details
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
