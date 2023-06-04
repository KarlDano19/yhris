import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { T_Directive } from '@/types/globals';
import CustomToast from '@/components/CustomToast';
import DragDrop from '@/components/DragDrop';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';
import { useQueryClient } from '@tanstack/react-query';

export default function CreatePolicyModal({
  createMemoPolicyItems,
  setCreateMemoPolicyItems,
  isOpen,
  setIsOpen,
}: {
  createMemoPolicyItems: any;
  setCreateMemoPolicyItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddDirectivesItems();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<T_Directive>();
  const cancelButtonRef = useRef(null);
  const [isNextForm, setIsNextForm] = useState(false);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type='success' />,
          { duration: 5000 }
        );
        setIsOpen(false);
        queryClient.refetchQueries({ queryKey: ['directivesItemCache'] });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    data['type'] = 'policy';
    mutate(data, callbackReq);
    reset();
  });
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
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
                    Create Policy
                  </h3>
                  <XCircleIcon
                    className='w-8 h-8 text-white cursor-pointer'
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <form onSubmit={onSubmit}>
                  {!isNextForm ? (
                    <div key='1'>
                      <div className='px-4 pt-4 pb-6'>
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='title'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Title<span className='text-red-600'>*</span>
                          </label>
                          <div className='mt-2'>
                            <input
                              id='title'
                              {...register('title', { required: true })}
                              type='text'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 flex ml-4 mt-4'>
                          <input
                            id='withResponse'
                            type='checkbox'
                            {...register('withResponse')}
                            className='form-checkbox h-5 w-5 border border-gray-300 rounded-md text-indigo-600 bg-white'
                          />
                          <label
                            htmlFor='withResponse'
                            className='block text-sm font-medium leading-6 text-gray-900 ml-2'
                          >
                            With Response
                          </label>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            To<span className='text-red-600'>*</span>
                          </label>
                          <div className='mt-2'>
                            <input
                              id='email'
                              {...register('email', { required: true })}
                              type='email'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='purpose'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Purpose
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('purpose')}
                              id='purpose'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>

                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='policy'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Policy
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('policy')}
                              id='policy'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='procedure'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Procedure
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('procedure')}
                              id='procedure'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key='2'>
                      <div className='px-4 pb-6'>
                        <p className='font-bold my-4'>Provisions</p>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='eligibility'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Eligibility
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={3}
                              {...register('eligibility')}
                              id='eligibility'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>

                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='application'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Application
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={3}
                              {...register('application')}
                              id='application'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='coverage'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Coverage
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={3}
                              id='coverage'
                              {...register('coverage')}
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='termination'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Termination
                          </label>
                          <div className='mt-2'>
                            <textarea
                              rows={3}
                              id='termination'
                              {...register('termination')}
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label
                            htmlFor='file'
                            className='block text-sm font-medium leading-6 text-gray-900 mb-2'
                          >
                            Upload File (Optional)
                          </label>
                          <DragDrop
                            setValue={(value: any) => setValue('file', value)}
                          />
                          <p className='text-xs mt-1 text-gray-400'>
                            Maximum file size: 10mb
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <hr />
                  {!isNextForm ? (
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <span
                        className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={async () => {
                          const title = await trigger('title');
                          const email = await trigger('email');
                          const results = [title, email];
                          const incomplete = results.some(
                            (item: boolean) => !item
                          );
                          if (!incomplete) {
                            setIsNextForm(true);
                          }
                        }}
                      >
                        Next
                      </span>
                    </div>
                  ) : (
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                      >
                        Create
                      </button>
                      <span
                        className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => setIsNextForm(false)}
                      >
                        Back
                      </span>
                    </div>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
