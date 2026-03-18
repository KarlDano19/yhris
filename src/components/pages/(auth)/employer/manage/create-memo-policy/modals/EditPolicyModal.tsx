import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useGetDirectiveDetails from '../hooks/useGetDirectiveDetails';
import useUpdateDirective from '../hooks/useUpdateDirective';
import RemoveFieldConfirmModal from './RemoveFieldConfirmModal';
import EmailField from '@/components/common/EmailField';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { MinusCircleIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

import DeleteIcon from '@/svg/DeleteIcon';
import EyePassword from '@/svg/EyePassword';

const DEFAULT_POLICY_FIELDS = [
  { inputLabel: 'Purpose', inputName: '' },
  { inputLabel: 'Policy', inputName: '' },
  { inputLabel: 'Procedure', inputName: '' },
];

export default function EditPolicyModal({
  isOpen,
  setIsOpen,
  directiveId,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  directiveId: number | null;
  refetch?: () => void;
}) {
  const cancelButtonRef = useRef(null);
  const [isNextForm, setIsNextForm] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Array<{id: number; attachment: string; attachment_name: string}>>([]);
  const [inputTo, setInputTo] = useState('');
  const [isToFocused, setIsToFocused] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, setValue, reset, clearErrors, watch, control, formState: { errors }, setError } = useForm<any>({
    defaultValues: {
      custom_policy_fields: DEFAULT_POLICY_FIELDS,
    },
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'custom_policy_fields' });
  const updateMutation = useUpdateDirective();

  // load existing directive details
  const { data, refetch: refetchDetails } = useGetDirectiveDetails(directiveId);
  useEffect(() => {
    if (isOpen && directiveId) refetchDetails();
  }, [isOpen, directiveId, refetchDetails]);

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || '',
        custom_policy_fields: data.custom_policy_fields?.length ? data.custom_policy_fields : DEFAULT_POLICY_FIELDS,
        eligibility: data.eligibility || '',
        application: data.application || '',
        coverage: data.coverage || '',
        termination: data.termination || '',
      });
      replace(data.custom_policy_fields?.length ? data.custom_policy_fields : DEFAULT_POLICY_FIELDS);
      setExistingAttachments(data.attachments || []);
      try {
        const toArr = Array.isArray(data.to) ? data.to : JSON.parse(data.to || '[]');
        setTagsTo(toArr);
      } catch {
        setTagsTo([]);
      }
    }
  }, [data, reset, replace, setTagsTo]);

  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setExistingAttachments([]);
      setIsNextForm(false);
    }
  }, [isOpen]);

  const watchedFields = watch('custom_policy_fields');

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles: File[] = [];
      for (const file of selectedFiles) {
        if (file.size > 5 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 5MB limit.`} type='error' />, { duration: 2000 });
          continue;
        }
        validFiles.push(file);
      }
      if (validFiles.length > 0) setFiles(prev => [...prev, ...validFiles]);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

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
        if (file.size > 5 * 1024 * 1024) {
          toast.custom(() => <CustomToast message={`${file.name} exceeds 5MB limit.`} type='error' />, { duration: 2000 });
          continue;
        }
        validFiles.push(file);
      }
      if (validFiles.length > 0) setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleEmployeeSelect = (employee: any) => {
    if (employee.type === 'individual_select') setTagsTo([...tagsTo, employee.email]);
    else if (employee.type === 'department_select') setTagsTo([...tagsTo, ...employee.emails]);
    else if (employee.type === 'department_remove') setTagsTo(employee.remainingTags);
  };

  const onSubmit = handleSubmit((dataForm) => {
    if (!isNextForm) return;

    updateMutation.mutate({
      id: directiveId as number,
      directive_type: 'policy',
      title: dataForm.title,
      eligibility: dataForm.eligibility,
      application: dataForm.application,
      coverage: dataForm.coverage,
      termination: dataForm.termination,
      to: tagsTo,
      custom_policy_fields: dataForm.custom_policy_fields,
      attachments: files,
    }, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message={'Successfully updated a policy'} type='success' />, { duration: 5000 });
        setIsNextForm(false);
        setIsOpen(false);
        if (refetch) refetch();
        reset();
        setTagsTo([]);
        setFiles([]);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 5000 });
      },
    });
  });

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const titleValue = watch('title');
    const customFields = watch('custom_policy_fields');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasErrors = false;

    clearErrors(['title', 'to', 'custom_policy_fields']);

    if (!titleValue) {
      setError('title', { type: 'manual', message: 'Title is required.' });
      hasErrors = true;
    }

    if (tagsTo.length === 0) {
      setError('to', { type: 'manual', message: 'To field is required.' });
      hasErrors = true;
    } else if (tagsTo.some(email => !emailRegex.test(email))) {
      setError('to', { type: 'manual', message: 'Please enter valid email addresses.' });
      hasErrors = true;
    }

    customFields?.forEach((field: any, index: number) => {
      if (!field.inputLabel?.trim()) {
        setError(`custom_policy_fields.${index}.inputLabel` as any, { type: 'manual', message: 'Field title is required.' });
        hasErrors = true;
      }
      if (!field.inputName?.trim()) {
        setError(`custom_policy_fields.${index}.inputName` as any, { type: 'manual', message: 'Field content is required.' });
        hasErrors = true;
      }
    });

    if (!hasErrors) setIsNextForm(true);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
        <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>
        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95' enterTo='opacity-100 translate-y-0 sm:scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 translate-y-0 sm:scale-100' leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Policy</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                {!isNextForm ? (
                  <div className="policy-form-step-1">
                    <div className='px-4 pt-4 pb-6'>
                      <div className='sm:col-span-4'>
                        <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-900'>Title<span className='text-red-600'>*</span></label>
                        {errors.title && (<p className='text-xs text-red-600 mt-1'>{(errors.title as any)?.message || String(errors.title) || 'Title is required.'}</p>)}
                        <div className='mt-2'><input id='title' {...register('title', { required: true })} type='text' className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' /></div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <div className='flex items-center justify-between'>
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>To<span className='text-red-600'>*</span></label>
                          {tagsTo.length > 1 && (<button type='button' className='text-xs text-red-600 hover:text-red-800 hover:underline' onClick={() => setTagsTo([])}>Unselect All</button>)}
                        </div>
                        {errors.to && (<p className='text-xs text-red-600 mt-1'>{(errors.to as any)?.message || String(errors.to) || 'To field is required.'}</p>)}
                        <div className='mt-2 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <EmailField
                              tags={tagsTo}
                              inputValue={inputTo}
                              onInputChange={(value) => setInputTo(value)}
                              onInputFocus={() => setIsToFocused(true)}
                              onInputBlur={() => setIsToFocused(false)}
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
                      {fields.map((item: any, index: number) => {
                        const labelError = (errors.custom_policy_fields as any)?.[index]?.inputLabel;
                        const contentError = (errors.custom_policy_fields as any)?.[index]?.inputName;
                        return (
                          <div className='sm:col-span-4 mt-4' key={index}>
                            <label htmlFor={`custom_policy_fields.${index}.inputName`} className='flex justify-between text-sm font-medium leading-6 text-gray-900'>
                              <div>
                                <input
                                  type='text'
                                  style={{ width: `${Math.max(10, watchedFields?.[index]?.inputLabel?.length || 0)}ch` }}
                                  id={`title${index}`}
                                  {...register(`custom_policy_fields.${index}.inputLabel`, { required: "Field title is required." })}
                                  onInput={() => {
                                    if (labelError) clearErrors(`custom_policy_fields.${index}.inputLabel` as any);
                                  }}
                                  disabled={true}
                                />
                                <button type='button' onClick={() => {
                                  const el = document.getElementById(`title${index}`);
                                  if (el) { el.removeAttribute('disabled'); el.focus(); }
                                }}>
                                  <PencilIcon className='h-3 text-gray-500 ml-2' />
                                </button>
                              </div>
                              <button type='button' className='hover:t-red-500 text-white'
                                onClick={() => { setFieldToRemove(index); setIsConfirmModalOpen(true); }}>
                                <MinusCircleIcon fill='gray' className='h-3' />
                              </button>
                            </label>
                            {labelError && (<p className='text-xs text-red-600 mt-1'>{(labelError as any)?.message || 'Field title is required.'}</p>)}
                            <div className='mt-2'>
                              <textarea rows={4} {...register(`custom_policy_fields.${index}.inputName`, { required: "Field content is required." })} placeholder={`Enter ${item.inputLabel}...`} id={`custom_policy_fields.${index}.inputName`} className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' />
                            </div>
                            {contentError && (<p className='text-xs text-red-600 mt-1'>{(contentError as any)?.message || 'Field content is required.'}</p>)}
                            <RemoveFieldConfirmModal
                              message={`Are you sure you want to remove the ${item.inputLabel} field`}
                              isOpen={isConfirmModalOpen && fieldToRemove === index}
                              setIsOpen={setIsConfirmModalOpen}
                              confirmAction={() => {
                                if (fieldToRemove !== null) { remove(fieldToRemove); setFieldToRemove(null); }
                                setIsConfirmModalOpen(false);
                              }}
                            />
                          </div>
                        );
                      })}
                      <div className='sm:col-span-4 mt-4'>
                        <button type="button" className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto' onClick={() => { append({ inputLabel: 'Enter title', inputName: '' }); }}>
                          <PlusIcon className='h-5 w-auto mr-2' />
                          Add Field
                        </button>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4 mb-4'>
                      <button type="button" className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto' onClick={handleNextClick}>Next</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <p className='font-bold my-4'>Provisions</p>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='eligibility' className='block text-sm font-medium leading-6 text-gray-900'>Eligibility</label>
                        <div className='mt-2'><textarea rows={3} {...register('eligibility')} id='eligibility' className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' /></div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='application' className='block text-sm font-medium leading-6 text-gray-900'>Application</label>
                        <div className='mt-2'><textarea rows={3} {...register('application')} id='application' className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' /></div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='coverage' className='block text-sm font-medium leading-6 text-gray-900'>Coverage</label>
                        <div className='mt-2'><textarea rows={3} id='coverage' {...register('coverage')} className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' /></div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='termination' className='block text-sm font-medium leading-6 text-gray-900'>Termination</label>
                        <div className='mt-2'><textarea rows={3} id='termination' {...register('termination')} className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300' /></div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='attachments' className='block text-sm font-medium leading-6 text-gray-900'>Attachments</label>
                        <div className='mt-2'>
                          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className='block w-full rounded-md border-0 py-8 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 text-center'>
                            {existingAttachments.length > 0 && (
                              <div className='mb-4'>
                                <p className='text-xs text-gray-600 mb-2'>Existing Attachments:</p>
                                {existingAttachments.map((att) => (
                                  <div key={att.id} className='flex items-center justify-between py-2 px-3 mb-2 bg-gray-50 rounded'>
                                    <div className='flex-1 min-w-0'>
                                      <p className='text-sm text-slate-800 font-light truncate' title={att.attachment_name}>
                                        {att.attachment_name}
                                      </p>
                                    </div>
                                    <a href={att.attachment} target='_blank' rel='noopener noreferrer' className='cursor-pointer ml-2'>
                                      <EyePassword visible />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                            <label className={`${ files.length === 0 ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal' : 'hidden' }`}>
                              Drop files to upload or click to select
                              <input name='attachments' id='attachments' ref={attachmentInputRef} type='file' multiple className='sr-only' onChange={handleAttachmentUpload} accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' />
                            </label>
                            {files.length > 0 && (
                              <div className='mb-4'>
                                <p className='text-xs text-gray-600 mb-2'>Files to Upload:</p>
                                {files.map((file, index) => (
                                  <div key={index} className='flex items-center justify-between py-2 px-3 mb-2 bg-blue-50 rounded'>
                                    <div className='flex-1 min-w-0'>
                                      <p className='text-sm text-slate-800 font-light truncate' title={file.name}>{file.name}</p>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                      <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
                                        <EyePassword visible />
                                      </a>
                                      <button type='button' className='cursor-pointer' onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}>
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {files.length > 0 && (
                              <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
                                + Add more files
                                <input name='attachments-add' id='attachments-add' type='file' multiple className='sr-only' onChange={handleAttachmentUpload} accept='application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' />
                              </label>
                            )}
                          </div>
                          <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5mb per file</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4 mb-4'>
                      <button type='submit' className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto' disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading && (
                          <div role='status'>
                            <svg aria-hidden='true' className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
                              <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
                            </svg>
                            <span className='sr-only'>Loading...</span>
                          </div>
                        )}
                        {!updateMutation.isLoading && 'Save'}
                      </button>
                      <button type="button" className='mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto' onClick={() => setIsNextForm(false)}>Back</button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
