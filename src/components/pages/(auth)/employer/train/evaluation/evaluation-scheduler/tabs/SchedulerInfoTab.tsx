import { useEffect, useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';
import Select, { components } from 'react-select';

import useGetEvaluationTemplateItems from '@/components/hooks/useGetEvaluationTemplateItems';

import SelectChevronDown from '@/svg/SelectChevronDown';
import InfoIcon from '@/svg/InfoIcon';
import { ClockIcon } from '@heroicons/react/24/outline';

// Custom MenuList component to hide scrollbar arrows and show 5 items
const MenuList = (props: any) => {
  return (
    <components.MenuList
      {...props}
      className="custom-menu-list"
      style={{
        ...props.style,
        maxHeight: '175px',
      }}
    >
      {props.children}
    </components.MenuList>
  );
};

function SchedulerInfoTab({
  register,
  handleSubmit,
  setSelectedTab,
  watch,
  setValue,
  setIsCustomModalOpen,
  control,
  Controller,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: (tab: number) => void;
  watch: any;
  setValue: any;
  setIsCustomModalOpen: (isOpen: boolean) => void;
  control: any;
  Controller: any;
}) {
  const [evaluationItems, setEvaluationItems] = useState<any>([]);
  const {
    data: dataEvaluation,
  } = useGetEvaluationTemplateItems();

  const selectedFrequencyUnit = watch('frequency_unit');
  const selectedEvaluationTemplate = watch('evaluation_template');
  const selectedReminderSchedule = watch('reminder_schedule');
  const [showTooltip, setShowTooltip] = useState(false);
  const [customScheduleDetails, setCustomScheduleDetails] = useState<{
    months: number[];
    day: number;
  } | null>(null);
  // Add a state to force UI updates when custom frequency changes
  const [customFrequencyUpdateCounter, setCustomFrequencyUpdateCounter] = useState(0);

  // Helper function to update deadline (now uses day and time instead of full date)
  const updateDeadline = (day: number, time: string) => {
    if (!day || !time) return;
    
    // Store as JSON object with day and time
    const deadlineJSON = {
      day: parseInt(String(day)),
      time: time
    };
    
    // Set the deadline as JSON string
    setValue('deadline', JSON.stringify(deadlineJSON));
  };

  // Watch for custom frequency value changes
  const customFrequencyValue = watch('frequency_value');
  // Determine if the current frequency_unit is a custom type
  const isCustomUnit = ['quarterly', 'semi-annually', 'annually'].includes(watch('frequency_unit'));
  
  // Parse custom frequency details when they change
  useEffect(() => {
    if (isCustomUnit && customFrequencyValue) {
      try {
        const parsed = JSON.parse(customFrequencyValue);
        if (parsed.months && parsed.day) {
          setCustomScheduleDetails({ months: [...parsed.months], day: parsed.day });
        }
      } catch (error) {
        console.error('Error parsing custom frequency value:', error);
      }
    } else if (!isCustomUnit) {
      setCustomScheduleDetails(null);
    }
  }, [isCustomUnit, customFrequencyValue, customFrequencyUpdateCounter]);

  // Load deadline day and time when editing
  useEffect(() => {
    const deadlineValue = watch('deadline');
    if (deadlineValue) {
      try {
        let deadlineJSON: any = {};
        if (typeof deadlineValue === 'string') {
          deadlineJSON = JSON.parse(deadlineValue);
        } else if (typeof deadlineValue === 'object') {
          deadlineJSON = deadlineValue;
        }
        
        if (deadlineJSON.day && deadlineJSON.time) {
          setValue('deadline_day', deadlineJSON.day);
          setValue('deadline_time', deadlineJSON.time);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, [watch('deadline'), setValue]);

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  useEffect(() => {
    // Show tooltip for 3 seconds on mount only if no frequency is set
    if (!selectedFrequencyUnit && !customFrequencyValue) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Show tooltip when user selects week or month
  useEffect(() => {
    if (selectedFrequencyUnit === 'week' || selectedFrequencyUnit === 'month') {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedFrequencyUnit]);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    // Only hide if it's not the initial auto-show period
    setTimeout(() => {
      setShowTooltip(false);
    }, 100);
  };

  useEffect(() => {
    if (dataEvaluation) {
      // Ensure we always have an array
      const items = Array.isArray(dataEvaluation) ? dataEvaluation : [];
      setEvaluationItems(items);
    }
  }, [dataEvaluation]);

    // Prepare evaluation template options for react-select (sorted alphabetically)
    const evaluationTemplateOptions = useMemo(() => {
      if (!Array.isArray(evaluationItems)) return [];
      return evaluationItems
        .map((item: any) => ({
          value: String(item.id),
          label: item.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }, [evaluationItems]);
  
    // Reminder schedule options
    const reminderScheduleOptions = useMemo(() => [
      { value: '3 days', label: '3 days before' },
      { value: '1 day', label: '1 day before' },
    ], []);
    
  // Reset frequency value when frequency unit changes to ensure proper value display
  useEffect(() => {
    if (selectedFrequencyUnit) {
      // Trigger a re-render of the frequency value dropdown
      const currentValue = watch('frequency_value');
      if (currentValue) {
        // Temporarily clear and reset the value to ensure proper display
        setValue('frequency_value', '');
        setTimeout(() => {
          setValue('frequency_value', currentValue);
          // Force UI update for custom frequencies
          if (isCustomUnit) {
            setCustomFrequencyUpdateCounter(prev => prev + 1);
          }
        }, 0);
      }
    }
  }, [selectedFrequencyUnit, watch, setValue, isCustomUnit]);

  // Handle frequency unit change
  const handleFrequencyUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomModalOpen(true);
    } else {
      setValue('frequency_unit', value);
      setValue('frequency_value', '');
      setValue('deadline_day', ''); // Clear deadline day when frequency unit changes
      setValue('deadline', ''); // Clear deadline JSON
      setCustomScheduleDetails(null);
    }
  };

  // Modify to handle custom modal opening with an update mechanism
  const handleOpenCustomModal = () => {
    // When the modal is opened, we'll refresh UI when it's closed
    setIsCustomModalOpen(true);
    // After modal closes, parent component will re-render this component with a new key
  };

  // When custom frequency is updated, force a refresh
  useEffect(() => {
    // This runs on initial mount and whenever the component gets a new key from parent
    if (isCustomUnit && customFrequencyValue) {
      setCustomFrequencyUpdateCounter(prev => prev + 1);
    }
  }, []);

  const getCustomScheduleDisplay = () => {
    if (!customScheduleDetails) return '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const selectedMonthNames = customScheduleDetails.months.map(month => monthNames[month - 1]);
    let frequencyText = '';
    if (selectedFrequencyUnit === 'quarterly') frequencyText = 'Quarterly';
    else if (selectedFrequencyUnit === 'semi-annually') frequencyText = 'Semi-Annually';
    else frequencyText = 'Annually';
    return `${frequencyText} - ${selectedMonthNames.join(', ')} ${customScheduleDetails.day}`;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-6 pt-6 pb-8'>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Schedule<span className='text-red-600'>*</span>
              <div
                className='inline-block ml-1 cursor-pointer'
                data-tooltip-id='file-upload-tooltip'
                data-tooltip-place='right'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <InfoIcon />
              </div>
              <Tooltip 
                id='file-upload-tooltip' 
                opacity={1} 
                style={{ fontSize: '10px' }}
                isOpen={showTooltip}
              >
                <div>
                  <h2 className='text-[12px] font-medium'>
                    {(!customFrequencyValue && !selectedFrequencyUnit)
                      ? 'Select week, month, or custom first.'
                      : selectedFrequencyUnit === 'week'
                        ? 'The week starts with Sunday-1 to Saturday-7'
                        : selectedFrequencyUnit === 'month'
                          ? 'If you select 31, it will use the last day for months with fewer days.'
                          : isCustomUnit
                            ? 'Custom schedule uses the selected months and day.'
                            : ''}
                  </h2>
                </div>
              </Tooltip>
          </label>
          <div className='flex items-center text-sm'>
            {(!isCustomUnit) ? (
              <>
                Every
                <div className='relative mt-2 mx-3'>
                  <select
                    id='frequency_value'
                    {...register('frequency_value', { required: true })}
                    disabled={!selectedFrequencyUnit}
                    className='appearance-none block w-16 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 text-left disabled:bg-gray-100 disabled:text-gray-500'
                  >
                    <option value='' disabled>
                      -
                    </option>
                    {selectedFrequencyUnit === 'week' && 
                      Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))
                    }
                    {selectedFrequencyUnit === 'month' && 
                      Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))
                    }
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-1 flex items-center pr-1'>
                    <SelectChevronDown />
                  </div>
                </div>
                day of the
              </>
            ) : (
              <div className='mt-2 mx-3 flex items-center space-x-2'>
                <textarea
                  key={customFrequencyUpdateCounter} // Add key to force re-render
                  value={getCustomScheduleDisplay()}
                  readOnly
                  rows={1}
                  className="block rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6 resize-none"
                  style={{ width: '100%', minHeight: '4rem' }}
                  placeholder="Select custom frequency..."
                />
                <button
                  type='button'
                  onClick={handleOpenCustomModal}
                  className='px-3 py-1.5 text-sm text-savoy-blue hover:text-indigo-300 border border-savoy-blue rounded-md hover:bg-blue-50'
                >
                  Edit
                </button>
                <input
                  type='hidden'
                  {...register('frequency_value')}
                  value={customScheduleDetails ? JSON.stringify(customScheduleDetails) : ''}
                />
              </div>
            )}
            <div className='relative mt-2 mx-3 w-28'>
              <select
                id='frequency_unit'
                {...register('frequency_unit', { required: true })}
                value={isCustomUnit ? 'custom' : (selectedFrequencyUnit || '')}
                onChange={handleFrequencyUnitChange}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value='' disabled>
                  Select...
                </option>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
                <option value='custom'>Custom</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='deadline' className='block text-sm font-medium leading-6 text-gray-900'>
                Evaluation Deadline<span className='text-red-600'>*</span>
              </label>
              {isCustomUnit && customScheduleDetails && customScheduleDetails.months.length > 1 ? (
                // Multiple months - show day and time inputs (applies to all months)
                <div className='mt-2'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <label htmlFor='deadline_day' className='block text-sm font-medium text-gray-700 mb-1'>
                        Day of Month
                      </label>
                      <div className='relative'>
                        <select
                          id='deadline_day'
                          {...register('deadline_day', { 
                            required: "Evaluation deadline day is required"
                          })}
                          onChange={(e) => {
                            const dayValue = parseInt(e.target.value);
                            const timeValue = watch('deadline_time');
                            if (dayValue && timeValue) {
                              updateDeadline(dayValue, timeValue);
                            }
                          }}
                          className='appearance-none block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          required
                        >
                          <option value='' disabled>
                            -
                          </option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className='relative'>
                      <label htmlFor='deadline_time' className='block text-sm font-medium text-gray-700 mb-1'>
                        Time
                      </label>
                      <input
                        type='time'
                        {...register('deadline_time', { required: "Evaluation deadline time is required" })}
                        id='deadline_time'
                        onChange={(e) => {
                          const dayValue = watch('deadline_day');
                          if (dayValue && e.target.value) {
                            updateDeadline(parseInt(String(dayValue)), e.target.value);
                          }
                        }}
                        className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden'
                        style={{ WebkitAppearance: 'none' }}
                        required
                      />
                      <div 
                        className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer mt-6'
                        onClick={() => {
                          const timeInput = document.getElementById('deadline_time') as HTMLInputElement;
                          timeInput?.showPicker();
                        }}
                      >
                        <ClockIcon className='h-6 w-6 text-savoy-blue hover:text-indigo-300' />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Single deadline - use day and time for week/month frequencies too
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
                  <div>
                    <label htmlFor='deadline_day' className='block text-sm font-medium text-gray-700 mb-1'>
                      {selectedFrequencyUnit === 'week' ? 'Day of Week' : 'Day of Month'}
                    </label>
                    <div className='relative'>
                      <select
                        id='deadline_day'
                        {...register('deadline_day', { 
                          required: "Evaluation deadline day is required"
                        })}
                        onChange={(e) => {
                          const dayValue = parseInt(e.target.value);
                          const timeValue = watch('deadline_time');
                          if (dayValue && timeValue) {
                            updateDeadline(dayValue, timeValue);
                          }
                        }}
                        className='appearance-none block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        required
                      >
                        <option value='' disabled>
                          -
                        </option>
                        {selectedFrequencyUnit === 'week' 
                          ? Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))
                          : Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))
                        }
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                        <SelectChevronDown />
                      </div>
                    </div>
                  </div>
                  <div className='relative'>
                    <label htmlFor='deadline_time' className='block text-sm font-medium text-gray-700 mb-1'>
                      Time
                    </label>
                    <input
                      type='time'
                      {...register('deadline_time', { required: "Evaluation deadline time is required" })}
                      id='deadline_time'
                      onChange={(e) => {
                        const dayValue = watch('deadline_day');
                        if (dayValue && e.target.value) {
                          updateDeadline(parseInt(String(dayValue)), e.target.value);
                        }
                      }}
                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden'
                      style={{ WebkitAppearance: 'none' }}
                      required
                    />
                    <div 
                      className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer mt-6'
                      onClick={() => {
                        const timeInput = document.getElementById('deadline_time') as HTMLInputElement;
                        timeInput?.showPicker();
                      }}
                    >
                      <ClockIcon className='h-6 w-6 text-savoy-blue hover:text-indigo-300' />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='flex items-center mt-12'>
              <div className='flex items-center w-full'>
                <input
                  id='close_after_deadline'
                  type='checkbox'
                  {...register('close_after_deadline')}
                  className='h-4 w-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue'
                />
                <label htmlFor='close_after_deadline' className='ml-2 block text-sm text-gray-900'>
                  Close evaluation forms after deadline passes
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Scheduler Name<span className='text-red-600'>*</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name', { required: true })}
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
          />
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Template<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
          <Controller
              name='evaluation_template'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }: { field: { onChange: (value: any) => void; value: any } }) => (
                <Select
                  className='text-sm'
                  classNamePrefix='select'
                  options={evaluationTemplateOptions}
                  value={evaluationTemplateOptions.find((item: any) => item.value === String(value))}
                  onChange={(val) => onChange(val?.value || '')}
                  components={{
                    DropdownIndicator: () => (
                      <div className='pointer-events-none px-2'>
                        <SelectChevronDown />
                      </div>
                    ),
                    IndicatorSeparator: () => null,
                    MenuList: MenuList,
                  }}
                  isClearable={false}
                  noOptionsMessage={() => 'No evaluation templates available'}
                  placeholder='Select...'
                  maxMenuHeight={175}
                  menuPortalTarget={document.body}
                  menuPosition='fixed'
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid rgb(209, 213, 219)',
                      boxShadow: 'none',
                      borderRadius: '0.375rem',
                      minHeight: '38px',
                      '&:hover': {
                        border: '1px solid rgb(209, 213, 219)',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? 'rgb(59, 130, 246)'
                        : state.isFocused
                        ? 'rgb(239, 246, 255)'
                        : 'white',
                      color: state.isSelected ? 'white' : 'rgb(17, 24, 39)',
                      fontSize: '0.75rem',
                      padding: '8px 12px',
                      height: '35px',
                      '&:active': {
                        backgroundColor: 'rgb(59, 130, 246)',
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: '0.75rem',
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    menuList: (base) => ({
                      ...base,
                      padding: '0',
                      maxHeight: '175px',
                    }),
                  }}
                />
              )}
            />

          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Reminder Schedule<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
          <Controller
              name='reminder_schedule'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }: { field: { onChange: (value: any) => void; value: any } }) => (
                <Select
                  className='text-sm'
                  classNamePrefix='select'
                  options={reminderScheduleOptions}
                  value={reminderScheduleOptions.find((item: any) => item.value === value)}
                  onChange={(val) => onChange(val?.value || '')}
                  components={{
                    DropdownIndicator: () => (
                      <div className='pointer-events-none px-2'>
                        <SelectChevronDown />
                      </div>
                    ),
                    IndicatorSeparator: () => null,
                  }}
                  isClearable={false}
                  noOptionsMessage={() => 'No options available'}
                  placeholder='Select...'
                  maxMenuHeight={200}
                  menuPortalTarget={document.body}
                  menuPosition='fixed'
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid rgb(209, 213, 219)',
                      boxShadow: 'none',
                      borderRadius: '0.375rem',
                      minHeight: '38px',
                      '&:hover': {
                        border: '1px solid rgb(209, 213, 219)',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? 'rgb(59, 130, 246)'
                        : state.isFocused
                        ? 'rgb(239, 246, 255)'
                        : 'white',
                      color: state.isSelected ? 'white' : 'rgb(17, 24, 39)',
                      fontSize: '0.75rem',
                      padding: '8px 12px',
                      height: '35px',
                      '&:active': {
                        backgroundColor: 'rgb(59, 130, 246)',
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: '0.75rem',
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className='py-4 px-4 text-right'>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Next
        </button>
      </div>
    </form>
    </>
  );
}

export default SchedulerInfoTab;