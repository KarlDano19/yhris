import { Dispatch, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import useTagTo from '@/components/hooks/useTagTo';
import CustomToast from '@/components/CustomToast';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';
import SignatureModal from './SignatureModal';
import EmailField from '@/components/common/EmailField';
import EmployeeSelect from '@/components/common/EmployeeSelect';

import { XCircleIcon } from '@heroicons/react/24/solid';

import DeleteIcon from '@/svg/DeleteIcon';
import EyePassword from '@/svg/EyePassword';

import { DirectiveData } from '@/types/directives';
import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

interface CachedProfileData {
  name: string;
}

export default function CreateMemoModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
}) {
  const cancelButtonRef = useRef(null);
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [qrCodeExist, setQrCodeExist] = useState(false);
  const [signatureFileExist, setSignatureFileExist] = useState(false);
  const [toSaveData, setToSaveData] = useState<any>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const qrCodeInputRef = useRef<HTMLInputElement>(null);
  const [inputTo, setInputTo] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const [isToFocused, setIsToFocused] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSelected, setEmployeeSelected] = useState(false);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, setValue, reset, trigger, clearErrors, setError, watch, control, getValues, formState: { errors } } = useForm<DirectiveData>();
  const { mutate, isLoading } = useAddDirectivesItems();
  const queryClient = useQueryClient();
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  
  const cachedProfile = queryClient
    .getQueryCache()
    .find(['employerProfileCache']) as {
    state: { data: CachedProfileData } | undefined;
  };


  const onSubmit = handleSubmit((data) => {
    // Check if To field has any entries with valid email format
    if (tagsTo.length === 0) {
      toast.custom(() => <CustomToast message={'To field is required'} type='error' />, {
        duration: 5000,
      });
      return; // Prevent form submission
    }
    
    // Validate that all email addresses in tagsTo are valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = tagsTo.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      toast.custom(() => <CustomToast message={'Please enter valid email addresses'} type='error' />, {
        duration: 5000,
      });
      return; // Prevent form submission
    }

    const callbackReq = {
      onSuccess: () => {
        toast.custom(
          () => <CustomToast message={'Successfully created a memo'} type='success' />,

          { duration: 5000 }
        );
        setIsOpen(false);

        refetch();

        reset();
        setEmployeeSearch('');
        setEmployeeSelected(false);
        setTagsTo([]);
        setFiles([]);
        setQrCodeExist(false);
        setSignatureFileExist(false);
        setToSaveData(null);
        setSignatureUrl('');
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 5000,
        });
      },
    };
    data['to'] = tagsTo;
    data.directive_type = 'memo';
    // Add multiple attachments - pass files array directly
    const payload: any = { ...toSaveData, ...data };
    if (files.length > 0) {
      payload.attachments = files;
    }
    mutate(payload, callbackReq);
  });

  const uploadOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      setToSaveData({ ...toSaveData, qr_code: file });
      setQrCodeExist(true);
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 5000,
      });
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
  const titleValue = watch('title');
  useEffect(() => {
    if (titleValue && titleValue !== "") {
      clearErrors('title');
    }
  }, [titleValue, clearErrors]);

  // Clear errors when tagsTo changes
  useEffect(() => {
    if (tagsTo.length > 0) {
      clearErrors('to');
    }
  }, [tagsTo, clearErrors]);



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

  // Set company name from cached profile when modal opens
  useEffect(() => {
    if (isOpen && cachedProfile?.state?.data) {
      setValue('company_name', cachedProfile.state.data.name || '');
    }
  }, [isOpen, cachedProfile, setValue]);

  useEffect(() => {
    if (signatureUrl) {
      setValue('signature', signatureUrl as never);
      // Clear uploaded file if drawn signature is created
      setSignatureFileExist(false);
      const signatureInput = document.getElementById('signature') as HTMLInputElement;
      if (signatureInput) {
        signatureInput.value = '';
      }
    } else {
      setSignatureUrl('');
    }
    if (!isOpen && signatureUrl) {
      setSignatureUrl('');
    }

    // Reset form when modal closes
    if (!isOpen) {
      setFiles([]);
      setEmployeeSearch('');
      setEmployeeSelected(false);
      setIsToFocused(false);
      setQrCodeExist(false);
      setSignatureFileExist(false);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
      const signatureInput = document.getElementById('signature') as HTMLInputElement;
      if (signatureInput) {
        signatureInput.value = '';
      }
      if (qrCodeInputRef.current) {
        qrCodeInputRef.current.value = '';
      }
    }
  }, [signatureUrl, setValue, isOpen]);

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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Memo</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>
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
                              onEmployeeSelect={handleEmployeeSelect}
                              onRemoveTag={handleRemoveTagTo}
                              showTooltip={showTooltip}
                              tooltipId="to-section-tooltip"
                              isFocused={isToFocused}
                            />
                          </div>
                        </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='body' className='block text-sm font-medium leading-6 text-gray-900'>
                        Body
                      </label>
                      <div className='mt-2 h-72 mb-12'>
                        <textarea rows={4} {...register('body')} id='body' hidden />
                        <ReactQuill
                          onChange={(value) => setValue('body', value)}
                          formats={QUILL_FORMATS}
                          modules={QUILL_MODULES}
                          style={{ height: '100%', padding: '5px 8px !important' }}
                          value={watch('body') || ''}
                        />
                      </div>
                    </div>

                    <p className='font-bold my-4'>Signatory</p>
                    <div className='grid grid-cols-2 gap-6'>
                      <div>
                        <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                          Employee Name
                        </label>
                        <div className='relative mt-2'>
                          <EmployeeSelect
                            control={control}
                            name="employee_id"
                            label=""
                            required={false}
                            placeholder="Select employee..."
                            isMulti={false}
                            isClearable={true}
                            employeeSearch={employeeSearch}
                            setEmployeeSearch={setEmployeeSearch}
                            setEmployeeSelected={setEmployeeSelected}
                            className=""
                            onChange={(selectedOption: any) => {
                              if (selectedOption && !selectedOption.isShowMore) {
                                setEmployeeSearch(selectedOption.label);
                                setEmployeeSelected(true);
                                // Set the name field to the employee's full name
                                setValue('name', selectedOption.label);
                                // Auto-fill position from employee data
                                if (selectedOption.position) {
                                  setValue('position', selectedOption.position);
                                }
                              } else {
                                setEmployeeSearch('');
                                setEmployeeSelected(false);
                                setValue('name', '');
                                setValue('position', '');
                              }
                            }}
                          />
                          {/* Hidden input to register the name field */}
                          <input
                            type="hidden"
                            {...register('name')}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                          Position
                        </label>
                        <div className='relative mt-2'>
                          <input
                            id='position'
                            {...register('position')}
                            type='text'
                            readOnly
                            data-tooltip-id="position-tooltip"
                            data-tooltip-content="Auto-populated from selected employee"
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-gray-100 sm:text-sm sm:leading-6'
                          />
                          <Tooltip 
                            id="position-tooltip" 
                            place="bottom"
                            style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className='my-4 block text-sm font-medium leading-6 text-gray-900'>Signature</p>
                    <div className='flex flex-col md:flex-row items-start gap-6 mt-4'>
                      <div className='flex-1'>
                        <button
                          id='draw'
                          type='button'
                          className={`block w-full text-savoy-blue font-bold rounded-md border border-savoy-blue py-1.5 px-3 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                            signatureUrl ? 'bg-savoy-blue text-white ' : ''
                          }`}
                          onClick={() => {
                            setSignatureModalOpen(true);
                            // setSignatureUrl("");
                          }}
                        >
                          Draw
                        </button>
                      </div>
                      <p className='text-center mt-2'>or</p>
                      <div className='flex-1'>
                        <input
                          id='signature'
                          type='file'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                          {...register('signature', {
                            onChange: (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setSignatureUrl('');
                                setSignatureFileExist(true);
                              } else {
                                setSignatureFileExist(false);
                              }
                            }
                          })}
                        />
                        {signatureFileExist && (
                          <button
                            type='button'
                            className='underline text-savoy-blue text-sm mt-1'
                            onClick={() => {
                              setValue('signature', null as never);
                              setSignatureFileExist(false);
                              // Reset the input by accessing it via DOM
                              const signatureInput = document.getElementById('signature') as HTMLInputElement;
                              if (signatureInput) {
                                signatureInput.value = '';
                              }
                            }}
                          >
                            Remove Signature
                          </button>
                        )}
                      </div>
                    </div>
                    {signatureUrl !== '' && (
                      <div className='mt-4'>
                        <Image
                          className='border-0 ring-1 ring-inset ring-gray-300 m-auto'
                          src={signatureUrl}
                          width={500}
                          height={200}
                          alt='signatureImage'
                        />
                      </div>
                    )}
                    <div className='grid grid-cols-2 gap-6 mt-4'>
                      <div>
                        <label htmlFor='qr_code' className='block text-sm font-medium leading-6 text-gray-900'>
                          QR Code
                        </label>
                        <div className='mt-2'>
                          <input
                            id='qr_code'
                            ref={qrCodeInputRef}
                            type='file'
                            onChange={uploadOnChange}
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                          />
                          {qrCodeExist ? (
                            <button
                              type='button'
                              className='underline text-savoy-blue text-sm mt-1'
                              onClick={() => {
                                delete toSaveData.qr_code;
                                setToSaveData({ ...toSaveData });
                                setQrCodeExist(false);
                                if (qrCodeInputRef.current) {
                                  qrCodeInputRef.current.value = '';
                                }
                              }}
                            >
                              Remove QR Code
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <div>
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
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                    <button
                      onClick={async (e) => {
                        const titleValue = watch('title');
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        let hasErrors = false;
                        
                        // Clear any existing errors first
                        clearErrors(['title', 'to']);
                        
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

                        // If there are errors, focus on the first invalid field and return
                        if (hasErrors) {
                          e.preventDefault(); // Prevent form submission
                          if (!titleValue || titleValue === "") {
                            const el = document.getElementById("title");
                            if (el) el.focus();
                          } else if (tagsTo.length === 0) {
                            // Focus on the email input field
                            const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (emailInput) emailInput.focus();
                          }
                          return;
                        }
                      }}
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
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
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
        <SignatureModal
          setSignatureUrl={setSignatureUrl}
          isOpen={signatureModalOpen}
          setIsOpen={setSignatureModalOpen}
        />
      </Dialog>
    </Transition.Root>
  );
}
