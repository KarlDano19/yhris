'use client';

import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
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
import useAddLocationToYP from './hooks/location/useAddLocationToYP';
import useAddDepartmentToYP from './hooks/department/useAddDepartmentToYP';
import useAddPositionToYP from './hooks/position/useAddPositionToYP';
import useGetLocationItems from './hooks/location/useGetLocationItems';
import useGetDepartmentItems from './hooks/department/useGetDepartmentItems';
import useGetPositionItems from './hooks/position/useGetPositionItems';
import useAddEmployeeStatusToYP from './hooks/employee-status/useAddEmployeeStatusToYP';
import useSyncEmployeeStatus from './hooks/employee-status/useSyncEmployeeStatus';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import useGetEmployeeStatusItems from './hooks/employee-status/useGetEmployeeStatusItems';
import EmployeeId from './tabs/Employee-id';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState('location');
  const queryClient = useQueryClient();
  const cachedUserDetails = queryClient.getQueryCache().find(['userDetailsCache']) as { state: { data: any } | undefined };
  const [loginType, setLoginType] = useState<string>('');

  useEffect(() => {
    if (cachedUserDetails?.state?.data) {
      setLoginType(cachedUserDetails.state.data.login_type);
    }
  }, [cachedUserDetails]);

  // Sync hooks
  const { mutate: syncLocation, isLoading: isSyncLocationLoading } = useSyncLocation();
  const { mutate: syncDepartment, isLoading: isSyncDepartmentLoading } = useSyncDepartment();
  const { mutate: syncPosition, isLoading: isSyncPositionLoading } = useSyncPosition();
  const { mutate: syncEmployeeStatus, isLoading: isSyncEmployeeStatusLoading } = useSyncEmployeeStatus();

  // Add to YP hooks
  const { mutate: addLocationToYP, isLoading: isAddLocationToYPLoading } = useAddLocationToYP();
  const { mutate: addDepartmentToYP, isLoading: isAddDepartmentToYPLoading } = useAddDepartmentToYP();
  const { mutate: addPositionToYP, isLoading: isAddPositionToYPLoading } = useAddPositionToYP();
  const { mutate: addEmployeeStatusToYP, isLoading: isAddEmployeeStatusToYPLoading } = useAddEmployeeStatusToYP();

  // Data fetching hooks (get all items without pagination)
  const { data: allLocationsData } = useGetLocationItems({ pageSize: 1000, currentPage: 1 });
  const { data: allDepartmentsData } = useGetDepartmentItems({ pageSize: 1000, currentPage: 1 });
  const { data: allPositionsData } = useGetPositionItems({ pageSize: 1000, currentPage: 1 });
  const { data: allEmployeeStatusesData } = useGetEmployeeStatusItems({ pageSize: 1000, currentPage: 1 });
  
  // Track overall sync state
  const isSyncingAll = isSyncLocationLoading || isSyncDepartmentLoading || isSyncPositionLoading ||
                      isAddLocationToYPLoading || isAddDepartmentToYPLoading || isAddPositionToYPLoading;

  const handleSyncAll = async () => {
    // Get all items
    const locations = allLocationsData?.records || [];
    const departments = allDepartmentsData?.records || [];
    const positions = allPositionsData?.records || [];
    const employeeStatuses = allEmployeeStatusesData?.records || [];

    const totalOperations = locations.length + departments.length + positions.length + employeeStatuses.length + 3; // +3 for sync operations
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

    // Add all items to YP first, then sync
    // Add Locations to YP
    locations.forEach((location: any) => {
      addLocationToYP({ id: location.id, data: { name: location.name } }, {
        onSuccess: (data) => {
          if (data.status === "already_exists") {
            toast.custom(() => <CustomToast message={data.message || `Location "${location.name}" already exists in payroll system`} type='info' />, { duration: 3000 });
            onOperationComplete('Location', `"${location.name}" already exists in YP`, true, data.message);
          } else {
            toast.custom(() => <CustomToast message={data.message || `Location "${location.name}" added to payroll system successfully`} type='success' />, { duration: 3000 });
            onOperationComplete('Location', `"${location.name}" added to YP`, true, data.message);
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={`Failed to add location "${location.name}": ${err.message || err}`} type='error' />, { duration: 4000 });
          onOperationComplete('Location', `"${location.name}" add failed`, false, err.message || err);
        },
      });
    });

    // Add Departments to YP
    departments.forEach((department: any) => {
      addDepartmentToYP({ id: department.id, data: { name: department.name } }, {
        onSuccess: (data) => {
          if (data.status === "already_exists") {
            toast.custom(() => <CustomToast message={data.message || `Department "${department.name}" already exists in payroll system`} type='info' />, { duration: 3000 });
            onOperationComplete('Department', `"${department.name}" already exists in YP`, true, data.message);
          } else {
            toast.custom(() => <CustomToast message={data.message || `Department "${department.name}" added to payroll system successfully`} type='success' />, { duration: 3000 });
            onOperationComplete('Department', `"${department.name}" added to YP`, true, data.message);
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={`Failed to add department "${department.name}": ${err.message || err}`} type='error' />, { duration: 4000 });
          onOperationComplete('Department', `"${department.name}" add failed`, false, err.message || err);
        },
      });
    });

    // Add Positions to YP
    positions.forEach((position: any) => {
      addPositionToYP({ id: position.id, data: { name: position.name } }, {
        onSuccess: (data) => {
          if (data.status === "already_exists") {
            toast.custom(() => <CustomToast message={data.message || `Position "${position.name}" already exists in payroll system`} type='info' />, { duration: 3000 });
            onOperationComplete('Position', `"${position.name}" already exists in YP`, true, data.message);
          } else {
            toast.custom(() => <CustomToast message={data.message || `Position "${position.name}" added to payroll system successfully`} type='success' />, { duration: 3000 });
            onOperationComplete('Position', `"${position.name}" added to YP`, true, data.message);
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={`Failed to add position "${position.name}": ${err.message || err}`} type='error' />, { duration: 4000 });
          onOperationComplete('Position', `"${position.name}" add failed`, false, err.message || err);
        },
      });
    });

    // Add Employee Statuses to YP
    employeeStatuses.forEach((employeeStatus: any) => {
      addEmployeeStatusToYP({ id: employeeStatus.id, data: { name: employeeStatus.name } }, {
        onSuccess: (data) => {
          if (data.status === "already_exists") {
            toast.custom(() => <CustomToast message={data.message || `Employee Status "${employeeStatus.name}" already exists in payroll system`} type='info' />, { duration: 3000 });
            onOperationComplete('Employee Status', `"${employeeStatus.name}" already exists in YP`, true, data.message);
          } else {
            toast.custom(() => <CustomToast message={data.message || `Employee Status "${employeeStatus.name}" added to payroll system successfully`} type='success' />, { duration: 3000 });
            onOperationComplete('Employee Status', `"${employeeStatus.name}" added to YP`, true, data.message);
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={`Failed to add employee status "${employeeStatus.name}": ${err.message || err}`} type='error' />, { duration: 4000 });
          onOperationComplete('Employee Status', `"${employeeStatus.name}" add failed`, false, err.message || err);
        },
      });
    });

    // Then perform sync operations
    syncLocation(undefined, {
      onSuccess: (data) => {
        const message = data.message || 'Location sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Location', 'sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Location sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Location', 'sync', false, errorMessage);
      },
    });

    syncDepartment(undefined, {
      onSuccess: (data) => {
        const message = data.message || 'Department sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Department', 'sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Department sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Department', 'sync', false, errorMessage);
      },
    });

    syncPosition(undefined, {
      onSuccess: (data) => {
        const message = data.message || 'Position sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Position', 'sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Position sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Position', 'sync', false, errorMessage);
      },
    });

    syncEmployeeStatus(undefined, {
      onSuccess: (data) => {
        const message = data.message || 'Employee Status sync completed';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 4000 });
        onOperationComplete('Employee Status', 'sync', true, message);
      },
      onError: (err: any) => {
        const errorMessage = err.message || err;
        toast.custom(() => <CustomToast message={`Employee Status sync failed: ${errorMessage}`} type='error' />, { duration: 5000 });
        onOperationComplete('Employee Status', 'sync', false, errorMessage);
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
            <div className={`flex-shrink-0 ${loginType === 'password' ? 'hidden' : ''}`}>
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
                    Adding & Syncing...
                  </div>
                ) : (
                  'Add All & Sync to YP'
                )}
              </SmartButton>
            </div>
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
