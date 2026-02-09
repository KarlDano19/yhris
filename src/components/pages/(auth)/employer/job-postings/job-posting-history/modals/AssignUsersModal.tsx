import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';

import CustomToast from '@/components/CustomToast';

import { XCircleIcon, UserGroupIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number | null;
  open: boolean;
  jobTitle?: string;
};

type T_User = {
  id: number;
  name: string;
  email: string;
};

type T_Assignment = {
  id: number;
  assigned_user: number;
  assigned_user_name: string;
  assigned_user_email: string;
  can_view: boolean;
  can_edit: boolean;
  can_view_applicants: boolean;
};

export default function AssignUsersModal({
  isOpen,
  setIsOpen,
  onAssignmentComplete,
}: {
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  onAssignmentComplete?: () => void;
}) {
  const cancelButtonRef = useRef(null);
  const [availableUsers, setAvailableUsers] = useState<T_User[]>([]);
  const [currentAssignments, setCurrentAssignments] = useState<T_Assignment[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch available users and current assignments
  useEffect(() => {
    if (isOpen.open && isOpen.id) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    if (!isOpen.id) return;
    
    setIsLoadingData(true);
    try {
      // Fetch available users
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/available-users/`, {
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        // The API returns data directly in the root if it's an array
        // or might be wrapped in a data field
        let users = [];
        if (Array.isArray(usersData)) {
          users = usersData;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          users = usersData.data;
        } else if (usersData.results && Array.isArray(usersData.results)) {
          users = usersData.results;
        }
        setAvailableUsers(users);
      }

      // Fetch current assignments
      const assignmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${isOpen.id}/assignments/`, {
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        // Handle different response structures
        let assignments = [];
        if (Array.isArray(assignmentsData)) {
          assignments = assignmentsData;
        } else if (assignmentsData.data && Array.isArray(assignmentsData.data)) {
          assignments = assignmentsData.data;
        } else if (assignmentsData.results && Array.isArray(assignmentsData.results)) {
          assignments = assignmentsData.results;
        }
        setCurrentAssignments(assignments);
        
        // Set currently selected users
        const currentlySelected = assignments.map((a: T_Assignment) => a.assigned_user);
        setSelectedUsers(currentlySelected);
      }
      
    } catch (error) {
      toast.custom(() => <CustomToast message="Error loading assignment data" type="error" />, {
        duration: 5000,
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!isOpen.id) return;
    
    setIsLoading(true);
    
    try {
      const payload = {
        assigned_users: selectedUsers,
        can_view: true,
        can_edit: false,
        can_view_applicants: true,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${isOpen.id}/assignments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Handle different response structures
        const message = result.data?.message || result.message || 'Users assigned successfully';
        
        toast.custom(() => <CustomToast message={message} type="success" />, {
          duration: 5000,
        });
        setIsOpen(null);
        if (onAssignmentComplete) {
          onAssignmentComplete();
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign users');
      }
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message} type="error" />, {
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(user => user.id));
    }
  };

  if (!isOpen.open) return null;

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="flex bg-savoy-blue p-4 items-center">
                  <UserGroupIcon className="h-6 w-6 text-white mr-2" />
                  <h3 className="flex-1 text-white font-semibold">
                    Assign Users to Job: {isOpen.jobTitle || `#${isOpen.id}`}
                  </h3>
                  <XCircleIcon 
                    className="w-8 h-8 text-white cursor-pointer" 
                    onClick={() => setIsOpen(null)} 
                  />
                </div>

                <div className="p-6">
                  {isLoadingData ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-savoy-blue"></div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            Select Users ({selectedUsers.length} selected)
                          </h4>
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-sm text-savoy-blue hover:text-blue-700 font-medium"
                          >
                            {selectedUsers.length === availableUsers.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                          {availableUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No other users available for assignment
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {availableUsers.map((user) => (
                                <label
                                  key={user.id}
                                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserToggle(user.id)}
                                    className="h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded"
                                  />
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {currentAssignments.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Currently Assigned Users
                          </h4>
                          <div className="bg-gray-50 rounded-md p-3">
                            <div className="text-sm text-gray-600">
                              {currentAssignments.map((assignment) => (
                                <div key={assignment.id} className="flex justify-between py-1">
                                  <span>{assignment.assigned_user_name}</span>
                                  <span className="text-gray-400">{assignment.assigned_user_email}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                          onClick={() => setIsOpen(null)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="bg-savoy-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                        >
                          {isLoading ? 'Assigning...' : 'Assign Users'}
                        </button>
                      </div>
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
}
