import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import DragDrop from '@/components/DragDrop';
import useTagTo from '@/components/hooks/useTagTo';
import RemoveFieldConfirmModal from './RemoveFieldConfirmModal';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { MinusCircleIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { T_Directive, T_PolicyField } from '@/types/globals';

export default function CreatePolicyModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
}) {
  const cancelButtonRef = useRef(null);
  const [isNextForm, setIsNextForm] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const { tagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, setFocus, setValue, getFieldState, getValues, reset, clearErrors, trigger, control } =
    useForm<T_Directive>({
      defaultValues: {
        policyField: [
          {
            inputLabel: 'Purpose',
            inputName: '',
          },
          {
            inputLabel: 'Policy',
            inputName: '',
          },
          {
            inputLabel: 'Procedure',
            inputName: '',
          },
        ],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'policyField',
  });
  const { mutate, isLoading } = useAddDirectivesItems();

  const handleAddField = () => {
    clearErrors('policyField');
  };

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        setIsNextForm(false);
        toast.custom(() => <CustomToast message={'Successfully created a policy'} type='success' />, {
          duration: 5000,
        });
        setIsOpen(false);
        refetch();
        reset();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 5000,
        });
      },
    };
    data['email'] = tagsTo;
    data['type'] = 'policy';
    mutate(data, callbackReq);
  });

  const increaseWidth = (text: HTMLInputElement) => {
    let textLength = text.value.length;
    if (textLength >= 10) {
      text.style.width = textLength + 'ch';
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
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Policy</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>
                  {!isNextForm ? (
                    <div key='1'>
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
                              <h3 className='text-sm font-medium text-red-800'>
                                You cannot proceed due to incomplete fields. Please review.
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='sm:col-span-4'>
                          <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                            To<span className='text-red-600'>*</span>
                          </label>
                          <div className='mt-2 flex rounded-md shadow-sm'>
                            <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                              <div className='relative border border-gray-300 pl-2 rounded-md flex items-center flex-wrap w-full'>
                                {tagsTo.map((tagTo: string) => (
                                  <div
                                    key={tagTo}
                                    className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start'
                                  >
                                    <button type='button' onClick={() => handleRemoveTagTo(tagTo)}>
                                      <XMarkIcon className='w-4 h-4' />
                                    </button>
                                    <p>{tagTo}</p>
                                  </div>
                                ))}
                                <input
                                  type='cc'
                                  value={inputTo}
                                  onKeyDown={handleKeyDownTo}
                                  onChange={(e) => setInputTo(e.target.value)} // Add this line to update input state
                                  className='focus:none outline-none px-2 py-1 grow rounded-md'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {fields.map((item: T_PolicyField, index: number) => (
                          <div className='sm:col-span-4 mt-4' key={index}>
                            <label
                              htmlFor={`policyField.${index}.inputName`}
                              className='flex justify-between text-sm font-medium leading-6 text-gray-900'
                            >
                              <div>
                                <input
                                  type='text'
                                  defaultValue={item.inputLabel}
                                  className=' w-[10ch]'
                                  id={`title${index}`}
                                  {...register(`policyField.${index}.inputLabel`)}
                                  onInput={(e: any) => increaseWidth(e.currentTarget)}
                                  disabled={true}
                                />
                                <button
                                  type='button'
                                  onClick={() => {
                                    document.getElementById(`title${index}`)?.removeAttribute('disabled');
                                    setFocus(`policyField.${index}.inputLabel`);
                                  }}
                                >
                                  <PencilIcon className='h-3 text-gray-500 ml-2' />
                                </button>
                              </div>
                              <button
                                type='button'
                                className='hover:t-red-500 text-white'
                                onClick={() => setIsConfirmModalOpen(true)}
                              >
                                <MinusCircleIcon fill='gray' className='h-3' />
                              </button>
                            </label>
                            <div className='mt-2'>
                              <textarea
                                rows={4}
                                {...register(`policyField.${index}.inputName`)}
                                placeholder={`Enter ${item.inputLabel}...`}
                                id={`policyField.${index}.inputName`}
                                className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                              />
                            </div>
                            <RemoveFieldConfirmModal
                              message={`Are you sure you want to remove the ${item.inputLabel} field`}
                              isOpen={isConfirmModalOpen}
                              setIsOpen={setIsConfirmModalOpen}
                              confirmAction={() => {
                                remove(index);
                                setIsConfirmModalOpen(false);
                              }}
                            />
                          </div>
                        ))}
                        <div className='sm:col-span-4 mt-4'>
                          <button
                            className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                            onClick={() => {
                              append({
                                inputLabel: 'Enter title',
                                inputName: '',
                              });
                              handleAddField();
                            }}
                          >
                            <PlusIcon className='h-5 w-auto mr-2' />
                            Add Field
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key='2'>
                      <div className='px-4 pb-6'>
                        <p className='font-bold my-4'>Provisions</p>
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='eligibility' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <label htmlFor='application' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <label htmlFor='coverage' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <label htmlFor='termination' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <label htmlFor='file' className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                            Upload File (Optional)
                          </label>
                          <DragDrop setValue={(value: any) => setValue('file', value)} />
                          <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5mb</p>
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
                          let results = null;
                          if (getValues().email.indexOf('@') < 1) {
                            results = [title, false];
                          } else {
                            results = [title, email];
                          }

                          const incomplete = results?.some((item: boolean) => !item);
                          if (!incomplete) {
                            setIsNextForm(true);
                          } else {
                            let message = '';
                            if (getValues().email.indexOf('@') < 1) {
                              message = 'Invalid email address';
                            } else {
                              message = 'You cannot proceed due to incomplete fields. Please review.';
                            }
                            toast.custom(() => <CustomToast message={message} type='error' />, {
                              duration: 5000,
                            });
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
