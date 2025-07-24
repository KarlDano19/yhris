import { useEffect, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import useGetEvaluationTemplateItems from '@/components/hooks/useGetEvaluationTemplateItems';

import SelectChevronDown from '@/svg/SelectChevronDown';
import InfoIcon from '@/svg/InfoIcon';

function SchedulerInfoTab({
  register,
  handleSubmit,
  setSelectedTab,
  watch,
  setValue,
  setIsCustomModalOpen,
  onCustomFrequencySelect,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: (tab: number) => void;
  watch: any;
  setValue: any;
  setIsCustomModalOpen: (isOpen: boolean) => void;
  onCustomFrequencySelect?: (frequency: string, months?: number[], day?: number) => void;
}) {
  const [evaluationItems, setEvaluationItems] = useState<any>([]);
  const {
    data: dataEvaluation,
    isLoading: isGetEvaluationLoading,
    refetch: refetchEvaluation,
  } = useGetEvaluationTemplateItems();

  const selectedFrequencyUnit = watch('frequency_unit');
  const [showTooltip, setShowTooltip] = useState(false);
  const [customScheduleDetails, setCustomScheduleDetails] = useState<{
    months: number[];
    day: number;
  } | null>(null);
  // Add a state to force UI updates when custom frequency changes
  const [customFrequencyUpdateCounter, setCustomFrequencyUpdateCounter] = useState(0);

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
                    {(!customFrequencyValue && !selectedFrequencyUnit) ? 'Select week, month, or custom first.' :
                      selectedFrequencyUnit === 'week' ? 'The week starts with Sunday-1 to Saturday-7' :
                      selectedFrequencyUnit === 'month' ? 'If you select 31, it will use the last day for months with fewer days.' :
                      ''
                    }
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
            <select
              id='evaluation_template'
              {...register('evaluation_template', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              {Array.isArray(evaluationItems) && evaluationItems.map((item: any, index: number) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Reminder Schedule<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='reminder_schedule'
              {...register('reminder_schedule', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='3 days'>3 days before</option>
              <option value='1 day'>1 day before</option>
              {/* <option value='1 hour'>1 hour before</option> */}
              {/* <option value='30 minutes'>30 minutes before</option> */}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
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
