import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import DragDrop from '@/components/DragDrop';
import useTagTo from '@/components/hooks/useTagTo';
import SignatureModal from './SignatureModal';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { T_Directive } from '@/types/globals';

export default function CreateMemoModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
}) {
  const cancelButtonRef = useRef(null);
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [qrCodeExist, setQrCodeExist] = useState(false);
  const [toSaveData, setToSaveData] = useState<any>(null);
  const [inputTo, setInputTo] = useState('');
  const { tagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, setValue, reset, trigger } = useForm<T_Directive>();
  const { mutate, isLoading } = useAddDirectivesItems();

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: () => {
        toast.custom(
          () => <CustomToast message={'Successfully created a memo'} type='success' />,

          { duration: 5000 }
        );
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
    data['type'] = 'memo';
    mutate({ ...toSaveData, ...data }, callbackReq);
  });

  const uploadOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      setToSaveData({ ...toSaveData, qrCode: file });
      setQrCodeExist(true);
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue('signature', signatureUrl);
    } else {
      setSignatureUrl('');
    }
    if (!isOpen && signatureUrl) {
      setSignatureUrl('');
    }
  }, [signatureUrl, setValue]);

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
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Memo</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
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
                      <label htmlFor='withResponse' className='block text-sm font-medium leading-6 text-gray-900 ml-2'>
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
                                className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
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
                      <label htmlFor='body' className='block text-sm font-medium leading-6 text-gray-900'>
                        Body
                      </label>
                      <div className='mt-2'>
                        <textarea
                          rows={4}
                          {...register('body')}
                          id='body'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <p className='font-bold my-4'>Signatory</p>
                    <div className='sm:col-span-4'>
                      <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                        Name
                      </label>
                      <div className='mt-2'>
                        <input
                          id='name'
                          {...register('name')}
                          type='text'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                        Position
                      </label>
                      <div className='mt-2'>
                        <input
                          id='position'
                          {...register('position')}
                          type='text'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <p className='my-4 block text-sm font-medium leading-6 text-gray-900'>Signature</p>
                    <div className='flex flex-col md:flex-row items-start gap-6 mt-4'>
                      <div className='flex-1'>
                        <button
                          id='draw'
                          type='button'
                          className={`block w-full text-savoy-blue font-bold rounded-md border border-savoy-blue py-1.5 px-3 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                            signatureUrl ? 'bg-savoy-blue text-white ' : ''
                          }`}
                          onClick={() => {
                            setSignatureModalOpen(true);
                            // setSignatureUrl("");
                          }}
                        >
                          Draw
                        </button>
                      </div>
                      <p className='text-center mt-2'>or</p>
                      <div className='flex-1'>
                        <input
                          id='signature'
                          {...register('signature')}
                          onChange={(e) => {
                            e.target.value ? setSignatureUrl('') : null;
                            e.target.value ? setAttachmentExist(true) : null;
                          }}
                          type='file'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                        />
                        {attachmentExist ? (
                          <button
                            type='button'
                            className='underline text-savoy-blue text-sm'
                            onClick={() => {
                              setValue('signature', '');
                              setAttachmentExist(false);
                            }}
                          >
                            Remove Attachment
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {signatureUrl !== '' && (
                      <div className='mt-4'>
                        <Image
                          className='border-0 ring-1 ring-inset ring-gray-300 m-auto'
                          src={signatureUrl}
                          width={500}
                          height={200}
                          alt='signatureImage'
                        />
                      </div>
                    )}
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='qrCode' className='block text-sm font-medium leading-6 text-gray-900'>
                        QR Code
                      </label>
                      <div className='mt-2'>
                        <input
                          id='qrCode'
                          type='file'
                          onChange={uploadOnChange}
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                        />
                        {qrCodeExist ? (
                          <button
                            type='button'
                            className='underline text-savoy-blue text-sm mt-1'
                            onClick={() => {
                              delete toSaveData.qrCode;
                              setToSaveData({ ...toSaveData });
                              setQrCodeExist(false);
                            }}
                          >
                            Remove QR Code
                          </button>
                        ) : null}
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
                  <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                    <button
                      onClick={async () => {
                        const title = await trigger('title');
                        const email = await trigger('email');
                        const results = [title, email];
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
                              duration: 5000,
                            }
                          );
                        }
                      }}
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
        <SignatureModal
          setSignatureUrl={setSignatureUrl}
          isOpen={signatureModalOpen}
          setIsOpen={setSignatureModalOpen}
        />
      </Dialog>
    </Transition.Root>
  );
}
