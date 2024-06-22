import { Dispatch, Fragment, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetEmailTemplateItems from '@/components/hooks/useGetEmailTemplateItems';
import usePatchEmployeeIssueItems from '../hooks/usePatchEmployeeIssueItems';

import SelectChevronDown from '@/svg/SelectChevronDown';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import { T_SendNTEModal } from '@/types/globals';

import 'react-quill/dist/quill.snow.css';

type FormValues = {
  template: string;
  email: string;
  message: string;
  cc: string;
  bcc: string;
};

export default function SendNTEModal({
  employeeIssueItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
}: {
  employeeIssueItems: any;
  setEmployeeIssueItems: any;
  isOpen: T_SendNTEModal | null;
  setIsOpen: Dispatch<T_SendNTEModal | null>;
}) {
  const cancelButtonRef = useRef(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const { register, handleSubmit, reset, getValues, setValue, trigger } = useForm<FormValues>({
    defaultValues: {
      template: '',
      message: '',
    },
  });
  const { data: dataEmailTemplate } = useGetEmailTemplateItems();
  const { mutate, isLoading } = usePatchEmployeeIssueItems();

  const onSubmit = handleSubmit((data) => {
    if (isOpen && isOpen.id) {
      const itemIndex = employeeIssueItems.findIndex((item: any) => item.id === isOpen.id);
      const employeeIssueItemsCopy = JSON.parse(JSON.stringify(employeeIssueItems));
      employeeIssueItemsCopy[itemIndex].id = isOpen.id;
      employeeIssueItemsCopy[itemIndex].actionType = 'sending';
      employeeIssueItemsCopy[itemIndex].emailType = 'nte';
      employeeIssueItemsCopy[itemIndex].issueNTEForm.template = data.template;
      employeeIssueItemsCopy[itemIndex].issueNTEForm.to = data.email;
      employeeIssueItemsCopy[itemIndex].issueNTEForm.cc = data.cc;
      employeeIssueItemsCopy[itemIndex].issueNTEForm.bcc = data.bcc;
      employeeIssueItemsCopy[itemIndex].issueNTEForm.message = data.message;
      employeeIssueItemsCopy[itemIndex].isNTESent = true;
      const callbackReq = {
        onSuccess: (data: any) => {
          setEmployeeIssueItems([...employeeIssueItemsCopy]);
          setIsOpen(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          reset();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      mutate(employeeIssueItemsCopy[itemIndex], callbackReq);
    } else {
      toast.custom(() => <CustomToast message='Incomplete information.' type='error' />, { duration: 4000 });
    }
  });

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Send NTE</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div
                        className={`
                         hidden rounded-md bg-red-50 p-4 mb-3`}
                      >
                        <div className='flex'>
                          <div className='flex-shrink-0'>
                            <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                          </div>
                          <div className='ml-3'>
                            {/* If incomplete fields */}
                            <h3 className='text-sm font-medium text-red-800'>
                              You cannot proceed due to incomplete fields. Please review.
                            </h3>
                            {/* If invalid email */}
                            <h3 className='text-sm font-medium text-red-800'>Invalid email should not proceed.</h3>
                          </div>
                        </div>
                      </div>
                      <div className='sm:col-span-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Email Template<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <select
                            id='template'
                            {...register('template', { required: true })}
                            className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          >
                            <option value='' disabled>
                              Select...
                            </option>
                            {(dataEmailTemplate || []).map((item: any) => (
                              <option key={item.id} value={item.subject}>
                                {item.subject}
                              </option>
                            ))}
                          </select>
                          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <SelectChevronDown />
                          </div>
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          To<span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <input
                              type='email'
                              {...register('email', { required: true })}
                              id='email'
                              className='block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                            />
                          </div>
                          <button
                            type='button'
                            className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                              isCCOpen && 'bg-savoy-blue text-white hover:bg-blue-700'
                            }`}
                            onClick={() => setIsCCOPen(!isCCOpen)}
                          >
                            CC
                          </button>
                          <button
                            type='button'
                            className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                              isBCCOpen && 'bg-savoy-blue text-white hover:bg-blue-700'
                            }`}
                            onClick={() => setIsBCCOpen(!isBCCOpen)}
                          >
                            BCC
                          </button>
                        </div>
                      </div>
                      {isCCOpen && (
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                            CC
                          </label>
                          <div className='mt-2'>
                            <input
                              id='cc'
                              {...register('cc')}
                              type='cc'
                              autoComplete='email'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                      )}
                      {isBCCOpen && (
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='bcc' className='block text-sm font-medium leading-6 text-gray-900'>
                            BCC
                          </label>
                          <div className='mt-2'>
                            <input
                              id='bcc'
                              {...register('bcc')}
                              type='bcc'
                              autoComplete='email'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                      )}
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='message' className='block text-sm font-medium leading-6 text-gray-900'>
                          Message<span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2 h-72 mb-12'>
                          <textarea rows={4} {...register('message', { required: true })} id='message' hidden />
                          <ReactQuill
                            onChange={(value) => setValue('message', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%' }}
                            defaultValue={getValues('message')}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                        disabled={isLoading}
                        onClick={async () => {
                          const email = await trigger('email');
                          const template = await trigger('template');
                          const message = await trigger('template');
                          const results = [email, template, message];
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
                        {!isLoading && 'Send'}
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => setIsOpen(null)}
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
    </>
  );
}
