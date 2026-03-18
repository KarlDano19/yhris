'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useSyncEmployees from './hooks/useSyncEmployees';
import useSyncYPUsers from './pages/(auth)/employer/settings/users/accounts/hooks/useSyncYPUsers';
import useSyncDepartment from './pages/(auth)/employer/settings/general-settings/employees/hooks/department/useSyncDepartment';
import usePullEmployeeIdSettingsFromPayroll from './pages/(auth)/employer/settings/general-settings/employees/hooks/employee-id-settings/useSyncEmployeeIdSettings';
import useSyncEmployeeStatus from './pages/(auth)/employer/settings/general-settings/employees/hooks/employee-status/useSyncEmployeeStatus';
import useSyncLocation from './pages/(auth)/employer/settings/general-settings/employees/hooks/location/useSyncLocation';
import useSyncPosition from './pages/(auth)/employer/settings/general-settings/employees/hooks/position/useSyncPosition';
import useSyncDepartmentFromYP from './pages/(auth)/employer/settings/general-settings/employees/hooks/department/useSyncDepartmentFromYP';
import useSyncLocationFromYP from './pages/(auth)/employer/settings/general-settings/employees/hooks/location/useSyncLocationFromYP';
import useSyncPositionFromYP from './pages/(auth)/employer/settings/general-settings/employees/hooks/position/useSyncPositionFromYP';
import useSyncEmployeeStatusFromYP from './pages/(auth)/employer/settings/general-settings/employees/hooks/employee-status/useSyncEmployeeStatusFromYP';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SyncingIcon from '@/svg/SyncingIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

type SyncOption = 'inactive' | 'active' | 'all';

type SyncStep = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
};

