import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import usePatchEmployeeIssueItems from '../hooks/usePatchEmployeeIssueItems';
import SelectChevronDown from '@/svg/SelectChevronDown';

interface UpdateStatusModalProps {
  employeeIssueItems: any;
  setEmployeeIssueItems: any;
  isOpen: { id: number; open: boolean } | null;
  setIsOpen: Dispatch<{ id: number; open: boolean } | null>;
  refetch: any;
  selectedIssue: any;
  cachedUserRights?: any;
}

const statusOptions = [
  { value: 'approved', label: 'Approve', color: 'bg-green-100 text-green-700' },
  { value: 'disapproved', label: 'Disapprove', color: 'bg-red-100 text-red-700' },
];

export default function UpdateStatusModal({
  employeeIssueItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
  refetch,
  selectedIssue,
  cachedUserRights,
}: UpdateStatusModalProps) {
  const hasUpdateRights = cachedUserRights?.state?.data?.update_employee_issue_status;
  const queryClient = useQueryClient();
  const { mutate, isLoading } = usePatchEmployeeIssueItems();
  const cancelButtonRef = useRef(null);

  const handleApprove = () => {
    if (!selectedIssue) return;
    
    const updatedIssue = { ...selectedIssue, status: 'approved' };
    const callbackReq = {
      onSuccess: (data: any) => {
        // Update local state
        setEmployeeIssueItems((prev: any) => 
          prev.map((item: any) => 
            item.id === selectedIssue.id ? { ...item, status: 'approved' } : item
          )
        );
        toast.custom(() => <CustomToast message="Issue approved successfully." type='success' />, { duration: 5000 });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(updatedIssue, callbackReq);
  };

  const handleDisapprove = () => {
    if (!selectedIssue) return;
    
    const updatedIssue = { ...selectedIssue, status: 'disapproved' };
    const callbackReq = {
      onSuccess: (data: any) => {
        // Update local state
        setEmployeeIssueItems((prev: any) => 
          prev.map((item: any) => 
            item.id === selectedIssue.id ? { ...item, status: 'disapproved' } : item
          )
        );
        toast.custom(() => <CustomToast message="Issue disapproved successfully." type='success' />, { duration: 5000 });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(updatedIssue, callbackReq);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedIssue) return;
    
    const updatedIssue = { ...selectedIssue, status: newStatus };
    const callbackReq = {
      onSuccess: (data: any) => {
        // Update local state
        setEmployeeIssueItems((prev: any) => 
          prev.map((item: any) => 
            item.id === selectedIssue.id ? { ...item, status: newStatus } : item
          )
        );
        const message = newStatus === 'approved' ? 'Issue approved successfully.' : 'Issue disapproved successfully.';
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 5000 });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(updatedIssue, callbackReq);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <Transition.Root show={isOpen?.open || false} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    Update Issue Status
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                </div>
                
                <div className='px-4 pt-4 pb-6'>
                  {/* Read-only fields display */}
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Employee Name
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.name || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Position
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.employee_position || selectedIssue?.position || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-6 mt-4'>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Department
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.employee_department || selectedIssue?.department || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Date of Incident
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.incidentDate || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-6 mt-4'>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Place of Incident
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.incident_place || selectedIssue?.place_of_incident || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Issue Type
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          value={selectedIssue?.issue_type || ''}
                          readOnly
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='sm:col-span-4 mt-4'>
                    <label className='block text-sm font-medium leading-6 text-gray-900'>
                      Brief Background
                    </label>
                    <div className='mt-2'>
                      <textarea
                        rows={6}
                        value={selectedIssue?.brief_background || ''}
                        readOnly
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 resize-none sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>
                </div>
                
                <hr />
                <div className='mt-5 sm:mt-4 px-4'>
                  {/* Buttons row */}
                  <div className='sm:flex sm:justify-between sm:gap-2'>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(null)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                    
                    {/* Approve/Disapprove buttons */}
                    {selectedIssue?.status === 'pending' && (
                      <div className='flex gap-2 mt-3 sm:mt-0'>
                        <button
                          type='button'
                          onClick={handleApprove}
                          className='inline-flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 sm:w-auto'
                          disabled={isLoading}
                        >
                          Approve
                        </button>
                        <button
                          type='button'
                          onClick={handleDisapprove}
                          className='inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 sm:w-auto'
                          disabled={isLoading}
                        >
                          Disapprove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
