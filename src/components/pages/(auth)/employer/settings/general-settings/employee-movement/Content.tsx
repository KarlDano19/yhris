'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import CustomToast from '@/components/CustomToast';
import DeleteModal from '@/components/DeleteModal';
import BackButton from '@/components/BackButton';
import useGetApprovalItems from './hooks/useGetApprovalItems';
import useAddApproval from './hooks/useAddApproval';
import useDeleteApproval from './hooks/useDeleteApproval';
import useGetApprovalDetails from './hooks/useGetApprovalDetails';
import useEditApproval from './hooks/useEditApproval';

import classNames from '@/helpers/classNames';

import { XMarkIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

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
  const router = useRouter();
  const broadcastChannel = new BroadcastChannel('settings-integration-channel');
  const [approverTags, setApproverTags] = useState<ApproverTag[]>([]);
  const [inputApprover, setInputApprover] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [usersFetchEnabled, setUsersFetchEnabled] = useState(false);
  const approverDropdownRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm();
  const [approvalItems, setApprovalItems] = useState<any>([]);
  const [isDeleteApprovalModalOpen, setIsDeleteApprovalModalOpen] = useState<T_ModalData | null>(null);
  const {
    data: dataApprovalItems,
    isLoading: isGetApprovalItemsLoading,
    refetch: refetchApprovalItems,
  } = useGetApprovalItems();
  const { mutate: addApproval, isLoading: isAddApprovalLoading } = useAddApproval();
  const { mutate: deleteApproval, isLoading: isDeleteApprovalLoading } = useDeleteApproval();
  const { data: dataUsers = [] } = useQuery(
    ['usersCache'],
    async () => {
      const token = getCookie('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/?view_type=select`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    { enabled: usersFetchEnabled, refetchOnWindowFocus: false, keepPreviousData: true }
  );
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
      setFilteredUsers(dataUsers);
    }
  };

  const handleApproverFocus = () => {
    setUsersFetchEnabled(true);
    if (!inputApprover.trim()) {
      setFilteredUsers(dataUsers);
    }
    setShowSuggestions(true);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (approverDropdownRef.current && !approverDropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      const formattedItems = dataApprovalItems.map((item: any) => ({
        ...item,
        created_at: Intl.DateTimeFormat('en-US').format(new Date(item.created_at)),
      }));
      setApprovalItems(formattedItems);

      const nextSequence = getNextSequenceNumber();
      setValue('sequence', nextSequence);

      const hasApprovers = dataApprovalItems.some((item: any) => item.approvers?.length > 0);
      if (hasApprovers) setUsersFetchEnabled(true);
    }
  }, [dataApprovalItems, setValue]);

  useEffect(() => {
    if (showSuggestions && !inputApprover.trim()) {
      setFilteredUsers(dataUsers);
    }
  }, [dataUsers]);

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
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <BackButton label="General Settings" />
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
                    {approvalItems.map((item: any) => {
                      const approverNames = (item.approvers || []).map((id: number) => {
                        const user = (dataUsers as User[]).find((u) => u.id === id);
                        return user ? user.name : null;
                      }).filter(Boolean);

                      return (
                        <div key={item.id} className='flex justify-between items-start mb-2 border-b border-gray-300 pb-3'>
                          <div className='flex flex-col gap-1 pl-4'>
                            <h1 className='text-sm font-semibold text-gray-700'>{item.stage_name}</h1>
                            {approverNames.length > 0 ? (
                              <div className='flex flex-wrap gap-1'>
                                {approverNames.map((name: string) => (
                                  <span key={name} className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                                    {name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className='text-xs text-gray-400 italic'>No approvers assigned</span>
                            )}
                          </div>
                          <button type='button' onClick={() => setIsDeleteApprovalModalOpen({ id: item.id, open: true })} className='flex-shrink-0 mt-0.5'>
                            <DeleteIcon />
                          </button>
                        </div>
                      );
                    })}
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
                        Create New Stage <span className='text-red-500'>*</span>
                      </label>
                      <input
                        {...register('stage_name', { required: 'Stage name is required.' })}
                        id='stage_name'
                        type='text'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      />
                      {errors.stage_name && (
                        <p className='mt-1 text-sm text-red-500'>{errors.stage_name.message as string}</p>
                      )}
                    </div>
                    <div className='px-4 py-2'>
                      <label htmlFor='sequence' className='block text-sm font-medium leading-6 text-gray-900'>
                        Stage Order <span className='text-red-500'>*</span>
                      </label>
                      <input
                        {...register('sequence', { required: 'Stage order is required.' })}
                        id='sequence'
                        type='number'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      />
                      {errors.sequence && (
                        <p className='mt-1 text-sm text-red-500'>{errors.sequence.message as string}</p>
                      )}
                    </div>
                    <label htmlFor='approvers' className='block text-sm font-medium leading-6 text-gray-900 px-4 py-2'>
                      Approvers
                    </label>
                    <div className='flex flex-row px-4 space-x-2 pb-4'>
                      <div className='relative w-[80%]' ref={approverDropdownRef}>
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
                            onFocus={handleApproverFocus}
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
                    <SmartButton
                      id="create-movement-settings-btn"
                      type='submit'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-12 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Save
                    </SmartButton>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isDeleteApprovalModalOpen && (
        <DeleteModal
          isOpen={isDeleteApprovalModalOpen}
          setIsOpen={setIsDeleteApprovalModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteApprovalModalOpen(null);
                refetchApprovalItems();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteApproval(isDeleteApprovalModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteApprovalLoading}
        />
      )}
    </>
  );
}

export default Content;
