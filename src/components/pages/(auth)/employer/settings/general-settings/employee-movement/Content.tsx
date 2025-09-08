'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import CreateThirdPartyIntegrationModal from '../third-party-platform/modals/CreateThirdPartyIntegrationModal';
import useGetThirdPartyIntegrationItems from '../third-party-platform/hooks/useGetThirdPartyIntegrationItems';

import { ArrowLeftIcon, MagnifyingGlassIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';
import useGetApprovalItems from './hooks/useGetApprovalItems';
import useAddApproval from './hooks/useAddApproval';
import CustomToast from '@/components/CustomToast';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import useGetUsers from '@/components/hooks/useGetUsers';
import DeleteApprovalModal from './modal/DeleteModal';
import useGetApprovalDetails from './hooks/useGetApprovalDetails';
import useEditApproval from './hooks/useEditApproval';
import classNames from '@/helpers/classNames';

interface User {
  id: number;
  email: string;
  name: string;
}

interface ApproverTag {
  id: number;
  name: string;
}

type T_ModalData = {
  id: number;
  open: boolean;
  code?: string;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const broadcastChannel = new BroadcastChannel('settings-integration-channel');
  const [approverTags, setApproverTags] = useState<ApproverTag[]>([]);
  const [inputApprover, setInputApprover] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { register, handleSubmit, reset, control, setValue } = useForm();
  const [approvalItems, setApprovalItems] = useState<any>([]);
  const [isDeleteApprovalModalOpen, setIsDeleteApprovalModalOpen] = useState<T_ModalData | null>(null);
  const {
    data: dataApprovalItems,
    isLoading: isGetApprovalItemsLoading,
    refetch: refetchApprovalItems,
  } = useGetApprovalItems();
  const { mutate: addApproval, isLoading: isAddApprovalLoading } = useAddApproval();
  const { data: dataUsers = [], isLoading: isGetUsersLoading } = useGetUsers();
  const { data: dataApprovalDetails, isLoading: isGetApprovalDetailsLoading } = useGetApprovalDetails(isDeleteApprovalModalOpen?.id || null);
  const { mutate: editApproval, isLoading: isEditApprovalLoading } = useEditApproval();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputApprover(value);
    setShowSuggestions(true);

    if (value.trim()) {
      const filtered = dataUsers.filter((user: User) => user.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!approverTags.some((tag) => tag.id === user.id)) {
      setApproverTags([
        ...approverTags,
        {
          id: user.id,
          name: `${user.name}`,
        },
      ]);
    }
    setInputApprover('');
    setShowSuggestions(false);
  };

  const handleRemoveApprover = (idToRemove: number) => {
    setApproverTags(approverTags.filter((tag) => tag.id !== idToRemove));
  };

  // Function to calculate the next sequence number
  const getNextSequenceNumber = () => {
    if (!approvalItems || approvalItems.length === 0) {
      return 1;
    }
    
    const maxSequence = Math.max(...approvalItems.map((item: any) => item.sequence || 0));
    return maxSequence + 1;
  };

  const onSubmit = handleSubmit((data) => {
    const submissionData = {
      ...data,
      approvers: approverTags.map((tag) => tag.id), // Send only the IDs
    };

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        reset({ stage_name: '', sequence: '' });
        setApproverTags([]); 
        setInputApprover('');
        // Refetch the updated data
        refetchApprovalItems();
      },
      onError: (err: any) => {
        const errorMessage = typeof err === 'object' ? err.message || JSON.stringify(err) : err.toString();
        toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
          duration: 7000,
        });
      },
    };
    addApproval(submissionData, callbackReq);
  });

  useEffect(() => {
    refetchApprovalItems();
  }, []);

  // Set initial sequence number when component mounts
  useEffect(() => {
    if (approvalItems.length > 0) {
      const nextSequence = getNextSequenceNumber();
      setValue('sequence', nextSequence);
    }
  }, [approvalItems, setValue]);

  useEffect(() => {
    if (dataApprovalItems && Array.isArray(dataApprovalItems)) {
      // Add Array check
      const formattedItems = dataApprovalItems.map((item: any) => ({
        ...item,
        created_at: Intl.DateTimeFormat('en-US').format(new Date(item.created_at)),
      }));
      setApprovalItems(formattedItems);
      
      // Auto-fill the sequence field with the next number
      const nextSequence = getNextSequenceNumber();
      setValue('sequence', nextSequence);
    }
  }, [dataApprovalItems, setValue]);

  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.isGranted) {
        refetchApprovalItems();
      }
    };
    return () => {
      broadcastChannel.close();
    };
  }, []);

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Movement Settings</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none lg:w-1/2'>
              <div className='relative flex items-center'>
                <div className='w-full h-full bg-[#EAECEE] rounded-md'>
                  <div className='flex justify-between px-4 py-2 h-[50px]'>
                    <div>
                      <h4>Approval Stages</h4>
                    </div>
                  </div>
                  <div className='px-4 py-2'>
                    {approvalItems.map((item: any) => (
                      <div key={item.id} className='flex justify-between mb-2 border-b border-gray-300 pb-2'>
                        <div className='flex gap-2 items-center justify-between w-full'>
                          <h1 className='text-sm font-semibold text-gray-500 pl-4'>{item.stage_name}</h1>
                          <hr className='border-b-[0px] border-[#2C3F58] border-1 mt-2' />
                        </div>
                        <div className='flex gap-2 justify-end w-full'>
                        <button type='button' onClick={() => setIsDeleteApprovalModalOpen({ id: item.id, open: true })}>
                          <TrashIcon className='w-5 h-5 text-red-500' />
                        </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames('flex-none lg:w-1/2', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
              <form onSubmit={onSubmit}>
                <div className='relative flex items-center'>
                  <div className='w-full h-full'>
                    <div className='px-4 py-2'>
                      <label htmlFor='stage_name' className='block text-sm font-medium leading-6 text-gray-900'>
                        Create New Stage
                      </label>
                      <input
                        {...register('stage_name')}
                        id='stage_name'
                        type='text'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      />
                    </div>
                    <div className='px-4 py-2'>
                      <label htmlFor='sequence' className='block text-sm font-medium leading-6 text-gray-900'>
                        Stage Order
                      </label>
                      <input
                        {...register('sequence')}
                        id='sequence'
                        type='number'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      />
                    </div>
                    <label htmlFor='approvers' className='block text-sm font-medium leading-6 text-gray-900 px-4 py-2'>
                      Approvers
                    </label>
                    <div className='flex flex-row px-4 space-x-2 pb-4'>
                      <div className='relative w-[80%]'>
                        <div className='relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full text-sm'>
                          {approverTags.map((tag) => (
                            <div
                              key={tag.id}
                              className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
                            >
                              <button type='button' onClick={() => handleRemoveApprover(tag.id)}>
                                <XMarkIcon className='w-4 h-4' />
                              </button>
                              <p>{tag.name}</p>
                            </div>
                          ))}
                          <input
                            type='text'
                            value={inputApprover}
                            onChange={handleInputChange}
                            onFocus={() => setShowSuggestions(true)}
                            className='focus:none outline-none px-2 py-1 grow rounded-md'
                            placeholder='Type to search users'
                          />
                        </div>

                        {/* Suggestions dropdown */}
                        {showSuggestions && filteredUsers.length > 0 && (
                          <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
                            {filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                onClick={() => handleSelectUser(user)}
                              >
                                <div className='text-sm'>{user.name}</div>
                                <div className='text-xs text-gray-500'>{user.email}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type='button'
                        className='bg-white border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100'
                        onClick={() => {
                          setApproverTags([]);
                          setInputApprover('');
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
                <div className='flex pl-4 space-x-4 pb-2'>
                  <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                    <button
                      type='button'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-gray-300 px-10 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      // onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </span>
                  <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
                    <button
                      type='submit'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-12 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Save
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isDeleteApprovalModalOpen && (
      <DeleteApprovalModal
        refetch={refetchApprovalItems}
          isOpen={isDeleteApprovalModalOpen}
          setIsOpen={setIsDeleteApprovalModalOpen}
        />
      )}
    </>
  );
}

export default Content;
