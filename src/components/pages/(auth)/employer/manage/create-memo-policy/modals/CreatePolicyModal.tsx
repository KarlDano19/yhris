import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ReactQuill from '@/components/ReactQuillDynamic';
import useTagTo from '@/components/hooks/useTagTo';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';
import useGenerateMemoPreview from '../hooks/useGenerateMemoPreview';
import RemoveFieldConfirmModal from './RemoveFieldConfirmModal';
import MemoPreviewModal from './MemoPreviewModal';
import LetterheadField from '../components/LetterheadField';
import EmailField from '@/components/common/EmailField';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import { isRichTextEmpty } from '@/helpers/richText';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { MinusCircleIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

import DeleteIcon from '@/svg/DeleteIcon';
import EyePassword from '@/svg/EyePassword';

import { DirectiveData, PolicyField } from '@/types/directives';

export default function CreatePolicyModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
}) {
  const cancelButtonRef = useRef(null);
  const [isNextForm, setIsNextForm] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [inputTo, setInputTo] = useState('');
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [isToFocused, setIsToFocused] = useState(false);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);

  const { register, handleSubmit, setFocus, setValue, getFieldState, getValues, reset, clearErrors, trigger, control, watch, formState: { errors }, setError } =
    useForm<DirectiveData>({
      defaultValues: {
        custom_policy_fields: [
          {
            inputLabel: 'Purpose',
            inputName: '',
          },
          {
            inputLabel: 'Policy',
            inputName: '',
          },
          {
            inputLabel: 'Procedure',
            inputName: '',
          },
        ],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_policy_fields',
  });
  const { mutate, isLoading } = useAddDirectivesItems();
  const { mutateAsync: generatePreview, isLoading: isPreviewLoading } = useGenerateMemoPreview();

  // Authoring mode — either the policy is built from the fields below and rendered into a
  // document, or the user supplies their own PDF and that file *is* the policy.
  const [documentMode, setDocumentMode] = useState<'form' | 'upload'>('form');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewError, setPreviewError] = useState('');
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleAddField = () => {
    clearErrors('custom_policy_fields');
  };

  // Upload mode — the policy document itself. Only PDF, because the public page shows it in
  // an iframe and browsers render nothing else there natively.
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.custom(() => <CustomToast message={'The document must be a PDF file.'} type='error' />, {
        duration: 5000,
      });
      event.target.value = '';
      return;
    }
    if (file.size > 20000000) {
      toast.custom(() => <CustomToast message={'Maximum document size is 20mb.'} type='error' />, {
        duration: 5000,
      });
      event.target.value = '';
      return;
    }

    setDocumentFile(file);
  };

  const handleOpenPreview = async () => {
    setPreviewError('');
    setIsPreviewOpen(true);
    try {
      const url = await generatePreview({ ...getValues(), directive_type: 'policy' });
      // Release the previous preview before replacing it — each render is a fresh object URL.
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return url;
      });
    } catch (err: any) {
      setPreviewError(err?.message || 'Failed to generate the preview.');
    }
  };

  const onSubmit = handleSubmit((data) => {
    // Only process form submission if we're on the second form (provisions)
    if (!isNextForm) {
      return;
    }
    
    const callbackReq = {
      onSuccess: (data: any) => {
        setIsNextForm(false);
        toast.custom(() => <CustomToast message={'Successfully created a policy'} type='success' />, {
          duration: 5000,
        });
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
    if (documentMode === 'upload' && !documentFile) {
      toast.custom(() => <CustomToast message={'Please upload a PDF document.'} type='error' />, {
        duration: 5000,
      });
      return;
    }

    data['to'] = tagsTo;
    data.directive_type = 'policy';
    // Add multiple attachments - pass files array directly
    const payload: any = { ...data };
    if (files.length > 0) {
      payload.attachments = files;
    }

    if (documentMode === 'upload') {
      // The uploaded PDF replaces the composed policy entirely, so none of the provision
      // fields are sent — the backend stores the file and skips rendering.
      payload.document = documentFile;
      // An uploaded PDF carries its own letterhead already.
      payload.letterhead = undefined;
      payload.custom_policy_fields = [];
      payload.eligibility = '';
      payload.application = '';
      payload.coverage = '';
      payload.termination = '';
    }

    mutate(payload, callbackReq);
  });

  // Separate handler for the Next button to avoid form submission
  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any potential form submission
    
    const titleValue = watch('title');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customFields = watch('custom_policy_fields');
    let hasErrors = false;
    
    // Clear any existing errors first
    clearErrors(['title', 'to', 'custom_policy_fields']);
    
    // Validate title field
    if (!titleValue || titleValue === "") {
      setError("title", {
        type: "manual",
        message: "Title is required."
      });
      hasErrors = true;
    }
    
    // Validate To field
    if (tagsTo.length === 0) {
      setError("to", {
        type: "manual",
        message: "To field is required."
      });
      hasErrors = true;
    } else {
      // Validate email format only if there are emails
      const invalidEmails = tagsTo.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        setError("to", {
          type: "manual",
          message: "Please enter valid email addresses."
        });
        hasErrors = true;
      }
    }

    // Upload mode replaces the composed policy wholesale, so requiring the fields it is
    // about to discard would make the mode impossible to reach.
    if (documentMode === 'upload' && !documentFile) {
      toast.custom(() => <CustomToast message={'Please upload a PDF document.'} type='error' />, {
        duration: 5000,
      });
      hasErrors = true;
    }

    // Validate custom policy fields
    if (documentMode === 'form' && customFields && customFields.length > 0) {
      customFields.forEach((field: PolicyField, index: number) => {
        // Validate inputLabel (field title)
        if (!field.inputLabel || field.inputLabel.trim() === "") {
          setError(`custom_policy_fields.${index}.inputLabel` as any, {
            type: "manual",
            message: "Field title is required."
          });
          hasErrors = true;
        }
        
        // Validate inputName (field content)
        if (isRichTextEmpty(field.inputName)) {
          setError(`custom_policy_fields.${index}.inputName` as any, {
            type: "manual",
            message: "Field content is required."
          });
          hasErrors = true;
        }
      });
    }

    // If there are errors, focus on the first invalid field and return
    if (hasErrors) {
      if (!titleValue || titleValue === "") {
        const el = document.getElementById("title");
        if (el) el.focus();
      } else if (tagsTo.length === 0) {
        // Focus on the email input field
        const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      } else if (documentMode === 'form' && customFields && customFields.length > 0) {
        // Focus on the first invalid policy field
        for (let i = 0; i < customFields.length; i++) {
          const field = customFields[i];
          if (!field.inputLabel || field.inputLabel.trim() === "") {
            const el = document.getElementById(`title${i}`);
            if (el) {
              el.removeAttribute('disabled');
              el.focus();
            }
            break;
          } else if (isRichTextEmpty(field.inputName)) {
            // Focus the Quill editing surface, not the hidden input backing the field.
            const el = document.querySelector(
              `#custom_policy_fields\\.${i}\\.inputName .ql-editor`
            ) as HTMLElement | null;
            if (el) el.focus();
            break;
          }
        }
      }
      return;
    }
    
    // If validation passes, proceed to next form
    setIsNextForm(true);
  };

  const increaseWidth = (text: HTMLInputElement) => {
    let textLength = text.value.length;
    if (textLength >= 10) {
      text.style.width = textLength + 'ch';
    }
  };

  // Handle file attachment upload - multiple files
  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles: File[] = [];
      
      for (const file of selectedFiles) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 5MB limit.`} type='error' />, {
            duration: 2000,
          });
          continue;
        }
        validFiles.push(file);
      }
      
      if (validFiles.length > 0) {
        // Append to existing files
        setFiles(prev => [...prev, ...validFiles]);
      }
      
      // Clear the file input
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e?.dataTransfer?.files || []);
    
    if (droppedFiles.length > 0) {
      const validFiles: File[] = [];
      
      for (const file of droppedFiles) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 5MB limit.`} type='error' />, {
            duration: 2000,
          });
          continue;
        }
        validFiles.push(file);
      }
      
      if (validFiles.length > 0) {
        // Append to existing files
        setFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

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
      clearErrors('to');
    }
  }, [tagsTo, clearErrors]);

  // Clear errors when custom policy fields change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('custom_policy_fields')) {
        const fieldIndex = name.match(/custom_policy_fields\.(\d+)/)?.[1];
        if (fieldIndex !== undefined) {
          const fieldName = name.split('.').pop();
          if (fieldName === 'inputLabel' || fieldName === 'inputName') {
            const fieldValue = value.custom_policy_fields?.[parseInt(fieldIndex)]?.[fieldName as keyof PolicyField];
            const isFilled = fieldName === 'inputName'
              ? !isRichTextEmpty(fieldValue as string)
              : Boolean(fieldValue && String(fieldValue).trim() !== '');
            if (isFilled) {
              clearErrors(name as any);
            }
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setIsNextForm(false);
      setTagsTo([]);
      setInputTo('');
      setFiles([]);
      setIsToFocused(false);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
    }
  }, [isOpen]);



  // Handle employee selection for TO field
  const handleEmployeeSelect = (employee: any) => {
    if (employee.type === 'individual_select') {
      setTagsTo([...tagsTo, employee.email]);
    } else if (employee.type === 'department_select') {
      setTagsTo([...tagsTo, ...employee.emails]);
    } else if (employee.type === 'department_remove') {
      setTagsTo(employee.remainingTags);
    }
  };


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel className='relative transform overflow-hidden visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Policy</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                
                {!isNextForm ? (
                  // First Form Step - Just collect basic info and fields
                  <div className="policy-form-step-1">
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
                        <div className='mt-2'>
                          <input
                            id='title'
                            {...register('title', { required: true })}
                            type='text'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
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
                        {errors.to && (
                          <p className='text-xs text-red-600 mt-1'>
                            {errors.to.message || 'To field is required.'}
                          </p>
                        )}
                        <div className='mt-2 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <EmailField
                              tags={tagsTo}
                              inputValue={inputTo}
                              onInputChange={(value) => {
                                setInputTo(value);
                              }}
                              onInputFocus={() => {
                                setIsToFocused(true);
                              }}
                              onInputBlur={() => {
                                setIsToFocused(false);
                              }}
                              onKeyDown={handleKeyDownTo}
                              onEmployeeSelect={handleEmployeeSelect}
                              onRemoveTag={handleRemoveTagTo}
                              showTooltip={true}
                              tooltipId="to-section-tooltip"
                              isFocused={isToFocused}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Sits before the content fields, not after them: choosing to upload a
                          PDF means none of the fields below need filling, and offering the
                          choice only on the next step made people type a whole policy first. */}
                      <div className='sm:col-span-4 mt-4'>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Policy Content
                        </label>
                        <div className='mt-2 inline-flex rounded-md ring-1 ring-inset ring-gray-300'>
                          <button
                            type='button'
                            onClick={() => setDocumentMode('form')}
                            className={`rounded-l-md px-3 py-2 text-sm font-semibold ${
                              documentMode === 'form' ? 'bg-savoy-blue text-white' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Fill up the form
                          </button>
                          <button
                            type='button'
                            onClick={() => setDocumentMode('upload')}
                            className={`rounded-r-md px-3 py-2 text-sm font-semibold ${
                              documentMode === 'upload' ? 'bg-savoy-blue text-white' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Upload a PDF
                          </button>
                        </div>
                        <p className='mt-2 text-xs text-gray-500'>
                          Either way the policy is delivered as a document, so it looks the same on
                          a phone as it does on a computer.
                        </p>
                      </div>

                      {documentMode === 'upload' && (
                        <div className='sm:col-span-4 mt-4'>
                          <label htmlFor='document' className='block text-sm font-medium leading-6 text-gray-900'>
                            Policy Document<span className='text-red-600'>*</span>
                          </label>
                          <div className='mt-2'>
                            <input
                              id='document'
                              ref={documentInputRef}
                              type='file'
                              accept='application/pdf'
                              onChange={handleDocumentUpload}
                              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                            />
                            <p className='mt-2 text-xs text-gray-500'>
                              PDF only, up to 20mb. Export from Word as PDF before uploading.
                            </p>
                            {documentFile && (
                              <div className='mt-2 flex items-center gap-3'>
                                <span className='text-sm text-gray-700'>{documentFile.name}</span>
                                <button
                                  type='button'
                                  className='underline text-savoy-blue text-sm'
                                  onClick={() => {
                                    setDocumentFile(null);
                                    if (documentInputRef.current) documentInputRef.current.value = '';
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className={documentMode === 'upload' ? 'hidden' : undefined}>
                      {fields.map((item: PolicyField, index: number) => {
                        const labelError = errors.custom_policy_fields?.[index]?.inputLabel;
                        const contentError = errors.custom_policy_fields?.[index]?.inputName;
                        return (
                          <div className='sm:col-span-4 mt-4' key={index}>
                            <label
                              htmlFor={`custom_policy_fields.${index}.inputName`}
                              className='flex justify-between text-sm font-medium leading-6 text-gray-900'
                            >
                              <div>
                                <input
                                  type='text'
                                  defaultValue={item.inputLabel}
                                  className=' w-[10ch]'
                                  id={`title${index}`}
                                  {...register(`custom_policy_fields.${index}.inputLabel`, {
                                    required: "Field title is required."
                                  })}
                                  onInput={(e: any) => {
                                    increaseWidth(e.currentTarget);
                                    // Clear error when user types
                                    if (labelError) {
                                      clearErrors(`custom_policy_fields.${index}.inputLabel` as any);
                                    }
                                  }}
                                  disabled={true}
                                />
                                <button
                                  type='button'
                                  onClick={() => {
                                    document.getElementById(`title${index}`)?.removeAttribute('disabled');
                                    setFocus(`custom_policy_fields.${index}.inputLabel`);
                                  }}
                                >
                                  <PencilIcon className='h-3 text-gray-500 ml-2' />
                                </button>
                                <span className='text-red-600'>*</span>
                              </div>
                              <button
                                type='button'
                                className='hover:t-red-500 text-white'
                                onClick={() => {
                                  setFieldToRemove(index);
                                  setIsConfirmModalOpen(true);
                                }}
                              >
                                <MinusCircleIcon fill='gray' className='h-3' />
                              </button>
                            </label>
                            {labelError && (
                              <p className='text-xs text-red-600 mt-1'>
                                {labelError.message || 'Field title is required.'}
                              </p>
                            )}
                            <div className='quill-resize-clip mt-2 h-56 min-h-[14rem] resize-y overflow-hidden' id={`custom_policy_fields.${index}.inputName`}>
                              <input
                                type='text'
                                {...register(`custom_policy_fields.${index}.inputName`, {
                                  validate: (value?: string) =>
                                    !isRichTextEmpty(value) || "Field content is required."
                                })}
                                hidden
                              />
                              <ReactQuill
                                onChange={(value: string) =>
                                  setValue(`custom_policy_fields.${index}.inputName`, value)
                                }
                                formats={QUILL_FORMATS}
                                modules={QUILL_MODULES}
                                placeholder={`Enter ${item.inputLabel}...`}
                                style={{ height: '100%' }}
                                value={watch(`custom_policy_fields.${index}.inputName`) || ''}
                              />
                            </div>
                            {contentError && (
                              <p className='text-xs text-red-600 mt-1'>
                                {contentError.message || 'Field content is required.'}
                              </p>
                            )}
                            <RemoveFieldConfirmModal
                              message={`Are you sure you want to remove the ${item.inputLabel} field`}
                              isOpen={isConfirmModalOpen && fieldToRemove === index}
                              setIsOpen={setIsConfirmModalOpen}
                              confirmAction={() => {
                                if (fieldToRemove !== null) {
                                  remove(fieldToRemove);
                                  setFieldToRemove(null);
                                }
                                setIsConfirmModalOpen(false);
                              }}
                            />
                          </div>
                        );
                      })}
                      <div className='sm:col-span-4 mt-4'>
                        <button
                          type="button"
                          className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          onClick={() => {
                            append({
                              inputLabel: 'Enter title',
                              inputName: '',
                            });
                            handleAddField();
                          }}
                        >
                          <PlusIcon className='h-5 w-auto mr-2' />
                          Add Field
                        </button>
                      </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4 mb-4'>
                      <button
                        type="button"
                        className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={handleNextClick}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  // Second Form Step - Final form with provisions and submit
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div className={documentMode === 'upload' ? 'hidden' : undefined}>
                      <LetterheadField
                        existingUrl={null}
                        onChange={(file) => setValue('letterhead', file)}
                      />

                      <p className='font-bold my-4'>Provisions</p>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='eligibility' className='block text-sm font-medium leading-6 text-gray-900'>
                          Eligibility
                        </label>
                        <div className='quill-resize-clip mt-2 h-48 min-h-[12rem] resize-y overflow-hidden' id='eligibility'>
                          <input type='text' {...register('eligibility')} hidden />
                          <ReactQuill
                            onChange={(value: string) => setValue('eligibility', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%' }}
                            value={watch('eligibility') || ''}
                          />
                        </div>
                      </div>

                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='application' className='block text-sm font-medium leading-6 text-gray-900'>
                          Application
                        </label>
                        <div className='quill-resize-clip mt-2 h-48 min-h-[12rem] resize-y overflow-hidden' id='application'>
                          <input type='text' {...register('application')} hidden />
                          <ReactQuill
                            onChange={(value: string) => setValue('application', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%' }}
                            value={watch('application') || ''}
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='coverage' className='block text-sm font-medium leading-6 text-gray-900'>
                          Coverage
                        </label>
                        <div className='quill-resize-clip mt-2 h-48 min-h-[12rem] resize-y overflow-hidden' id='coverage'>
                          <input type='text' {...register('coverage')} hidden />
                          <ReactQuill
                            onChange={(value: string) => setValue('coverage', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%' }}
                            value={watch('coverage') || ''}
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='termination' className='block text-sm font-medium leading-6 text-gray-900'>
                          Termination
                        </label>
                        <div className='quill-resize-clip mt-2 h-48 min-h-[12rem] resize-y overflow-hidden' id='termination'>
                          <input type='text' {...register('termination')} hidden />
                          <ReactQuill
                            onChange={(value: string) => setValue('termination', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%' }}
                            value={watch('termination') || ''}
                          />
                        </div>
                      </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='attachments' className='block text-sm font-medium leading-6 text-gray-900'>
                          Attachments
                        </label>
                        <div className='mt-2'>
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className='block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                          >
                            <label
                              className={`${
                                files.length === 0
                                  ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                                  : 'hidden'
                              }`}
                            >
                              Drop files to upload or click to select
                              <input
                                name='attachments'
                                id='attachments'
                                ref={attachmentInputRef}
                                type='file'
                                multiple
                                className='sr-only'
                                onChange={handleAttachmentUpload}
                                accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                              />
                            </label>
                            
                            {/* Show uploaded files */}
                            {files.length > 0 && (
                              <div className='mb-4'>
                                <p className='text-xs text-gray-600 mb-2'>Files to Upload:</p>
                                {files.map((file, index) => (
                                  <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded'>
                                    <div className='flex-1 min-w-0'>
                                      <p className='text-sm text-slate-800 font-light truncate' title={file.name}>{file.name}</p>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                      <a 
                                        href={URL.createObjectURL(file)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className='cursor-pointer'
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <EyePassword visible />
                                      </a>
                                      <button
                                        type='button'
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFile(index);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Show "Add more files" option when files exist */}
                            {files.length > 0 && (
                              <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                                + Add more files
                                <input
                                  name='attachments-add'
                                  id='attachments-add'
                                  type='file'
                                  multiple
                                  className='sr-only'
                                  onChange={handleAttachmentUpload}
                                  accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                />
                              </label>
                            )}
                          </div>
                          <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5mb per file</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4 mb-4'>
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
                        {!isLoading && 'Create'}
                      </button>
                      <button
                        type="button"
                        className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => setIsNextForm(false)}
                      >
                        Back
                      </button>
                      {documentMode === 'form' && (
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:mr-3 sm:w-auto'
                          onClick={handleOpenPreview}
                        >
                          Preview
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
        <MemoPreviewModal
          isOpen={isPreviewOpen}
          handleClose={() => setIsPreviewOpen(false)}
          previewUrl={previewUrl}
          isLoading={isPreviewLoading}
          error={previewError}
        />
      </Dialog>
    </Transition>
  );
}
