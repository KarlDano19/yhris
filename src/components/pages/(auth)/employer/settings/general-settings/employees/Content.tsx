'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import toast from 'react-hot-toast';

import Location from './tabs/Location';
import Department from './tabs/Department';
import Position from './tabs/Position';
import EmployeeStatus from './tabs/EmployeeStatus';

import CustomToast from '@/components/CustomToast';
import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import useSyncLocation from './hooks/location/useSyncLocation';
import useSyncDepartment from './hooks/department/useSyncDepartment';
import useSyncPosition from './hooks/position/useSyncPosition';
import useSyncEmployeeStatus from './hooks/employee-status/useSyncEmployeeStatus';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import EmployeeId from './tabs/Employee-id';

const Content = ({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState('location');

  // Bulk sync hooks
  const { mutate: syncLocation, isLoading: isSyncLocationLoading } = useSyncLocation();
  const { mutate: syncDepartment, isLoading: isSyncDepartmentLoading } = useSyncDepartment();
  const { mutate: syncPosition, isLoading: isSyncPositionLoading } = useSyncPosition();
  const { mutate: syncEmployeeStatus, isLoading: isSyncEmployeeStatusLoading } = useSyncEmployeeStatus();
  
  // Track overall sync state
  const isSyncingAll = isSyncLocationLoading || isSyncDepartmentLoading || isSyncPositionLoading || isSyncEmployeeStatusLoading;

  const handleSyncAll = async () => {
    // 4 bulk sync operations (location, department, position, employee status)
    const totalOperations = 4;
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

      // Show final result when all operations are complete
      if (completedCount === totalOperations) {
        if (errors.length === 0) {
          toast.custom(() => <CustomToast message={`All data synced successfully! (${successes.length} operations completed)`} type='success' />, { duration: 6000 });
        } else if (successes.length > 0) {
          toast.custom(() => <CustomToast message={`Sync completed with ${successes.length} successes and ${errors.length} errors. Check individual items for details.`} type='warning' />, { duration: 8000 });
        } else {
          toast.custom(() => <CustomToast message={`Sync failed: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? ` and ${errors.length - 3} more errors` : ''}`} type='error' />, { duration: 8000 });
        }
      }
    };

    // Bulk sync locations to payroll (creates/updates all locations in one call)
    syncLocation({}, {
      onSuccess: (data) => {
        const summary = data.summary;
        const message = summary 
          ? `Location bulk sync completed: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`
          : data.message || 'Location bulk sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Location', 'bulk sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Location bulk sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Location', 'bulk sync', false, errorMessage);
      },
    });

    // Bulk sync departments to payroll (creates/updates all departments in one call)
    syncDepartment({}, {
      onSuccess: (data) => {
        const summary = data.summary;
        const message = summary 
          ? `Department bulk sync completed: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`
          : data.message || 'Department bulk sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Department', 'bulk sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Department bulk sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Department', 'bulk sync', false, errorMessage);
      },
    });

    // Bulk sync positions to payroll (creates/updates all positions in one call)
    syncPosition({}, {
      onSuccess: (data) => {
        const summary = data.summary;
        const message = summary 
          ? `Position bulk sync completed: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`
          : data.message || 'Position bulk sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Position', 'bulk sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Position bulk sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Position', 'bulk sync', false, errorMessage);
      },
    });

    // Bulk sync employee statuses to payroll (creates/updates all employee statuses in one call)
    syncEmployeeStatus({}, {
      onSuccess: (data) => {
        const summary = data.summary;
        const message = summary 
          ? `Employee Status bulk sync completed: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`
          : data.message || 'Employee Status bulk sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Employee Status', 'bulk sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Employee Status bulk sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Employee Status', 'bulk sync', false, errorMessage);
      },
    });
  };
  

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
          </Link>
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
                  'Sync All to YP'
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
