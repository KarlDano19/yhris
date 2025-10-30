import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/solid';

interface ExportOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onExport: (option: 'primary' | 'all', usePlaceholders: boolean, excludeAvatars: boolean) => void;
  isExporting: boolean;
  hasEmployees: boolean;
}

const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({
  isVisible,
  onClose,
  onExport,
  isExporting,
  hasEmployees
}) => {
  const [usePlaceholders, setUsePlaceholders] = React.useState(false);
  const [excludeAvatars, setExcludeAvatars] = React.useState(false);

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
                <div className="flex bg-savoy-blue p-3 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-base">
                    Export Options
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-1">Choose how you want to export the organizational chart:</p>
                    <p className="text-xs text-gray-500 mt-1">You'll be able to select which positions to include in the next step.</p>
                  </div>

                  {/* Export Options */}
                  <div className="space-y-3">
                    {/* Primary Employees Only */}
                    <button
                      onClick={() => onExport('primary', usePlaceholders, excludeAvatars)}
                      disabled={isExporting}
                      className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-gray-800">Primary Employees Only</h5>
                        <p className="text-sm text-gray-600">Export showing only the primary employee for each position</p>
                      </div>
                    </button>

                    {/* Show "or" between options when both are available */}
                    {hasEmployees && (
                      <div className="text-center">
                        <span className="text-gray-500 font-medium">or</span>
                      </div>
                    )}

                    {/* All Employees */}
                    {hasEmployees && (
                      <button
                        onClick={() => onExport('all', usePlaceholders, excludeAvatars)}
                        disabled={isExporting}
                        className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <UserGroupIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-semibold text-gray-800">All Employees</h5>
                          <p className="text-sm text-gray-600">Export showing all employees in every position (will enter fullscreen mode)</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Export Options Checkboxes */}
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={excludeAvatars}
                        onChange={(e) => {
                          setExcludeAvatars(e.target.checked);
                          // Auto-uncheck placeholder avatars when text-only is enabled
                          if (e.target.checked) {
                            setUsePlaceholders(false);
                          }
                        }}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm text-gray-800 group-hover:text-gray-900">Text-Only Export (Smaller File Size)</h5>
                        <p className="text-xs text-gray-600 mt-0.5">Export with names only, excluding all avatars and photos to reduce file size</p>
                      </div>
                    </label>

                    {!excludeAvatars && (
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={usePlaceholders}
                          onChange={(e) => setUsePlaceholders(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-gray-800 group-hover:text-gray-900">Use Placeholder Avatars</h5>
                          <p className="text-xs text-gray-600 mt-0.5">Show colored avatars with initials for employees without photos</p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="pt-4">
                    <button
                      onClick={onClose}
                      disabled={isExporting}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
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

export default ExportOptionsModal;
