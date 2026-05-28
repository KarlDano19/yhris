'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import Location from './tabs/Location';
import Department from './tabs/Department';
import Position from './tabs/Position';
import EmployeeStatus from './tabs/EmployeeStatus';

import CustomToast from '@/components/CustomToast';
import BackButton from '@/components/BackButton';
import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import useSyncLocation from './hooks/location/useSyncLocation';
import useSyncDepartment from './hooks/department/useSyncDepartment';
import useSyncPosition from './hooks/position/useSyncPosition';
import useSyncEmployeeStatus from './hooks/employee-status/useSyncEmployeeStatus';
import useSyncDepartmentFromYP from './hooks/department/useSyncDepartmentFromYP';
import useSyncLocationFromYP from './hooks/location/useSyncLocationFromYP';
import useSyncPositionFromYP from './hooks/position/useSyncPositionFromYP';
import useSyncEmployeeStatusFromYP from './hooks/employee-status/useSyncEmployeeStatusFromYP';

import EmployeeId from './tabs/Employee-id';

const Content = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription: boolean }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('location');

  // Bulk sync hooks - TO YP
  const { mutate: syncLocation, isLoading: isSyncLocationLoading } = useSyncLocation();
  const { mutate: syncDepartment, isLoading: isSyncDepartmentLoading } = useSyncDepartment();
  const { mutate: syncPosition, isLoading: isSyncPositionLoading } = useSyncPosition();
  const { mutate: syncEmployeeStatus, isLoading: isSyncEmployeeStatusLoading } = useSyncEmployeeStatus();

  // Sync hooks - FROM YP
  const { mutate: syncDepartmentFromYP, isLoading: isSyncDepartmentFromYPLoading } = useSyncDepartmentFromYP();
  const { mutate: syncLocationFromYP, isLoading: isSyncLocationFromYPLoading } = useSyncLocationFromYP();
  const { mutate: syncPositionFromYP, isLoading: isSyncPositionFromYPLoading } = useSyncPositionFromYP();
  const { mutate: syncEmployeeStatusFromYP, isLoading: isSyncEmployeeStatusFromYPLoading } = useSyncEmployeeStatusFromYP();

  // Track overall sync state
  const isSyncingAll =
    isSyncLocationLoading || isSyncDepartmentLoading ||
    isSyncPositionLoading || isSyncEmployeeStatusLoading ||
    isSyncLocationFromYPLoading || isSyncDepartmentFromYPLoading ||
    isSyncPositionFromYPLoading || isSyncEmployeeStatusFromYPLoading;

  const handleSyncAll = async () => {
    // 8 operations total: 4 FROM YP + 4 TO YP
    const totalOperations = 8;
    let completedCount = 0;
    const errors: string[] = [];
    const successes: string[] = [];

    const onOperationComplete = (type: string, operation: string, success: boolean, message?: string) => {
      completedCount++;

      if (success) {
        successes.push(`${type} ${operation}`);
      } else if (message) {
        errors.push(`${type} ${operation}: ${message}`);
      }

      // When first 4 operations complete (FROM YP), start TO YP operations
      if (completedCount === 4) {
        setTimeout(() => executePushToYP(), 500);
      }

      // Show final result when all operations complete
      if (completedCount === totalOperations) {
        showFinalResults();
      }
    };

    const executePullFromYP = () => {
      // 1. Pull departments FROM YP
      syncDepartmentFromYP({ syncType: 'all' }, {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={`Departments FROM YP: ${data.message}`} type='success' />, { duration: 3000 });
          onOperationComplete('Department', 'FROM YP', true, data.message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Department pull failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Department', 'FROM YP', false, errorMessage);
        },
      });

      // 2. Pull locations FROM YP
      syncLocationFromYP({ syncType: 'all' }, {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={`Locations FROM YP: ${data.message}`} type='success' />, { duration: 3000 });
          onOperationComplete('Location', 'FROM YP', true, data.message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Location pull failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Location', 'FROM YP', false, errorMessage);
        },
      });

      // 3. Pull positions FROM YP
      syncPositionFromYP({ syncType: 'all' }, {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={`Positions FROM YP: ${data.message}`} type='success' />, { duration: 3000 });
          onOperationComplete('Position', 'FROM YP', true, data.message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Position pull failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Position', 'FROM YP', false, errorMessage);
        },
      });

      // 4. Pull employee status FROM YP
      syncEmployeeStatusFromYP({ syncType: 'all' }, {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={`Employee Statuses FROM YP: ${data.message}`} type='success' />, { duration: 3000 });
          onOperationComplete('Employee Status', 'FROM YP', true, data.message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Employee Status pull failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Employee Status', 'FROM YP', false, errorMessage);
        },
      });
    };

    const executePushToYP = () => {
      // 5. Push locations TO YP
      syncLocation({}, {
        onSuccess: (data: any) => {
          const summary = data.summary;
          const message = summary
            ? `Location TO YP: ${summary.created} created, ${summary.updated} updated`
            : data.message || 'Location push completed';
          toast.custom(() => <CustomToast message={message} type='success' />, { duration: 3000 });
          onOperationComplete('Location', 'TO YP', true, message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Location push failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Location', 'TO YP', false, errorMessage);
        },
      });

      // 6. Push departments TO YP
      syncDepartment({}, {
        onSuccess: (data: any) => {
          const summary = data.summary;
          const message = summary
            ? `Department TO YP: ${summary.created} created, ${summary.updated} updated`
            : data.message || 'Department push completed';
          toast.custom(() => <CustomToast message={message} type='success' />, { duration: 3000 });
          onOperationComplete('Department', 'TO YP', true, message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Department push failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Department', 'TO YP', false, errorMessage);
        },
      });

      // 7. Push positions TO YP
      syncPosition({}, {
        onSuccess: (data: any) => {
          const summary = data.summary;
          const message = summary
            ? `Position TO YP: ${summary.created} created, ${summary.updated} updated`
            : data.message || 'Position push completed';
          toast.custom(() => <CustomToast message={message} type='success' />, { duration: 3000 });
          onOperationComplete('Position', 'TO YP', true, message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Position push failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Position', 'TO YP', false, errorMessage);
        },
      });

      // 8. Push employee status TO YP
      syncEmployeeStatus({}, {
        onSuccess: (data: any) => {
          const summary = data.summary;
          const message = summary
            ? `Employee Status TO YP: ${summary.created} created, ${summary.updated} updated`
            : data.message || 'Employee Status push completed';
          toast.custom(() => <CustomToast message={message} type='success' />, { duration: 3000 });
          onOperationComplete('Employee Status', 'TO YP', true, message);
        },
        onError: (err: any) => {
          const errorMessage = err.message || err;
          toast.custom(() => <CustomToast message={`Employee Status push failed: ${errorMessage}`} type='error' />, { duration: 3000 });
          onOperationComplete('Employee Status', 'TO YP', false, errorMessage);
        },
      });
    };

    const showFinalResults = () => {
      if (errors.length === 0) {
        toast.custom(() => <CustomToast message={`Bidirectional sync completed successfully! (${successes.length} operations)`} type='success' />, { duration: 6000 });
      } else if (successes.length > 0) {
        toast.custom(() => <CustomToast message={`Sync completed with ${successes.length} successes and ${errors.length} errors. Check details above.`} type='warning' />, { duration: 8000 });
      } else {
        toast.custom(() => <CustomToast message={`Sync failed: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? ` and ${errors.length - 3} more` : ''}`} type='error' />, { duration: 8000 });
      }
    };

    // Start with pulling FROM YP
    executePullFromYP();
  };
  

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <BackButton label="General Settings" href="/settings/general-settings" />
        </div>
        <div className='pl-4 md:pl-10 mb-5'>
          <div className='flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between'>
            <div
              className='overflow-x-auto'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
              <div className='flex gap-2 min-w-max pb-2'>
                <div
                  onClick={() => setActiveTab('location')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'location'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Location
                </div>
                <div
                  onClick={() => setActiveTab('department')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'department'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Department
                </div>
                <div
                  onClick={() => setActiveTab('position')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'position'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Position
                </div>
                <div
                  onClick={() => setActiveTab('employee-status')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'employee-status'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Employee Status
                </div>
                <div
                  onClick={() => setActiveTab('employee-id')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'employee-id'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Employee ID
                </div>
              </div>
            </div>
            
            {/* Sync All Button */}
            {['yahshua-payroll', 'yg-payroll'].includes(loginType) && (
            <div>
              <SmartButton
                id="sync-all-btn"
                onClick={handleSyncAll}
                disabled={isSyncingAll || !hasActiveSubscription}
                className={`px-4 py-2 rounded-md text-sm font-semibold shadow hover:shadow-md focus:shadow-none transition-all duration-200 whitespace-nowrap ${
                  isSyncingAll 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } ${!hasActiveSubscription ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSyncingAll ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Syncing...
                  </div>
                ) : (
                  'Sync All with YP'
                )}
              </SmartButton>
            </div>
            )}
          </div>
        </div>
        {activeTab === 'location' && <Location hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'department' && <Department hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'position' && <Position hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'employee-status' && <EmployeeStatus hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'employee-id' && <EmployeeId />}
      </div>
    </>
  );
};

export default Content;
