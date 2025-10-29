import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import EmailField from '@/components/common/EmailField';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useAddBenefitItems from '../hooks/useAddBenefitItems';

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
  const [isCCOpen, setIsCCOpen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const [isToFocused, setIsToFocused] = useState(false);
  const [isCcFocused, setIsCcFocused] = useState(false);
  const [isBccFocused, setIsBccFocused] = useState(false);
  
  // Modal state
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const { register, handleSubmit, reset, trigger, getValues, setValue, clearErrors, watch, formState: { errors }, setError } = useForm<T_Benefit>();
  const { mutate, isLoading } = useAddBenefitItems();

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

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const title = watch('title');
    const purpose = watch('purpose');
    const benefits = watch('benefits');
    const coverage = watch('coverage');
    const eligibility = watch('eligibility');
    
    return (
      (title && title.trim() !== '') ||
      (purpose && purpose.trim() !== '') ||
      (benefits && benefits.trim() !== '') ||
      (coverage && coverage.trim() !== '') ||
      (eligibility && eligibility.trim() !== '') ||
      tagsTo.length > 0 ||
      tagsCc.length > 0 ||
      tagsBcc.length > 0
    );
  };

  // Function to handle confirmation modal close (cancel)
  const handleUnsavedChangesCancel = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingCloseAction(null);
  };

  // Function to handle confirmation modal confirm (proceed with close)
  const handleUnsavedChangesConfirm = () => {
    setIsUnsavedChangesModalOpen(false);
    const action = pendingCloseAction;
    setPendingCloseAction(null);
    
    // Execute the pending close action
    if (action) {
      action();
    }
  };

  // Function to handle modal close with unsaved changes check
  const handleModalClose = (closeAction: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingCloseAction(() => closeAction);
      setIsUnsavedChangesModalOpen(true);
    } else {
      closeAction();
    }
  };


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
  }, [watch, clearErrors]);

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
  }, [watch, clearErrors]);

  // Clear errors when benefits changes
  useEffect(() => {
    const benefitsValue = watch('benefits');
    if (benefitsValue && benefitsValue !== "") {
      clearErrors('benefits');
    }
  }, [watch, clearErrors]);

  // Clear errors when coverage changes
  useEffect(() => {
    const coverageValue = watch('coverage');
    if (coverageValue && coverageValue !== "") {
      clearErrors('coverage');
    }
  }, [watch, clearErrors]);

  // Clear errors when eligibility changes
  useEffect(() => {
    const eligibilityValue = watch('eligibility');
    if (eligibilityValue && eligibilityValue !== "") {
      clearErrors('eligibility');
    }
  }, [watch, clearErrors]);

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setIsToFocused(false);
      setIsCcFocused(false);
      setIsBccFocused(false);
    }
  }, [isOpen]);


  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => {
          handleModalClose(() => {
            reset();
            setIsOpen(null);
          });
        }}>
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
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => {
                      handleModalClose(() => {
                        reset();
                        setIsOpen(null);
                      });
                    }} />
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
                          {errors.email && (
                            <p className='text-xs text-red-600 mt-1'>
                              {errors.email.message || 'To field is required.'}
                            </p>
                          )}
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
                                  setIsToFocused(true);
                                }}
                                onInputBlur={() => {
                                  setIsToFocused(false);
                                  if (!inputTo.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                onKeyDown={handleKeyDownTo}
                                onEmployeeSelect={handleEmployeeSelectTo}
                                onRemoveTag={handleRemoveTagTo}
                                showTooltip={showTooltip}
                                tooltipId="to-section-tooltip"
                                isFocused={isToFocused}
                              />
                            </div>
                            <button
                              type='button'
                              className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                                isCCOpen ? 'bg-savoy-blue text-white hover:bg-blue-700' : 'bg-gray-50'
                              }`}
                              onClick={() => setIsCCOpen(!isCCOpen)}
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
                            <div className='flex items-center justify-between'>
                            <label htmlFor='cc' className='block text-sm font-medium leading-6 text-gray-900'>
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
                            {errors.cc && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.cc.message}
                              </p>
                            )}
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
                                  setIsCcFocused(true);
                                }}
                                onInputBlur={() => {
                                  setIsCcFocused(false);
                                  if (!inputCc.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                onKeyDown={handleKeyDown}
                                onEmployeeSelect={handleEmployeeSelectCc}
                                onRemoveTag={handleRemoveTag}
                                showTooltip={showTooltip}
                                tooltipId="cc-section-tooltip"
                                isFocused={isCcFocused}
                              />
                            </div>
                          </div>
                        )}
                        {isBCCOpen && (
                          <div className='sm:col-span-4 mt-4'>
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
                            {errors.bcc && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.bcc.message}
                              </p>
                            )}
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
                                  setIsBccFocused(true);
                                }}
                                onInputBlur={() => {
                                  setIsBccFocused(false);
                                  if (!inputBcc.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                onKeyDown={handleKeyDownBcc}
                                onEmployeeSelect={handleEmployeeSelectBcc}
                                onRemoveTag={handleRemoveTagBcc}
                                showTooltip={showTooltip}
                                tooltipId="bcc-section-tooltip"
                                isFocused={isBccFocused}
                              />
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
      
      {/* Unsaved Changes Confirmation Modal */}
      {isUnsavedChangesModalOpen && (
        <UnsavedChangesModal
          isOpen={isUnsavedChangesModalOpen}
          onClose={handleUnsavedChangesCancel}
          onConfirm={handleUnsavedChangesConfirm}
          isLoading={false}
          isSwitchingEmployee={false}
          contentType="benefit"
        />
      )}
      
      {/* Tooltips */}
      <Tooltip id='to-section-tooltip' />
      <Tooltip id='cc-section-tooltip' />
      <Tooltip id='bcc-section-tooltip' />
    </>
  );
}
