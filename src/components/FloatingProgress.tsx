'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useSyncEmployees from './hooks/useSyncEmployees';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SyncingIcon from '@/svg/SyncingIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

type SyncOption = 'inactive' | 'active' | 'all';

const FloatingProgress = () => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as {
    state: { data: any } | undefined;
  };
  const [isProgressShow, setShowProgress] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SyncOption>('all');
  const { mutate: syncEmployees, isLoading: isSyncingEmployees } = useSyncEmployees();

  const handleSyncEmployees = () => {
    const callBackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        setShowProgress(false);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    // Pass the selectedOption to the sync function
    syncEmployees({ syncType: selectedOption }, callBackReq);
  };

  const handleCancel = () => {
    setShowProgress(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isProgressShow && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCancel}
        />
      )}
      
      {/* Floating button */}
      <div className='fixed z-50 bottom-4 left-6' onClick={() => setShowProgress(!isProgressShow)}>
        <div
          className={`${
            !isProgressShow ? 'flex' : 'hidden'
          } static bg-[#2c3e56fb] w-16 h-16 justify-center items-center rounded-full cursor-pointer hover:bg-[#2c3e56] transition-colors`}
        >
          <SyncingIcon />
        </div>
      </div>

      {/* Sync Dialog */}
      {isProgressShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-lg">
              <h2 className="text-lg font-semibold text-white">Sync Employee List</h2>
              <button
                onClick={handleCancel}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Sync Confirmation Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Sync Confirmation</h3>
                    <p className="text-sm text-blue-700">
                      Choose which employee records to sync between YP and HRIS systems.
                    </p>
                  </div>
                </div>
              </div>

              {/* Radio Options */}
              <div className="space-y-4">
                {/* Inactive Employees */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="syncOption"
                    value="inactive"
                    checked={selectedOption === 'inactive'}
                    onChange={(e) => setSelectedOption(e.target.value as SyncOption)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Inactive Employees</div>
                    <div className="text-sm text-gray-600">Sync only inactive employee records</div>
                  </div>
                </label>

                {/* Active Employees */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="syncOption"
                    value="active"
                    checked={selectedOption === 'active'}
                    onChange={(e) => setSelectedOption(e.target.value as SyncOption)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Active Employees</div>
                    <div className="text-sm text-gray-600">Sync only active employee records</div>
                  </div>
                </label>

                {/* Sync All */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="syncOption"
                    value="all"
                    checked={selectedOption === 'all'}
                    onChange={(e) => setSelectedOption(e.target.value as SyncOption)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Sync All</div>
                    <div className="text-sm text-gray-600">Sync all employee records (active & inactive)</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isSyncingEmployees}
              >
                Cancel
              </button>
              <button
                onClick={handleSyncEmployees}
                disabled={isSyncingEmployees}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSyncingEmployees && (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                )}
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingProgress;