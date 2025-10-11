import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/solid';

import { PositionActionModalProps } from '../types';

const PositionActionModal: React.FC<PositionActionModalProps> = ({ 
  data, 
  primaryEmployee,
  isVisible,
  onClose,
  onViewDetails,
  onShowEmployees,
  isExpanded = false
}) => {
  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-md">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-lg">
                    {data.position_name}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Position Info - only show if there are employees */}
                  {primaryEmployee && data.employees && data.employees.length > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        {primaryEmployee.firstname} {primaryEmployee.lastname}
                      </h4>
                      <p className="text-sm text-gray-600">{primaryEmployee.email}</p>
                    </div>
                  )}

                  {/* Only show this text if there are employees to interact with */}
                  {data.employees && data.employees.length > 0 && (
                    <div className="text-center mb-6">
                      <p className="text-gray-600 mb-4">What would you like to do with this position?</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* View Details Button - only show if there are employees */}
                    {data.employees && data.employees.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          onViewDetails();
                        }}
                        className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <EyeIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-semibold text-gray-800">View Details</h5>
                          <p className="text-sm text-gray-600">See position information and all employees</p>
                        </div>
                      </button>
                    )}

                    {/* Show Employees Button */}
                    {data.employees && data.employees.filter((employee) => employee.id !== primaryEmployee?.id).length > 0 ? (
                      <button
                        onClick={() => {
                          onClose();
                          onShowEmployees();
                        }}
                        className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <UserGroupIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-semibold text-gray-800">
                            {isExpanded ? 'Hide Employees' : 'Show Employees'}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {isExpanded 
                              ? 'Hide all employees from the chart view'
                              : `Display all ${data.employees.filter((employee) => employee.id !== primaryEmployee?.id).length} other employees in the chart`
                            }
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <UserGroupIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          {data.employees && data.employees.length > 0 
                            ? 'Only the primary employee is assigned to this position'
                            : 'No employees are currently assigned to this position'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="pt-4">
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
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

export default PositionActionModal;
