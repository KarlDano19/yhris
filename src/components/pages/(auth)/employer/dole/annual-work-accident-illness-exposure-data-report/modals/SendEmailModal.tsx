import { Dispatch, Fragment, useRef, useEffect, useState, useMemo } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useGetEmailTemplateItems from '@/components/hooks/useGetEmailTemplateItems';
import useSendEmail from '../hooks/useSendEmail';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

type FormValues = {
    template: string;
    subject: string;
    to: string;
    message: string;
    cc: string;
    bcc: string;
  };

type T_ModalData = {
  id: number;
  open: boolean;
};

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const trimmed = html.trim();
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>';
};

export default function SendEmailModal({
    refetch,
    isOpen,
    setIsOpen,
}: {
    refetch: any;
    isOpen: T_ModalData;
    setIsOpen: Dispatch<T_ModalData | null>;
}) {
    const cancelButtonRef = useRef(null);
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
    const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
    const [isCCOpen, setIsCCOPen] = useState(false);
    const [isBCCOpen, setIsBCCOpen] = useState(false);
    const [inputTo, setInputTo] = useState('');
    const [inputCc, setInputCc] = useState('');
    const [inputBcc, setInputBcc] = useState('');
    const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
    const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
    const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
    const { register, handleSubmit, reset, setValue, watch, trigger, formState: { errors }, setError, clearErrors } = useForm<FormValues>({
        defaultValues: {
            template: '',
            subject: '',
            to: '',
            message: '',
        },
    });
    const { data: dataEmailTemplate } = useGetEmailTemplateItems();
    const { mutate, isLoading } = useSendEmail();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    useEffect(() => {
        if (selectedTemplate && dataEmailTemplate) {
            const template = dataEmailTemplate.find((item: any) => item.id === parseInt(selectedTemplate));
            if (template) {
                setValue('subject', template.subject);
                if (employeeEmail) {
                    setTagsTo([employeeEmail, ...template.to]);
                } else {
                    setTagsTo(template.to);
                }
                if (template.bcc) {
                    setIsBCCOpen(true);
                    setTagsBcc(template.bcc);
                }
                if (template.cc) {
                    setIsCCOPen(true);
                    setTagsCc(template.cc);
                }
                setValue('message', template.body);
            }
        } else {
            // Clear template-related fields if no template is selected
            setTagsTo(employeeEmail ? [employeeEmail] : []);
            setTagsCc([]);
            setTagsBcc([]);
            setValue('message', '');
        }
    }, [selectedTemplate, dataEmailTemplate, employeeEmail, setTagsTo, setTagsCc, setTagsBcc, setValue]);
    
    // Clear errors when tagsTo changes
    useEffect(() => {
        if (tagsTo.length > 0) {
            clearErrors('to');
        }
    }, [tagsTo, clearErrors]);

    // Clear errors when message changes
    useEffect(() => {
        const messageContent = watch('message');
        // Only clear errors when message has actual content
        if (!isHtmlEmpty(messageContent)) {
            clearErrors('message');
        }
    }, [watch('message'), clearErrors]);

    // Clear errors when subject changes
    useEffect(() => {
        const subjectContent = watch('subject');
        if (subjectContent && subjectContent.trim() !== '') {
            clearErrors('subject');
        }
    }, [watch('subject'), clearErrors]);

    const onSubmit = handleSubmit((data) => {
        // Validate "To" field manually since it uses tags
        if (tagsTo.length === 0) {
            setError('to', {
                type: 'manual',
                message: 'At least one recipient is required'
            });
            toast.custom(() => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />, { duration: 2000 });
            return;
        }
        
        const payload = {
            ...data,
            to: tagsTo,
            cc: tagsCc,
            bcc: tagsBcc
        };

        const callbackReq = {
            onSuccess: () => {
                setIsOpen({ id: 0, open: false });
                refetch();
                toast.custom(() => <CustomToast message={'Successfully sent email.'} type='success' />, {
                    duration: 5000,
                  });
            },
            onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 });
            }
        }
        mutate(payload, callbackReq);
    });

    const customCloseModal = () => {
      // Reset form state
      // add reset state here if needed
      
      // Close the modal
      setIsOpen({ id: 0, open: false });
    };

    return (
        <>
          <Transition.Root show={isOpen.open} as={Fragment}>
            <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen({ id: 0, open: false })}>
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
                        <h3 className='flex-1 text-white ml-2 font-semibold'>Send Contract</h3>
                        <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen({ id: 0, open: false })} />
                      </div>
                      <form onSubmit={onSubmit}>
                        <div className='px-4 pt-4 pb-6'>
                          <div className='sm:col-span-4'>
                            <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                              Email Template
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='template'
                                {...register('template')}
                                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                onChange={(event) => {
                                    setSelectedTemplate(event.target.value);
                                }}
                              >
                                <option value=''>Select...</option>
                                {(dataEmailTemplate || []).map((item: any) => (
                                  <option key={item.id} value={item.id}>
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
                              Subject<span className='text-red-600'>*</span>
                            </label>
                            {errors.subject && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.subject.message}
                              </p>
                            )}
                            <input
                              type='text'
                              id='subject'
                              {...register('subject', { required: 'Subject is required' })}
                              className='mt-2 block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                              onChange={(e) => {
                                setValue('subject', e.target.value);
                                if (e.target.value.trim() !== '') {
                                  clearErrors('subject');
                                } else {
                                  setError('subject', {
                                    type: 'manual',
                                    message: 'Subject is required'
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className='sm:col-span-4 mt-4'>
                            <label htmlFor='to' className='block text-sm font-medium leading-6 text-gray-900'>
                              To<span className='text-red-600'>*</span>
                            </label>
                            {errors.to && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.to.message}
                              </p>
                            )}
                            <div className='mt-2 flex rounded-md shadow-sm'>
                              <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                                <div 
                                  className='relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full'
                                  data-tooltip-id='to-section-tooltip'
                                  data-tooltip-place='bottom'
                                >
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
                                    type='text'
                                    value={inputTo}
                                    onKeyDown={handleKeyDownTo}
                                    onChange={(e) => setInputTo(e.target.value)}
                                    className='focus:none outline-none px-2 py-1 grow'
                                  />
                                  <Tooltip id='to-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                                    <div className='px-1'>
                                      <h2 className='text-[12px] font-medium'>
                                        Add multiple recipients by pressing Tab or Enter.
                                      </h2>
                                    </div>
                                  </Tooltip>
                                </div>
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
                            <div className='sm:col-span-4 mt-4'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                CC
                              </label>
                              <div className='mt-2'>
                                <div 
                                  className='relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full'
                                  data-tooltip-id='cc-section-tooltip'
                                  data-tooltip-place='bottom'
                                >
                                  {tagsCc.map((tag: string) => (
                                    <div
                                      key={tag}
                                      className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
                                    >
                                      <button type='button' onClick={() => handleRemoveTag(tag)}>
                                        <XMarkIcon className='w-4 h-4' />
                                      </button>
                                      <p>{tag}</p>
                                    </div>
                                  ))}
                                  <input
                                    type='text'
                                    value={inputCc}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setInputCc(e.target.value)}
                                    className='focus:none outline-none px-2 py-1 grow rounded-md'
                                  />
                                  <Tooltip id='cc-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                                    <div className='px-1'>
                                      <h2 className='text-[12px] font-medium'>
                                        Add multiple recipients by pressing Tab or Enter.
                                      </h2>
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          )}
                          {isBCCOpen && (
                            <div className='sm:col-span-4 mt-4'>
                              <label htmlFor='bcc' className='block text-sm font-medium leading-6 text-gray-900'>
                                BCC
                              </label>
                              <div className='mt-2'>
                                <div 
                                  className='relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full text-sm'
                                  data-tooltip-id='bcc-section-tooltip'
                                  data-tooltip-place='bottom'
                                >
                                  {tagsBcc.map((tagBcc: string) => (
                                    <div
                                      key={tagBcc}
                                      className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
                                    >
                                      <button type='button' onClick={() => handleRemoveTagBcc(tagBcc)}>
                                        <XMarkIcon className='w-4 h-4' />
                                      </button>
                                      <p>{tagBcc}</p>
                                    </div>
                                  ))}
                                  <input
                                    type='text'
                                    value={inputBcc}
                                    onKeyDown={handleKeyDownBcc}
                                    onChange={(e) => setInputBcc(e.target.value)}
                                    className='focus:none outline-none px-2 py-1 grow rounded-md'
                                  />
                                  <Tooltip id='bcc-section-tooltip' opacity={1} style={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#222C3B' }}>
                                    <div className='px-1'>
                                      <h2 className='text-[12px] font-medium'>
                                        Add multiple recipients by pressing Tab or Enter.
                                      </h2>
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className='sm:col-span-4 mt-4'>
                            <label htmlFor='message' className='block text-sm font-medium leading-6 text-gray-900'>
                              Message<span className='text-red-600'>*</span>
                            </label>
                            {errors.message && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.message.message}
                              </p>
                            )}
                            <div className='mt-2 h-72 mb-12'>
                              <textarea rows={4} {...register('message', { required: 'Message is required' })} id='message' hidden />
                              <ReactQuill
                                onChange={(value) => {
                                  setValue('message', value);
                                  // Only clear errors when there is actual content
                                  if (!isHtmlEmpty(value)) {
                                    clearErrors('message');
                                  } else {
                                    // Set error when content is empty or just a blank line
                                    setError('message', {
                                      type: 'manual',
                                      message: 'Message is required'
                                    });
                                  }
                                }}
                                formats={QUILL_FORMATS}
                                modules={QUILL_MODULES}
                                style={{ height: '100%', padding: '5px 8px !important' }}
                                value={watch('message')}
                              />
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                          <button
                            type='submit'
                            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto disabled:opacity-50'
                            disabled={isLoading}
                            onClick={async (e) => {
                              // Trigger validation for all required fields
                              const subjectValid = await trigger('subject');
                              
                              // Check message content specifically for empty HTML
                              const messageContent = watch('message');
                              let messageValid = !isHtmlEmpty(messageContent);
                              
                              if (!messageValid) {
                                setError('message', {
                                  type: 'manual',
                                  message: 'Message is required'
                                });
                              }
                              
                              // Check if all validations pass
                              if (!subjectValid || !messageValid || tagsTo.length === 0) {
                                e.preventDefault();
                                // Set error for "to" field if no recipients
                                if (tagsTo.length === 0) {
                                  setError('to', {
                                    type: 'manual',
                                    message: 'At least one recipient is required'
                                  });
                                }
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
        </>
      );
}