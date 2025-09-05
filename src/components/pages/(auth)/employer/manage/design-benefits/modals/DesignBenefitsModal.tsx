import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useAddBenefitItems from '../hooks/useAddBenefitItems';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { T_Benefit } from '@/types/globals';

export default function DesignBenefitsModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean | null;
  setIsOpen: Dispatch<boolean | null>;
  refetch: any;
}) {
  const cancelButtonRef = useRef(null);
  const [page, setPage] = useState(1);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const { tagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const { register, handleSubmit, reset, trigger, getValues, setValue, clearErrors, watch, formState: { errors }, setError } = useForm<T_Benefit>();
  const { mutate, isLoading } = useAddBenefitItems();

  const onSubmit = handleSubmit((data) => {
    data.email = tagsTo;
    if (tagsCc) {
      data.cc = tagsCc;
    }
    if (tagsBcc) {
      data.bcc = tagsBcc;
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
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

  // Clear errors when title changes
  useEffect(() => {
    const titleValue = watch('title');
    if (titleValue && titleValue !== "") {
      clearErrors('title');
    }
  }, [watch('title'), clearErrors]);

  // Clear errors when tagsTo changes
  useEffect(() => {
    if (tagsTo.length > 0) {
      clearErrors('email');
    }
  }, [tagsTo, clearErrors]);

  // Clear errors when purpose changes
  useEffect(() => {
    const purposeValue = watch('purpose');
    if (purposeValue && purposeValue !== "") {
      clearErrors('purpose');
    }
  }, [watch('purpose'), clearErrors]);

  // Clear errors when purpose changes
  useEffect(() => {
    const benefitsValue = watch('benefits');
    if (benefitsValue && benefitsValue !== "") {
      clearErrors('benefits');
    }
  }, [watch('benefits'), clearErrors]);

  // Clear errors when coverage changes
  useEffect(() => {
    const coverageValue = watch('coverage');
    if (coverageValue && coverageValue !== "") {
      clearErrors('coverage');
    }
  }, [watch('coverage'), clearErrors]);

  // Clear errors when eligibility changes
  useEffect(() => {
    const eligibilityValue = watch('eligibility');
    if (eligibilityValue && eligibilityValue !== "") {
      clearErrors('eligibility');
    }
  }, [watch('eligibility'), clearErrors]);

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
    }
  }, [isOpen]);

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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Design Benefits</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                  </div>
                  <form onSubmit={onSubmit}>
                    {page === 1 ? (
                      <div className='px-4 pt-4 pb-6'>
                        <div className='sm:col-span-4'>
                          <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-900'>
                            Title<span className='text-red-600'>*</span>
                          </label>
                          {errors.title && (
                            <p className='text-xs text-red-600 mt-1'>
                              {errors.title.message || 'Title is required.'}
                            </p>
                          )}
                          <div className='relative mt-2'>
                            <input
                              id='title'
                              {...register('title', { required: true })}
                              type='text'
                              autoComplete='title'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                            To<span className='text-red-600'>*</span>
                          </label>
                          {errors.email && (
                            <p className='text-xs text-red-600 mt-1'>
                              {errors.email.message || 'To field is required.'}
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
                            <label htmlFor='cc' className='block text-sm font-medium leading-6 text-gray-900'>
                              CC
                            </label>
                            {errors.cc && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.cc.message}
                              </p>
                            )}
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
                            {errors.bcc && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.bcc.message}
                              </p>
                            )}
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
                          <label htmlFor='purpose' className='block text-sm font-medium leading-6 text-gray-900'>
                            Purpose<span className='text-red-600'>*</span>
                          </label>
                          {errors.purpose && (
                            <p className='mt-1 text-xs text-red-600'>{errors.purpose.message}</p>
                          )}
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('purpose', { 
                                required: true,
                                maxLength: {
                                  value: 100,
                                  message: 'You have reached the 100 characters limit'
                                }
                              })}
                              id='purpose'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='benefits' className='block text-sm font-medium leading-6 text-gray-900'>
                            Benefits<span className='text-red-600'>*</span>
                          </label>
                          {errors.benefits && (
                            <p className='mt-1 text-xs text-red-600'>{errors.benefits.message}</p>
                          )}
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('benefits', { 
                                required: true,
                                maxLength: {
                                  value: 100,
                                  message: 'You have reached the 100 characters limit'
                                }
                              })}
                              id='benefits'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='px-4 pt-4 pb-6'>
                        <div className='sm:col-span-4'>
                          <label htmlFor='coverage' className='block text-sm font-medium leading-6 text-gray-900'>
                            Coverage<span className='text-red-600'>*</span>
                          </label>
                          {errors.coverage && (
                            <p className='text-xs text-red-600 mt-1'>
                              {errors.coverage.message || 'Coverage is required.'}
                            </p>
                          )}
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('coverage', { 
                                required: true,
                                maxLength: {
                                  value: 100,
                                  message: 'You have reached the 100 characters limit'
                                }
                              })}
                              id='coverage'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='eligibility' className='block text-sm font-medium leading-6 text-gray-900'>
                            Eligibility<span className='text-red-600'>*</span>
                          </label>
                          {errors.eligibility && (
                            <p className='text-xs text-red-600 mt-1'>
                              {errors.eligibility.message || 'Eligibility is required.'}
                            </p>
                          )}
                          <div className='mt-2'>
                            <textarea
                              rows={4}
                              {...register('eligibility', { 
                                required: true,
                                maxLength: {
                                  value: 100,
                                  message: 'You have reached the 100 characters limit'
                                }
                              })}
                              id='eligibility'
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <hr />
                    {page === 1 ? (
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='button'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          onClick={async (e) => {
                            e.preventDefault(); // Prevent any potential form submission
                            
                            const titleValue = watch('title');
                            const purposeValue = watch('purpose');
                            const benefitsValue = watch('benefits');
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            let hasErrors = false;
                            
                            // Clear any existing errors first
                            clearErrors(['title', 'email', 'purpose', 'benefits', 'cc', 'bcc']);
                            
                            // Validate title field
                            if (!titleValue || titleValue === "") {
                              setError("title", {
                                type: "manual",
                                message: "Title is required."
                              });
                              hasErrors = true;
                            }
                            
                            // Validate purpose field
                            if (!purposeValue || purposeValue === "") {
                              setError("purpose", {
                                type: "manual",
                                message: "Purpose is required."
                              });
                              hasErrors = true;
                            }
                            
                            // Validate benefits field
                            if (!benefitsValue || benefitsValue === "") {
                              setError("benefits", {
                                type: "manual",
                                message: "Benefits is required."
                              });
                              hasErrors = true;
                            }
                            
                            // Validate To field
                            if (tagsTo.length === 0) {
                              setError("email", {
                                type: "manual",
                                message: "To field is required."
                              });
                              hasErrors = true;
                            } else {
                              // Validate email format only if there are emails
                              const invalidEmails = tagsTo.filter(email => !emailRegex.test(email));
                              if (invalidEmails.length > 0) {
                                setError("email", {
                                  type: "manual",
                                  message: "Please enter valid email addresses."
                                });
                                hasErrors = true;
                              }
                            }
                            
                            // Validate CC field if open and has emails (only validate format, not required)
                            if (isCCOpen && tagsCc.length > 0) {
                              const invalidCcEmails = tagsCc.filter(email => !emailRegex.test(email));
                              if (invalidCcEmails.length > 0) {
                                setError("cc", {
                                  type: "manual",
                                  message: "Please enter valid email addresses."
                                });
                                hasErrors = true;
                              }
                            }
                            
                            // Validate BCC field if open and has emails (only validate format, not required)
                            if (isBCCOpen && tagsBcc.length > 0) {
                              const invalidBccEmails = tagsBcc.filter(email => !emailRegex.test(email));
                              if (invalidBccEmails.length > 0) {
                                setError("bcc", {
                                  type: "manual",
                                  message: "Please enter valid email addresses."
                                });
                                hasErrors = true;
                              }
                            }

                            // If there are errors, focus on the first invalid field and return
                            if (hasErrors) {
                              if (!titleValue || titleValue === "") {
                                const el = document.getElementById("title");
                                if (el) el.focus();
                              } else if (!purposeValue || purposeValue === "") {
                                const el = document.getElementById("purpose");
                                if (el) el.focus();
                              } else if (!benefitsValue || benefitsValue === "") {
                                const el = document.getElementById("benefits");
                                if (el) el.focus();
                              } else if (tagsTo.length === 0) {
                                // Focus on the email input field
                                const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (emailInput) emailInput.focus();
                              }
                              return;
                            }
                            
                            // If validation passes, proceed to next page
                            setPage(2);
                          }}
                        >
                          Next
                        </button>
                      </div>
                    ) : (
                      <div className='mt-5 sm:mt-4 sm:flex px-4'>
                        <div className='flex-1'>
                          <button
                            type='button'
                            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                            onClick={() => setPage(1)}
                          >
                            Back
                          </button>
                        </div>
                        <button
                          type='submit'
                          className='flex-none inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
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
                          {!isLoading && 'Send'}
                        </button>
                      </div>
                    )}
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
