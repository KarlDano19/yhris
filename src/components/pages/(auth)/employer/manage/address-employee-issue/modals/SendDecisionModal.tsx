import { Dispatch, Fragment, useMemo, useRef, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useGetEmailTemplateItems from '@/components/hooks/useGetEmailTemplateItems';
import usePatchEmployeeIssueItems from '../hooks/usePatchEmployeeIssueItems';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import { T_SendDecisionModal } from '@/types/globals';

import 'react-quill/dist/quill.snow.css';

type FormValues = {
  template: string;
  subject: string;
  email: string;
  to: string;
  message: string;
  cc: string;
  bcc: string;
};

function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function SendDecisionModal({
  employeeIssueItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
  refetch,
}: {
  employeeIssueItems: any;
  setEmployeeIssueItems: any;
  isOpen: T_SendDecisionModal | null;
  setIsOpen: Dispatch<T_SendDecisionModal | null>;
  refetch?: () => void;
}) {
  const cancelButtonRef = useRef(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
  const [applicantEmail, setApplicantEmail] = useState<string | null>(null);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const { register, handleSubmit, reset, watch, setValue, trigger, formState: { errors }, setError, clearErrors } = useForm<FormValues>({
    defaultValues: {
      template: '',
      message: '',
    },
  });
  const { data: dataEmailTemplate } = useGetEmailTemplateItems();
  const { mutate, isLoading } = usePatchEmployeeIssueItems();

  useEffect(() => {
    if (isOpen && isOpen.id) {
      const itemIndex = employeeIssueItems.findIndex((item: any) => item.id === isOpen.id);
      const employeeIssueItemsCopy = JSON.parse(JSON.stringify(employeeIssueItems));
      if (employeeIssueItemsCopy[itemIndex]) {
        setApplicantEmail(employeeIssueItemsCopy[itemIndex].email);
        // Do not clear tagsTo here to preserve the To field
      }
    }
  }, [isOpen]);

  // Clear errors when tagsTo changes
  useEffect(() => {
    if (tagsTo.length > 0) {
      clearErrors('to');
    }
  }, [tagsTo, clearErrors]);

  // Clear errors when message changes
  useEffect(() => {
    if (watch('message') && watch('message').trim() !== '') {
      clearErrors('message');
    }
  }, [watch('message'), clearErrors]);

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
    if (isOpen && isOpen.id) {
      const itemIndex = employeeIssueItems.findIndex((item: any) => item.id === isOpen.id);
      const employeeIssueItemsCopy = JSON.parse(JSON.stringify(employeeIssueItems));
      const template = dataEmailTemplate.find((item: any) => item.id === parseInt(data.template));
      employeeIssueItemsCopy[itemIndex].id = isOpen.id;
      employeeIssueItemsCopy[itemIndex].actionType = 'sending';
      employeeIssueItemsCopy[itemIndex].emailType = 'decision';
      employeeIssueItemsCopy[itemIndex].sendDecisionForm.subject = data.subject;
      employeeIssueItemsCopy[itemIndex].sendDecisionForm.template = template ? template.subject : '';
      employeeIssueItemsCopy[itemIndex].sendDecisionForm.to = tagsTo;
      if (tagsCc) {
        employeeIssueItemsCopy[itemIndex].sendDecisionForm.cc = tagsCc;
      }
      if (tagsBcc) {
        employeeIssueItemsCopy[itemIndex].sendDecisionForm.bcc = tagsBcc;
      }
      const plainMessage = stripHtml(data.message);
      employeeIssueItemsCopy[itemIndex].sendDecisionForm.message = plainMessage;
      employeeIssueItemsCopy[itemIndex].isDecisionSent = true;
      // Save decision_to, decision_cc, decision_bcc as JSON stringified arrays
      employeeIssueItemsCopy[itemIndex].decision_subject = data.subject;
      employeeIssueItemsCopy[itemIndex].decision_to = JSON.stringify(tagsTo);
      employeeIssueItemsCopy[itemIndex].decision_cc = JSON.stringify(tagsCc);
      employeeIssueItemsCopy[itemIndex].decision_bcc = JSON.stringify(tagsBcc);
      employeeIssueItemsCopy[itemIndex].decision_message = plainMessage;
      const callbackReq = {
        onSuccess: (data: any) => {
          setEmployeeIssueItems([...employeeIssueItemsCopy]);
          setIsOpen(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          reset();
          if (refetch) {
            refetch();
          }
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Send Decision</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
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
                              const template = dataEmailTemplate.find(
                                (item: any) => item.id === parseInt(event.target.value)
                              );
                              if (template) {
                                setValue('subject', template.subject);
                                // Just set the template's to addresses directly
                                setTagsTo(template.to || []);
                                
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
                            }}
                          >
                            <option value='' disabled>
                              Select...
                            </option>
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
                        />
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
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
                                onChange={(e) => setInputTo(e.target.value)} // Add this line to update input state
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
                                onChange={(e) => setInputCc(e.target.value)} // Add this line to update input state
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
                              className='relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full'
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
                                onChange={(e) => setInputBcc(e.target.value)} // Add this line to update input state
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
                              trigger('message');
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
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                        disabled={isLoading}
                        onClick={async () => {
                          // Trigger validation for all required fields
                          const subjectValid = await trigger('subject');
                          const messageValid = await trigger('message');
                          const toValid = await trigger('to');
                          // Check if all validations pass
                          if (!subjectValid || !toValid || !messageValid) {
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
