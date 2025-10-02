import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import useTagTo from '@/components/hooks/useTagTo';
import CustomToast from '@/components/CustomToast';
import useAddDirectivesItems from '../hooks/useAddDirectivesItems';
import SignatureModal from './SignatureModal';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { DirectiveData } from '@/types/directives';

export default function CreateMemoModal({
  isOpen,
  setIsOpen,
  refetch,
  employeeData,
  onSearchChange,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  employeeData?: any;
  onSearchChange: (searchTerm: string) => void;
}) {
  const cancelButtonRef = useRef(null);
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [qrCodeExist, setQrCodeExist] = useState(false);
  const [toSaveData, setToSaveData] = useState<any>(null);
  const [inputTo, setInputTo] = useState('');
  const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);
  const [showTooltip, setShowTooltip] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { register, handleSubmit, setValue, reset, trigger, clearErrors, setError, watch, formState: { errors } } = useForm<DirectiveData>();
  const { mutate, isLoading } = useAddDirectivesItems();

  // Function to scroll selected item into view
  const scrollToSelectedItem = (index: number) => {
    if (dropdownRef.current && index >= 0) {
      const selectedElement = dropdownRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
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
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 5000,
        });
      },
    };
    data['to'] = tagsTo;
    data.directive_type = 'memo';
    mutate({ ...toSaveData, ...data }, callbackReq);
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

  // Handle file attachment upload
  const handleAttachmentUpload = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    
    if (file.size <= 5000000) {
      // Set the file in the form
      setValue('attachments', file);
      setAttachmentExist(true);
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 5000,
      });
    }
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

  // Filter employees based on input using passed data
  useEffect(() => {
    if (employeeData?.records) {
      if (inputTo.trim()) {
        const searchTerm = inputTo.toLowerCase();
        
        // Filter employees (exclude already selected ones)
        const filtered = employeeData.records.filter((employee: any) => {
          const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
          const email = employee.email?.toLowerCase() || '';
          const department = employee.department?.toLowerCase() || '';
          const position = employee.position?.toLowerCase() || '';
          
          // Check if employee is already selected
          const isAlreadySelected = tagsTo.includes(employee.email);
          
          return !isAlreadySelected && (
            fullName.includes(searchTerm) || 
            email.includes(searchTerm) || 
            department.includes(searchTerm) || 
            position.includes(searchTerm)
          );
        }).slice(0, 5); // Limit to 5 suggestions
        
        // Check if search matches any department name
        const matchingDepartments = new Set();
        employeeData.records.forEach((employee: any) => {
          if (employee.department && employee.department.toLowerCase().includes(searchTerm)) {
            matchingDepartments.add(employee.department);
          }
        });
        
        // Create department options (only show if not all employees from that department are selected)
        const departmentOptions = Array.from(matchingDepartments).map((deptName: any) => {
          // Check if all employees from this department are already selected
          const employeesInDepartment = employeeData.records.filter((emp: any) => 
            emp.department === deptName && emp.email
          );
          const selectedEmployeesInDepartment = employeesInDepartment.filter((emp: any) => 
            tagsTo.includes(emp.email)
          );
          const allEmployeesSelected = employeesInDepartment.length > 0 && 
            selectedEmployeesInDepartment.length === employeesInDepartment.length;
          
          return {
            id: `dept:${deptName}`,
            firstname: null,
            lastname: null,
            email: null,
            department: deptName,
            position: null,
            is_department_option: true,
            label: `${deptName} (All Employees)`,
            allEmployeesSelected: allEmployeesSelected
          };
        }).filter((deptOption: any) => !deptOption.allEmployeesSelected); // Only show departments where not all employees are selected
        
        // Combine department options with filtered employees
        const combinedOptions = [...departmentOptions, ...filtered];
        
        setFilteredEmployees(combinedOptions);
        setShowEmployeeSuggestions(combinedOptions.length > 0);
        setSelectedEmployeeIndex(-1); // Reset selection when filtering
      } else {
        // When no search input, show no suggestions (no department options in default list)
        setFilteredEmployees([]);
        setShowEmployeeSuggestions(false);
        setSelectedEmployeeIndex(-1);
      }
    } else {
      setFilteredEmployees([]);
      setShowEmployeeSuggestions(false);
      setSelectedEmployeeIndex(-1);
    }
  }, [inputTo, employeeData, tagsTo]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmployeeSuggestions(false);
        setSelectedEmployeeIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmployeeSelect = (employee: any) => {
    if (employee.is_department_option) {
      // Handle department selection - add all employees from that department
      const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
        emp.department === employee.department && emp.email
      ) || [];
      
      const newEmails = employeesInDepartment
        .map((emp: any) => emp.email)
        .filter((email: string) => !tagsTo.includes(email));
      
      if (newEmails.length > 0) {
        setTagsTo([...tagsTo, ...newEmails]);
      }
    } else if (employee.email && !tagsTo.includes(employee.email)) {
      // Handle individual employee selection
      setTagsTo([...tagsTo, employee.email]);
    }
    setInputTo('');
    setShowEmployeeSuggestions(false);
    setSelectedEmployeeIndex(-1);
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue('signature', signatureUrl as never);
    } else {
      setSignatureUrl('');
    }
    if (!isOpen && signatureUrl) {
      setSignatureUrl('');
    }
    
    // Reset form when modal closes
    if (!isOpen) {
      setAttachmentExist(false);
      setSelectedEmployeeIndex(-1);
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
                            <div 
                              className='relative border border-gray-300 pl-2 flex items-center gap-3 flex-wrap w-full min-w-0 rounded-l-md'
                              data-tooltip-id='to-section-tooltip'
                              data-tooltip-place='bottom'
                              style={{ width: '100%' }}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    if (showEmployeeSuggestions && filteredEmployees.length > 0) {
                                      const newIndex = selectedEmployeeIndex < filteredEmployees.length - 1 ? selectedEmployeeIndex + 1 : selectedEmployeeIndex;
                                      setSelectedEmployeeIndex(newIndex);
                                      scrollToSelectedItem(newIndex);
                                    }
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const newIndex = selectedEmployeeIndex > 0 ? selectedEmployeeIndex - 1 : -1;
                                    setSelectedEmployeeIndex(newIndex);
                                    if (newIndex >= 0) {
                                      scrollToSelectedItem(newIndex);
                                    }
                                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                                    e.preventDefault();
                                    if (selectedEmployeeIndex >= 0 && filteredEmployees[selectedEmployeeIndex]) {
                                      handleEmployeeSelect(filteredEmployees[selectedEmployeeIndex]);
                                    } else {
                                      handleKeyDownTo(e);
                                    }
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setShowEmployeeSuggestions(false);
                                    setSelectedEmployeeIndex(-1);
                                  } else {
                                    // Let other keys pass through to the original handler
                                    handleKeyDownTo(e);
                                  }
                                }}
                                onChange={(e) => {
                                  setInputTo(e.target.value);
                                  onSearchChange(e.target.value);
                                  setSelectedEmployeeIndex(-1); // Reset selection when typing
                                }}
                                onFocus={() => {
                                  if (employeeData?.records && employeeData.records.length > 0) {
                                    setShowEmployeeSuggestions(true);
                                  }
                                  setShowTooltip(false);
                                }}
                                onBlur={() => {
                                  if (!inputTo.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                className='focus:none outline-none px-2 py-1 flex-1 min-w-0'
                                style={{ width: '100%' }}
                                autoComplete='off'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                data-lpignore='true'
                                data-form-type='other'
                              />
                              {showTooltip && (
                                <Tooltip 
                                  id='to-section-tooltip' 
                                  opacity={1} 
                                  style={{ 
                                    fontSize: '13px', 
                                    borderRadius: '8px', 
                                    backgroundColor: '#222C3B', 
                                    maxWidth: '330px',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    zIndex: 9999
                                  }}
                                >
                                  <div className='px-2 py-1'>
                                    <div className='text-[13px] font-medium leading-relaxed'>
                                      Add multiple recipients by pressing Tab or Enter,<br />
                                      or search for employees and departments.
                                    </div>
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                            
                            {/* Employee Suggestions Dropdown */}
                            {showEmployeeSuggestions && (
                              <div 
                                ref={dropdownRef}
                                className='absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'
                              >
                                {filteredEmployees.map((employee: any, index: number) => (
                                  <div
                                    key={employee.id}
                                    className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                      index === selectedEmployeeIndex 
                                        ? 'bg-blue-100' 
                                        : 'hover:bg-gray-100'
                                    }`}
                                    onMouseEnter={() => setSelectedEmployeeIndex(index)}
                                    onClick={() => handleEmployeeSelect(employee)}
                                  >
                                    {employee.is_department_option ? (
                                      <>
                                        <div className='text-sm font-medium text-gray-900'>
                                          {employee.label}
                                        </div>
                                        <div className='text-xs text-blue-600'>
                                          • Select all employees from this department
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className='text-sm font-medium text-gray-900'>
                                          {employee.firstname} {employee.lastname}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                          {employee.email}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='body' className='block text-sm font-medium leading-6 text-gray-900'>
                        Body
                      </label>
                      <div className='mt-2'>
                        <textarea
                          rows={4}
                          {...register('body')}
                          id='body'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <p className='font-bold my-4'>Signatory</p>
                    <div className='sm:col-span-4'>
                      <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                        Name
                      </label>
                      <div className='mt-2'>
                        <input
                          id='name'
                          {...register('name')}
                          type='text'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                        Position
                      </label>
                      <div className='mt-2'>
                        <input
                          id='position'
                          {...register('position')}
                          type='text'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
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
                          {...register('signature')}
                          onChange={(e) => {
                            e.target.value ? setSignatureUrl('') : null;
                            e.target.value ? setAttachmentExist(true) : null;
                          }}
                          type='file'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                        />
                        {attachmentExist ? (
                          <button
                            type='button'
                            className='underline text-savoy-blue text-sm'
                            onClick={() => {
                              setValue('signature', '' as never);
                              setAttachmentExist(false);
                            }}
                          >
                            Remove Attachment
                          </button>
                        ) : null}
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
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='qr_code' className='block text-sm font-medium leading-6 text-gray-900'>
                        QR Code
                      </label>
                      <div className='mt-2'>
                        <input
                          id='qr_code'
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
                            }}
                          >
                            Remove QR Code
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='attachments' className='block text-sm font-medium leading-6 text-gray-900'>
                        Attachment
                      </label>
                      <div className='mt-2'>
                        <input
                          id='attachments'
                          type='file'
                          onChange={handleAttachmentUpload}
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                        />
                        {attachmentExist ? (
                          <button
                            type='button'
                            className='underline text-savoy-blue text-sm mt-1'
                            onClick={() => {
                              setValue('attachments', undefined as any);
                              setAttachmentExist(false);
                            }}
                          >
                            Remove Attachment
                          </button>
                        ) : null}
                      </div>
                      <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5mb</p>
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
