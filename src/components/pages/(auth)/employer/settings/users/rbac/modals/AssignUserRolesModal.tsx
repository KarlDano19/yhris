import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import CustomToast from '@/components/CustomToast';
import useAssignUserRoles from '../hooks/useAssignUserRoles';
import useGetUserRoles from '../hooks/useGetUserRoles';
import useGetRolesList from '../hooks/useGetRolesList';

import { XCircleIcon, CheckIcon, UserIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/solid';

type T_AssignRoleModalData = {
  id: number;
  open: boolean;
  userName?: string;
};

export default function AssignUserRolesModal({
  refetch, 
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_AssignRoleModalData;
  setIsOpen: Dispatch<T_AssignRoleModalData | null>;
}) {
  const queryClient = useQueryClient();
  const cancelButtonRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { handleSubmit, reset, formState: { errors } } = useForm();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  
  // Clear selectedRoles when modal opens with a new user
  useEffect(() => {
    if (isOpen.open && isOpen.id) {
      setSelectedRoles([]);
      // Clear the query cache for this specific user to force fresh data
      queryClient.removeQueries(['userRoles', isOpen.id]);
    }
  }, [isOpen.open, isOpen.id, queryClient]);
  
  const { data: userRolesData, refetch: refetchUserRoles } = useGetUserRoles(isOpen.id, isOpen.open);
  const { data: rolesData } = useGetRolesList({ pageSize: 1000 });
  const { mutate: assignUserRoles, isLoading: isLoadingAssignRoles } = useAssignUserRoles();

  useEffect(() => {
    if (isOpen.open && isOpen.id) {
      refetchUserRoles();
    }
  }, [isOpen.id, isOpen.open, refetchUserRoles]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (responseData: any) => {
        toast.custom(() => <CustomToast message={responseData.message} type='success' />, {
          duration: 5000,
        });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };

    assignUserRoles({ 
      user_id: isOpen.id, 
      role_ids: selectedRoles 
    }, callbackReq);
  });

  useEffect(() => {
    // Always set selectedRoles based on userRolesData, even if empty
    if (userRolesData?.roles) {
      const roleIds = userRolesData.roles.map((role: any) => role.id);
      setSelectedRoles(roleIds);
    } else if (userRolesData) {
      // User exists but has no roles
      setSelectedRoles([]);
    }
  }, [userRolesData, isOpen.id]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const customCloseModal = () => {
    reset();
    setSelectedRoles([]);
    setButtonRect(null);
    setIsOpen(null);
  };

  // Group roles by type
  const rolesByType = rolesData?.results?.reduce((acc: any, role: any) => {
    // Convert is_system_role boolean to role_type string for grouping
    const type = role.is_system_role ? 'system' : 'custom';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(role);
    return acc;
  }, {}) || {};

  const getRoleTypeLabel = (type: string) => {
    switch (type) {
      case 'system':
        return 'System Roles';
      case 'custom':
        return 'Custom Roles';
      default:
        return 'Other Roles';
    }
  };

  return (
    <>
      <Transition.Root show={isOpen.open} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-3xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <UserIcon className='w-6 h-6 text-white mr-2' />
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Assign Roles to User{isOpen.userName ? `: ${isOpen.userName}` : ''}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4 max-h-[calc(100vh-12rem)] overflow-y-auto'>
                    <form onSubmit={onSubmit}>
                      <div className='px-4 pt-4 pb-6'>
                        <div className={`${Object.keys(errors).length > 0 ? 'block' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
                          <div className='flex'>
                            <div className='flex-shrink-0'>
                              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                            </div>
                            <div className='ml-3'>
                              <h3 className='text-sm font-medium text-red-800'>
                                You cannot proceed due to incomplete fields. Please review.
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Current User Info */}
                        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                          <div className='flex items-center'>
                            <UserIcon className='w-5 h-5 text-gray-500 mr-2' />
                            <span className='text-sm text-gray-700'>
                              Currently assigned {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''}
                              {isOpen.userName && ` to ${isOpen.userName}`}
                            </span>
                          </div>
                        </div>

                        {/* Roles Section */}
                        <div className='mb-8'>
                          <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                            Roles ({selectedRoles.length} selected)
                            <span className='text-red-600'>*</span>
                          </label>
                          
                          <Listbox value={selectedRoles} onChange={setSelectedRoles} multiple>
                            {({ open }) => (
                              <>
                                <div className='relative'>
                                  <Listbox.Button 
                                    ref={buttonRef}
                                    onClick={() => {
                                      if (buttonRef.current) {
                                        setButtonRect(buttonRef.current.getBoundingClientRect());
                                      }
                                    }}
                                    className='relative w-full cursor-default rounded-md bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                  >
                                    <span className='flex flex-wrap gap-1'>
                                      {selectedRoles.length === 0 ? (
                                        <span className='text-gray-400'>Select roles...</span>
                                      ) : selectedRoles.length <= 5 ? (
                                        selectedRoles.map((roleId) => {
                                          const role = rolesData?.results?.find((r: any) => r.id === roleId);
                                          return role ? (
                                            <span
                                              key={roleId}
                                              className='inline-flex items-center gap-x-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'
                                            >
                                              {role.display_name || role.name}
                                              <button
                                                type='button'
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleRole(roleId);
                                                }}
                                                className='group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20'
                                              >
                                                <XMarkIcon className='h-3.5 w-3.5' />
                                              </button>
                                            </span>
                                          ) : null;
                                        })
                                      ) : (
                                        <span className='text-gray-900'>
                                          {selectedRoles.length} roles selected
                                        </span>
                                      )}
                                    </span>
                                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                      <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                    </span>
                                  </Listbox.Button>

                                  {open && buttonRect && createPortal(
                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave='transition ease-in duration-100'
                                      leaveFrom='opacity-100'
                                      leaveTo='opacity-0'
                                    >
                                      <Listbox.Options 
                                        className='fixed overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                                        style={{
                                          top: `${buttonRect.bottom + window.scrollY + 4}px`,
                                          left: `${buttonRect.left + window.scrollX}px`,
                                          width: `${buttonRect.width}px`,
                                          maxHeight: '240px',
                                          zIndex: 9999,
                                        }}
                                      >
                                      {Object.entries(rolesByType).map(([type, roles]: [string, any]) => (
                                        <div key={type}>
                                          {roles.map((role: any) => (
                                            <Listbox.Option
                                              key={role.id}
                                              value={role.id}
                                              className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                                  active ? 'bg-savoy-blue text-white' : 'text-gray-900'
                                                }`
                                              }
                                            >
                                              {({ selected, active }) => (
                                                <>
                                                  <div className='flex items-center'>
                                                    <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                                                      selected
                                                        ? 'border-savoy-blue bg-savoy-blue'
                                                        : 'border-gray-300 bg-white'
                                                    }`}>
                                                      {selected && (
                                                        <CheckIcon className='h-3 w-3 text-white' aria-hidden='true' />
                                                      )}
                                                    </div>
                                                    <div className='ml-3 flex-1'>
                                                      <span className={`block truncate text-sm ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                        {role.display_name || role.name}
                                                      </span>
                                                      {role.description && (
                                                        <span className={`block truncate text-xs ${active ? 'text-blue-200' : 'text-gray-500'}`}>
                                                          {role.description}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </Listbox.Option>
                                          ))}
                                        </div>
                                      ))}
                                      {Object.keys(rolesByType).length === 0 && (
                                        <div className='text-center py-8 text-gray-500'>
                                          <UserIcon className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                                          <p>No roles available</p>
                                          <p className='text-sm'>Create roles first to assign them to users</p>
                                        </div>
                                      )}
                                    </Listbox.Options>
                                  </Transition>,
                                  document.body
                                )}
                                </div>
                              </>
                            )}
                          </Listbox>
                          
                          {selectedRoles.length > 5 && (
                            <div className='mt-3 flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50'>
                              {selectedRoles.map((roleId) => {
                                const role = rolesData?.results?.find((r: any) => r.id === roleId);
                                return role ? (
                                  <span
                                    key={roleId}
                                    className='inline-flex items-center gap-x-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'
                                  >
                                    {role.display_name || role.name}
                                    <button
                                      type='button'
                                      onClick={() => toggleRole(roleId)}
                                      className='group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20'
                                    >
                                      <XMarkIcon className='h-3.5 w-3.5' />
                                    </button>
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoadingAssignRoles}
                        >
                          {isLoadingAssignRoles && (
                            <div role='status'>
                              <svg
                                aria-hidden='true'
                                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                  fill='currentColor'
                                />
                                <path
                                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                  fill='currentFill'
                                />
                              </svg>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          )}
                          {!isLoadingAssignRoles && 'Assign Roles'}
                        </button>
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          onClick={() => customCloseModal()}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
