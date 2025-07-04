import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import useAddEmployeeIssueItems from '../hooks/useAddEmployeeIssueItems';

import SelectChevronDown from '@/svg/SelectChevronDown';

import { T_IncidentReport } from '@/types/globals';


export default function IncidentReportModal({
  employeeIssueItems,
  departmentItems,
  employeeItems,
  positionItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
  refetch,
}: {
  employeeIssueItems: any;
  departmentItems: any;
  employeeItems: any;
  positionItems: any;
  setEmployeeIssueItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddEmployeeIssueItems();
  const { register, handleSubmit, setValue, reset, control, trigger, watch } = useForm<T_IncidentReport>({
    defaultValues: {
      incidentDate: new Date().toISOString(), 
    },
  });
  const dateInputRef = useRef(null);
  const cancelButtonRef = useRef(null);
  
  // Character limit state for brief background
  const maxLength = 430;
  const [hasShownToast, setHasShownToast] = useState(false);
  const briefBackgroundValue = watch('briefBackground') || '';
  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={"Successfully created an incident report."} type='success' />, { duration: 5000 });
        setIsOpen(false);
        reset();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(data, callbackReq);
  });

  // Handle brief background input change with character limit
  const handleBriefBackgroundChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length <= maxLength) {
      // Reset the toast flag when back under the limit
      if (hasShownToast) setHasShownToast(false);
      setValue('briefBackground', value);
    } else if (!hasShownToast) {
      // Show toast only once per limit exceeding attempt
      toast.custom(() => <CustomToast message={`Brief Background cannot exceed ${maxLength} characters.`} type="error" />);
      setHasShownToast(true);
      
      // Prevent further input by truncating the text
      const truncated = value.substring(0, maxLength);
      setValue('briefBackground', truncated);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Incident Report</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>
                  <div className='px-4 pt-4 pb-6'>
                    <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
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
                    <div className='sm:col-span-4'>
                      <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                        Employee Name<span className='text-red-600'>*</span>
                      </label>
                      <div className='relative mt-2'>
                        <select
                          id='name'
                          {...register('name', { required: true })}
                          className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        >
                          <option value='' disabled>Select...</option>
                          {employeeItems.map((item: any) => {
                            return (
                              <option key={item.id} value={item.id}>{`${item.firstname} ${item.lastname}`}</option>
                            );
                          })}
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6 mt-4'>
                      <div>
                        <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                          Position<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          {/* <select
                            id="position"
                            {...register("position", { required: true })}
                            className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select...</option>
                            {positionItems.map((item: any) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <SelectChevronDown />
                          </div> */}
                          <input
                            id='position'
                            {...register('position', { required: true })}
                            type='text'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor='department' className='block text-sm font-medium leading-6 text-gray-900'>
                          Department<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          {/* <select
                            id='department'
                            {...register('department', { required: true })}
                            className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          >
                            <option value='' disabled>Select...</option>
                            {departmentItems.map((item: any) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <SelectChevronDown />
                          </div> */}
                          <input
                            id='department'
                            {...register('department', { required: true })}
                            type='text'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6 mt-4'>
                      <div>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Date of Incident
                          <span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <Controller
                            control={control}
                            name='incidentDate'
                            render={({ field }) => (
                              <CustomDatePicker
                                id='incident-report-datepicker'
                                placeholder={'mm/dd/yyyy'}
                                className={
                                  'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                                }
                                selected={field.value ? new Date(field.value) : null}
                                pickerOnChange={(date: any) => field.onChange(date)}
                                inputOnChange={(value: any) => field.onChange(value)}
                                required={true}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Place of Incident
                          <span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2'>
                          <input
                            id='incidentPlace'
                            {...register('incidentPlace', { required: true })}
                            type='text'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='message' className='block text-sm font-medium leading-6 text-gray-900'>
                        Brief Background<span className='text-red-600'>*</span>
                      </label>
                      <div className='mt-2'>
                        <textarea
                          rows={4}
                          {...register('briefBackground', { required: true })}
                          id='briefBackground'
                          value={briefBackgroundValue}
                          onChange={handleBriefBackgroundChange}
                          maxLength={maxLength + 1}
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                        <div className='text-xs text-gray-500 text-right mt-1'>
                          {briefBackgroundValue.length}/{maxLength} characters
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                    <button
                      type='submit'
                      onClick={async () => {
                        const name = await trigger('name');
                        const position = await trigger('position');
                        const department = await trigger('department');
                        const incidentPlace = await trigger('incidentPlace');
                        const briefBackground = await trigger('briefBackground');
                        const incidentDate = await trigger('incidentDate');
                        const results = [name, position, department, incidentPlace, briefBackground, incidentDate];
                        const incomplete = results.some((item: boolean) => !item);
                        if (incomplete) {
                          toast.custom(
                            () => (
                              <CustomToast
                                message={'You cannot proceed due to incomplete fields. Please review.'}
                                type='error'
                              />
                            ),
                            {
                              duration: 2000,
                            }
                          );
                        }
                      }}
                      className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                      disabled={isLoading}
                    >
                      {isLoading && (
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
                      {!isLoading && 'Create'}
                    </button>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
