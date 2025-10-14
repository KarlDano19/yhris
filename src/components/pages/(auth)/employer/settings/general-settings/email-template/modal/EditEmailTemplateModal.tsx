import React, { Dispatch, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useUpdateEmailTemplate from '../hooks/useUpdateEmailTemplate';
import useGetEmailTemplateDetails from '../hooks/useGetEmailTemplateDetails';
import EmailField from '@/components/common/EmailField';

import { XCircleIcon } from '@heroicons/react/24/solid';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

export default function EditEmailTemplateModal({
  isOpen,
  setIsOpen,
  refetch,
  selectedEmailTemplateId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  selectedEmailTemplateId: number | null;
}) {
  const inputRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const [file, setFile] = useState<File | null>(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const { register, handleSubmit, setValue, watch } = useForm<any>();

  
  const {
    data: dataEmailTemplateDetail,
    refetch: refetchEmailTemplateDetail,
    remove: removeEmailTemplateDetail,
  } = useGetEmailTemplateDetails(selectedEmailTemplateId);
  const { mutate, isLoading } = useUpdateEmailTemplate();



  // Handle employee selection for TO field
  const handleEmployeeSelectTo = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsTo([...tagsTo, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsTo([...tagsTo, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsTo(employee.remainingTags);
    }
  };

  // Handle employee selection for CC field
  const handleEmployeeSelectCc = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsCc([...tagsCc, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsCc([...tagsCc, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsCc(employee.remainingTags);
    }
  };

  // Handle employee selection for BCC field
  const handleEmployeeSelectBcc = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsBcc([...tagsBcc, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsBcc([...tagsBcc, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsBcc(employee.remainingTags);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refetchEmailTemplateDetail();
    }
  }, [isOpen, refetchEmailTemplateDetail]);

  useEffect(() => {
    if (dataEmailTemplateDetail) {
      setValue('subject', dataEmailTemplateDetail.subject);
      setTagsTo(dataEmailTemplateDetail.to);
      setValue('body', dataEmailTemplateDetail.body);
      if (dataEmailTemplateDetail.cc) {
        setIsCCOPen(true);
        setTagsCc(dataEmailTemplateDetail.cc);
      }
      if (dataEmailTemplateDetail.bcc) {
        setIsBCCOpen(true);
        setTagsBcc(dataEmailTemplateDetail.bcc);
      }
    }
  }, [dataEmailTemplateDetail, setValue, setTagsTo, setTagsCc, setTagsBcc]);

  const customCloseModal = () => {
    removeEmailTemplateDetail();
    setIsOpen(false);
  };

  const onSubmit = handleSubmit((data) => {
    data.to = tagsTo;
    data.cc = tagsCc;
    data.bcc = tagsBcc;
    const callbackReq = {
      onSuccess: async (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />);
        customCloseModal();
        refetch();
      },
      onError: async (error: any) => {
        toast.custom(() => <CustomToast message={error.message} type='error' />);
      },
    };
    mutate({ emailTemplateId: selectedEmailTemplateId, data: data }, callbackReq);
  });

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setFile(e?.dataTransfer?.files[0]);
  };

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      setFile(e.target.files[0]);
      setValue('attachment', e.target.files[0]);
      e.target.value = '';
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
                <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Email Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>
                  <div className='px-4 pt-4 pb-6 space-x-10 overflow-y-auto h-[750px]'>
                    <div className='sm:col-span-4 mt-2 w-full space-y-2'>
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Subject<span className='text-red-600'> *</span>
                      </label>
                      <input
                        id='subject'
                        type='text'
                        {...register('subject', { required: true })}
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      />
                      <div className='w-full mt-4'>
                        <div className='flex items-center justify-between'>
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                            To<span className='text-red-600'>*</span>
                          </label>
                          {tagsTo.length > 1 && (
                            <button
                              type='button'
                              className='text-xs text-red-600 hover:text-red-800 hover:underline'
                              onClick={() => setTagsTo([])}
                            >
                              Unselect All
                            </button>
                          )}
                        </div>
                        <div className='mt-2 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <EmailField
                              tags={tagsTo}
                              inputValue={inputTo}
                              onInputChange={(value) => {
                                setInputTo(value);
                                setShowTooltip(false);
                              }}
                              onInputFocus={() => {
                                setShowTooltip(false);
                              }}
                              onInputBlur={() => {
                                  if (!inputTo.trim()) {
                                    setShowTooltip(true);
                                  }
                              }}
                              onKeyDown={handleKeyDownTo}
                              onEmployeeSelect={handleEmployeeSelectTo}
                              onRemoveTag={handleRemoveTagTo}
                              showTooltip={showTooltip}
                              tooltipId="to-section-tooltip"
                            />
                          </div>
                          <button
                            type='button'
                            className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                              isCCOpen ? 'bg-savoy-blue text-white hover:bg-blue-700' : 'bg-gray-50'
                            }`}
                            onClick={() => setIsCCOPen(!isCCOpen)}
                          >
                            CC
                          </button>
                          <button
                            type='button'
                            className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                              isBCCOpen ? 'bg-savoy-blue text-white hover:bg-blue-700' : 'bg-gray-50'
                            }`}
                            onClick={() => setIsBCCOpen(!isBCCOpen)}
                          >
                            BCC
                          </button>
                        </div>
                      </div>
                      {isCCOpen && (
                        <div className='w-full mt-4'>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                              CC
                            </label>
                            {tagsCc.length > 1 && (
                              <button
                                type='button'
                                className='text-xs text-red-600 hover:text-red-800 hover:underline'
                                onClick={() => setTagsCc([])}
                              >
                                Unselect All
                              </button>
                            )}
                          </div>
                          <div className='mt-2'>
                            <EmailField
                                tags={tagsCc}
                                inputValue={inputCc}
                                onInputChange={(value) => {
                                  setInputCc(value);
                                  setShowTooltip(false);
                                }}
                                onInputFocus={() => {
                                  setShowTooltip(false);
                                }}
                                onInputBlur={() => {
                                    if (!inputCc.trim()) {
                                      setShowTooltip(true);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                onEmployeeSelect={handleEmployeeSelectCc}
                                onRemoveTag={handleRemoveTag}
                                showTooltip={showTooltip}
                                tooltipId="cc-section-tooltip"
                              />
                          </div>
                        </div>
                      )}
                      {isBCCOpen && (
                        <div className='w-full mt-4'>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='bcc' className='block text-sm font-medium leading-6 text-gray-900'>
                              BCC
                            </label>
                            {tagsBcc.length > 1 && (
                              <button
                                type='button'
                                className='text-xs text-red-600 hover:text-red-800 hover:underline'
                                onClick={() => setTagsBcc([])}
                              >
                                Unselect All
                              </button>
                            )}
                          </div>
                          <div className='mt-2'>
                            <EmailField
                                tags={tagsBcc}
                                inputValue={inputBcc}
                                onInputChange={(value) => {
                                  setInputBcc(value);
                                  setShowTooltip(false);
                                }}
                                onInputFocus={() => {
                                  setShowTooltip(false);
                                }}
                                onInputBlur={() => {
                                  if (!inputBcc.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                onKeyDown={handleKeyDownBcc}
                                onEmployeeSelect={handleEmployeeSelectBcc}
                                onRemoveTag={handleRemoveTagBcc}
                                showTooltip={showTooltip}
                                tooltipId="bcc-section-tooltip"
                              />
                          </div>
                        </div>
                      )}
                      <div className='w-full mt-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Body<span className='text-red-600'> *</span>
                        </label>
                        <div className='mt-2 h-72 mb-12'>
                          <textarea rows={4} {...register('body', { required: true })} id='body' hidden />
                          <ReactQuill
                            onChange={(value) => setValue('body', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%', padding: '5px 8px !important' }}
                            value={watch('body')}
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Attachments<span className='text-red-6000'></span>
                        </label>
                        <div>
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className='block w-full rounded-md border-0 py-14 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                          >
                            <label
                              className={`${
                                file === null
                                  ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                                  : 'hidden'
                              }`}
                            >
                              Drop file to upload
                              <input
                                {...register('attachment')}
                                name='attachment'
                                id='attachment'
                                ref={inputRef}
                                type='file'
                                className='sr-only'
                                onChange={handleChange}
                                accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                              />
                            </label>
                            <div className={`${file !== null ? 'file-preview' : 'hidden'}`}>
                              <p className='text-sm text-slate-800 font-light'>{file?.name}</p>
                              <p className='underline text-blue-500 cursor-pointer' onClick={() => setFile(null)}>
                                Remove File
                              </p>
                            </div>
                          </div>
                          <h1 className='text-xs pl-2'>Maximum file size: 10 mb</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row px-4 justify-end space-x-4'>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-100 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                    <div className='ml-4'>
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
                        {!isLoading && 'Save'}
                      </button>
                    </div>
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
