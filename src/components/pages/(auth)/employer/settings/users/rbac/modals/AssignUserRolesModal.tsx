import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useAssignUserRoles from '../hooks/useAssignUserRoles';
import useGetUsersWithRoles from '../hooks/useGetUsersWithRoles';
import useGetRolesList from '../hooks/useGetRolesList';

import { XCircleIcon, CheckIcon, UserIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
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
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  
  const { data: userRolesData, refetch: refetchUserRoles } = useGetUsersWithRoles({
    userId: isOpen.id,
    pageSize: 1
  });
  const { data: rolesData } = useGetRolesList({ pageSize: 1000 });
  const { mutate: assignUserRoles, isLoading: isLoadingAssignRoles } = useAssignUserRoles();

  useEffect(() => {
    if (isOpen.open && isOpen.id) {
      refetchUserRoles();
    }
  }, [isOpen, refetchUserRoles]);

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
    if (userRolesData?.results?.[0]?.roles) {
      setSelectedRoles(userRolesData.results[0].roles.map((role: any) => role.id));
    }
  }, [userRolesData]);

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
    setIsOpen(null);
  };

  // Group roles by type
  const rolesByType = rolesData?.results?.reduce((acc: any, role: any) => {
    const type = role.role_type || 'custom';
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-3xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <UserIcon className='w-6 h-6 text-white mr-2' />
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Assign Roles to User{isOpen.userName ? `: ${isOpen.userName}` : ''}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4'>
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
                          <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                            Available Roles ({selectedRoles.length} selected)
                          </h3>
                          <div className='max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4'>
                            {Object.entries(rolesByType).map(([type, roles]: [string, any]) => (
                              <div key={type} className='mb-6 last:mb-0'>
                                <h4 className='text-md font-medium text-gray-800 mb-3 px-2 py-1 bg-gray-50 rounded'>
                                  {getRoleTypeLabel(type)}
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                  {roles.map((role: any) => (
                                    <div
                                      key={role.id}
                                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                                        selectedRoles.includes(role.id)
                                          ? 'border-savoy-blue bg-blue-50'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                      onClick={() => toggleRole(role.id)}
                                    >
                                      <div className='flex-shrink-0 mr-3'>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                          selectedRoles.includes(role.id)
                                            ? 'bg-savoy-blue border-savoy-blue'
                                            : 'border-gray-300'
                                        }`}>
                                          {selectedRoles.includes(role.id) && (
                                            <CheckIcon className='w-3 h-3 text-white' />
                                          )}
                                        </div>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <div className='text-sm font-medium text-gray-900'>{role.name}</div>
                                        <div className='text-xs text-gray-500 capitalize'>{role.role_type} Role</div>
                                        {role.description && (
                                          <div className='text-xs text-gray-400 mt-1'>{role.description}</div>
                                        )}
                                        <div className='text-xs text-blue-600 mt-1'>
                                          {role.permissions_count || 0} permission{role.permissions_count !== 1 ? 's' : ''}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {Object.keys(rolesByType).length === 0 && (
                              <div className='text-center py-8 text-gray-500'>
                                <UserIcon className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                                <p>No roles available</p>
                                <p className='text-sm'>Create roles first to assign them to users</p>
                              </div>
                            )}
                          </div>
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
