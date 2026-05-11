import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import useGetEmployeeIssueDetails from '../hooks/useGetEmployeeIssueDetails';
import usePatchEmployeeIssueItems, { EmployeeIssueUpdateData } from '../hooks/usePatchEmployeeIssueItems';
import { usePermission } from '@/hooks/useLegacyPermissions';

import SelectChevronDown from '@/svg/SelectChevronDown';

import { T_IncidentReport } from '@/types/globals';
import { issueTypeOptions } from '@/helpers/issueTypes';

interface Field {
  onChange: (value: any) => void;
  value: any;
}


interface EditIncidentReportModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  selectedIssue: any;
}

export default function EditIncidentReportModal({
  isOpen,
  setIsOpen,
  refetch,
  selectedIssue,
}: EditIncidentReportModalProps) {
  // Use new RBAC hooks
  const editEmployeeIssue = usePermission('edit_employee_issue');
  const updateEmployeeIssueStatus = usePermission('update_employee_issue_status');
  
  // Can edit when user has both permissions AND issue is pending AND no NTE attachment
  const canEdit = editEmployeeIssue.hasPermission && 
                  updateEmployeeIssueStatus.hasPermission && 
                  selectedIssue?.status === 'pending' && 
                  !selectedIssue?.nte_attachment;
  const { mutate, isLoading } = usePatchEmployeeIssueItems();
  
  // Add data fetching hook similar to UpdateWorkAccidentIllnessReportModal
  const {
    data: employeeIssueDetailsData,
    refetch: refetchEmployeeIssueDetails,
    remove: removeEmployeeIssueDetails,
  } = useGetEmployeeIssueDetails(selectedIssue?.id || null);
  const { register, handleSubmit, setValue, reset, control, trigger, watch } = useForm<T_IncidentReport>({
    defaultValues: {
      name: '',
      incidentDate: new Date().toISOString(),
      position: '',
      department: '',
      incidentPlace: '',
      issueType: '',
      briefBackground: '',
    },
  });
  const cancelButtonRef = useRef(null);
  
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [customIssueType, setCustomIssueType] = useState('');
  const briefBackgroundValue = watch('briefBackground') || '';
  const issueTypeValue = watch('issueType') || '';
  
  // Check if the selected option has isCustom flag or if it's the Others value
  const selectedOption = issueTypeOptions.find((opt: any) => opt.value === issueTypeValue && !opt.isDisabled);
  const isOtherSelected = issueTypeValue === 'Others: (Please specify)' || selectedOption?.isCustom === true;
  
  // Refetch data when modal opens
  useEffect(() => {
    if (isOpen && selectedIssue?.id) {
      refetchEmployeeIssueDetails();
    }
  }, [isOpen, selectedIssue?.id, refetchEmployeeIssueDetails]);

  // Populate form when employeeIssueDetailsData is available (similar to UpdateWorkAccidentIllnessReportModal)
  useEffect(() => {
    if (employeeIssueDetailsData && isOpen) {
      // Set employee search to show selected employee name from the API response
      if (employeeIssueDetailsData.employee_name) {
        setEmployeeSearch(employeeIssueDetailsData.employee_name);
        setValue('name', employeeIssueDetailsData.employee);
      } else if (employeeIssueDetailsData.employee) {
        setEmployeeSearch('Loading employee...');
        setValue('name', employeeIssueDetailsData.employee);
      }
      
      // Set form values using the fetched data - matching the API response structure
      setValue('position', employeeIssueDetailsData.position || '');
      setValue('department', employeeIssueDetailsData.department || '');
      setValue('incidentDate', employeeIssueDetailsData.incident_date ? new Date(employeeIssueDetailsData.incident_date).toISOString() : new Date().toISOString());
      setValue('incidentPlace', employeeIssueDetailsData.place_of_incident || '');
      
      // Handle issue type: check if it's a custom value (not in predefined options)
      const issueTypeValue = employeeIssueDetailsData.issue_type || '';
      const isCustomValue = issueTypeValue && !issueTypeOptions.some((opt: any) => opt.value === issueTypeValue && !opt.isDisabled);
      
      if (isCustomValue) {
        // It's a custom value, set dropdown to "Others" and populate custom input
        setValue('issueType', 'Others: (Please specify)');
        setCustomIssueType(issueTypeValue);
      } else {
        // It's a predefined option
        setValue('issueType', issueTypeValue);
        setCustomIssueType('');
      }
      
      setValue('briefBackground', employeeIssueDetailsData.brief_background || '');
    }
  }, [employeeIssueDetailsData, isOpen, setValue, setEmployeeSearch]);

  const customCloseModal = () => {
    reset();
    setEmployeeSearch('');
    setCustomIssueType('');
    removeEmployeeIssueDetails();
    setIsOpen(false);
  };

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={"Successfully updated the incident report."} type='success' />, { duration: 5000 });
        // Clear the cached data so it refetches fresh data
        removeEmployeeIssueDetails();
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    
    // If "Others" is selected and customIssueType has a value, use the custom value
    let finalIssueType = data.issueType;
    if ((data.issueType === 'Others: (Please specify)' || isOtherSelected) && customIssueType.trim()) {
      finalIssueType = customIssueType.trim();
    }
    
    // Transform data to match backend API format
    const updateData: EmployeeIssueUpdateData = {
      id: selectedIssue?.id,
      employee: parseInt(data.name.toString()),
      incident_date: data.incidentDate,
      position: data.position,
      department: data.department,
      place_of_incident: data.incidentPlace,
      issue_type: finalIssueType,
      brief_background: data.briefBackground,
    };
    
    mutate(updateData, callbackReq);
  });


  // Handle brief background input change
  const handleBriefBackgroundChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Prevent excessive consecutive line breaks (more than 2)
    value = value.replace(/\n{3,}/g, '\n\n');
    
    // Also prevent excessive spaces (more than 2 consecutive spaces)
    value = value.replace(/ {3,}/g, '  ');
    
    setValue('briefBackground', value);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
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
                <div className='flex bg-savoy-blue p-2 items-center' data-element-id="update-employee-issue-status-rights">
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    {canEdit ? 'Edit Incident Report' : 'View Incident Report'}
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                </div>
                <form onSubmit={onSubmit}>
                  <div className='px-4 pt-4 pb-6'>
                    <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
                      <div className='flex'>
                        <div className='flex-shrink-0'>
                          <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                        </div>
                        <div className='ml-3'>
                          <h3 className='text-sm font-medium text-red-800'>
                            You cannot proceed due to incomplete fields. Please review.
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6'>
                      <div>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Employee Name{canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='relative mt-2'>
                          {employeeIssueDetailsData && !canEdit ? (
                            // Show simple input in view mode
                            <input
                              type="text"
                              value={employeeIssueDetailsData.employee_name}
                              readOnly
                              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-gray-100 sm:text-sm sm:leading-6"
                            />
                          ) : (
                            // Show EmployeeSelect in edit mode or when no data
                            <EmployeeSelect
                              control={control}
                              name="name"
                              label=""
                              required={true}
                              placeholder="Select employee..."
                              isMulti={false}
                              isClearable={canEdit}
                              employeeSearch={employeeSearch}
                              setEmployeeSearch={setEmployeeSearch}
                              employeeName={employeeIssueDetailsData?.employee_name}
                              className=""
                              onChange={(selectedOption: any) => {
                                if (canEdit && selectedOption && !selectedOption.isShowMore) {
                                  setEmployeeSearch(selectedOption.label);
                                  // Auto-fill department from employee data
                                  if (selectedOption.department) {
                                    setValue('department', selectedOption.department);
                                  }
                                  // Auto-fill position from employee data
                                  if (selectedOption.position) {
                                    setValue('position', selectedOption.position);
                                  }
                                } else if (canEdit) {
                                  setEmployeeSearch('');
                                  setValue('department', '');
                                  setValue('position', '');
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                          Position{canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='relative mt-2'>
                          <input
                            id='position'
                            {...register('position', { required: true })}
                            type='text'
                            readOnly
                            disabled={!canEdit}
                            data-tooltip-id="position-tooltip"
                            data-tooltip-content="Auto-populated from selected employee"
                            className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-gray-100 sm:text-sm sm:leading-6`}
                          />
                          <Tooltip 
                            id="position-tooltip" 
                            place="bottom"
                            style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6 mt-4'>
                      <div>
                        <label htmlFor='department' className='block text-sm font-medium leading-6 text-gray-900'>
                          Department{canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='relative mt-2'>
                          <input
                            id='department'
                            {...register('department', { required: true })}
                            type='text'
                            readOnly
                            disabled={!canEdit}
                            data-tooltip-id="department-tooltip"
                            data-tooltip-content="Auto-populated from selected employee"
                            className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-gray-100 sm:text-sm sm:leading-6`}
                          />
                          <Tooltip 
                            id="department-tooltip" 
                            place="bottom"
                            style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Date of Incident
                          {canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='relative mt-2'>
                          <Controller
                            control={control}
                            name='incidentDate'
                            render={({ field }) => (
                              <CustomDatePicker
                                id='edit-incident-report-datepicker'
                                placeholder={'mm/dd/yyyy'}
                                className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none ${!canEdit ? 'bg-gray-100' : ''}`}
                                selected={field.value ? new Date(field.value) : null}
                                pickerOnChange={(date: any) => canEdit && field.onChange(date)}
                                inputOnChange={(value: any) => canEdit && field.onChange(value)}
                                required={true}
                                disabled={!canEdit}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6 mt-4'>
                      <div>
                        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                          Place of Incident
                          {canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='mt-2'>
                          <input
                            id='incidentPlace'
                            {...register('incidentPlace', { required: true })}
                            type='text'
                            disabled={!canEdit}
                            className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${!canEdit ? 'bg-gray-100' : ''}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor='issueType' className='block text-sm font-medium leading-6 text-gray-900'>
                          Issue Type{canEdit && <span className='text-red-600'>*</span>}
                        </label>
                        <div className='relative mt-2'>
                          <Controller
                            name='issueType'
                            control={control}
                            rules={{
                              required: "Please select an issue type",
                              validate: (value) => {
                                const selectedOpt = issueTypeOptions.find((opt: any) => opt.value === value && !opt.isDisabled);
                                if ((value === 'Others: (Please specify)' || selectedOpt?.isCustom === true) && canEdit) {
                                  if (!customIssueType || !customIssueType.trim()) {
                                    return "Please specify the issue type";
                                  }
                                }
                                return true;
                              }
                            }}
                            render={({ field: { onChange, value } }: { field: Field }) => {
                              // Check if current value is a custom value (not in predefined options)
                              const selectedOpt = issueTypeOptions.find((opt: any) => opt.value === value && !opt.isDisabled);
                              const isCustomValue = value && value !== 'Others: (Please specify)' && !issueTypeOptions.some((opt: any) => opt.value === value && !opt.isDisabled);
                              const isCustomOption = value === 'Others: (Please specify)' || selectedOpt?.isCustom === true;
                              const displayValue = isCustomValue ? 'Others: (Please specify)' : value;
                              
                              return (
                                <>
                                  <Select
                                    className='text-sm'
                                    classNamePrefix='select'
                                    options={issueTypeOptions}
                                    value={issueTypeOptions.find((item: any) => item.value === displayValue) || null}
                                    onChange={(val: any) => {
                                      if (canEdit) {
                                        const newValue = val ? val.value : '';
                                        onChange(newValue);
                                        // Clear custom input if switching away from "Others"
                                        const newOpt = issueTypeOptions.find((opt: any) => opt.value === newValue && !opt.isDisabled);
                                        if (newValue !== 'Others: (Please specify)' && newOpt?.isCustom !== true) {
                                          setCustomIssueType('');
                                        }
                                      }
                                    }}
                                    components={{
                                      DropdownIndicator: () => (
                                        <div className='pointer-events-none px-2'>
                                          <SelectChevronDown />
                                        </div>
                                      ),
                                      IndicatorSeparator: () => null,
                                    }}
                                    isClearable={false}
                                    isDisabled={!canEdit}
                                    isOptionDisabled={(option: any) => option.isDisabled}
                                    noOptionsMessage={() => null}
                                    placeholder='Select issue type...'
                                    menuPortalTarget={document.body}
                                    menuPosition='fixed'
                                    styles={{
                                      menuPortal: (base: any) => ({ ...base, zIndex: 50 }),
                                      menu: (base: any) => ({ ...base, zIndex: 50 }),
                                    }}
                                  />
                                  {(isCustomOption || isCustomValue) && (
                                    <div className='mt-2'>
                                      <input
                                        id='customIssueType'
                                        type='text'
                                        placeholder='Please specify the issue type...'
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${!canEdit ? 'bg-gray-100' : ''}`}
                                        value={isCustomValue ? value : customIssueType}
                                        onChange={(e) => {
                                          if (canEdit) {
                                            const customValue = e.target.value;
                                            setCustomIssueType(customValue);
                                            // Preserve user-entered spacing; only fall back when empty
                                            if (customValue === '') {
                                              onChange('Others: (Please specify)');
                                            } else {
                                              onChange(customValue);
                                            }
                                          }
                                        }}
                                        onBlur={async () => {
                                          if (canEdit) {
                                            await trigger('issueType');
                                          }
                                        }}
                                        disabled={!canEdit}
                                      />
                                    </div>
                                  )}
                                </>
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='sm:col-span-4 mt-4'>
                      <label htmlFor='message' className='block text-sm font-medium leading-6 text-gray-900'>
                        Brief Background{canEdit && <span className='text-red-600'>*</span>}
                      </label>
                      <div className='mt-2'>
                        <textarea
                          rows={Math.max(4, Math.min(10, briefBackgroundValue.split('\n').length + 1))}
                          {...register('briefBackground', { required: true })}
                          id='briefBackground'
                          value={briefBackgroundValue}
                          onChange={canEdit ? handleBriefBackgroundChange : undefined}
                          disabled={!canEdit}
                          className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 resize-none sm:text-sm sm:leading-6 ${!canEdit ? 'bg-gray-100' : ''}`}
                        />
                        <div className='text-xs text-gray-500 text-right mt-1'>
                          {briefBackgroundValue.length} characters
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 px-4'>
                    {/* Update and Close buttons */}
                    <div className={canEdit ? 'sm:flex sm:flex-row-reverse' : 'flex justify-end'}>
                      {canEdit && (
                        <button
                          type='submit'
                          onClick={async () => {
                            const name = await trigger('name');
                            const position = await trigger('position');
                            const department = await trigger('department');
                            const incidentPlace = await trigger('incidentPlace');
                            const issueType = await trigger('issueType');
                            const briefBackground = await trigger('briefBackground');
                            const incidentDate = await trigger('incidentDate');
                          }}
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
                          {!isLoading && 'Update'}
                        </button>
                      )}
                      <button
                        type='button'
                        className={`inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 ${canEdit ? 'mt-3 w-full sm:mt-0 sm:w-auto' : 'w-auto'}`}
                        onClick={() => customCloseModal()}
                        ref={cancelButtonRef}
                      >
                        Close
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
