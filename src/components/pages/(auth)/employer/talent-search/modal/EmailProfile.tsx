import { Dispatch, Fragment, useRef, useMemo, useState, useEffect } from 'react';

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
import useAddEmail from '../hook/useAddEmail';
import CustomDatePicker from '@/components/CustomDatePicker'

import { XMarkIcon } from '@heroicons/react/24/outline';

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

  // Check for common empty HTML patterns
  if (trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>') {
    return true;
  }

  // Remove HTML tags and check if there's actual text content
  const textContent = trimmed.replace(/<[^>]*>/g, '').trim();
  return textContent === '';
};

const MAX_FOLLOW_UPS = 5;

export default function EmailProfileModal({
  refetch,
  isOpen,
  setIsOpen,
  applicantEmail,
  applicantId,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  applicantEmail?: string;
  applicantId?: number;
}) {
  const cancelButtonRef = useRef(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [isOpen]);
  const [employeeEmail, setEmployeeEmail] = useState<string | null>(applicantEmail || null);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      template: '',
      subject: '',
      to: '',
      message: '',
    },
  });
  const { data: dataEmailTemplate } = useGetEmailTemplateItems();
  const { mutate: sendEmail, isLoading } = useAddEmail();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [followUps, setFollowUps] = useState([
    { date: new Date(), subject: '', body: '', to: applicantEmail || '', isMain: true },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [addingFollowUp, setAddingFollowUp] = useState(false);
  const [newFollowUpDate, setNewFollowUpDate] = useState<Date | null>(null);

  // Add follow-up
  const handleAddFollowUp = () => {
    setAddingFollowUp(true);
    setNewFollowUpDate(null);
  };
  const handleConfirmAddFollowUp = () => {
    if (!newFollowUpDate) return;
    setFollowUps([
      ...followUps,
      { date: newFollowUpDate, subject: '', body: '', to: applicantEmail || '', isMain: false },
    ]);
    setActiveTab(followUps.length); // select new tab
    setAddingFollowUp(false);
    setNewFollowUpDate(null);
  };
  // Remove follow-up
  const handleRemoveFollowUp = (idx: number) => {
    if (idx === 0) return;
    const newArr = followUps.filter((_, i) => i !== idx);
    setFollowUps(newArr);
    setActiveTab((prev) => (prev >= idx ? Math.max(0, prev - 1) : prev));
  };
  // Update subject/body for active tab
  const updateActiveTabField = (field: 'subject' | 'body', value: string) => {
    setFollowUps((prev) => prev.map((item, idx) => (idx === activeTab ? { ...item, [field]: value } : item)));
  };

  // Update employeeEmail when applicantEmail prop changes
  useEffect(() => {
    if (applicantEmail) {
      setEmployeeEmail(applicantEmail);
      // Set the applicant's email as the first recipient
      setTagsTo([applicantEmail]);
    }
  }, [applicantEmail, setTagsTo]);

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
        message: 'At least one recipient is required',
      });
      toast.custom(
        () => <CustomToast message='You cannot proceed due to incomplete fields. Please review.' type='error' />,
        { duration: 2000 }
      );
      return;
    }

    // Validate applicant ID
    if (!applicantId) {
      toast.custom(() => <CustomToast message='Applicant ID is required' type='error' />, { duration: 2000 });
      return;
    }

    // Validate that all follow-ups have required fields
    const hasIncompleteFollowUps = followUps.some((followUp, index) => {
      if (index === 0) return false; // Skip main email (handled by form validation)
      return !followUp.subject.trim() || isHtmlEmpty(followUp.body);
    });

    if (hasIncompleteFollowUps) {
      toast.custom(() => <CustomToast message='Please complete all follow-up emails before sending.' type='error' />, {
        duration: 2000,
      });
      return;
    }

    // Prepare emails array - main email + follow-ups
    const emailsToSend: Array<{
      applicant: number;
      to_email: string;
      cc_email: string;
      bcc_email: string;
      subject: string;
      body: string;
      scheduled_date: string | null;
    }> = [];

    // Add main email (current form data)
    const mainEmail = {
      applicant: Number(applicantId),
      to_email: tagsTo.join(','),
      cc_email: tagsCc.join(','),
      bcc_email: tagsBcc.join(','),
      subject: data.subject,
      body: data.message,
      scheduled_date: null, // Send immediately
    };
    emailsToSend.push(mainEmail);

    // Add follow-up emails
    followUps.slice(1).forEach((followUp) => {
      if (followUp.subject.trim() && !isHtmlEmpty(followUp.body)) {
        const followUpEmail = {
          applicant: Number(applicantId),
          to_email: followUp.to,
          cc_email: '', // Follow-ups use the same recipients as main email
          bcc_email: '',
          subject: followUp.subject,
          body: followUp.body,
          scheduled_date: followUp.date.toISOString(), // Schedule for the specified date
        };
        emailsToSend.push(followUpEmail);
      }
    });

    // Send all emails
    const sendAllEmails = async () => {
      try {
        for (const emailData of emailsToSend) {
          await new Promise((resolve, reject) => {
            sendEmail(emailData, {
              onSuccess: resolve,
              onError: reject,
            });
          });
        }

        // All emails sent successfully
        setIsOpen({ id: 0, open: false });
        refetch();
        const message =
          emailsToSend.length === 1
            ? 'Successfully sent email.'
            : `Successfully sent ${emailsToSend.length} emails (${emailsToSend.length - 1} follow-ups scheduled).`;
        toast.custom(() => <CustomToast message={message} type='success' />, { duration: 5000 });
      } catch (error) {
        toast.custom(() => <CustomToast message={`Error sending emails: ${error}`} type='error' />, { duration: 7000 });
      }
    };

    sendAllEmails();
  });

  const customCloseModal = () => {
    // Reset form state
    reset();
    setFollowUps([{ date: new Date(), subject: '', body: '', to: applicantEmail || '', isMain: true }]);
    setActiveTab(0);
    setTagsTo(applicantEmail ? [applicantEmail] : []);
    setTagsCc([]);
    setTagsBcc([]);
    setIsCCOPen(false);
    setIsBCCOpen(false);
    setInputTo('');
    setInputCc('');
    setInputBcc('');

    // Close the modal
    setIsOpen({ id: 0, open: false });
  };

  const handleScheduleFollowUp = () => {
    if (!followUpDate) {
      toast.custom(() => <CustomToast message='Please select a follow-up date.' type='error' />);
      return;
    }
    toast.custom(() => (
      <CustomToast message={`Follow-up scheduled for ${followUpDate.toLocaleString()}`} type='success' />
    ));
    setShowFollowUp(false);
    setFollowUpDate(null);
  };

  return (
    <>
      <Transition.Root show={isOpen.open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={() => setIsOpen({ id: 0, open: false })}
        >
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl'>
                  {/* Tab Bar */}
                  <div className='flex items-center bg-blue-50 rounded-lg p-3 mb-4 gap-2'>
                    {/* Main Email Tab */}
                    <button
                      className={`px-4 py-2 rounded font-semibold ${
                        activeTab === 0 ? 'bg-white text-blue-700 shadow' : 'text-blue-400'
                      }`}
                      onClick={() => setActiveTab(0)}
                    >
                      Email <span className='text-xs'>(Today)</span>
                    </button>
                    {/* Follow Up Tabs */}
                    {followUps.slice(1).map((fu, idx) => (
                      <div key={idx + 1} className='flex items-center'>
                        <button
                          className={`px-4 py-2 rounded font-semibold ${
                            activeTab === idx + 1 ? 'bg-white text-blue-700 shadow' : 'text-blue-400'
                          }`}
                          onClick={() => setActiveTab(idx + 1)}
                        >
                          {`${idx + 1}${['st', 'nd', 'rd', 'th'][Math.min(idx, 3)]} Follow up`}
                          <span className='block text-xs font-normal'>
                            {fu.date ? `(on ${fu.date.toLocaleDateString()})` : ''}
                          </span>
                        </button>
                        <button
                          className='ml-1 text-gray-400 hover:text-red-500 text-lg'
                          onClick={() => handleRemoveFollowUp(idx + 1)}
                          title='Remove follow up'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Add Follow Up */}
                    {followUps.length - 1 < MAX_FOLLOW_UPS && !addingFollowUp && (
                      <button
                        className='ml-auto text-blue-700 hover:underline text-sm font-semibold'
                        onClick={handleAddFollowUp}
                      >
                        Add Follow Up
                      </button>
                    )}
                    {addingFollowUp && (
                      <div className='flex items-center gap-2 ml-4'>
                        <div className='flex flex-col items-center'>
                          <CustomDatePicker
                            id='new-follow-up-date'
                            selected={newFollowUpDate}
                            pickerOnChange={setNewFollowUpDate}
                            inputOnChange={setNewFollowUpDate}
                            minDate={new Date()}
                            placeholder='Pick date'
                            className='border rounded px-3 py-2 w-56 text-base'
                          />
                          <button
                            className='mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full'
                            onClick={handleConfirmAddFollowUp}
                            disabled={!newFollowUpDate}
                            style={{ minWidth: '120px' }}
                          >
                            Confirm
                          </button>
                        </div>
                        <button
                          className='text-gray-400 hover:text-red-500 text-lg ml-2'
                          onClick={() => setAddingFollowUp(false)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Form for active tab */}
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='subject' className='block text-sm font-medium leading-6 text-gray-900'>
                          Subject<span className='text-red-600'>*</span>
                        </label>

                        {errors.subject && <p className='text-xs text-red-600 mt-1'>{errors.subject.message}</p>}
                        <input
                          type='text'
                          id='subject'
                          value={activeTab === 0 ? watch('subject') : followUps[activeTab]?.subject || ''}
                          onChange={(e) => {
                            if (activeTab === 0) {
                              setValue('subject', e.target.value);
                            } else {
                              updateActiveTabField('subject', e.target.value);
                            }
                          }}
                          className='mt-2 block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          placeholder='Enter subject...'
                        />
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='to' className='block text-sm font-medium leading-6 text-gray-900'>
                          To<span className='text-red-600'>*</span>
                        </label>
                        {errors.to && <p className='text-xs text-red-600 mt-1'>{errors.to.message}</p>}
                        {activeTab === 0 ? (
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div 
                                className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full"
                                data-tooltip-id='to-section-tooltip'
                                data-tooltip-place='bottom'
                              >
                                {tagsTo.map((tagTo) => (
                                  <div
                                    key={tagTo}
                                    className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTagTo(tagTo)}
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                    <p>{tagTo}</p>
                                  </div>
                                ))}
                                <input
                                  type="text"
                                  value={inputTo}
                                  onKeyDown={handleKeyDownTo}
                                  onChange={(e) => setInputTo(e.target.value)}
                                  className="focus:none outline-none px-2 py-1 grow"
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
                              type="button"
                              className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                                isCCOpen
                                  ? "bg-savoy-blue text-white hover:bg-blue-700"
                                  : "bg-gray-50"
                              }`}
                              onClick={() => setIsCCOPen(!isCCOpen)}
                            >
                              CC
                            </button>
                            <button
                              type="button"
                              className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 ${
                                isBCCOpen
                                  ? "bg-savoy-blue text-white hover:bg-blue-700"
                                  : "bg-gray-50"
                              }`}
                              onClick={() => setIsBCCOpen(!isBCCOpen)}
                            >
                              BCC
                            </button>
                          </div>
                        ) : (
                          <input
                            type='text'
                            value={followUps[activeTab]?.to || ''}
                            readOnly
                            className='mt-2 block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-100'
                          />
                        )}
                      </div>
                      {isCCOpen && activeTab === 0 && (
                        <div className="sm:col-span-4 mt-4">
                          <label
                            htmlFor="cc"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            CC
                          </label>
                          <div className="mt-2">
                            <div 
                              className="relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full"
                              data-tooltip-id='cc-section-tooltip'
                              data-tooltip-place='bottom'
                            >
                              {tagsCc.map((tag) => (
                                <div
                                  key={tag}
                                  className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                  <p>{tag}</p>
                                </div>
                              ))}
                              <input
                                type="text"
                                value={inputCc}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setInputCc(e.target.value)}
                                className="focus:none outline-none px-2 py-1 grow rounded-md"
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
                      {isBCCOpen && activeTab === 0 && (
                        <div className="sm:col-span-4 mt-4">
                          <label
                            htmlFor="bcc"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            BCC
                          </label>
                          <div className="mt-2">
                            <div 
                              className="relative border border-gray-300 pl-2 rounded-md flex items-center gap-3 flex-wrap w-full text-sm"
                              data-tooltip-id='bcc-section-tooltip'
                              data-tooltip-place='bottom'
                            >
                              {tagsBcc.map((tagBcc) => (
                                <div
                                  key={tagBcc}
                                  className="bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTagBcc(tagBcc)}
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                  <p>{tagBcc}</p>
                                </div>
                              ))}
                              <input
                                type="text"
                                value={inputBcc}
                                onKeyDown={handleKeyDownBcc}
                                onChange={(e) => setInputBcc(e.target.value)}
                                className="focus:none outline-none px-2 py-1 grow rounded-md"
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
                        {errors.message && <p className='text-xs text-red-600 mt-1'>{errors.message.message}</p>}
                        <div className='mt-2 h-72 mb-12'>
                          <textarea
                            rows={4}
                            {...register('message', { required: 'Message is required' })}
                            id='message'
                            hidden
                          />
                          <ReactQuill
                            onChange={(value) => {
                              console.log('HTML Content:', value); // Temporary debugging
                              if (activeTab === 0) {
                                setValue('message', value);
                                // Only clear errors when there is actual content
                                if (!isHtmlEmpty(value)) {
                                  clearErrors('message');
                                } else {
                                  // Set error when content is empty or just a blank line
                                  setError('message', {
                                    type: 'manual',
                                    message: 'Message is required',
                                  });
                                }
                              } else {
                                updateActiveTabField('body', value);
                              }
                            }}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%', padding: '5px 8px !important' }}
                            value={activeTab === 0 ? watch('message') : followUps[activeTab]?.body || ''}
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
                          // For main email tab, validate form fields
                          if (activeTab === 0) {
                            // Trigger validation for all required fields
                            const subjectValid = await trigger('subject');

                            // Check message content specifically for empty HTML
                            const messageContent = watch('message');
                            let messageValid = !isHtmlEmpty(messageContent);

                            if (!messageValid) {
                              setError('message', {
                                type: 'manual',
                                message: 'Message is required',
                              });
                            }

                            // Check if all validations pass
                            if (!subjectValid || !messageValid || tagsTo.length === 0) {
                              e.preventDefault();
                              // Set error for "to" field if no recipients
                              if (tagsTo.length === 0) {
                                setError('to', {
                                  type: 'manual',
                                  message: 'At least one recipient is required',
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
                              return;
                            }
                          } else {
                            // For follow-up tabs, validate the current follow-up
                            const currentFollowUp = followUps[activeTab];
                            if (!currentFollowUp?.subject?.trim() || isHtmlEmpty(currentFollowUp?.body)) {
                              e.preventDefault();
                              toast.custom(
                                () => (
                                  <CustomToast
                                    message={'Please complete the current follow-up email before sending.'}
                                    type='error'
                                  />
                                ),
                                {
                                  duration: 2000,
                                }
                              );
                              return;
                            }
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
