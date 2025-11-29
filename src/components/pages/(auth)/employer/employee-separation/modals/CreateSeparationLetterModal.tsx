import { Dispatch, Fragment, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from "@tanstack/react-query"; 
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import useGenerateSeparationLetter from '../hooks/useGenerateSeparationLetter';
import CustomToast from '@/components/CustomToast';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface CreateSeparationLetterModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  separationId: number;
  letterType: 'Acceptance' | 'Separation';
  refetch: () => void;
  onSuccess?: (data: any) => void;
  employerName?: string;
  effectiveDate?: string;
}

interface FormData {
  message: string;
  approvedBy: string;
}

export default function CreateSeparationLetterModal({
  isOpen,
  setIsOpen,
  separationId,
  letterType,
  refetch,
  onSuccess,
  employerName,
  effectiveDate
}: CreateSeparationLetterModalProps) {
  const cancelButtonRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: generateLetter } = useGenerateSeparationLetter();
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const profileData = cachedProfile?.state?.data as { name?: string };
  const companyName = profileData?.name || '{company_name}';

  // Default message content based on letter type
  const getDefaultMessage = (type: 'Acceptance' | 'Separation') => {
    const dateStr = effectiveDate ? new Date(effectiveDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }) : '{effective_date}';
    
    if (type === 'Acceptance') {
      return `<p>We acknowledge receipt of your resignation letter and accept your decision to terminate your employment with <strong>${companyName}</strong>.</p>

<p>Your last working day will be <strong>${dateStr}</strong>. Please ensure that all company property, documents, and equipment are returned to the appropriate department before your last day of work. You are also required to complete the clearance process as outlined in the employee handbook.</p>

<p>We appreciate your service and contributions during your employment with us. We wish you success in your future endeavors.</p>

<p>Thank you for your understanding and cooperation.</p>`;
    } else {
      return `<p>This letter serves as formal notification of the termination of your employment with <strong>${companyName}</strong>, effective <strong>${dateStr}</strong>.</p>

<p>Please ensure that all company property, documents, and equipment are returned to the appropriate department before your last day of work. You are also required to complete the clearance process as outlined in the employee handbook.</p>

<p>We appreciate your service and contributions during your employment with us.</p>

<p>Thank you for your understanding and cooperation.</p>`;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      message: getDefaultMessage(letterType),
      approvedBy: ''
    }
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);

    generateLetter({
      separation_id: separationId,
      letter_type: letterType,
      message: data.message,
      approved_by: data.approvedBy
    }, {
      onSuccess: (responseData) => {
        toast.custom(() => (
          <CustomToast 
            message={`Successfully generated ${letterType} letter with custom message`} 
            type='success' 
          />
        ), {
          duration: 5000,
        });

        // Reset form and close modal
        reset();
        setIsOpen(false);
        
        // Refetch data to get updated attachment
        refetch();
        
        // Call success callback to open email modal
        if (onSuccess) {
          onSuccess(responseData);
        }
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Create Letter of {letterType}
                    </Dialog.Title>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg 
                            className="h-5 w-5 text-blue-400" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Letter Content Editor
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>
                              Review and customize the default letter content below. 
                              The content has been pre-filled with standard text that you can modify as needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                          Letter Content
                        </label>
                        <div className="mt-2">
                          <Controller
                            name="message"
                            control={control}
                            rules={{ 
                              required: 'Letter content is required',
                              validate: (value) => {
                                // Check if the content is not just empty HTML tags
                                const textContent = value.replace(/<[^>]*>/g, '').trim();
                                return textContent.length > 0 || 'Letter content cannot be empty';
                              }
                            }}
                            render={({ field: { onChange, value } }) => (
                              <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={onChange}
                                modules={QUILL_MODULES}
                                formats={QUILL_FORMATS}
                                style={{ 
                                  height: '250px',
                                  marginBottom: '50px' 
                                }}
                                placeholder="Enter the letter content..."
                              />
                            )}
                          />
                        </div>
                        {errors.message && (
                          <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      <div className="mt-6">
                        <label htmlFor="approvedBy" className="block text-sm font-medium leading-6 text-gray-900">
                          Approved by
                        </label>
                        <div className="mt-2">
                          <Controller
                            name="approvedBy"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <input
                                type="text"
                                value={value}
                                onChange={onChange}
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6"
                                placeholder="Enter the name of the approving authority..."
                              />
                            )}
                          />
                        </div>
                        {errors.approvedBy && (
                          <p className="mt-2 text-sm text-red-600">{errors.approvedBy.message}</p>
                        )}
                      </div>

                      <div className="mt-12 sm:mt-16 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Generating...' : `Generate ${letterType} Letter`}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={handleClose}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
