import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomDatePicker from '@/components/CustomDatePicker';
import useTagTo from '@/components/hooks/useTagTo';
import ConfirmModal from '@/components/ConfirmModal';
import CustomToast from '@/components/CustomToast';
import usePatchSeparationItem from '../hooks/usePatchSeparation';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { T_LetterModal } from '@/types/globals';

type FormValues = {
  date: string;
  email: string;
  message: string;
};

export default function LetterModal({
  separationItems,
  refetch,
  type,
  isOpen,
  setIsOpen,
}: {
  separationItems: any;
  refetch: any;
  type?: 'Acceptance' | 'Separation';
  isOpen: T_LetterModal | null;
  setIsOpen: Dispatch<T_LetterModal | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [applicantEmail, setApplicantEmail] = useState<string | null>(null);
  const [letterType, setLetterType] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toSaveData, setToSaveData] = useState<any>(null);
  const [inputTo, setInputTo] = useState('');
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, reset, control, trigger } = useForm<FormValues>();
  const { mutate, isLoading } = usePatchSeparationItem();

  useEffect(() => {
    if (isOpen && isOpen.id) {
      const itemIndex = separationItems.findIndex((item: any) => item.id === isOpen.id);
      const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
      if (separationItemsCopy[itemIndex]) {
        setApplicantEmail(separationItemsCopy[itemIndex].email);
        setTagsTo([separationItemsCopy[itemIndex].email]);
      }
    }
  }, [isOpen]);

  const onSubmit = handleSubmit((data) => {
    if (isOpen && isOpen.id) {
      const itemIndex = separationItems.findIndex((item: any) => item.id === isOpen.id);
      const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
      separationItemsCopy[itemIndex].id = isOpen.id;
      separationItemsCopy[itemIndex].actionType = 'sending';
      separationItemsCopy[itemIndex].emailType = 'letters';
      separationItemsCopy[itemIndex].separationLetter.type = type;
      separationItemsCopy[itemIndex].separationLetter.date = data.date;
      separationItemsCopy[itemIndex].separationLetter.to = tagsTo;
      separationItemsCopy[itemIndex].separationLetter.message = data.message;
      separationItemsCopy[itemIndex].isLetterSent = true;
      setToSaveData(separationItemsCopy[itemIndex]);
      customCloseModal();
      setLetterType(type || '');
      setIsConfirmModalOpen(true);
    } else {
      toast.custom(
        () => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />,
        { duration: 4000 }
      );
    }
  });

  const saveData = () => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        setIsConfirmModalOpen(!isConfirmModalOpen);
        refetch();
        reset();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(toSaveData, callbackReq);
  };

  const updateConfirmModal = (value: boolean) => {
    if (!value) {
      setIsConfirmModalOpen(false);
      reset();
    }
  };

  const customCloseModal = () => {
    reset();
    setIsOpen(null);
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Letter of {type}</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div className='sm:col-span-4'>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Date<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <Controller
                            control={control}
                            name='date'
                            render={({ field }) => (
                              <CustomDatePicker
                                id='separation-letter-datepicker'
                                placeholder={'mm/dd/yyyy'}
                                className={
                                  'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                                }
                                selected={field.value}
                                pickerOnChange={(date: any) => field.onChange(date)}
                                inputOnChange={(value: any) => field.onChange(value)}
                                required={true}
                              />
                            )}
                          />
                        </div>
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
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='message' className='block text-sm font-medium leading-6 text-gray-900'>
                          Message<span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2'>
                          <textarea
                            rows={4}
                            {...register('message', { required: true })}
                            id='message'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                        onClick={async () => {
                          const email = await trigger('email');
                          const date = await trigger('date');
                          const message = await trigger('message');
                          const result = [email, date, message];
                          const incomplete = result.some((item: boolean) => !item);
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
                        Send
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => customCloseModal()}
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
      <ConfirmModal
        message={`Would you like to send the letter of ${letterType.toLocaleLowerCase()}?`}
        isOpen={isConfirmModalOpen}
        setIsOpen={updateConfirmModal}
        confirmAction={saveData}
        isLoading={isLoading}
      />
    </>
  );
}
