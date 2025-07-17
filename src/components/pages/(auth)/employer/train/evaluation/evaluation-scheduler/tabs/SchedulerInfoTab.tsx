import { useEffect, useState, useRef } from 'react';

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
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: (tab: number) => void;
  watch: any;
  setValue: any;
}) {
  const [evaluationItems, setEvaluationItems] = useState<any>([]);
  const {
    data: dataEvaluation,
    isLoading: isGetEvaluationLoading,
    refetch: refetchEvaluation,
  } = useGetEvaluationTemplateItems();

  const selectedFrequencyUnit = watch('frequency_unit');
  const [showTooltip, setShowTooltip] = useState(false);

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  useEffect(() => {
    // Show tooltip for 3 seconds when component mounts
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

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
      setEvaluationItems(dataEvaluation);
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
        }, 0);
      }
    }
  }, [selectedFrequencyUnit, watch, setValue]);

  return (
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
                  <h2 className='text-[12px] font-medium'>Select week or month first.</h2>
                </div>
              </Tooltip>
          </label>
          <div className='flex items-center text-sm'>
            Every
            <div className='relative mt-2 mx-3'>
              <select
                id='frequency_value'
                {...register('frequency_value', { required: true })}
                disabled={!selectedFrequencyUnit}
                className='appearance-none block w-16 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 text-left disabled:bg-gray-100 disabled:text-gray-500'
                defaultValue=''
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
            <div className='relative mt-2 mx-3 w-28'>
              <select
                id='frequency_unit'
                {...register('frequency_unit', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                defaultValue=''
              >
                <option value='' disabled>
                  Select...
                </option>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
                {/* <option value='quarter'>Quarter</option> */}
                {/* <option value='year'>Year</option> */}
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
              {evaluationItems.map((item: any, index: number) => {
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
  );
}

export default SchedulerInfoTab;
