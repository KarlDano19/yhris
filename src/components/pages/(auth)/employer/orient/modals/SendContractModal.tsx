import { Dispatch, Fragment, useRef, useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { T_ApplicantOrientEmail, T_DocumentsModal } from '@/types/globals';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import SelectChevronDown from '@/svg/SelectChevronDown';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { QUILL_FORMATS, QUILL_MODULES, SEPARATION_TEMPLATE } from '@/helpers/constants';
import useUpdateApplicantOrient from '../hooks/useUpdateApplicantOrient';

type FormValues = {
  template: string;
  email: string;
  message: string;
  cc: string;
  bcc: string;
};

export default function SendContractModal({
  selectedOrientId,
  orientItems,
  setOrientItems,
  isOpen,
  setIsOpen,
  setSuccessModal,
}: {
  selectedOrientId: string;
  orientItems: any;
  setOrientItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setSuccessModal: Dispatch<boolean>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      template: '',
      email: '',
      message: '',
    },
  });
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
  const { mutate, isLoading } = useUpdateApplicantOrient();
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const onSubmit = handleSubmit((data) => {
    if (isOpen && selectedOrientId) {
      const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
      const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
      orientItemCopy[itemIndex].sendContract.template = data.template;
      orientItemCopy[itemIndex].sendContract.to = data.email;
      orientItemCopy[itemIndex].sendContract.message = data.message;
      if (data.cc) {
        orientItemCopy[itemIndex].sendContract.cc = data.cc;
      }
      if (data.bcc) {
        orientItemCopy[itemIndex].sendContract.bcc = data.bcc;
      }
      orientItemCopy[itemIndex].isContractSent = true;
      orientItemCopy[itemIndex].actionType = 'sending';
      orientItemCopy[itemIndex].emailType = 'contract';
      const callbackReq = {
        onSuccess: (data: any) => {
          setOrientItems(orientItemCopy);
          reset();
          setIsOpen(false);
          setSuccessModal(true);
          toast.custom(() => <CustomToast message={'Successfully sent contract email.'} type='success' />, {
            duration: 5000,
          });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      mutate(orientItemCopy[itemIndex], callbackReq);
    } else {
      toast.custom(() => <CustomToast message='Incomplete information.' type='error' />, { duration: 4000 });
    }
  });
  const cancelButtonRef = useRef(null);
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Send Contract via Email</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div className='sm:col-span-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Email Template<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <select
                            id='template'
                            {...register('template', { required: true })}
                            className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                            onChange={(e) => {
                              const currTemplate = SEPARATION_TEMPLATE.find(
                                (template) => template.name === e.target.value
                              );
                              setValue('message', currTemplate ? currTemplate?.message : '');
                            }}
                          >
                            <option value='' disabled>
                              Select...
                            </option>
                            {/* Email Template Here */}
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
                              {...register('cc', { required: true })}
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
                              {...register('bcc', { required: true })}
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
                      >
                        {isLoading ? (
                          <div
                            className='animate-spin inline-block w-[20px] h-[20px] border-[2px] border-current border-t-transparent text-white rounded-full'
                            role='status'
                            aria-label='loading'
                          >
                            <span className='sr-only'>Loading...</span>
                          </div>
                        ) : (
                          'Send'
                        )}
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
    </>
  );
}
