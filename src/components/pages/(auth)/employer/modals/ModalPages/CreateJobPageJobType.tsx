import { Dispatch, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

export default function CreateJobPageJobType({
  control,
  register,
  setValue,
  setPageNumber,
  setIsSalaryRangeModalOpen,
  handleSubmit,
  getValues,
  hasSalaryRange,
  secondFormSubmit,
}: {
  control: any;
  register: any;
  setValue: any;
  setPageNumber: Dispatch<number>;
  setIsSalaryRangeModalOpen: Dispatch<boolean>;
  handleSubmit: any;
  getValues: any;
  hasSalaryRange?: boolean;
  secondFormSubmit?: () => void;
}) {
  const [otherJobType, setOtherJobType] = useState(false);
  const [otherSchedule, setOtherSchedule] = useState(false);
  const [otherWorkSetup, setOtherWorkSetup] = useState(false);
  const [manualInputFocus, setManualInputFocus] = useState({
    jobType: false,
    workSetup: false,
    schedule: false,
    hireDate: false,
  });
  const JobType = ['Full Time', 'Part Time', 'Internship/OJT', 'Project-based'];
  const WorkSetup = ['On-site', 'Work from Home', 'Hybrid'];
  const Schedule = ['Flexible', '8 Hours', '12 Hours', 'Night Shift'];
  const handleData = (action: string, option: string, type: string) => {
    let data = getValues(type);
    data = data ? data : [];
    const index = data.indexOf(option);
    if (action === 'remove' && index !== -1) {
      data.splice(index, 1);
      if (data.length == 0) {
        return setValue(type, undefined);
      }
      return setValue(type, [...data]);
    }
    return setValue(type, [...data, option]);
  };

  const onSubmit = handleSubmit((data: any) => {
    const hireDate = getValues('hireDate');
    const hireCount = getValues('hireCount');
    let jobType = getValues('jobType');
    let workSetup = getValues('workSetup');
    let schedule = getValues('schedule');
    const otherJobTypeData = getValues('otherJobType');
    if (otherJobType && otherJobTypeData) {
      jobType = getValues('jobType') || [];
      jobType = jobType.concat(otherJobTypeData);
    }
    const otherWorkSetupData = getValues('otherWorkSetup');
    if (otherWorkSetup && otherWorkSetupData) {
      workSetup = getValues('workSetup') || [];
      workSetup = workSetup.concat(otherWorkSetupData);
    }
    const otherScheduleData = getValues('otherSchedule');
    if (otherSchedule && otherScheduleData) {
      schedule = getValues('schedule') || [];
      schedule = schedule.concat(otherScheduleData);
    }
    let manualInputFocusData = {
      hireDate: !!!hireDate,
      jobType: !!!jobType,
      workSetup: !!!workSetup,
      schedule: !!!schedule,
    };
    setManualInputFocus(manualInputFocusData);
    if (hireCount > 1000) {
      toast.custom(() => <CustomToast message={'The maximum number of hires allowed is 1000.'} type='error' />, {
        duration: 7000,
      });
      return;
    }
    const results = [!!hireDate, !!jobType, !!workSetup, !!schedule];
    const incomplete = results.some((item: boolean) => !item);
    if (!incomplete) {
      if (!hasSalaryRange) {
        setIsSalaryRangeModalOpen(true);
      } else {
        setPageNumber(3);
        secondFormSubmit?.();
      }
      setValue('jobType', jobType);
      setValue('workSetup', workSetup);
      setValue('schedule', schedule);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='px-4 pb-6'>
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='language' className='block text-sm font-medium leading-6 text-gray-900'>
            What is the job type?
            <span className='text-red-600'>*</span>
          </label>
          <div
            className={`flex flex-wrap mt-2  space-x-2 md:space-y-0 md:space-x-6 ${
              manualInputFocus.jobType ? 'border-2 border-blue-700' : ''
            }`}
          >
            {JobType.map((job, index) => {
              const jobTypes = getValues('jobType');
              return (
                <button
                  key={index}
                  id={`jobTypeBtn${index}`}
                  type='button'
                  className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                    jobTypes?.includes(job) ? 'bg-slate-400' : ''
                  }`}
                  onClick={() => {
                    if (jobTypes?.includes(job)) {
                      handleData('remove', job, 'jobType');
                    } else {
                      handleData('add', job, 'jobType');
                    }
                    setManualInputFocus({
                      jobType: false,
                      workSetup: false,
                      schedule: false,
                      hireDate: false,
                    });
                  }}
                >
                  {jobTypes?.includes(job) ? '✓' : '+'} {job}
                </button>
              );
            })}
            {/* Other */}
            <button
              id='otherJobTypeBtn'
              type='button'
              className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                otherJobType ? 'bg-slate-400' : ''
              }`}
              onClick={() => {
                if (!otherJobType) {
                  setValue('otherJobType', '');
                }
                setOtherJobType(!otherJobType);
                setManualInputFocus({
                  jobType: false,
                  workSetup: false,
                  schedule: false,
                  hireDate: false,
                });
              }}
            >
              {otherJobType ? '✓' : '+'}
              Other
            </button>
          </div>
        </div>
        {otherJobType && (
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='otherJobType' className='block text-sm font-medium leading-6 text-gray-900'>
                If you selected other, please input the job type and add comma if it&#39;s more than one.
              </label>
              <div className='mt-2'>
                <input
                  id='otherJobType'
                  {...register('otherJobType', {
                    required: true,
                  })}
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        )}
        
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='workSetup' className='block text-sm font-medium leading-6 text-gray-900'>
            What is the work set-up for this job?
            <span className='text-red-600'>*</span>
          </label>
          <div
            className={`flex flex-wrap mt-2 space-x-2 md:space-y-0 md:space-x-6 ${
              manualInputFocus.workSetup ? 'border-2 border-blue-700' : ''
            }`}
          >
            {WorkSetup.map((setup, index) => {
              const workSetups = getValues('workSetup');
              return (
                <button
                  key={index}
                  id={`workSetupBtn${index}`}
                  type='button'
                  className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                    workSetups?.includes(setup) ? 'bg-slate-400' : ''
                  }`}
                  onClick={() => {
                    if (workSetups?.includes(setup)) {
                      handleData('remove', setup, 'workSetup');
                    } else {
                      handleData('add', setup, 'workSetup');
                    }
                    setManualInputFocus({
                      jobType: false,
                      workSetup: false,
                      schedule: false,
                      hireDate: false,
                    });
                  }}
                >
                  {workSetups?.includes(setup) ? '✓' : '+'} {setup}
                </button>
              );
            })}
            {/* Other */}
            {/* <button
              id='otherWorkSetupBtn'
              type='button'
              className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                otherWorkSetup ? 'bg-slate-400' : ''
              }`}
              onClick={() => {
                if (!otherWorkSetup) {
                  setValue('otherWorkSetup', '');
                }
                setOtherWorkSetup(!otherWorkSetup);
                setManualInputFocus({
                  jobType: false,
                  workSetup: false,
                  schedule: false,
                  hireDate: false,
                });
              }}
            >
              {otherWorkSetup ? '✓' : '+'}
              Other
            </button> */}
          </div>
        </div>
        {otherWorkSetup && (
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='otherWorkSetup' className='block text-sm font-medium leading-6 text-gray-900'>
                If you selected other, please input the work set-up and add comma if it&#39;s more than one.
              </label>
              <div className='mt-2'>
                <input
                  id='otherWorkSetup'
                  {...register('otherWorkSetup', {
                    required: true,
                  })}
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        )}
        
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='language' className='block text-sm font-medium leading-6 text-gray-900'>
            What is the schedule for this job?
            <span className='text-red-600'>*</span>
          </label>
          <div
            className={`flex flex-wrap mt-2 space-x-2 md:space-y-0 md:space-x-6 ${
              manualInputFocus.schedule ? 'border-2 border-blue-700' : ''
            }`}
          >
            {Schedule.map((sched, index) => {
              const schedules = getValues('schedule');
              return (
                <button
                  key={index}
                  id={`scheduleBtn${index}`}
                  type='button'
                  className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                    schedules?.includes(sched) ? 'bg-slate-400' : ''
                  }`}
                  onClick={() => {
                    if (schedules?.includes(sched)) {
                      handleData('remove', sched, 'schedule');
                    } else {
                      handleData('add', sched, 'schedule');
                    }
                    setManualInputFocus({
                      jobType: false,
                      workSetup: false,
                      schedule: false,
                      hireDate: false,
                    });
                  }}
                >
                  {schedules?.includes(sched) ? '✓' : '+'} {sched}
                </button>
              );
            })}
            {/* Other */}
            <button
              id='otherScheduleBtn'
              type='button'
              className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                otherSchedule ? 'bg-slate-400' : ''
              }`}
              onClick={() => {
                setOtherSchedule(!otherSchedule);
                setManualInputFocus({
                  jobType: false,
                  workSetup: false,
                  schedule: false,
                  hireDate: false,
                });
              }}
            >
              {otherSchedule ? '✓' : '+'}
              Other
            </button>
          </div>
        </div>
        {otherSchedule && (
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='otherSchedule' className='block text-sm font-medium leading-6 text-gray-900'>
                If you selected other, please input the schedule and add comma after the word if it&#39;s more than one.
              </label>
              <div className='mt-2'>
                <input
                  id='otherSchedule'
                  {...register('otherSchedule', {
                    required: true,
                  })}
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        )}
        <div className='sm:col-span-4 mt-4'>
          <div>
            <label htmlFor='hireCount' className='block text-sm font-medium leading-6 text-gray-900'>
              How many people do you want to hire for this opening?
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                id='hireCount'
                {...register('hireCount')}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  if (value < 0) {
                    setValue('hireCount', 0);
                  } else {
                    setValue('hireCount', value);
                  }
                }}
                type='number'
                defaultValue={1}
                className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
              />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
              How soon do you need to hire?
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <Controller
                control={control}
                name='hireDate'
                render={({ field }) => (
                  <CustomDatePicker
                    id='investigation-report-datepicker'
                    placeholder={'mm/dd/yyyy'}
                    className={classNames(
                      'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none',
                      manualInputFocus.hireDate ? 'border-2 border-gray-900' : ''
                    )}
                    selected={field.value}
                    pickerOnChange={(date: any) => field.onChange(date)}
                    inputOnChange={(value: any) => field.onChange(value)}
                    minDate={new Date()}
                    required={true}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pageJobTypeNextBtn'
          type='submit'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
        >
          Next
        </button>
        <button
          id='pageJobTypeBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => setPageNumber(1)}
        >
          Back
        </button>
      </div>
    </form>
  );
}
