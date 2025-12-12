import { useEffect, useState, useMemo } from 'react';

import { Tooltip } from 'react-tooltip';

import useGetEvaluationTemplateItems from '@/components/hooks/useGetEvaluationTemplateItems';

import ReactSelect from '@/components/common/ReactSelect';
import InfoIcon from '@/svg/InfoIcon';
import { ClockIcon } from '@heroicons/react/24/outline';

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
    } else if (selectedFrequencyUnit === 'custom' && !customFrequencyValue) {
      // Hide tooltip when custom is selected but no custom frequency is set yet
      setShowTooltip(false);
    }
  }, [selectedFrequencyUnit, customFrequencyValue]);

  const handleMouseEnter = () => {
    // Only show tooltip if there's a message to display
    const hasMessage = selectedFrequencyUnit || customFrequencyValue || isCustomUnit;
    if (hasMessage) {
      setShowTooltip(true);
    }
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
  
    // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
    const getOrdinalSuffix = (n: number): string => {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return n + 'st';
      if (j === 2 && k !== 12) return n + 'nd';
      if (j === 3 && k !== 13) return n + 'rd';
      return n + 'th';
    };

    // Reminder schedule options
    const reminderScheduleOptions = useMemo(() => [
      { value: '3 days', label: '3 days before' },
      { value: '1 day', label: '1 day before' },
    ], []);

    // Frequency unit options
    const frequencyUnitOptions = useMemo(() => [
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'custom', label: 'Custom' },
    ], []);

    // Deadline day options (depends on selectedFrequencyUnit: 1-7 for week, 1-31 for month/custom)
    const deadlineDayOptions = useMemo(() => {
      const length = selectedFrequencyUnit === 'week' ? 7 : 31;
      return Array.from({ length }, (_, i) => i + 1).map((day) => ({
        value: String(day),
        label: String(day),
      }));
    }, [selectedFrequencyUnit]);

    // Frequency value options (depends on selectedFrequencyUnit)
    const frequencyValueOptions = useMemo(() => {
      if (!selectedFrequencyUnit) return [];
      const length = selectedFrequencyUnit === 'week' ? 7 : 31;
      return Array.from({ length }, (_, i) => i + 1).map((day) => ({
        value: String(day),
        label: getOrdinalSuffix(day),
      }));
    }, [selectedFrequencyUnit]);
    
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

  // Clear deadline day if it's out of range when frequency unit changes
  useEffect(() => {
    const currentDeadlineDay = watch('deadline_day');
    if (currentDeadlineDay && selectedFrequencyUnit) {
      const maxDay = selectedFrequencyUnit === 'week' ? 7 : 31;
      if (parseInt(String(currentDeadlineDay)) > maxDay) {
        setValue('deadline_day', '');
        setValue('deadline', '');
      }
    }
  }, [selectedFrequencyUnit, watch, setValue]);

  // Handle frequency unit change
  const handleFrequencyUnitChange = (value: string) => {
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
                          : selectedFrequencyUnit === 'custom' || isCustomUnit
                            ? 'Custom schedule uses the selected months and day.'
                            : ''}
                  </h2>
                </div>
              </Tooltip>
          </label>
          <div className='mt-2 flex items-center text-sm text-gray-700'>
            {(!isCustomUnit) ? (
              <>
                <span className='mr-3'>Every</span>
                <ReactSelect
                  name='frequency_value'
                  control={control}
                  rules={{ required: true }}
                  options={frequencyValueOptions}
                  placeholder='-'
                  isDisabled={!selectedFrequencyUnit}
                  width='w-24'
                />
                <span className='mx-3'>day of the</span>
                <ReactSelect
                  name='frequency_unit'
                  control={control}
                  rules={{ required: true }}
                  options={frequencyUnitOptions}
                  value={isCustomUnit ? 'custom' : undefined}
                  onChange={(selectedValue) => {
                    handleFrequencyUnitChange(selectedValue);
                    setValue('frequency_unit', selectedValue);
                  }}
                  placeholder='Select...'
                  width='w-32'
                />
              </>
            ) : (
              <>
                <div className='flex items-center space-x-2 md:w-auto'>
                  <textarea
                    key={customFrequencyUpdateCounter}
                    value={getCustomScheduleDisplay()}
                    readOnly
                    rows={1}
                    className="block flex-1 rounded-md border-0 py-1.5 px-3 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 resize-none md:min-w-[300px] lg:min-w-[400px]"
                    style={{ minHeight: '4rem' }}
                    placeholder="Select custom frequency..."
                  />
                  <button
                    type='button'
                    onClick={handleOpenCustomModal}
                    className='px-3 py-2 text-sm sm:leading-6 text-savoy-blue hover:text-indigo-300 border border-savoy-blue rounded-md hover:bg-blue-50 whitespace-nowrap'
                    style={{ height: '40px' }}
                  >
                    Edit
                  </button>
                  <input
                    type='hidden'
                    {...register('frequency_value')}
                    value={customScheduleDetails ? JSON.stringify(customScheduleDetails) : ''}
                  />
                </div>
                <div className='mx-3'>
                  <ReactSelect
                    name='frequency_unit'
                    control={control}
                    rules={{ required: true }}
                    options={frequencyUnitOptions}
                    value={isCustomUnit ? 'custom' : undefined}
                    onChange={(selectedValue) => {
                      handleFrequencyUnitChange(selectedValue);
                      setValue('frequency_unit', selectedValue);
                    }}
                    placeholder='Select...'
                    width='w-28'
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {(selectedFrequencyUnit || isCustomUnit) && (
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='deadline' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Deadline<span className='text-red-600'>*</span>
          </label>
          <div className='mt-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='deadline_day' className='block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide'>
                  {selectedFrequencyUnit === 'week' ? 'Day of Week' : 'Day of Month'}
                </label>
                <ReactSelect
                  name='deadline_day'
                  control={control}
                  rules={{ required: "Evaluation deadline day is required" }}
                  options={deadlineDayOptions}
                  onChange={(dayValue) => {
                    const day = dayValue ? parseInt(dayValue) : null;
                    setValue('deadline_day', day);
                    const timeValue = watch('deadline_time');
                    if (day && timeValue) {
                      updateDeadline(day, timeValue);
                    }
                  }}
                  placeholder='-'
                />
              </div>
              <div className='relative'>
                <label htmlFor='deadline_time' className='block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide'>
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
                  className='rounded-md w-full border-0 px-3 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden'
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
                  <ClockIcon className="h-6 w-6 text-savoy-blue hover:text-indigo-300" />
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <div className='flex items-start'>
                <input
                  id='close_after_deadline'
                  type='checkbox'
                  {...register('close_after_deadline')}
                  className='h-4 w-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue mt-0.5'
                />
                <div className='ml-2'>
                  <label htmlFor='close_after_deadline' className='block text-sm text-gray-900'>
                    Auto-close evaluation forms
                  </label>
                  <p className='text-xs text-gray-500 mt-0.5'>
                    Close evaluation forms after deadline passes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
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
            <ReactSelect
              name='evaluation_template'
              control={control}
              rules={{ required: true }}
              options={evaluationTemplateOptions}
              placeholder='Select...'
              noOptionsMessage={({ inputValue }) => 'No evaluation templates available'}
            />
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Reminder Schedule<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <ReactSelect
              name='reminder_schedule'
              control={control}
              rules={{ required: true }}
              options={reminderScheduleOptions}
              placeholder='Select...'
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