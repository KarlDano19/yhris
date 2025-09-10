import { Dispatch, Fragment, useMemo, useRef, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useGetEmailTemplateItems from '@/components/hooks/useGetEmailTemplateItems';
import usePatchEmployeeIssueItems from '../hooks/usePatchEmployeeIssueItems';
import useGetEmployeeIssueDetails from '../hooks/useGetEmployeeIssueDetails';
import { useDeleteNTEAttachment } from '../hooks/useDeleteNTEAttachment';

import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';
import ClipIcon from '@/svg/ClipIcon';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import { T_SendNTEModal } from '@/types/globals';

import 'react-quill/dist/quill.snow.css';

type FormValues = {
  template: string;
  subject: string;
  email: string;
  message: string;
  cc: string;
  bcc: string;
  to: string;
};

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const trimmed = html.trim();
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>';
};

function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function SendNTEModal({
  employeeIssueItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
  refetch,
}: {
  employeeIssueItems: any;
  setEmployeeIssueItems: any;
  isOpen: T_SendNTEModal | null;
  setIsOpen: Dispatch<T_SendNTEModal | null>;
  refetch?: () => void;
}) {
  const cancelButtonRef = useRef(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
  const [applicantEmail, setApplicantEmail] = useState<string | null>(null);
  const [isCCOpen, setIsCCOpen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const { register, handleSubmit, reset, watch, setValue, trigger, formState: { errors }, setError, clearErrors } = useForm<FormValues>({
    defaultValues: {
      template: '',
      subject: '',
      message: '',
      email: '',
      cc: '',
      bcc: '',
      to: '',
    },
  });
  const { data: dataEmailTemplate } = useGetEmailTemplateItems();
  const { mutate, isLoading } = usePatchEmployeeIssueItems();
  const { mutate: deleteNTEAttachment, isLoading: isDeleting } = useDeleteNTEAttachment();
  const [pdfAttachment, setPdfAttachment] = useState<string | null>(null);
  // Fetch employee issue details to get attachment
  const { data: employeeIssueDetails } = useGetEmployeeIssueDetails(isOpen?.id || null);

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const subject = watch('subject');
    const message = watch('message');
    
    // Check if tagsTo has more than just the applicant email (user-added recipients)
    const hasUserAddedRecipients = tagsTo.length > 1 || (tagsTo.length === 1 && tagsTo[0] !== applicantEmail);
    
    return (
      (subject && subject.trim() !== '') ||
      (!isHtmlEmpty(message)) ||
      selectedTemplateId !== '' ||
      hasUserAddedRecipients ||
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

  // Function to reset all form data
  const resetFormData = () => {
    setSelectedTemplateId('');
    setValue('template', '');
    setValue('subject', '');
    setValue('message', '');
    setMessageContent('');
    setTagsTo([]);
    setTagsCc([]);
    setTagsBcc([]);
    setIsCCOpen(false);
    setIsBCCOpen(false);
    setCurrentEmployeeId(null);
    setIsInitialized(false);
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

  useEffect(() => {
    if (isOpen && isOpen.id && employeeIssueDetails) {
      const employeeEmail = employeeIssueDetails.email;
      setApplicantEmail(employeeEmail);
      
      // Check if this is a different employee than the current one
      const isDifferentEmployee = currentEmployeeId !== isOpen.id;
      
      if (isDifferentEmployee) {
        // Reset everything for new employee
        resetFormData();
        
        // Set the employee email for new employee
        if (employeeEmail) {
          setTagsTo([employeeEmail]);
        }
      }
      
      // Update current employee ID
      setCurrentEmployeeId(isOpen.id);
      
      // Always reset initialization flag when modal opens to ensure fresh data is loaded
      setIsInitialized(false);
    }
  }, [isOpen, employeeIssueDetails, setTagsTo, setValue, setTagsCc, setTagsBcc, currentEmployeeId]);


  // Prefill fields from backend when details are loaded
  useEffect(() => {
    if (employeeIssueDetails && isOpen && isOpen.id) {
      // Always populate the form when we have fresh data and the modal is open
      setValue('subject', employeeIssueDetails.nte_subject || '');
      
      // Set tagsTo from backend data, or fall back to employee email if not set
      if (employeeIssueDetails.nte_to) {
        setTagsTo(JSON.parse(employeeIssueDetails.nte_to));
      } else if (applicantEmail) {
        // If no backend data but we have the applicant email, use it
        setTagsTo([applicantEmail]);
      }
      
      setTagsCc(employeeIssueDetails.nte_cc ? JSON.parse(employeeIssueDetails.nte_cc) : []);
      setTagsBcc(employeeIssueDetails.nte_bcc ? JSON.parse(employeeIssueDetails.nte_bcc) : []);
      setValue('message', employeeIssueDetails.nte_message || '');
      setMessageContent(employeeIssueDetails.nte_message || '');
      if (employeeIssueDetails.nte_attachment) {
        setPdfAttachment(employeeIssueDetails.nte_attachment);
      }
      setIsInitialized(true);
    }
  }, [employeeIssueDetails, setTagsTo, setTagsCc, setTagsBcc, setValue, applicantEmail, isOpen]);

  // Clear errors when subject changes
  useEffect(() => {
    const subjectContent = watch('subject');
    if (subjectContent && subjectContent.trim() !== '') {
      clearErrors('subject');
    }
  }, [watch('subject'), clearErrors]);

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

  // Watch for template selection changes and update form fields
  useEffect(() => {
    if (selectedTemplateId && dataEmailTemplate) {
      const template = dataEmailTemplate.find(
        (item: any) => item.id === parseInt(selectedTemplateId)
      );
      
      if (template) {
        // Use setTimeout to ensure the form is ready
        setTimeout(() => {
          setValue('subject', template.subject || '', { 
            shouldValidate: true, 
            shouldDirty: true 
          });
          
          setValue('message', template.body || '', { 
            shouldValidate: true, 
            shouldDirty: true 
          });
          
          // Also set the message content state for ReactQuill
          setMessageContent(template.body || '');
          
          // Set CC and BCC
          if (template.cc && template.cc.length > 0) {
            setIsCCOpen(true);
            setTagsCc(template.cc);
          }
          
          if (template.bcc && template.bcc.length > 0) {
            setIsBCCOpen(true);
            setTagsBcc(template.bcc);
          }
          
          clearErrors('subject');
          clearErrors('message');
          clearErrors('to');
        }, 100);
      }
    }
  }, [selectedTemplateId, dataEmailTemplate, setValue, clearErrors, setTagsCc, setTagsBcc, setIsCCOpen, setIsBCCOpen]);

  const onSubmit = handleSubmit((data) => {
    // Validate "To" field manually since it uses tags
    if (tagsTo.length === 0) {
      setError('to', {
        type: 'manual',
        message: 'At least one recipient is required'
      });
      return;
    }

    if (isOpen && isOpen.id) {
      const template = dataEmailTemplate.find((item: any) => item.id === parseInt(data.template));
      
      // Create the payload directly without depending on employeeIssueItems array
      const payload = {
        id: isOpen.id.toString(),
        actionType: 'sending',
        emailType: 'nte',
        issueNTEForm: {
          template: template ? template.subject : '',
          subject: data.subject,
          to: tagsTo,
          cc: tagsCc,
          bcc: tagsBcc,
          message: data.message,
          attachment: pdfAttachment || null
        },
        sendDecisionForm: {}, // Required by type but not used for NTE
        dateReceived: null, // Required by type but not used for sending
        nte_subject: data.subject,
        nte_to: JSON.stringify(tagsTo),
        nte_cc: JSON.stringify(tagsCc),
        nte_bcc: JSON.stringify(tagsBcc),
        nte_message: data.message,
        decision_subject: '', // Required by type but not used for NTE
        decision_to: '', // Required by type but not used for NTE
        decision_cc: '', // Required by type but not used for NTE
        decision_bcc: '', // Required by type but not used for NTE
        decision_message: '' // Required by type but not used for NTE
      };
      
      const callbackReq = {
        onSuccess: (data: any) => {
          setIsOpen(null);
          // Reset form data after successful submission
          resetFormData();
          setPdfAttachment(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
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
      mutate(payload, callbackReq);
    } else {
      toast.custom(() => <CustomToast message='Incomplete information.' type='error' />, { duration: 4000 });
    }
  });

  // Get filename from attachment URL
  const getFilenameFromUrl = (url: string) => {
    if (!url) return '';
    
    // Remove AWS credentials from the URL if present
    let cleanUrl = url;
    if (url.includes('?AWSAccessKeyId=')) {
      cleanUrl = url.split('?AWSAccessKeyId=')[0];
    }
    
    const urlParts = cleanUrl.split('/');
    return urlParts[urlParts.length - 1];
  };

  // Handle delete NTE attachment
  const handleDeleteAttachment = () => {
    if (isOpen?.id) {
      deleteNTEAttachment(isOpen.id, {
        onSuccess: (data: any) => {
          setPdfAttachment(null);
          toast.custom(() => <CustomToast message={data.message || 'Attachment deleted successfully'} type='success' />, { duration: 3000 });
          
          // Close the modal and reset form data
          setIsOpen(null);
          resetFormData();
          
          if (refetch) {
            refetch();
          }
        },
        onError: (err: any) => {
          let errorMessage = 'Failed to delete attachment';
          
          if (typeof err === 'string') {
            errorMessage = err;
          } else if (err?.message) {
            errorMessage = err.message;
          } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
            duration: 5000,
          });
        },
      });
    }
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => {
          handleModalClose(() => {
            resetFormData();
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Send NTE</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => {
                      handleModalClose(() => {
                        resetFormData();
                        setIsOpen(null);
                      });
                    }} />
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
                              const templateId = event.target.value;
                              setSelectedTemplateId(templateId);
                              
                              if (templateId === 'unselect') {
                                // Clear template selection but preserve applicant email
                                setValue('template', '');
                                setValue('subject', '');
                                setValue('message', '');
                                setMessageContent('');
                                setTagsCc([]);
                                setTagsBcc([]);
                                setIsCCOpen(false);
                                setIsBCCOpen(false);
                                clearErrors('subject');
                                clearErrors('message');
                                
                                // Preserve only the applicant email in To field
                                if (applicantEmail) {
                                  setTagsTo([applicantEmail]);
                                }
                                return;
                              }
                              
                              // Handle To field immediately since it doesn't depend on form state
                              const template = dataEmailTemplate.find(
                                (item: any) => item.id === parseInt(templateId)
                              );
                              
                              if (template) {
                                // Merge template recipients with existing recipients
                                const templateRecipients = template.to || [];
                                const existingRecipients = tagsTo;
                                
                                // Combine existing and template recipients, avoiding duplicates
                                const combinedRecipients = [...existingRecipients];
                                templateRecipients.forEach((recipient: string) => {
                                  if (!combinedRecipients.includes(recipient)) {
                                    combinedRecipients.push(recipient);
                                  }
                                });
                                
                                setTagsTo(combinedRecipients);
                              }
                            }}
                          >
                            <option value='unselect'>
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
                          {...register('subject', { 
                            required: 'Subject is required',
                            onChange: (e) => {
                              if (e.target.value.trim() !== '') {
                                clearErrors('subject');
                              } else {
                                setError('subject', {
                                  type: 'manual',
                                  message: 'Subject is required'
                                });
                              }
                            }
                          })}
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
                        <div className='mt-2 h-72'>
                          <textarea rows={4} {...register('message', { required: 'Message is required' })} id='message' hidden />
                          <ReactQuill
                            key={selectedTemplateId}
                            onChange={(value) => {
                              setValue('message', value);
                              setMessageContent(value);
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
                            value={messageContent || watch('message')}
                          />
                        </div>
                      </div>
                      
                      {/* Attachment section with ClipIcon - moved outside the quill container */}
                      <div className="mt-10 border-t pt-4">
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Attachment
                        </label>
                        <div className="mt-2 flex items-center gap-2 pl-2">
                          <ClipIcon hasFile={!!pdfAttachment} />
                          {pdfAttachment && (
                            <>
                              <span className="text-sm text-gray-600">
                                {getFilenameFromUrl(pdfAttachment)}
                              </span>
                              <button
                                type="button"
                                onClick={() => window.open(pdfAttachment, '_blank')}
                                className="p-1 text-savoy-blue hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors ml-2"
                                title="View attachment"
                              >
                                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={handleDeleteAttachment}
                                disabled={isDeleting}
                                className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                              >
                                {isDeleting ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <TrashIcon className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                          {!pdfAttachment && (
                            <span className="text-sm text-gray-400">No attachment</span>
                          )}
                        </div>
                      </div>
                      
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
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
                        {!isLoading && 'Send & Mark as Sent'}
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => {
                          handleModalClose(() => {
                            resetFormData();
                            setIsOpen(null);
                          });
                        }}
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
      
      {/* Unsaved Changes Confirmation Modal */}
      {isUnsavedChangesModalOpen && (
        <UnsavedChangesModal
          isOpen={isUnsavedChangesModalOpen}
          onClose={handleUnsavedChangesCancel}
          onConfirm={handleUnsavedChangesConfirm}
          isLoading={false}
          isSwitchingEmployee={false}
          contentType="email"
        />
      )}
    </>
  );
}