const FloatingSyncButton = () => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as {
    state: { data: any } | undefined;
  };
  
  const [isProgressShow, setShowProgress] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SyncOption>('all');
  const [isMasterSyncing, setIsMasterSyncing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initial sync steps configuration
  const initialSteps: SyncStep[] = [
    { id: 'users', name: 'Users', status: 'pending' },
    { id: 'employee-id-settings', name: 'Employee ID Settings', status: 'pending' },
    { id: 'locations-from-yp', name: 'Locations (FROM YP)', status: 'pending' },
    { id: 'locations-to-yp', name: 'Locations (TO YP)', status: 'pending' },
    { id: 'positions-from-yp', name: 'Positions (FROM YP)', status: 'pending' },
    { id: 'positions-to-yp', name: 'Positions (TO YP)', status: 'pending' },
    { id: 'departments-from-yp', name: 'Departments (FROM YP)', status: 'pending' },
    { id: 'departments-to-yp', name: 'Departments (TO YP)', status: 'pending' },
    { id: 'employee-status-from-yp', name: 'Employment Status (FROM YP)', status: 'pending' },
    { id: 'employee-status-to-yp', name: 'Employment Status (TO YP)', status: 'pending' },
    { id: 'employees', name: 'Employees', status: 'pending' },
  ];
  
  const [syncSteps, setSyncSteps] = useState<SyncStep[]>(initialSteps);

  // Initialize all hooks
  const { mutate: syncEmployees } = useSyncEmployees();
  const ypUsersSync = useSyncYPUsers();
  const { mutate: syncDepartment } = useSyncDepartment();
  const { mutate: pullEmployeeIdSettings } = usePullEmployeeIdSettingsFromPayroll();
  const { mutate: syncEmployeeStatus } = useSyncEmployeeStatus();
  const { mutate: syncLocation } = useSyncLocation();
  const { mutate: syncPosition } = useSyncPosition();
  // FROM YP hooks
  const { mutate: syncDepartmentFromYP } = useSyncDepartmentFromYP();
  const { mutate: syncLocationFromYP } = useSyncLocationFromYP();
  const { mutate: syncPositionFromYP } = useSyncPositionFromYP();
  const { mutate: syncEmployeeStatusFromYP } = useSyncEmployeeStatusFromYP();

  // Helper function to update step status
  const updateStepStatus = (stepId: string, status: SyncStep['status'], message?: string) => {
    setSyncSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message }
        : step
    ));
  };

  // Master sync orchestration function
  const handleMasterSync = async () => {
    setIsMasterSyncing(true);
    setCurrentStep(0);
    
    // Reset all steps to pending
    setSyncSteps(initialSteps);
    
    try {
      // Step 1: Sync Users
      setCurrentStep(0);
      updateStepStatus('users', 'running');
      await new Promise<void>((resolve, reject) => {
        ypUsersSync.syncUsers(undefined, {
          onSuccess: (data: any) => {
            updateStepStatus('users', 'success', `${data.sync_results?.users_synced || 0} users synced`);
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('users', 'error', error.message || 'Failed to sync users');
            reject(error);
          }
        });
      });

      // Step 2: Sync Employee ID Settings
      setCurrentStep(1);
      updateStepStatus('employee-id-settings', 'running');
      await new Promise<void>((resolve, reject) => {
        pullEmployeeIdSettings(undefined, {
          onSuccess: (data: any) => {
            updateStepStatus('employee-id-settings', 'success', 'Employee ID settings synced');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('employee-id-settings', 'error', error.message || 'Failed to sync employee ID settings');
            reject(error);
          }
        });
      });

      // Step 3: Pull Locations FROM YP
      setCurrentStep(2);
      updateStepStatus('locations-from-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncLocationFromYP({ syncType: 'all' }, {
          onSuccess: (data: any) => {
            updateStepStatus('locations-from-yp', 'success', data.message || 'Locations pulled from YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('locations-from-yp', 'error', error.message || 'Failed to pull locations from YP');
            reject(error);
          }
        });
      });

      // Step 4: Push Locations TO YP
      setCurrentStep(3);
      updateStepStatus('locations-to-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncLocation({}, {
          onSuccess: (data: any) => {
            updateStepStatus('locations-to-yp', 'success', data.message || 'Locations pushed to YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('locations-to-yp', 'error', error.message || 'Failed to push locations to YP');
            reject(error);
          }
        });
      });

      // Step 5: Pull Positions FROM YP
      setCurrentStep(4);
      updateStepStatus('positions-from-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncPositionFromYP({ syncType: 'all' }, {
          onSuccess: (data: any) => {
            updateStepStatus('positions-from-yp', 'success', data.message || 'Positions pulled from YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('positions-from-yp', 'error', error.message || 'Failed to pull positions from YP');
            reject(error);
          }
        });
      });

      // Step 6: Push Positions TO YP
      setCurrentStep(5);
      updateStepStatus('positions-to-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncPosition({}, {
          onSuccess: (data: any) => {
            updateStepStatus('positions-to-yp', 'success', data.message || 'Positions pushed to YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('positions-to-yp', 'error', error.message || 'Failed to push positions to YP');
            reject(error);
          }
        });
      });

      // Step 7: Pull Departments FROM YP
      setCurrentStep(6);
      updateStepStatus('departments-from-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncDepartmentFromYP({ syncType: 'all' }, {
          onSuccess: (data: any) => {
            updateStepStatus('departments-from-yp', 'success', data.message || 'Departments pulled from YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('departments-from-yp', 'error', error.message || 'Failed to pull departments from YP');
            reject(error);
          }
        });
      });

      // Step 8: Push Departments TO YP
      setCurrentStep(7);
      updateStepStatus('departments-to-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncDepartment({}, {
          onSuccess: (data: any) => {
            updateStepStatus('departments-to-yp', 'success', data.message || 'Departments pushed to YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('departments-to-yp', 'error', error.message || 'Failed to push departments to YP');
            reject(error);
          }
        });
      });

      // Step 9: Pull Employee Status FROM YP
      setCurrentStep(8);
      updateStepStatus('employee-status-from-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncEmployeeStatusFromYP({ syncType: 'all' }, {
          onSuccess: (data: any) => {
            updateStepStatus('employee-status-from-yp', 'success', data.message || 'Employment status pulled from YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('employee-status-from-yp', 'error', error.message || 'Failed to pull employment status from YP');
            reject(error);
          }
        });
      });

      // Step 10: Push Employee Status TO YP
      setCurrentStep(9);
      updateStepStatus('employee-status-to-yp', 'running');
      await new Promise<void>((resolve, reject) => {
        syncEmployeeStatus({}, {
          onSuccess: (data: any) => {
            updateStepStatus('employee-status-to-yp', 'success', data.message || 'Employment status pushed to YP');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('employee-status-to-yp', 'error', error.message || 'Failed to push employment status to YP');
            reject(error);
          }
        });
      });

      // Step 11: Sync Employees (Final step)
      setCurrentStep(10);
      updateStepStatus('employees', 'running');
      await new Promise<void>((resolve, reject) => {
        syncEmployees({ syncType: selectedOption }, {
          onSuccess: (data: any) => {
            updateStepStatus('employees', 'success', data.message || 'Employees synced');
            resolve();
          },
          onError: (error: any) => {
            updateStepStatus('employees', 'error', error.message || 'Failed to sync employees');
            reject(error);
          }
        });
      });

      // All steps completed successfully
      toast.custom(() => <CustomToast message="All systems synced successfully!" type='success' />, { duration: 5000 });
      
      // Auto-close after a delay
      setTimeout(() => {
        setShowProgress(false);
        setIsMasterSyncing(false);
        setSyncSteps(initialSteps);
        setCurrentStep(0);
      }, 3000);

    } catch (error: any) {
      console.error('Master sync failed:', error);
      toast.custom(() => <CustomToast message={`Sync failed: ${error.message || 'Unknown error'}`} type='error' />, { duration: 7000 });
      setIsMasterSyncing(false);
    }
  };

  const handleCancel = () => {
    if (!isMasterSyncing) {
      setShowProgress(false);
      setSyncSteps(initialSteps);
      setCurrentStep(0);
    }
  };

  // Helper function to get step icon
  const getStepIcon = (step: SyncStep) => {
    switch (step.status) {
      case 'running':
        return <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>;
    }
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-lg">
              <h2 className="text-lg font-semibold text-white">Master Sync - All Systems</h2>
              {!isMasterSyncing && (
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {!isMasterSyncing ? (
                <>
                  {/* Sync Confirmation Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-1">Master Sync Configuration</h3>
                        <p className="text-sm text-blue-700">
                          This will perform bidirectional sync for all systems: Users → Employee ID Settings → Locations (FROM/TO YP) → Positions (FROM/TO YP) → Departments (FROM/TO YP) → Employment Status (FROM/TO YP) → Employees.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Radio Options */}
                  <div className="space-y-4">
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
                        <div className="font-medium text-gray-900">Sync Inactive Employees Only</div>
                        <div className="text-sm text-gray-600">Sync all systems + inactive employee records</div>
                      </div>
                    </label>

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
                        <div className="font-medium text-gray-900">Sync Active Employees Only</div>
                        <div className="text-sm text-gray-600">Sync all systems + active employee records</div>
                      </div>
                    </label>

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
                        <div className="font-medium text-gray-900">Complete System Sync</div>
                        <div className="text-sm text-gray-600">Sync all systems + all employee records (recommended)</div>
                      </div>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Sync Progress */}
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Synchronizing Systems...</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Please wait while we sync all systems with Yahshua Payroll
                      </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-3">
                      {syncSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            step.status === 'running' ? 'border-blue-200 bg-blue-50' :
                            step.status === 'success' ? 'border-green-200 bg-green-50' :
                            step.status === 'error' ? 'border-red-200 bg-red-50' :
                            'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {getStepIcon(step)}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              step.status === 'success' ? 'text-green-900' :
                              step.status === 'error' ? 'text-red-900' :
                              step.status === 'running' ? 'text-blue-900' :
                              'text-gray-700'
                            }`}>
                              {step.name}
                            </div>
                            {step.message && (
                              <div className={`text-sm ${
                                step.status === 'success' ? 'text-green-700' :
                                step.status === 'error' ? 'text-red-700' :
                                'text-gray-600'
                              }`}>
                                {step.message}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!isMasterSyncing && (
              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMasterSync}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                >
                  Start Master Sync
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSyncButton;