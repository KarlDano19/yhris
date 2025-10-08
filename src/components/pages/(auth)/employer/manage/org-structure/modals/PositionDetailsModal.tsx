import React, { Fragment } from 'react';

import 'react-quill/dist/quill.snow.css';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useSetPrimaryEmployee from '../hooks/useSetPrimaryEmployee';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

import { Employee, PositionDetailsModalProps } from '../types';

const PositionDetailsModal: React.FC<PositionDetailsModalProps> = ({ 
  data, 
  primaryEmployee, 
  isVisible,
  onClose
}) => {
  const setPrimaryEmployeeMutation = useSetPrimaryEmployee();

  // Determine avatar type (male/female) - use gender field if available
  const getAvatarType = (employee: Employee | undefined) => {
    if (!employee) return 'male'; // Default
    // Use gender field if available, otherwise fallback to name-based logic
    if (employee.gender) {
      return employee.gender.toLowerCase() === 'female' ? 'female' : 'male';
    }
    // Simple logic based on name as fallback
    return employee.firstname.toLowerCase().includes('a') ? 'female' : 'male';
  };

  const handleSetPrimary = async (employeeId: number) => {
    const orgStructureId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    
    try {
      await setPrimaryEmployeeMutation.mutateAsync({
        orgStructureId: orgStructureId,
        employeeId: employeeId
      });
      
      toast.custom(() => <CustomToast message='Employee will now be displayed in the org chart!' type='success' />, {
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error setting primary employee:', error);
      toast.custom(() => <CustomToast message={error.message || 'Failed to update chart display'} type='error' />, {
        duration: 5000,
      });
    }
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-2xl">
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
                <div className="p-6 space-y-6">
                  {/* Primary Employee Info */}
                  {primaryEmployee && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-savoy-blue overflow-hidden flex-shrink-0">
                        {primaryEmployee.photo ? (
                          <img
                            src={primaryEmployee.photo}
                            alt={`${primaryEmployee.firstname} ${primaryEmployee.lastname}`}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center ${primaryEmployee.photo ? 'hidden' : 'block'}`}
                        >
                          <PlaceholderPicture 
                            gender={getAvatarType(primaryEmployee)} 
                            fillColor="#3B82F6" 
                            width={32} 
                            height={32}
                            style={{ opacity: 0.5 }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800">
                          {primaryEmployee.firstname} {primaryEmployee.lastname}
                        </h4>
                        <p className="text-sm text-blue-700 font-medium">Displayed in Org Chart</p>
                        <p className="text-sm text-gray-500">{primaryEmployee.email}</p>
                      </div>
                    </div>
                  )}

                  {/* All Employees */}
                  {data.employees && data.employees.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {data.employees.length === 1 ? 'Employee' : `All Employees (${data.employees.length})`}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {data.employees.map((employee, index) => {
                          const avatarType = getAvatarType(employee);
                          const isPrimary = primaryEmployee?.id === employee.id;
                          return (
                            <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              {/* Employee Avatar */}
                              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-savoy-blue overflow-hidden flex-shrink-0">
                                {employee.photo ? (
                                  <img
                                    src={employee.photo}
                                    alt={`${employee.firstname} ${employee.lastname}`}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const placeholder = target.nextElementSibling as HTMLElement;
                                      if (placeholder) placeholder.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`w-full h-full flex items-center justify-center ${employee.photo ? 'hidden' : 'block'}`}
                                >
                                  <PlaceholderPicture 
                                    gender={avatarType} 
                                    fillColor="#3B82F6" 
                                    width={24} 
                                    height={24}
                                    style={{ opacity: 0.5 }}
                                  />
                                </div>
                              </div>
                              
                              {/* Employee Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-medium text-gray-800 truncate">
                                    {employee.firstname} {employee.lastname}
                                  </h5>
                                  {isPrimary && (
                                    <span className="text-blue-700 text-xs font-medium bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                      <StarIcon className="w-3 h-3" />
                                      Chart Display
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                                <p className="text-xs text-gray-400 truncate">{employee.mobile}</p>
                              </div>

                              {/* Display in Chart Button */}
                              {!isPrimary && (
                                <button
                                  onClick={() => handleSetPrimary(employee.id)}
                                  disabled={setPrimaryEmployeeMutation.isLoading}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  title="Display this employee in the organizational chart"
                                >
                                  <StarIcon className="w-3.5 h-3.5" />
                                  Display in Chart
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {data.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Position Description</h4>
                      <div 
                        className="text-sm text-gray-600 leading-relaxed ql-editor bg-gray-50 p-4 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      />
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PositionDetailsModal;
