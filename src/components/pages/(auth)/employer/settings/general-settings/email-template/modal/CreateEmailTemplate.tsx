import React, { Dispatch, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useTagTo from '@/components/hooks/useTagTo';
import useTagCC from '@/components/hooks/useTagCc';
import useTagBcc from '@/components/hooks/useTagBcc';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import useAddEmailTemplate from '../hooks/useAddEmailTemplate';
import EmailField from '../components/EmailField';

import { XCircleIcon } from '@heroicons/react/24/solid';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

export default function EmailTemplateModal({
  isOpen,
  setIsOpen,
  refetch,
  onSuccess,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  onSuccess: any;
}) {
  const inputRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isCCOpen, setIsCCOPen] = useState(false);
  const [isBCCOpen, setIsBCCOpen] = useState(false);
  const [inputTo, setInputTo] = useState('');
  const [inputCc, setInputCc] = useState('');
  const [inputBcc, setInputBcc] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Paginated search state
  const [toSearchTerm, setToSearchTerm] = useState('');
  const [ccSearchTerm, setCcSearchTerm] = useState('');
  const [bccSearchTerm, setBccSearchTerm] = useState('');
  const [debouncedToSearch, setDebouncedToSearch] = useState('');
  const [debouncedCcSearch, setDebouncedCcSearch] = useState('');
  const [debouncedBccSearch, setDebouncedBccSearch] = useState('');

  // Generic employee field state management
  const toDropdownRef = useRef<HTMLDivElement>(null);
  const ccDropdownRef = useRef<HTMLDivElement>(null);
  const bccDropdownRef = useRef<HTMLDivElement>(null);
  
  // TO field state
  const [showTOSuggestions, setShowTOSuggestions] = useState(false);
  const [filteredTOEmployees, setFilteredTOEmployees] = useState<any[]>([]);
  const [selectedTOIndex, setSelectedTOIndex] = useState(-1);
  
  // CC field state
  const [showCCSuggestions, setShowCCSuggestions] = useState(false);
  const [filteredCCEmployees, setFilteredCCEmployees] = useState<any[]>([]);
  const [selectedCCIndex, setSelectedCCIndex] = useState(-1);
  
  // BCC field state
  const [showBCCSuggestions, setShowBCCSuggestions] = useState(false);
  const [filteredBCCEmployees, setFilteredBCCEmployees] = useState<any[]>([]);
  const [selectedBCCIndex, setSelectedBCCIndex] = useState(-1);
  
  const { tagsTo, setTagsTo, handleKeyDownTo, handleRemoveTagTo } = useTagTo(inputTo, setInputTo);
  const { tagsCc, setTagsCc, handleKeyDown, handleRemoveTag } = useTagCC(inputCc, setInputCc);
  const { tagsBcc, setTagsBcc, handleKeyDownBcc, handleRemoveTagBcc } = useTagBcc(inputBcc, setInputBcc);
  const [file, setFile] = useState<File | null>(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const { register, handleSubmit, reset, setValue, getValues } = useForm<any>();
  
  // Paginated employee data fetching
  const { data: toEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedToSearch && debouncedToSearch.length >= 2 ? {
      search: debouncedToSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const { data: ccEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedCcSearch && debouncedCcSearch.length >= 2 ? {
      search: debouncedCcSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const { data: bccEmployeeData } = useGetEmployeePaginatedSelect(
    debouncedBccSearch && debouncedBccSearch.length >= 2 ? {
      search: debouncedBccSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const { mutate, isLoading } = useAddEmailTemplate();

  // Debouncing effects for each field
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedToSearch(toSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [toSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCcSearch(ccSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [ccSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBccSearch(bccSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [bccSearchTerm]);

  // Generic function to scroll selected item into view
  const scrollToSelectedItem = (dropdownRef: React.RefObject<HTMLDivElement>, index: number) => {
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

  // Generic function to filter employees using paginated data
  const filterEmployees = useCallback((inputValue: string, selectedTags: string[], setFilteredEmployees: (employees: any[]) => void, setShowSuggestions: (show: boolean) => void, setSelectedIndex: (index: number) => void, employeeData: any) => {
    if (employeeData?.records) {
      if (inputValue.trim()) {
        const searchTerm = inputValue.toLowerCase();
        
        // Filter employees (exclude already selected ones)
        const filtered = employeeData.records.filter((employee: any) => {
          const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
          const email = employee.email?.toLowerCase() || '';
          const department = employee.department?.toLowerCase() || '';
          const position = employee.position?.toLowerCase() || '';
          
          // Check if employee is already selected
          const isAlreadySelected = selectedTags.includes(employee.email);
          
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
            selectedTags.includes(emp.email)
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
        setShowSuggestions(combinedOptions.length > 0);
        setSelectedIndex(-1); // Reset selection when filtering
      } else {
        // When no search input, show no suggestions
        setFilteredEmployees([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    } else {
      setFilteredEmployees([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, []);

  // Filter employees for TO field
  useEffect(() => {
    filterEmployees(inputTo, tagsTo, setFilteredTOEmployees, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData);
  }, [inputTo, toEmployeeData, tagsTo, filterEmployees]);

  // Filter employees for CC field
  useEffect(() => {
    filterEmployees(inputCc, tagsCc, setFilteredCCEmployees, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData);
  }, [inputCc, ccEmployeeData, tagsCc, filterEmployees]);

  // Filter employees for BCC field
  useEffect(() => {
    filterEmployees(inputBcc, tagsBcc, setFilteredBCCEmployees, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData);
  }, [inputBcc, bccEmployeeData, tagsBcc, filterEmployees]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowTOSuggestions(false);
        setSelectedTOIndex(-1);
      }
      if (ccDropdownRef.current && !ccDropdownRef.current.contains(event.target as Node)) {
        setShowCCSuggestions(false);
        setSelectedCCIndex(-1);
      }
      if (bccDropdownRef.current && !bccDropdownRef.current.contains(event.target as Node)) {
        setShowBCCSuggestions(false);
        setSelectedBCCIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generic function to handle employee selection
  const handleEmployeeSelect = (employee: any, selectedTags: string[], setSelectedTags: (tags: string[]) => void, setInputValue: (value: string) => void, setShowSuggestions: (show: boolean) => void, setSelectedIndex: (index: number) => void, employeeData: any) => {
    if (employee.is_department_option) {
      if (employee.is_remove_option) {
        // Handle department removal - remove all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const emailsToRemove = employeesInDepartment.map((emp: any) => emp.email);
        const remainingTags = selectedTags.filter((tag: string) => !emailsToRemove.includes(tag));
        
        setSelectedTags(remainingTags);
      } else {
        // Handle department selection - add all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const newEmails = employeesInDepartment
          .map((emp: any) => emp.email)
          .filter((email: string) => !selectedTags.includes(email));
        
        if (newEmails.length > 0) {
          setSelectedTags([...selectedTags, ...newEmails]);
        }
      }
    } else if (employee.email && !selectedTags.includes(employee.email)) {
      // Handle individual employee selection
      setSelectedTags([...selectedTags, employee.email]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const onSubmit = handleSubmit((data) => {
    data.to = tagsTo;
    data.cc = tagsCc;
    data.bcc = tagsBcc;

    const callbackReq = {
      onSuccess: async (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        setIsOpen(false);
        reset();
        refetch();
        onSuccess();
      },
      onError: async (error: any) => {
        toast.custom(() => <CustomToast message={error} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setFile(e?.dataTransfer?.files[0]);
  };

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      setFile(e.target.files[0]);
      setValue('attachment', e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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

        <div className='fixed inset-0 z-50 overflow-y-auto'>
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
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Email Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>
                  <div className='px-4 pt-4 pb-6 space-x-10 overflow-y-auto h-[750px]'>
                    <div className='sm:col-span-4 mt-2 w-full space-y-2'>
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Subject<span className='text-red-600'> *</span>
                      </label>
                      <input
                        id='Subject'
                        type='text'
                        {...register('subject', { required: true })}
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      />
                      <div className='w-full mt-4'>
                        <div className='flex items-center justify-between'>
                          <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                            To<span className='text-red-600'> *</span>
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
                        <div className='mt-2 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <EmailField
                              tags={tagsTo}
                              inputValue={inputTo}
                              showSuggestions={showTOSuggestions}
                              filteredEmployees={filteredTOEmployees}
                              selectedIndex={selectedTOIndex}
                              dropdownRef={toDropdownRef}
                              showTooltip={showTooltip}
                              tooltipId="to-section-tooltip"
                              onInputChange={(value) => {
                                setInputTo(value);
                                setToSearchTerm(value);
                                setSelectedTOIndex(-1);
                                setShowTooltip(false);
                              }}
                              onInputFocus={() => {
                                setShowTOSuggestions(inputTo.trim().length > 0);
                                setShowTooltip(false);
                              }}
                              onInputBlur={() => {
                                if (!inputTo.trim()) {
                                  setShowTooltip(true);
                                }
                              }}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                  if (showTOSuggestions && filteredTOEmployees.length > 0) {
                                    const newIndex = selectedTOIndex < filteredTOEmployees.length - 1 ? selectedTOIndex + 1 : selectedTOIndex;
                                    setSelectedTOIndex(newIndex);
                                    scrollToSelectedItem(toDropdownRef, newIndex);
                                    }
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                  const newIndex = selectedTOIndex > 0 ? selectedTOIndex - 1 : -1;
                                  setSelectedTOIndex(newIndex);
                                    if (newIndex >= 0) {
                                    scrollToSelectedItem(toDropdownRef, newIndex);
                                    }
                                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                                    e.preventDefault();
                                  if (selectedTOIndex >= 0 && filteredTOEmployees[selectedTOIndex]) {
                                    handleEmployeeSelect(filteredTOEmployees[selectedTOIndex], tagsTo, setTagsTo, setInputTo, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData);
                                    } else {
                                      handleKeyDownTo(e);
                                    }
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                  setShowTOSuggestions(false);
                                  setSelectedTOIndex(-1);
                                  } else {
                                    handleKeyDownTo(e);
                                  }
                                }}
                              onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsTo, setTagsTo, setInputTo, setShowTOSuggestions, setSelectedTOIndex, toEmployeeData)}
                              onMouseEnter={(index) => setSelectedTOIndex(index)}
                              onRemoveTag={handleRemoveTagTo}
                            />
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
                        <div className='w-full mt-4'>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
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
                          <div className='mt-2'>
                            <EmailField
                                tags={tagsCc}
                                inputValue={inputCc}
                                showSuggestions={showCCSuggestions}
                                filteredEmployees={filteredCCEmployees}
                                selectedIndex={selectedCCIndex}
                                dropdownRef={ccDropdownRef}
                                showTooltip={showTooltip}
                                tooltipId="cc-section-tooltip"
                                onInputChange={(value) => {
                                  setInputCc(value);
                                  setCcSearchTerm(value);
                                  setSelectedCCIndex(-1);
                                }}
                                onInputFocus={() => {
                                  setShowCCSuggestions(inputCc.trim().length > 0);
                                  setShowTooltip(false);
                                }}
                                onInputBlur={() => {
                                  if (!inputCc.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                    if (showCCSuggestions && filteredCCEmployees.length > 0) {
                                      const newIndex = selectedCCIndex < filteredCCEmployees.length - 1 ? selectedCCIndex + 1 : selectedCCIndex;
                                      setSelectedCCIndex(newIndex);
                                      scrollToSelectedItem(ccDropdownRef, newIndex);
                                      }
                                    } else if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                    const newIndex = selectedCCIndex > 0 ? selectedCCIndex - 1 : -1;
                                    setSelectedCCIndex(newIndex);
                                      if (newIndex >= 0) {
                                      scrollToSelectedItem(ccDropdownRef, newIndex);
                                      }
                                    } else if (e.key === 'Enter' || e.key === 'Tab') {
                                      e.preventDefault();
                                    if (selectedCCIndex >= 0 && filteredCCEmployees[selectedCCIndex]) {
                                      handleEmployeeSelect(filteredCCEmployees[selectedCCIndex], tagsCc, setTagsCc, setInputCc, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData);
                                      } else {
                                        handleKeyDown(e);
                                      }
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                    setShowCCSuggestions(false);
                                    setSelectedCCIndex(-1);
                                    } else {
                                      handleKeyDown(e);
                                    }
                                  }}
                                onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsCc, setTagsCc, setInputCc, setShowCCSuggestions, setSelectedCCIndex, ccEmployeeData)}
                                onMouseEnter={(index) => setSelectedCCIndex(index)}
                                onRemoveTag={handleRemoveTag}
                              />
                          </div>
                        </div>
                      )}
                      {isBCCOpen && (
                        <div className='w-full mt-4'>
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
                          <div className='mt-2'>
                            <EmailField
                                tags={tagsBcc}
                                inputValue={inputBcc}
                                showSuggestions={showBCCSuggestions}
                                filteredEmployees={filteredBCCEmployees}
                                selectedIndex={selectedBCCIndex}
                                dropdownRef={bccDropdownRef}
                                showTooltip={showTooltip}
                                tooltipId="bcc-section-tooltip"
                                onInputChange={(value) => {
                                  setInputBcc(value);
                                  setBccSearchTerm(value);
                                  setSelectedBCCIndex(-1);
                                }}
                                onInputFocus={() => {
                                  setShowBCCSuggestions(inputBcc.trim().length > 0);
                                  setShowTooltip(false);
                                }}
                                onInputBlur={() => {
                                  if (!inputBcc.trim()) {
                                    setShowTooltip(true);
                                  }
                                }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                    if (showBCCSuggestions && filteredBCCEmployees.length > 0) {
                                      const newIndex = selectedBCCIndex < filteredBCCEmployees.length - 1 ? selectedBCCIndex + 1 : selectedBCCIndex;
                                      setSelectedBCCIndex(newIndex);
                                      scrollToSelectedItem(bccDropdownRef, newIndex);
                                      }
                                    } else if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                    const newIndex = selectedBCCIndex > 0 ? selectedBCCIndex - 1 : -1;
                                    setSelectedBCCIndex(newIndex);
                                      if (newIndex >= 0) {
                                      scrollToSelectedItem(bccDropdownRef, newIndex);
                                      }
                                    } else if (e.key === 'Enter' || e.key === 'Tab') {
                                      e.preventDefault();
                                    if (selectedBCCIndex >= 0 && filteredBCCEmployees[selectedBCCIndex]) {
                                      handleEmployeeSelect(filteredBCCEmployees[selectedBCCIndex], tagsBcc, setTagsBcc, setInputBcc, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData);
                                      } else {
                                        handleKeyDownBcc(e);
                                      }
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                    setShowBCCSuggestions(false);
                                    setSelectedBCCIndex(-1);
                                    } else {
                                      handleKeyDownBcc(e);
                                    }
                                  }}
                                onEmployeeSelect={(employee) => handleEmployeeSelect(employee, tagsBcc, setTagsBcc, setInputBcc, setShowBCCSuggestions, setSelectedBCCIndex, bccEmployeeData)}
                                onMouseEnter={(index) => setSelectedBCCIndex(index)}
                                onRemoveTag={handleRemoveTagBcc}
                              />
                          </div>
                        </div>
                      )}
                      <div className='w-full mt-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Body<span className='text-red-600'> *</span>
                        </label>
                        <div className='mt-2 h-72 mb-12'>
                          <textarea rows={4} {...register('body', { required: true })} id='body' hidden />
                          <ReactQuill
                            onChange={(value) => setValue('body', value)}
                            formats={QUILL_FORMATS}
                            modules={QUILL_MODULES}
                            style={{ height: '100%', padding: '5px 8px !important' }}
                            defaultValue={getValues('body')}
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                          Attachments<span className='text-red-600'></span>
                        </label>
                        <div>
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className='block w-full rounded-md border-0 py-14 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                          >
                            <label
                              className={`${
                                file === null
                                  ? 'file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal'
                                  : 'hidden'
                              }`}
                            >
                              Drop file to upload
                              <input
                                {...register('attachment')}
                                name='attachment'
                                id='attachment'
                                ref={inputRef}
                                type='file'
                                className='sr-only'
                                onChange={handleChange}
                              />
                            </label>
                            <div className={`${file !== null ? 'file-preview' : 'hidden'}`}>
                              <p className='text-sm text-slate-800 font-light'>{file?.name}</p>
                              <p className='underline text-blue-500 cursor-pointer' onClick={() => setFile(null)}>
                                Remove File
                              </p>
                            </div>
                          </div>
                          <h1 className='text-xs pl-2'>Maximum file size: 10 mb</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row px-4 justify-end space-x-4'>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-100 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                    <div className='ml-4'>
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
                        {!isLoading && 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
